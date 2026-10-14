import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";
import { clothing } from "./clothing.js";
import { accessories } from "./accessories.js";
import { footwear } from "./footwear.js";

const products = [...clothing, ...accessories, ...footwear];

async function seed() {
  await connectDB();

  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);
  console.log(`Inserted ${inserted.length} products`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
