import { createClient } from "redis";
import "dotenv/config";
// Create a redis client
const redisClient = createClient({url: process.env.REDIS_URL});
// Connect to redis
redisClient.connect().then(() => {
    console.log("Redis connected");
    // Flush all the data in redis on connect
    redisClient.flushAll();
})

export default redisClient;