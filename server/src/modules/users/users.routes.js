const router = require('express').Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const prisma = require('../../config/prisma');
const env = require('../../config/env');
const { authenticate, authorize } = require('../../middlewares/auth');
const { auditLog } = require('../../middlewares/audit');
const { uploadAvatar } = require('../../middlewares/upload');
const validate = require('../../middlewares/validate');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

const userSelect = {
  id: true, email: true, nom: true, prenom: true, telephone: true,
  poste: true, avatar: true, role: true, actif: true,
  directionId: true, direction: true, twoFactorEnabled: true,
  createdAt: true, updatedAt: true,
};

const createSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  telephone: Joi.string().allow('', null),
  poste: Joi.string().allow('', null),
  role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'AGENT').required(),
  directionId: Joi.string().allow(null),
});

const updateSchema = Joi.object({
  email: Joi.string().email(),
  nom: Joi.string(),
  prenom: Joi.string(),
  telephone: Joi.string().allow('', null),
  poste: Joi.string().allow('', null),
  role: Joi.string().valid('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR', 'AGENT'),
  directionId: Joi.string().allow(null),
  actif: Joi.boolean(),
});

// Liste (accessible aux connectés pour l'annuaire, infos limitées si pas admin)
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { search, directionId, role, actif, page = 1, pageSize = 20 } = req.query;
  const where = {};
  if (search) {
    where.OR = [
      { nom: { contains: search, mode: 'insensitive' } },
      { prenom: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { poste: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (directionId) where.directionId = directionId;
  if (role) where.role = role;
  if (actif !== undefined) where.actif = actif === 'true';

  const total = await prisma.user.count({ where });
  const users = await prisma.user.findMany({
    where,
    select: userSelect,
    skip: (parseInt(page) - 1) * parseInt(pageSize),
    take: parseInt(pageSize),
    orderBy: [{ nom: 'asc' }, { prenom: 'asc' }],
  });
  res.json({ success: true, data: users, total, page: parseInt(page), pageSize: parseInt(pageSize) });
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: userSelect,
  });
  if (!user) throw ApiError.notFound();
  res.json({ success: true, data: user });
}));

router.post('/',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password, env.BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: { ...req.body, email: req.body.email.toLowerCase(), password: hashed },
      select: userSelect,
    });
    await auditLog(req, 'CREATE_USER', 'User', user.id, { email: user.email });
    res.status(201).json({ success: true, data: user });
  })
);

router.put('/:id',
  authenticate,
  validate(updateSchema),
  asyncHandler(async (req, res) => {
    // Un agent ne peut modifier que lui-même (sauf role/actif)
    if (req.user.role === 'AGENT' && req.user.id !== req.params.id) {
      throw ApiError.forbidden();
    }
    if (req.user.role === 'AGENT') {
      delete req.body.role;
      delete req.body.actif;
      delete req.body.directionId;
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
      select: userSelect,
    });
    await auditLog(req, 'UPDATE_USER', 'User', user.id);
    res.json({ success: true, data: user });
  })
);

router.patch('/:id/activate',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN'),
  asyncHandler(async (req, res) => {
    const { actif } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { actif: Boolean(actif) },
      select: userSelect,
    });
    await auditLog(req, actif ? 'ACTIVATE_USER' : 'DEACTIVATE_USER', 'User', user.id);
    res.json({ success: true, data: user });
  })
);

router.delete('/:id',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    if (req.user.id === req.params.id) throw ApiError.badRequest('Impossible de se supprimer soi-même');
    await prisma.user.delete({ where: { id: req.params.id } });
    await auditLog(req, 'DELETE_USER', 'User', req.params.id);
    res.json({ success: true });
  })
);

router.post('/:id/avatar',
  authenticate,
  uploadAvatar.single('avatar'),
  asyncHandler(async (req, res) => {
    if (req.user.role === 'AGENT' && req.user.id !== req.params.id) throw ApiError.forbidden();
    if (!req.file) throw ApiError.badRequest('Fichier manquant');
    const avatar = `/uploads/avatars/${req.file.filename}`;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { avatar },
      select: userSelect,
    });
    res.json({ success: true, data: user });
  })
);

module.exports = router;
