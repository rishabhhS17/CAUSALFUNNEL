import { Router } from "express";
import { listSessions, getSessionEvents } from "../controllers/sessionController.js";

const router = Router();

router.get("/", listSessions);
router.get("/:id/events", getSessionEvents);

export default router;
