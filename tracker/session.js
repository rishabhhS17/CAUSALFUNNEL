// Anonymous visitor session: an id in localStorage that expires
// after 30 minutes without any activity.
import { SESSION_TIMEOUT_MS } from "./config.js";

const SESSION_KEY = "cf_session_id";
const ACTIVITY_KEY = "cf_last_activity";

// Fallback when localStorage is blocked (private mode etc.)
let memorySessionId = null;

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked: the session lasts for this page only
  }
}

function newId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

// Starts a new session and tells the page (the store's debug badge listens)
export function startSession() {
  memorySessionId = newId();
  storageSet(SESSION_KEY, memorySessionId);
  touchSession();
  window.dispatchEvent(new CustomEvent("cf:session", { detail: memorySessionId }));
  return memorySessionId;
}

// Returns the current session id, starting a new session if there is none
// or the visitor has been inactive for longer than the timeout.
export function getSessionId() {
  const id = storageGet(SESSION_KEY) || memorySessionId;
  const lastActivity = Number(storageGet(ACTIVITY_KEY)) || 0;
  if (!id || Date.now() - lastActivity > SESSION_TIMEOUT_MS) {
    return startSession();
  }
  return id;
}

export function touchSession() {
  storageSet(ACTIVITY_KEY, String(Date.now()));
}
