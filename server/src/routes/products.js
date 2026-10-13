import { Router } from "express";
import { Product } from "../models/Product.js";

const router = Router();

// GET /api/products            -> all products
// GET /api/products?category=x -> products in one category
router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const products = await Product.find(filter).sort({ name: 1 });
  res.json(products);
});

// GET /api/products/:slug -> one product
router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

export default router;
