const Redis = require('ioredis');
const env = require('./env');

let redisClient = null;

function getRedis() {
  if (!redisClient) {
    try {
      redisClient = new Redis(env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 2,
        retryStrategy(times) {
          if (times > 3) return null;
          return Math.min(times * 200, 1000);
        },
      });
      redisClient.on('error', (err) => {
        // Fail silently, Redis is optional for cache
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Redis]', err.message);
        }
      });
      redisClient.connect().catch(() => {
        console.warn('[Redis] connexion impossible, cache desactive');
      });
    } catch (err) {
      console.warn('[Redis] non disponible');
    }
  }
  return redisClient;
}

module.exports = { getRedis };
