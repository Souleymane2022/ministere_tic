const prisma = require('../config/prisma');
const logger = require('../utils/logger');

/**
 * Enregistre une action dans le journal d'audit.
 * Usage : auditLog(req, 'CREATE_DOCUMENT', 'Document', docId, { titre: ... })
 */
async function auditLog(req, action, entite, entiteId = null, details = null) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user ? req.user.id : null,
        action,
        entite,
        entiteId: entiteId ? String(entiteId) : null,
        details: details || undefined,
        ip: req.ip || req.headers['x-forwarded-for'] || null,
        userAgent: req.headers['user-agent'] || null,
      },
    });
  } catch (err) {
    logger.warn('Audit log échec:', err.message);
  }
}

module.exports = { auditLog };
