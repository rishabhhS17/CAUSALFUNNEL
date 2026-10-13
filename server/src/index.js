import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import productRoutes from "./routes/products.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productRoutes);

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Any error thrown in a route ends up here
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
