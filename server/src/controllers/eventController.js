import { parseEvents, saveEvents } from "../services/eventService.js";

const MAX_EVENTS = 500;

export async function createEvents(req, res) {
  let list;
  try {
    list = parseEvents(req.body);
  } catch {
    return res.status(400).json({ error: "Body must be valid JSON" });
  }

  if (list.length > MAX_EVENTS) {
    return res.status(400).json({ error: `Send at most ${MAX_EVENTS} events per request` });
  }

  const result = await saveEvents(list);
  res.status(201).json(result);
}
