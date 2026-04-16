const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const prisma = require('../../config/prisma');
const { authenticate, authorize } = require('../../middlewares/auth');
const { auditLog } = require('../../middlewares/audit');
const { uploadDocument, uploadRoot } = require('../../middlewares/upload');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

function mimeToType(mime) {
  if (!mime) return 'AUTRE';
  if (mime.includes('pdf')) return 'PDF';
  if (mime.includes('word') || mime.includes('document')) return 'WORD';
  if (mime.includes('sheet') || mime.includes('excel')) return 'EXCEL';
  if (mime.startsWith('image/')) return 'IMAGE';
  return 'AUTRE';
}

// Liste / recherche
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { search, directionId, type, statut, projetId, page = 1, pageSize = 20 } = req.query;
  const where = { parentId: null }; // on ne liste que les "parents" (version la plus récente)
  if (search) {
    where.OR = [
      { titre: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { contenuIndex: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }
  if (directionId) where.directionId = directionId;
  if (type) where.type = type;
  if (statut) where.statut = statut;
  if (projetId) where.projetId = projetId;

  const total = await prisma.document.count({ where });
  const docs = await prisma.document.findMany({
    where,
    include: {
      auteur: { select: { id: true, nom: true, prenom: true, avatar: true } },
      direction: { select: { id: true, nom: true, code: true } },
      _count: { select: { validations: true, versions: true } },
    },
    orderBy: { updatedAt: 'desc' },
    skip: (parseInt(page) - 1) * parseInt(pageSize),
    take: parseInt(pageSize),
  });
  res.json({ success: true, data: docs, total, page: parseInt(page), pageSize: parseInt(pageSize) });
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const doc = await prisma.document.findUnique({
    where: { id: req.params.id },
    include: {
      auteur: { select: { id: true, nom: true, prenom: true, avatar: true } },
      direction: true,
      validations: {
        include: { validateur: { select: { id: true, nom: true, prenom: true } } },
        orderBy: { createdAt: 'desc' },
      },
      versions: { orderBy: { version: 'desc' } },
      historique: { orderBy: { createdAt: 'desc' }, take: 50 },
    },
  });
  if (!doc) throw ApiError.notFound();
  res.json({ success: true, data: doc });
}));

// Upload
router.post('/',
  authenticate,
  uploadDocument.single('fichier'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('Fichier manquant');
    const { titre, description, directionId, projetId, tags } = req.body;

    const doc = await prisma.document.create({
      data: {
        titre: titre || req.file.originalname,
        description,
        fichier: `/uploads/documents/${req.file.filename}`,
        fichierNom: req.file.originalname,
        taille: req.file.size,
        mimeType: req.file.mimetype,
        type: mimeToType(req.file.mimetype),
        auteurId: req.user.id,
        directionId: directionId || req.user.directionId || null,
        projetId: projetId || null,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
        statut: 'SOUMIS',
      },
    });

    await prisma.documentHistorique.create({
      data: { documentId: doc.id, action: 'CREATED', userId: req.user.id },
    });
    await auditLog(req, 'UPLOAD_DOCUMENT', 'Document', doc.id, { titre: doc.titre });
    res.status(201).json({ success: true, data: doc });
  })
);

// Nouvelle version
router.post('/:id/version',
  authenticate,
  uploadDocument.single('fichier'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('Fichier manquant');
    const parent = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!parent) throw ApiError.notFound();

    const currentMax = await prisma.document.aggregate({
      where: { OR: [{ id: parent.id }, { parentId: parent.id }] },
      _max: { version: true },
    });
    const newVersion = (currentMax._max.version || 1) + 1;

    const version = await prisma.document.create({
      data: {
        titre: parent.titre,
        description: req.body.description || parent.description,
        fichier: `/uploads/documents/${req.file.filename}`,
        fichierNom: req.file.originalname,
        taille: req.file.size,
        mimeType: req.file.mimetype,
        type: mimeToType(req.file.mimetype),
        auteurId: req.user.id,
        directionId: parent.directionId,
        projetId: parent.projetId,
        tags: parent.tags,
        version: newVersion,
        parentId: parent.id,
        statut: 'SOUMIS',
      },
    });

    await prisma.documentHistorique.create({
      data: { documentId: parent.id, action: 'NEW_VERSION', userId: req.user.id, details: { version: newVersion } },
    });
    await auditLog(req, 'NEW_VERSION_DOCUMENT', 'Document', parent.id, { version: newVersion });
    res.status(201).json({ success: true, data: version });
  })
);

// Télécharger
router.get('/:id/download', authenticate, asyncHandler(async (req, res) => {
  const doc = await prisma.document.findUnique({ where: { id: req.params.id } });
  if (!doc) throw ApiError.notFound();
  const filePath = path.join(uploadRoot, doc.fichier.replace('/uploads/', ''));
  if (!fs.existsSync(filePath)) throw ApiError.notFound('Fichier introuvable sur le disque');

  await prisma.documentHistorique.create({
    data: { documentId: doc.id, action: 'DOWNLOADED', userId: req.user.id },
  });
  res.download(filePath, doc.fichierNom);
}));

// Validation (circuit)
router.post('/:id/validate',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const { statut, commentaire } = req.body;
    if (!['APPROUVE', 'REJETE', 'EN_REVISION'].includes(statut)) {
      throw ApiError.badRequest('Statut invalide');
    }

    const doc = await prisma.document.update({
      where: { id: req.params.id },
      data: { statut },
    });

    await prisma.documentValidation.create({
      data: {
        documentId: doc.id,
        validateurId: req.user.id,
        statut,
        commentaire,
      },
    });

    await prisma.documentHistorique.create({
      data: { documentId: doc.id, action: `VALIDATION_${statut}`, userId: req.user.id, details: { commentaire } },
    });

    // Notifier l'auteur
    await prisma.notification.create({
      data: {
        userId: doc.auteurId,
        titre: `Document ${statut === 'APPROUVE' ? 'approuvé' : statut === 'REJETE' ? 'rejeté' : 'en révision'}`,
        message: `Votre document "${doc.titre}" a été ${statut.toLowerCase()}`,
        type: 'DOCUMENT',
        lien: `/ged/${doc.id}`,
      },
    });

    await auditLog(req, 'VALIDATE_DOCUMENT', 'Document', doc.id, { statut });
    res.json({ success: true, data: doc });
  })
);

router.delete('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const doc = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!doc) throw ApiError.notFound();
    if (doc.auteurId !== req.user.id && !['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
      throw ApiError.forbidden();
    }
    await prisma.document.delete({ where: { id: req.params.id } });
    await auditLog(req, 'DELETE_DOCUMENT', 'Document', req.params.id);
    res.json({ success: true });
  })
);

module.exports = router;
