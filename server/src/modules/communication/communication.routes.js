const router = require('express').Router();
const Joi = require('joi');
const prisma = require('../../config/prisma');
const { authenticate, authorize } = require('../../middlewares/auth');
const { auditLog } = require('../../middlewares/audit');
const validate = require('../../middlewares/validate');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

// ============== MESSAGES ==============

const messageSchema = Joi.object({
  destinataireId: Joi.string().required(),
  contenu: Joi.string().min(1).required(),
});

router.get('/messages/conversations', authenticate, asyncHandler(async (req, res) => {
  // Liste distincte des interlocuteurs
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ expediteurId: req.user.id }, { destinataireId: req.user.id }],
    },
    include: {
      expediteur: { select: { id: true, nom: true, prenom: true, avatar: true, poste: true } },
      destinataire: { select: { id: true, nom: true, prenom: true, avatar: true, poste: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const map = new Map();
  for (const m of messages) {
    const other = m.expediteurId === req.user.id ? m.destinataire : m.expediteur;
    if (!map.has(other.id)) {
      const nonLus = messages.filter(
        (x) => x.destinataireId === req.user.id && x.expediteurId === other.id && !x.lu
      ).length;
      map.set(other.id, { contact: other, lastMessage: m, nonLus });
    }
  }

  res.json({ success: true, data: Array.from(map.values()) });
}));

router.get('/messages/:userId', authenticate, asyncHandler(async (req, res) => {
  const other = req.params.userId;
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { expediteurId: req.user.id, destinataireId: other },
        { expediteurId: other, destinataireId: req.user.id },
      ],
    },
    orderBy: { createdAt: 'asc' },
    take: 500,
  });

  // Marquer comme lus
  await prisma.message.updateMany({
    where: { expediteurId: other, destinataireId: req.user.id, lu: false },
    data: { lu: true, luAt: new Date() },
  });

  res.json({ success: true, data: messages });
}));

router.post('/messages', authenticate, validate(messageSchema), asyncHandler(async (req, res) => {
  const msg = await prisma.message.create({
    data: { ...req.body, expediteurId: req.user.id },
    include: {
      expediteur: { select: { id: true, nom: true, prenom: true, avatar: true } },
    },
  });

  // Notification
  await prisma.notification.create({
    data: {
      userId: req.body.destinataireId,
      titre: 'Nouveau message',
      message: `${msg.expediteur.prenom} ${msg.expediteur.nom} vous a envoyé un message`,
      type: 'MESSAGE',
      lien: `/messages/${msg.expediteurId}`,
    },
  });

  // Push Socket.io si disponible
  if (req.io) {
    req.io.to(`user:${req.body.destinataireId}`).emit('new-message', msg);
  }

  res.status(201).json({ success: true, data: msg });
}));

// ============== ANNONCES ==============

const annonceSchema = Joi.object({
  titre: Joi.string().required(),
  contenu: Joi.string().required(),
  categorie: Joi.string().valid('GENERALE', 'RH', 'DIRECTION', 'PROJET', 'URGENT').default('GENERALE'),
  epingle: Joi.boolean().default(false),
  image: Joi.string().allow('', null),
});

router.get('/annonces', authenticate, asyncHandler(async (req, res) => {
  const { categorie } = req.query;
  const where = {};
  if (categorie) where.categorie = categorie;
  const items = await prisma.annonce.findMany({
    where,
    include: { auteur: { select: { id: true, nom: true, prenom: true, avatar: true, poste: true } } },
    orderBy: [{ epingle: 'desc' }, { createdAt: 'desc' }],
  });
  res.json({ success: true, data: items });
}));

router.post('/annonces',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  validate(annonceSchema),
  asyncHandler(async (req, res) => {
    const item = await prisma.annonce.create({
      data: { ...req.body, auteurId: req.user.id },
      include: { auteur: { select: { id: true, nom: true, prenom: true, avatar: true } } },
    });
    await auditLog(req, 'CREATE_ANNONCE', 'Annonce', item.id);

    if (req.io) req.io.emit('new-announcement', item);

    res.status(201).json({ success: true, data: item });
  })
);

router.put('/annonces/:id',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    const item = await prisma.annonce.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: item });
  })
);

router.delete('/annonces/:id',
  authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'DIRECTEUR'),
  asyncHandler(async (req, res) => {
    await prisma.annonce.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  })
);

// ============== NOTIFICATIONS ==============

router.get('/notifications', authenticate, asyncHandler(async (req, res) => {
  const items = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  const nonLus = await prisma.notification.count({ where: { userId: req.user.id, lu: false } });
  res.json({ success: true, data: items, nonLus });
}));

router.patch('/notifications/:id/lu', authenticate, asyncHandler(async (req, res) => {
  const n = await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user.id },
    data: { lu: true, luAt: new Date() },
  });
  res.json({ success: true, count: n.count });
}));

router.patch('/notifications/all/lu', authenticate, asyncHandler(async (req, res) => {
  const n = await prisma.notification.updateMany({
    where: { userId: req.user.id, lu: false },
    data: { lu: true, luAt: new Date() },
  });
  res.json({ success: true, count: n.count });
}));

router.delete('/notifications/:id', authenticate, asyncHandler(async (req, res) => {
  await prisma.notification.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
  res.json({ success: true });
}));

module.exports = router;
