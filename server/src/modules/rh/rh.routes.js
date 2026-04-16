const router = require('express').Router();
const Joi = require('joi');
const prisma = require('../../config/prisma');
const { authenticate, authorize } = require('../../middlewares/auth');
const { auditLog } = require('../../middlewares/audit');
const validate = require('../../middlewares/validate');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

function diffJoursOuvres(d1, d2) {
  const ms = Math.abs(new Date(d2) - new Date(d1));
  return Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1;
}

// =============== CONGES ===============

const congeSchema = Joi.object({
  dateDebut: Joi.date().required(),
  dateFin: Joi.date().required(),
  type: Joi.string().valid('ANNUEL', 'MALADIE', 'MATERNITE', 'PATERNITE', 'SANS_SOLDE', 'EXCEPTIONNEL').required(),
  motif: Joi.string().allow('', null),
});

router.get('/conges', authenticate, asyncHandler(async (req, res) => {
  const { statut, agentId } = req.query;
  const where = {};

  if (req.user.role === 'AGENT') {
    where.agentId = req.user.id;
  } else if (agentId) {
    where.agentId = agentId;
  }

  if (statut) where.statut = statut;

  const conges = await prisma.conge.findMany({
    where,
    include: {
      agent: { select: { id: true, nom: true, prenom: true, avatar: true, poste: true, direction: true } },
      approbateur: { select: { id: true, nom: true, prenom: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: conges });
}));

router.post('/conges', authenticate, validate(congeSchema), asyncHandler(async (req, res) => {
  const nbJours = diffJoursOuvres(req.body.dateDebut, req.body.dateFin);
  const conge = await prisma.conge.create({
    data: { ...req.body, nbJours, agentId: req.user.id },
    include: {
      agent: { select: { id: true, nom: true, prenom: true, directionId: true } },
    },
  });

  // Notifier les directeurs de la direction
  if (conge.agent.directionId) {
    const directeurs = await prisma.user.findMany({
      where: { directionId: conge.agent.directionId, role: { in: ['DIRECTEUR', 'ADMIN', 'SUPER_ADMIN'] } },
    });
    for (const d of directeurs) {
      await prisma.notification.create({
        data: {
          userId: d.id,
          titre: 'Nouvelle demande de congé',
          message: `${conge.agent.prenom} ${conge.agent.nom} demande ${nbJours} jour(s) de congé`,
          type: 'CONGE',
          lien: `/rh/conges/${conge.id}`,
        },
      });
    }
  }

  await auditLog(req, 'CREATE_CONGE', 'Conge', conge.id);
  res.status(201).json({ success: true, data: conge });
}));

router.patch('/conges/:id/decision',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const { statut, commentaire } = req.body;
    if (!['APPROUVE', 'REJETE'].includes(statut)) throw ApiError.badRequest('Statut invalide');

    const conge = await prisma.conge.update({
      where: { id: req.params.id },
      data: {
        statut,
        commentaire,
        approbateurId: req.user.id,
        dateDecision: new Date(),
      },
      include: { agent: true },
    });

    await prisma.notification.create({
      data: {
        userId: conge.agentId,
        titre: `Congé ${statut === 'APPROUVE' ? 'approuvé' : 'rejeté'}`,
        message: commentaire || `Votre demande de congé a été ${statut.toLowerCase()}`,
        type: 'CONGE',
      },
    });

    await auditLog(req, `CONGE_${statut}`, 'Conge', conge.id);
    res.json({ success: true, data: conge });
  })
);

router.delete('/conges/:id', authenticate, asyncHandler(async (req, res) => {
  const conge = await prisma.conge.findUnique({ where: { id: req.params.id } });
  if (!conge) throw ApiError.notFound();
  if (conge.agentId !== req.user.id && !['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) throw ApiError.forbidden();
  if (conge.statut !== 'EN_ATTENTE') throw ApiError.badRequest('Seule une demande en attente peut être annulée');

  await prisma.conge.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}));

// =============== PRESENCES ===============

router.get('/presences', authenticate, asyncHandler(async (req, res) => {
  const { agentId, startDate, endDate } = req.query;
  const where = {};
  if (req.user.role === 'AGENT') {
    where.agentId = req.user.id;
  } else if (agentId) {
    where.agentId = agentId;
  }
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }
  const items = await prisma.presence.findMany({
    where,
    include: { agent: { select: { id: true, nom: true, prenom: true, avatar: true } } },
    orderBy: { date: 'desc' },
    take: 200,
  });
  res.json({ success: true, data: items });
}));

router.post('/presences/pointage-arrivee', authenticate, asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.presence.findUnique({
    where: { agentId_date: { agentId: req.user.id, date: today } },
  });
  if (existing && existing.heureArrivee) {
    throw ApiError.badRequest('Arrivée déjà pointée aujourd\'hui');
  }

  const presence = await prisma.presence.upsert({
    where: { agentId_date: { agentId: req.user.id, date: today } },
    create: { agentId: req.user.id, date: today, heureArrivee: new Date() },
    update: { heureArrivee: new Date() },
  });
  res.json({ success: true, data: presence });
}));

router.post('/presences/pointage-depart', authenticate, asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.presence.findUnique({
    where: { agentId_date: { agentId: req.user.id, date: today } },
  });
  if (!existing || !existing.heureArrivee) {
    throw ApiError.badRequest('Aucune arrivée pointée');
  }

  const depart = new Date();
  const nbHeures = (depart - existing.heureArrivee) / (1000 * 60 * 60);

  const presence = await prisma.presence.update({
    where: { agentId_date: { agentId: req.user.id, date: today } },
    data: { heureDepart: depart, nbHeures: Math.round(nbHeures * 100) / 100 },
  });
  res.json({ success: true, data: presence });
}));

// =============== EVALUATIONS ===============

router.get('/evaluations', authenticate, asyncHandler(async (req, res) => {
  const where = {};
  if (req.user.role === 'AGENT') where.agentId = req.user.id;

  const items = await prisma.evaluation.findMany({
    where,
    include: {
      agent: { select: { id: true, nom: true, prenom: true, poste: true } },
      evaluateur: { select: { id: true, nom: true, prenom: true } },
    },
    orderBy: { annee: 'desc' },
  });
  res.json({ success: true, data: items });
}));

router.post('/evaluations',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const item = await prisma.evaluation.create({
      data: { ...req.body, evaluateurId: req.user.id },
    });
    await auditLog(req, 'CREATE_EVALUATION', 'Evaluation', item.id);
    res.status(201).json({ success: true, data: item });
  })
);

module.exports = router;
