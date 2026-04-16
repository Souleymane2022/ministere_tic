const router = require('express').Router();
const prisma = require('../../config/prisma');
const { authenticate, authorize } = require('../../middlewares/auth');
const { auditLog } = require('../../middlewares/audit');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

// Toutes les routes ici sont réservées SUPER_ADMIN / ADMIN
router.use(authenticate, authorize('SUPER_ADMIN', 'ADMIN'));

// Stats globales admin
router.get('/stats', asyncHandler(async (req, res) => {
  const [
    totalUsers, usersActifs, usersInactifs, totalDocuments,
    totalProjets, totalBudget, logsLast24h,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { actif: true } }),
    prisma.user.count({ where: { actif: false } }),
    prisma.document.count(),
    prisma.projet.count(),
    prisma.budget.aggregate({ _sum: { montantAlloue: true, montantConsomme: true } }),
    prisma.auditLog.count({
      where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const repartitionRoles = await prisma.user.groupBy({
    by: ['role'],
    _count: true,
  });

  res.json({
    success: true,
    data: {
      utilisateurs: {
        total: totalUsers,
        actifs: usersActifs,
        inactifs: usersInactifs,
      },
      documents: totalDocuments,
      projets: totalProjets,
      budget: {
        alloue: totalBudget._sum.montantAlloue || 0,
        consomme: totalBudget._sum.montantConsomme || 0,
      },
      logs24h: logsLast24h,
      repartitionRoles: repartitionRoles.map((r) => ({ role: r.role, count: r._count })),
    },
  });
}));

// Journal d'audit
router.get('/audit', asyncHandler(async (req, res) => {
  const { userId, entite, action, page = 1, pageSize = 50 } = req.query;
  const where = {};
  if (userId) where.userId = userId;
  if (entite) where.entite = entite;
  if (action) where.action = { contains: action };

  const total = await prisma.auditLog.count({ where });
  const logs = await prisma.auditLog.findMany({
    where,
    include: { user: { select: { id: true, nom: true, prenom: true, email: true, role: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (parseInt(page) - 1) * parseInt(pageSize),
    take: parseInt(pageSize),
  });
  res.json({ success: true, data: logs, total, page: parseInt(page), pageSize: parseInt(pageSize) });
}));

// Paramètres système
router.get('/settings', asyncHandler(async (req, res) => {
  const settings = await prisma.systemSetting.findMany({ orderBy: { cle: 'asc' } });
  res.json({ success: true, data: settings });
}));

router.put('/settings/:cle', asyncHandler(async (req, res) => {
  const { valeur, description } = req.body;
  const item = await prisma.systemSetting.upsert({
    where: { cle: req.params.cle },
    create: { cle: req.params.cle, valeur, description },
    update: { valeur, description },
  });
  await auditLog(req, 'UPDATE_SETTING', 'SystemSetting', item.id, { cle: item.cle });
  res.json({ success: true, data: item });
}));

// Permissions par rôle (matrice simple)
router.get('/permissions', asyncHandler(async (req, res) => {
  // Matrice statique (peut être étendue avec persistance)
  const matrice = {
    SUPER_ADMIN: ['*'],
    ADMIN: [
      'users.manage', 'directions.manage', 'documents.manage',
      'projets.manage', 'finance.manage', 'communication.manage',
      'rh.manage', 'audit.read', 'settings.manage',
    ],
    DIRECTEUR: [
      'users.read', 'directions.read', 'documents.validate',
      'projets.manage', 'finance.validate', 'communication.publish',
      'rh.approve',
    ],
    AGENT: [
      'profile.edit', 'documents.create', 'documents.read',
      'conges.request', 'presence.pointage', 'messages.send',
      'tasks.read', 'tasks.update-own',
    ],
  };
  res.json({ success: true, data: matrice });
}));

module.exports = router;
