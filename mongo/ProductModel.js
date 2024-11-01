import mongoClient from "./mongoClient.js";
import { Schema } from "mongoose";

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

const ProductModel = mongoClient.model("Product", ProductSchema);

export default ProductModel;