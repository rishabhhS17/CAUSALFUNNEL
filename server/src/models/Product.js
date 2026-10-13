import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    // Readable id used in URLs, e.g. /products/classic-white-tee
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },

    // No real images: the store draws a coloured tile with an emoji instead
    color: { type: String, default: "#e5e7eb" },
    emoji: { type: String, default: "🛍️" },

    sizes: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
