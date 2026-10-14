import { Router } from "express";
import { listPages, getHeatmap, getStats } from "../controllers/analyticsController.js";

const router = Router();

router.get("/pages", listPages);
router.get("/heatmap", getHeatmap);
router.get("/stats", getStats);

export default router;
