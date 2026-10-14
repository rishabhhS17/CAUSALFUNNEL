import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";

const products = [
  {
    slug: "classic-white-tee",
    name: "Classic White Tee",
    price: 499,
    category: "clothing",
    description: "A soft cotton t-shirt that goes with everything.",
    color: "#f3f4f6",
    emoji: "👕",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "denim-jacket",
    name: "Denim Jacket",
    price: 2499,
    category: "clothing",
    description: "A sturdy denim jacket for cooler evenings.",
    color: "#bfdbfe",
    emoji: "🧥",
    sizes: ["S", "M", "L"],
  },
  {
    slug: "summer-dress",
    name: "Summer Dress",
    price: 1799,
    category: "clothing",
    description: "Light and breezy, made for warm days.",
    color: "#fbcfe8",
    emoji: "👗",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    slug: "running-shoes",
    name: "Running Shoes",
    price: 3499,
    category: "footwear",
    description: "Cushioned shoes for your daily run.",
    color: "#fde68a",
    emoji: "👟",
    sizes: ["7", "8", "9", "10"],
  },
  {
    slug: "leather-boots",
    name: "Leather Boots",
    price: 4299,
    category: "footwear",
    description: "Classic leather boots built to last.",
    color: "#d6b38c",
    emoji: "🥾",
    sizes: ["7", "8", "9", "10", "11"],
  },
  {
    slug: "canvas-backpack",
    name: "Canvas Backpack",
    price: 1999,
    category: "accessories",
    description: "Roomy backpack with a padded laptop sleeve.",
    color: "#bbf7d0",
    emoji: "🎒",
    sizes: [],
  },
  {
    slug: "sunglasses",
    name: "Sunglasses",
    price: 999,
    category: "accessories",
    description: "UV-protected lenses in a lightweight frame.",
    color: "#e9d5ff",
    emoji: "🕶️",
    sizes: [],
  },
  {
    slug: "wrist-watch",
    name: "Wrist Watch",
    price: 5999,
    category: "accessories",
    description: "A minimal watch with a stainless steel strap.",
    color: "#cbd5e1",
    emoji: "⌚",
    sizes: [],
  },
];

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
