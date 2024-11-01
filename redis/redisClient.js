import { createClient } from "redis";
import "dotenv/config";

const redisClient = createClient({url: process.env.REDIS_URL});
redisClient.connect().then(() => {
    console.log("Redis connected");
    redisClient.flushAll();
})

export default redisClient;