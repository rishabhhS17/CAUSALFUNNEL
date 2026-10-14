import express, { Router } from "express";
import { createEvents } from "../controllers/eventController.js";

const router = Router();

router.post("/", express.text({ type: "text/plain" }), createEvents);

export default router;
