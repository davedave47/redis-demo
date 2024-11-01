import ProductModel from "./mongo/ProductModel.js";
import { faker } from "@faker-js/faker";

const BATCH_SIZE = 1000; // Define the batch size
const TOTAL_PRODUCTS = 2e6; // Total number of products to insert

async function insertProducts() {
    for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
        const products = [];

        for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_PRODUCTS; j++) {
            products.push({
                name: faker.commerce.productName(),
                price: faker.commerce.price(),
                category: faker.commerce.department(),
            });
        }

        // Insert the batch into the database
        try {
            await ProductModel.insertMany(products, { ordered: false });
            console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
        } catch (err) {
            console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, err);
        }
    }
}

insertProducts().then(() => {
    console.log("All products inserted");
    process.exit(0);
}).catch(err => {
    console.error("Error inserting products:", err);
    process.exit(1);
});