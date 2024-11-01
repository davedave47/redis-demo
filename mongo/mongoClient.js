import { createConnection } from "mongoose";
import "dotenv/config";

const mongoClient = createConnection(process.env.MONGO_URL)

console.log("Mongo connected");

export default mongoClient;
