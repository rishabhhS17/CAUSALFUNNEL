import "dotenv/config";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import productRoutes from "./routes/products.js";
import eventRoutes from "./routes/events.js";

const app = express();
const PORT = process.env.PORT || 5000;
const TRACKER_DIR = fileURLToPath(new URL("../../tracker", import.meta.url));

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// The embeddable tracking script (ES modules) that websites load with
// <script type="module" src=".../tracker/index.js">
app.use("/tracker", express.static(TRACKER_DIR));

app.use("/api/products", productRoutes);
app.use("/api/events", eventRoutes);
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
