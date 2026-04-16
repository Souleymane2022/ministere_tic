const router = require('express').Router();
const Joi = require('joi');
const prisma = require('../../config/prisma');
const { authenticate, authorize } = require('../../middlewares/auth');
const { auditLog } = require('../../middlewares/audit');
const validate = require('../../middlewares/validate');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

// ============== BUDGETS ==============

router.get('/budgets', authenticate, asyncHandler(async (req, res) => {
  const { annee, directionId } = req.query;
  const where = {};
  if (annee) where.annee = parseInt(annee);
  if (directionId) where.directionId = directionId;
  const items = await prisma.budget.findMany({
    where,
    include: { direction: { select: { id: true, nom: true, code: true } } },
    orderBy: [{ annee: 'desc' }, { direction: { nom: 'asc' } }],
  });
  res.json({ success: true, data: items });
}));

router.post('/budgets',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const item = await prisma.budget.create({ data: req.body });
    await auditLog(req, 'CREATE_BUDGET', 'Budget', item.id);
    res.status(201).json({ success: true, data: item });
  })
);

router.put('/budgets/:id',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const item = await prisma.budget.update({ where: { id: req.params.id }, data: req.body });
    await auditLog(req, 'UPDATE_BUDGET', 'Budget', item.id);
    res.json({ success: true, data: item });
  })
);

// ============== DEPENSES ==============

const depenseSchema = Joi.object({
  libelle: Joi.string().required(),
  description: Joi.string().allow('', null),
  montant: Joi.number().positive().required(),
  devise: Joi.string().default('XAF'),
  categorie: Joi.string().allow('', null),
  directionId: Joi.string().allow(null),
});

router.get('/depenses', authenticate, asyncHandler(async (req, res) => {
  const { statut, demandeurId } = req.query;
  const where = {};
  if (req.user.role === 'AGENT') where.demandeurId = req.user.id;
  else if (demandeurId) where.demandeurId = demandeurId;
  if (statut) where.statut = statut;

  const items = await prisma.depense.findMany({
    where,
    include: {
      demandeur: { select: { id: true, nom: true, prenom: true, avatar: true } },
      validateur: { select: { id: true, nom: true, prenom: true } },
      direction: { select: { id: true, nom: true, code: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: items });
}));

router.post('/depenses',
  authenticate,
  validate(depenseSchema),
  asyncHandler(async (req, res) => {
    const count = await prisma.depense.count();
    const reference = `DEP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const item = await prisma.depense.create({
      data: {
        ...req.body,
        reference,
        demandeurId: req.user.id,
        directionId: req.body.directionId || req.user.directionId || null,
        statut: 'SOUMISE',
      },
    });
    await auditLog(req, 'CREATE_DEPENSE', 'Depense', item.id, { montant: item.montant });
    res.status(201).json({ success: true, data: item });
  })
);

router.patch('/depenses/:id/decision',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const { statut, commentaire } = req.body;
    if (!['APPROUVEE', 'REJETEE', 'PAYEE'].includes(statut)) throw ApiError.badRequest('Statut invalide');

    const item = await prisma.depense.update({
      where: { id: req.params.id },
      data: {
        statut,
        commentaire,
        validateurId: req.user.id,
        dateValidation: new Date(),
      },
    });

    // Si approuvée, incrémenter le budget consommé
    if (statut === 'APPROUVEE' && item.directionId) {
      const annee = new Date().getFullYear();
      const budget = await prisma.budget.findFirst({ where: { directionId: item.directionId, annee, mois: null } });
      if (budget) {
        await prisma.budget.update({
          where: { id: budget.id },
          data: { montantConsomme: { increment: item.montant } },
        });
      }
    }

    await prisma.notification.create({
      data: {
        userId: item.demandeurId,
        titre: `Dépense ${statut.toLowerCase()}`,
        message: `Votre demande ${item.reference} a été ${statut.toLowerCase()}`,
        type: statut === 'APPROUVEE' ? 'SUCCESS' : statut === 'REJETEE' ? 'ERROR' : 'INFO',
      },
    });

    await auditLog(req, `DEPENSE_${statut}`, 'Depense', item.id);
    res.json({ success: true, data: item });
  })
);

// ============== CONTRATS FOURNISSEURS ==============

router.get('/contrats', authenticate, asyncHandler(async (req, res) => {
  const items = await prisma.contrat.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: items });
}));

router.post('/contrats',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const count = await prisma.contrat.count();
    const reference = `CTR-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const item = await prisma.contrat.create({
      data: { ...req.body, reference },
    });
    await auditLog(req, 'CREATE_CONTRAT', 'Contrat', item.id);
    res.status(201).json({ success: true, data: item });
  })
);

router.put('/contrats/:id',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const item = await prisma.contrat.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: item });
  })
);

router.delete('/contrats/:id',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN'),
  asyncHandler(async (req, res) => {
    await prisma.contrat.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  })
);

// ============== RECAP MENSUEL ==============

router.get('/recap/:annee/:mois', authenticate, asyncHandler(async (req, res) => {
  const annee = parseInt(req.params.annee);
  const mois = parseInt(req.params.mois);
  const debut = new Date(annee, mois - 1, 1);
  const fin = new Date(annee, mois, 0, 23, 59, 59);

  const depenses = await prisma.depense.findMany({
    where: { createdAt: { gte: debut, lte: fin } },
    include: { direction: { select: { nom: true, code: true } } },
  });

  const parDirection = {};
  let totalApprouve = 0;
  let totalSoumis = 0;
  for (const d of depenses) {
    const key = d.direction?.code || 'N/A';
    if (!parDirection[key]) parDirection[key] = { nom: d.direction?.nom || 'N/A', total: 0, count: 0 };
    parDirection[key].total += d.montant;
    parDirection[key].count += 1;
    if (d.statut === 'APPROUVEE' || d.statut === 'PAYEE') totalApprouve += d.montant;
    if (d.statut === 'SOUMISE') totalSoumis += d.montant;
  }

  res.json({
    success: true,
    data: {
      annee, mois,
      totalDepenses: depenses.length,
      totalApprouve,
      totalSoumis,
      parDirection: Object.entries(parDirection).map(([code, v]) => ({ code, ...v })),
    },
  });
}));

module.exports = router;
