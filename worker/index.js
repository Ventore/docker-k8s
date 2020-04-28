const config = require('./config');
const redis = require('redis');
const fib = require('./fib');

const redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  retry_strategy: () => 1000,
});

const subscriber = redisClient.duplicate();

subscriber.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message), 10));
});

subscriber.subscribe('insert');
