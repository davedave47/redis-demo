import redisClient from "./redis/redisClient.js";
import ProductModel from "./mongo/ProductModel.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/products/lessthan/:price", async (req, res) => {
    const startTime = Date.now();
    const { price } = req.params;
    const cachedProducts = await redisClient.get(price);

    if (cachedProducts) {
        const responseTime = Date.now() - startTime;
        return res.json({
            data: JSON.parse(cachedProducts),
            cache: true,
            time: `${responseTime}ms`
        });    }

        const products = await ProductModel.find({ price: { $lt: price } });
        await redisClient.setEx(price, 3600, JSON.stringify(products));
    
        const responseTime = Date.now() - startTime;
        return res.json({
            data: products,
            cache: false,
            time: `${responseTime}ms`
        });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});