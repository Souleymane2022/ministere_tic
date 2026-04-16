const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = err;
  if (!(error instanceof ApiError)) {
    // Prisma known errors
    if (err.code === 'P2002') {
      error = ApiError.conflict('Valeur en doublon pour un champ unique');
    } else if (err.code === 'P2025') {
      error = ApiError.notFound('Enregistrement introuvable');
    } else {
      logger.error(err.message, err.stack);
      error = new ApiError(err.statusCode || 500, err.message || 'Erreur serveur');
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    details: error.details || undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route introuvable : ${req.method} ${req.originalUrl}`));
}

module.exports = { errorHandler, notFoundHandler };
