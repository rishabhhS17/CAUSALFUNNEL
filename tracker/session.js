import { SESSION_TIMEOUT_MS } from "./config.js";

const SESSION_KEY = "cf_session_id";
const ACTIVITY_KEY = "cf_last_activity";

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
  }
}

function newId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function startSession() {
  memorySessionId = newId();
  storageSet(SESSION_KEY, memorySessionId);
  touchSession();
  window.dispatchEvent(new CustomEvent("cf:session", { detail: memorySessionId }));
  return memorySessionId;
}

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
