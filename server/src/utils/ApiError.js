class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = 'Requête invalide', details) { return new ApiError(400, msg, details); }
  static unauthorized(msg = 'Non authentifié') { return new ApiError(401, msg); }
  static forbidden(msg = 'Accès refusé') { return new ApiError(403, msg); }
  static notFound(msg = 'Ressource introuvable') { return new ApiError(404, msg); }
  static conflict(msg = 'Conflit') { return new ApiError(409, msg); }
  static internal(msg = 'Erreur serveur') { return new ApiError(500, msg); }
}

module.exports = ApiError;
