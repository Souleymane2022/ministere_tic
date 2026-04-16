const { verifyAccessToken } = require('../utils/jwt');
const logger = require('../utils/logger');

/**
 * Initialise Socket.io - canaux par utilisateur + messagerie temps réel.
 */
function initSockets(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Token manquant'));
    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.sub;
      socket.userRole = decoded.role;
      next();
    } catch {
      next(new Error('Token invalide'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connecté: ${socket.userId}`);
    socket.join(`user:${socket.userId}`);

    socket.on('typing', ({ destinataireId }) => {
      io.to(`user:${destinataireId}`).emit('user-typing', { userId: socket.userId });
    });

    socket.on('disconnect', () => {
      logger.info(`Socket déconnecté: ${socket.userId}`);
    });
  });

  return io;
}

module.exports = { initSockets };
