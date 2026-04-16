const router = require('express').Router();
const Joi = require('joi');
const prisma = require('../../config/prisma');
const { authenticate, authorize } = require('../../middlewares/auth');
const { auditLog } = require('../../middlewares/audit');
const validate = require('../../middlewares/validate');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

const projetSchema = Joi.object({
  titre: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().allow('', null),
  statut: Joi.string().valid('PLANIFIE', 'EN_COURS', 'EN_PAUSE', 'TERMINE', 'ANNULE'),
  dateDebut: Joi.date().required(),
  dateFin: Joi.date().required(),
  budget: Joi.number().allow(null),
  chefProjetId: Joi.string().required(),
  directionId: Joi.string().allow(null),
});

const tacheSchema = Joi.object({
  titre: Joi.string().required(),
  description: Joi.string().allow('', null),
  statut: Joi.string().valid('A_FAIRE', 'EN_COURS', 'EN_REVUE', 'TERMINEE', 'BLOQUEE'),
  priorite: Joi.string().valid('BASSE', 'NORMALE', 'HAUTE', 'URGENTE'),
  assigneId: Joi.string().allow(null),
  dateDebut: Joi.date().allow(null),
  deadline: Joi.date().allow(null),
  avancement: Joi.number().min(0).max(100),
});

// ============== PROJETS ==============

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { statut, search } = req.query;
  const where = {};
  if (statut) where.statut = statut;
  if (search) {
    where.OR = [
      { titre: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.projet.findMany({
    where,
    include: {
      chefProjet: { select: { id: true, nom: true, prenom: true, avatar: true } },
      direction: { select: { id: true, nom: true, code: true } },
      _count: { select: { taches: true, membres: true, risques: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: items });
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const item = await prisma.projet.findUnique({
    where: { id: req.params.id },
    include: {
      chefProjet: { select: { id: true, nom: true, prenom: true, avatar: true, poste: true } },
      direction: true,
      taches: {
        include: { assigne: { select: { id: true, nom: true, prenom: true, avatar: true } } },
        orderBy: { createdAt: 'asc' },
      },
      membres: { include: { user: { select: { id: true, nom: true, prenom: true, avatar: true, poste: true } } } },
      risques: true,
    },
  });
  if (!item) throw ApiError.notFound();
  res.json({ success: true, data: item });
}));

router.post('/',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  validate(projetSchema),
  asyncHandler(async (req, res) => {
    const item = await prisma.projet.create({ data: req.body });
    await auditLog(req, 'CREATE_PROJET', 'Projet', item.id);
    res.status(201).json({ success: true, data: item });
  })
);

router.put('/:id',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const item = await prisma.projet.update({ where: { id: req.params.id }, data: req.body });
    await auditLog(req, 'UPDATE_PROJET', 'Projet', item.id);
    res.json({ success: true, data: item });
  })
);

router.delete('/:id',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN'),
  asyncHandler(async (req, res) => {
    await prisma.projet.delete({ where: { id: req.params.id } });
    await auditLog(req, 'DELETE_PROJET', 'Projet', req.params.id);
    res.json({ success: true });
  })
);

// ============== TACHES ==============

router.get('/:projetId/taches', authenticate, asyncHandler(async (req, res) => {
  const items = await prisma.tache.findMany({
    where: { projetId: req.params.projetId },
    include: { assigne: { select: { id: true, nom: true, prenom: true, avatar: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ success: true, data: items });
}));

router.post('/:projetId/taches',
  authenticate,
  validate(tacheSchema),
  asyncHandler(async (req, res) => {
    const item = await prisma.tache.create({
      data: { ...req.body, projetId: req.params.projetId },
      include: { assigne: { select: { id: true, nom: true, prenom: true } } },
    });
    if (item.assigneId) {
      await prisma.notification.create({
        data: {
          userId: item.assigneId,
          titre: 'Nouvelle tâche assignée',
          message: `Tâche : ${item.titre}`,
          type: 'TACHE',
          lien: `/projets/${item.projetId}`,
        },
      });
    }
    await auditLog(req, 'CREATE_TACHE', 'Tache', item.id);
    res.status(201).json({ success: true, data: item });
  })
);

router.put('/taches/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const item = await prisma.tache.update({ where: { id: req.params.id }, data: req.body });

    // Recalcule l'avancement du projet
    const taches = await prisma.tache.findMany({ where: { projetId: item.projetId } });
    const total = taches.length || 1;
    const avancement = Math.round(taches.reduce((s, t) => s + (t.avancement || 0), 0) / total);
    await prisma.projet.update({ where: { id: item.projetId }, data: { avancement } });

    res.json({ success: true, data: item });
  })
);

router.delete('/taches/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    await prisma.tache.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  })
);

// ============== MEMBRES ==============

router.post('/:projetId/membres',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const item = await prisma.projetMembre.create({
      data: { projetId: req.params.projetId, userId: req.body.userId, role: req.body.role || 'membre' },
    });
    res.status(201).json({ success: true, data: item });
  })
);

router.delete('/:projetId/membres/:userId',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    await prisma.projetMembre.deleteMany({
      where: { projetId: req.params.projetId, userId: req.params.userId },
    });
    res.json({ success: true });
  })
);

// ============== RISQUES ==============

router.post('/:projetId/risques',
  authenticate,
  asyncHandler(async (req, res) => {
    const item = await prisma.risque.create({
      data: { ...req.body, projetId: req.params.projetId },
    });
    res.status(201).json({ success: true, data: item });
  })
);

router.put('/risques/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const item = await prisma.risque.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: item });
  })
);

router.delete('/risques/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    await prisma.risque.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  })
);

// ============== GANTT ==============

router.get('/:projetId/gantt', authenticate, asyncHandler(async (req, res) => {
  const projet = await prisma.projet.findUnique({
    where: { id: req.params.projetId },
    include: { taches: { orderBy: { dateDebut: 'asc' } } },
  });
  if (!projet) throw ApiError.notFound();

  const gantt = projet.taches.map((t) => ({
    id: t.id,
    name: t.titre,
    start: t.dateDebut || projet.dateDebut,
    end: t.deadline || projet.dateFin,
    progress: t.avancement,
    statut: t.statut,
    priorite: t.priorite,
  }));
  res.json({ success: true, data: { projet, gantt } });
}));

module.exports = router;
