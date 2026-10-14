import { Product } from "../models/Product.js";

export async function getProducts(req, res) {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const products = await Product.find(filter).sort({ name: 1 });
  res.json(products);
}

export async function getProduct(req, res) {
  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
}
