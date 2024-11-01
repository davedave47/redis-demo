import { createConnection } from "mongoose";
import "dotenv/config";
// Create a mongo client
const mongoClient = createConnection(process.env.MONGO_URL)
console.log("Mongo connected");

export default mongoClient;
