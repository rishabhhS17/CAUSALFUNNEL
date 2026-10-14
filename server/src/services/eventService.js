import { Event, EVENT_TYPES } from "../models/Event.js";

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

export function parseEvents(body) {
  let data = body;
  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    return data;
  }
  return [data];
}

export async function saveEvents(list) {
  const valid = list.filter(isValidEvent);
  if (valid.length > 0) {
    await Event.insertMany(valid);
  }
  return { saved: valid.length, rejected: list.length - valid.length };
}
