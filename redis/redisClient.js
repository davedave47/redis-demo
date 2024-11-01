import { createClient } from "redis";
import "dotenv/config";

const redisClient = createClient({url: "redis://default:5g8AR4NA5sQRaXNxJbcfU8l8XZUswXcm@redis-11549.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com:11549"});
redisClient.connect().then(() => {
    console.log("Redis connected");
})

export default redisClient;