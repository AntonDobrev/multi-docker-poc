const keys = require("./keys");
const redis = require("redis");

// TODO - not working if initiaalized via the env vars from keys
const redisClient = redis.createClient({
  host: "redis",
  port: "6379",
  retry_strategy: () => 1000,
});
const subscriber = redisClient.duplicate();

redisClient.on("connect", () => {
  console.log("Redis client connected from worker");
});

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

subscriber.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});
subscriber.subscribe("insert");
