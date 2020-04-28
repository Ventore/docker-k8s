module.exports = {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  postgres: {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
  },
};
