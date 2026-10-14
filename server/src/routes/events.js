import express, { Router } from "express";
import { Event, EVENT_TYPES } from "../models/Event.js";

const router = Router();

const MAX_EVENTS_PER_REQUEST = 500;

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidEvent(event) {
  if (!event || typeof event !== "object") return false;
  if (typeof event.session_id !== "string" || !event.session_id) return false;
  if (!EVENT_TYPES.includes(event.event_type)) return false;
  if (typeof event.page_url !== "string" || !event.page_url) return false;
  if (Number.isNaN(Date.parse(event.timestamp))) return false;
  if (event.event_type === "click" && !(isNumber(event.x) && isNumber(event.y))) return false;
  return true;
}

// The tracker sends JSON as text/plain (avoids a CORS preflight),
// so parse it here; application/json is already parsed by express.json().
function readEvents(req) {
  let body = req.body;
  if (typeof body === "string") {
    body = JSON.parse(body);
  }
  return Array.isArray(body) ? body : [body];
}

// POST /api/events -> store one event or an array of events.
// Invalid events are dropped so one bad event doesn't lose the whole batch.
router.post("/", express.text({ type: "text/plain" }), async (req, res) => {
  let events;
  try {
    events = readEvents(req);
  } catch {
    return res.status(400).json({ error: "Body must be valid JSON" });
  }

  if (events.length > MAX_EVENTS_PER_REQUEST) {
    return res.status(400).json({ error: `Send at most ${MAX_EVENTS_PER_REQUEST} events per request` });
  }

  const valid = events.filter(isValidEvent);
  if (valid.length > 0) {
    await Event.insertMany(valid);
  }

  res.status(201).json({ saved: valid.length, rejected: events.length - valid.length });
});

export default router;
