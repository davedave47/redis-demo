import redisClient from "./redis/redisClient.js";
import ProductModel from "./mongo/ProductModel.js";
import crypto from "crypto";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const expireTime = 60;

// URL: localhost:3000/products?name=<name>&price=<price>&category=<category>
app.get("/products", async (req, res) => {
    const startTime = Date.now();
    // extract the query parameters
    const { name, price, category } = req.query;


    // hash the parameters to create a cache key
    const cacheKey = JSON.stringify({ name: name ? name.toLowerCase():undefined, price, category: category ? category.toLowerCase() : undefined });
    const hash = crypto.createHash("sha256").update(cacheKey).digest("hex");
    // check if the cache exists
    const cachedProducts = await redisClient.get(hash);
    // cache hit
    if (cachedProducts) {
        const responseTime = Date.now() - startTime;
        return res.json({
            cache: "hit",
            time: `${responseTime}ms`,
            data: JSON.parse(cachedProducts)
        });    
    }
    // cache miss, create query for mongodb
    const query = {};
    
    if (name) query.name = { $regex: name, $options: "i" }; // look for name, option i is for case insensitive
    if (price) query.price = { $lt: price }; // look for price less than the given price, $lt is for less than
    if (category) query.category = { $regex: `^${category}$`, $options: "i" }; // look for category, exact match, option i is for case insensitive
    // find the products
    const products = await ProductModel.find(query).lean();
    // set the cache with expireTime
    await redisClient.setEx(hash, expireTime, JSON.stringify(products));
    
    const responseTime = Date.now() - startTime;
    return res.json({
        cache: "miss",
        time: `${responseTime}ms`,
        data: products,
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});