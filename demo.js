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
    const cacheKey = JSON.stringify({ name, price, category });
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
    // look for name, option i is for case insensitive
    if (name) query.name = { $regex: name, $options: "i" };
    // look for price less than the given price, $lt is for less than
    if (price) query.price = { $lt: price };
    // look for category
    if (category) query.category = { $regex: category, $options: "i" };
    // find the products
    const products = await ProductModel.find(query).lean();
    // set the cache
    await redisClient.setEx(hash, 60, JSON.stringify(products));
    
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