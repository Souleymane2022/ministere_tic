const router = require('express').Router();
const PDFDocument = require('pdfkit');
const prisma = require('../../config/prisma');
const { authenticate } = require('../../middlewares/auth');
const asyncHandler = require('../../utils/asyncHandler');

/**
 * GET /api/dashboard/stats - statistiques selon le rôle
 */
router.get('/stats', authenticate, asyncHandler(async (req, res) => {
  const { role, id: userId, directionId } = req.user;
  const annee = new Date().getFullYear();

  // KPIs accessibles à tous (son périmètre)
  const effectif = await prisma.user.count({ where: { actif: true } });
  const congesEnAttente = role === 'AGENT'
    ? await prisma.conge.count({ where: { agentId: userId, statut: 'EN_ATTENTE' } })
    : await prisma.conge.count({ where: { statut: 'EN_ATTENTE' } });
  const documentsSoumis = await prisma.document.count({ where: { statut: 'SOUMIS' } });
  const projetsEnCours = await prisma.projet.count({ where: { statut: 'EN_COURS' } });

  const budgetData = await prisma.budget.groupBy({
    by: ['annee'],
    where: { annee },
    _sum: { montantAlloue: true, montantConsomme: true },
  });

  // Production simulée
  const today = new Date();
  const production = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    production.push({
      date: d.toISOString().slice(0, 10),
      barils: Math.floor(95000 + Math.random() * 25000),
    });
  }

  // Répartition effectifs par direction
  const effectifsParDirection = await prisma.direction.findMany({
    select: {
      nom: true,
      code: true,
      _count: { select: { agents: true } },
    },
  });

  // Budgets par direction
  const budgetsParDirection = await prisma.budget.findMany({
    where: { annee },
    include: { direction: { select: { nom: true, code: true } } },
  });

  const tachesParStatut = await prisma.tache.groupBy({
    by: ['statut'],
    _count: true,
  });

  res.json({
    success: true,
    data: {
      kpi: {
        effectif,
        congesEnAttente,
        documentsSoumis,
        projetsEnCours,
        budgetAlloue: budgetData[0]?._sum.montantAlloue || 0,
        budgetConsomme: budgetData[0]?._sum.montantConsomme || 0,
      },
      production,
      effectifsParDirection: effectifsParDirection.map((d) => ({
        direction: d.code, nom: d.nom, effectif: d._count.agents,
      })),
      budgetsParDirection: budgetsParDirection.map((b) => ({
        direction: b.direction.code,
        alloue: b.montantAlloue,
        consomme: b.montantConsomme,
      })),
      tachesParStatut: tachesParStatut.map((t) => ({ statut: t.statut, count: t._count })),
    },
  });
}));

/**
 * GET /api/dashboard/widgets - configuration des widgets de l'utilisateur
 */
router.get('/widgets', authenticate, asyncHandler(async (req, res) => {
  const widgets = await prisma.widgetConfig.findMany({
    where: { userId: req.user.id },
    orderBy: { position: 'asc' },
  });
  res.json({ success: true, data: widgets });
}));

/**
 * PUT /api/dashboard/widgets - sauvegarde la config (drag & drop)
 */
router.put('/widgets', authenticate, asyncHandler(async (req, res) => {
  const { widgets } = req.body; // [{ widgetKey, position, visible, config }]
  await prisma.widgetConfig.deleteMany({ where: { userId: req.user.id } });
  await prisma.widgetConfig.createMany({
    data: widgets.map((w) => ({
      userId: req.user.id,
      widgetKey: w.widgetKey,
      position: w.position,
      visible: w.visible ?? true,
      config: w.config || null,
    })),
  });
  res.json({ success: true });
}));

/**
 * GET /api/dashboard/export/pdf - rapport mensuel en PDF
 */
router.get('/export/pdf', authenticate, asyncHandler(async (req, res) => {
  const annee = new Date().getFullYear();
  const [effectif, projets, budgets] = await Promise.all([
    prisma.user.count({ where: { actif: true } }),
    prisma.projet.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
    prisma.budget.findMany({ where: { annee }, include: { direction: true } }),
  ]);

  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="rapport-sht-${Date.now()}.pdf"`);
  doc.pipe(res);

  // Header
  doc.fillColor('#1A2B3C').fontSize(22).text('PORTAIL SHT', { align: 'center' });
  doc.fontSize(12).fillColor('#2E7D32').text('Société des Hydrocarbures du Tchad', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).fillColor('#1A2B3C').text(`Rapport de gestion - ${annee}`, { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).fillColor('black');
  doc.text(`Généré le : ${new Date().toLocaleString('fr-FR')}`);
  doc.text(`Généré par : ${req.user.prenom} ${req.user.nom} (${req.user.role})`);
  doc.moveDown();

  // Indicateurs clés
  doc.fontSize(14).fillColor('#1A2B3C').text('Indicateurs clés');
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor('black');
  doc.text(`• Effectifs actifs : ${effectif}`);
  doc.text(`• Projets en cours : ${projets.filter((p) => p.statut === 'EN_COURS').length}`);
  doc.moveDown();

  // Budgets
  doc.fontSize(14).fillColor('#1A2B3C').text('Budgets par direction');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('black');
  for (const b of budgets) {
    const pct = b.montantAlloue ? ((b.montantConsomme / b.montantAlloue) * 100).toFixed(1) : 0;
    doc.text(`${b.direction.nom} : ${b.montantConsomme.toLocaleString()} / ${b.montantAlloue.toLocaleString()} XAF (${pct}%)`);
  }
  doc.moveDown();

  // Projets
  doc.fontSize(14).fillColor('#1A2B3C').text('Projets récents');
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('black');
  for (const p of projets) {
    doc.text(`[${p.code}] ${p.titre} - ${p.statut} (${p.avancement}%)`);
  }

  doc.moveDown(2);
  doc.fontSize(8).fillColor('gray').text('© SHT - Tous droits réservés', { align: 'center' });

  doc.end();
}));

module.exports = router;
