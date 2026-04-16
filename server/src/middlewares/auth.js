const { verifyAccessToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const prisma = require('../config/prisma');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token manquant');
    }
    const token = header.substring(7);
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true, email: true, nom: true, prenom: true, role: true,
        directionId: true, actif: true, avatar: true, poste: true,
      },
    });

    if (!user || !user.actif) {
      throw ApiError.unauthorized('Utilisateur inactif ou introuvable');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return next(ApiError.unauthorized('Token expiré'));
    if (err.name === 'JsonWebTokenError') return next(ApiError.unauthorized('Token invalide'));
    next(err);
  }
}

/**
 * RBAC : vérifie que l'utilisateur a l'un des rôles requis.
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Rôle requis : ${allowedRoles.join(', ')}`));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
