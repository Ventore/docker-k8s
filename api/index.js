const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require('pg');
const redis = require('redis');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pgClient = new pg.Pool({
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  host: config.postgres.host,
  port: config.postgres.port,
});

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(console.log);

pgClient.on('error', () => console.log('Lost PG connection'));

const redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
  res.send('Hi');
});
app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});
app.get('/values/current', (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});
app.post('/values', async (req, res) => {
  const { index } = req.body;

  if (parseInt(index, 10) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, () => {
  console.log('Listening');
});
