const keys = require("./keys");
const redis = require("redis");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
  ssl:
    process.env.NODE_ENV !== "production"
      ? false
      : { rejectUnauthorized: false },
});

pgClient.on("connect", (client) => {
  console.log("Connected to Postgres");
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// Redis Client Setup
// TODO - debug only
console.log("redisHost");
console.log(redisHost);
console.log(redisPort);

// TODO - not connecting if the env values are used - stays in limbo unless added directly in the config
const redisClient = redis.createClient({
  host: "redis",
  port: "6379",
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});
// Express route handlers

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");

  res.send(values.rows);
});

app.get("/values/current", (req, res) => {
  console.log("/values/current");

  // TODO - not working
  redisClient.hgetall("values", (err, values) => {
    if (err) {
      console.log(err);
    }
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});
