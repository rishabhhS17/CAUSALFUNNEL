import { findSessions, findSessionEvents } from "../services/sessionService.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function readNumber(value, fallback) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < 1) {
    return fallback;
  }
  return n;
}

export async function listSessions(req, res) {
  const page = readNumber(req.query.page, 1);
  const limit = Math.min(readNumber(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT);

  const { sessions, total } = await findSessions(page, limit);
  res.json({ sessions, total, page, limit });
}

export async function getSessionEvents(req, res) {
  const id = req.params.id;
  const events = await findSessionEvents(id);

  if (events.length === 0) {
    return res.status(404).json({ error: "Session not found" });
  }

  res.json({ session_id: id, count: events.length, events });
}
