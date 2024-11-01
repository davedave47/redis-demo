import mongoClient from "./mongoClient.js";
import { Schema } from "mongoose";
// Define the schema for the product
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
});
// Create a model from the schema
const ProductModel = mongoClient.model("Product", ProductSchema);

export default ProductModel;