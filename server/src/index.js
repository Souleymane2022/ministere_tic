const http = require('http');
const { Server } = require('socket.io');
const env = require('./config/env');
const { createApp } = require('./app');
const { initSockets } = require('./sockets');
const logger = require('./utils/logger');

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: env.CLIENT_URL, credentials: true },
});
initSockets(io);
app.set('io', io);

server.listen(env.PORT, () => {
  logger.success(`Serveur SHT démarré sur http://localhost:${env.PORT}`);
  logger.info(`Environnement : ${env.NODE_ENV}`);
  logger.info(`Client CORS : ${env.CLIENT_URL}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection:', err);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  process.exit(1);
});
