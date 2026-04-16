const router = require('express').Router();
const Joi = require('joi');
const prisma = require('../../config/prisma');
const { authenticate, authorize } = require('../../middlewares/auth');
const { auditLog } = require('../../middlewares/audit');
const validate = require('../../middlewares/validate');
const asyncHandler = require('../../utils/asyncHandler');

const createSchema = Joi.object({
  nom: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().allow('', null),
  responsableId: Joi.string().allow(null),
});

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const items = await prisma.direction.findMany({
    include: {
      responsable: { select: { id: true, nom: true, prenom: true, poste: true, avatar: true } },
      _count: { select: { agents: true, projets: true, documents: true } },
    },
    orderBy: { nom: 'asc' },
  });
  res.json({ success: true, data: items });
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const item = await prisma.direction.findUnique({
    where: { id: req.params.id },
    include: {
      responsable: true,
      agents: { select: { id: true, nom: true, prenom: true, poste: true, avatar: true, role: true } },
    },
  });
  res.json({ success: true, data: item });
}));

router.post('/',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN'),
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const item = await prisma.direction.create({ data: req.body });
    await auditLog(req, 'CREATE_DIRECTION', 'Direction', item.id);
    res.status(201).json({ success: true, data: item });
  })
);

router.put('/:id',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN'),
  asyncHandler(async (req, res) => {
    const item = await prisma.direction.update({
      where: { id: req.params.id },
      data: req.body,
    });
    await auditLog(req, 'UPDATE_DIRECTION', 'Direction', item.id);
    res.json({ success: true, data: item });
  })
);

router.delete('/:id',
  authenticate, authorize('SUPER_ADMIN'),
  asyncHandler(async (req, res) => {
    await prisma.direction.delete({ where: { id: req.params.id } });
    await auditLog(req, 'DELETE_DIRECTION', 'Direction', req.params.id);
    res.json({ success: true });
  })
);

// Organigramme (structure hiérarchique simple)
router.get('/tree/organigramme', authenticate, asyncHandler(async (req, res) => {
  const directions = await prisma.direction.findMany({
    include: {
      responsable: { select: { id: true, nom: true, prenom: true, poste: true, avatar: true } },
      agents: {
        where: { actif: true },
        select: { id: true, nom: true, prenom: true, poste: true, avatar: true, role: true },
      },
    },
    orderBy: { nom: 'asc' },
  });
  res.json({ success: true, data: directions });
}));

module.exports = router;
