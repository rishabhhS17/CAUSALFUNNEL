const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const STORE_URL = import.meta.env.VITE_STORE_URL || "http://localhost:5173";

async function get(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json();
}

export function getStats() {
  return get("/api/stats");
}

export function getSessions(page, limit) {
  return get(`/api/sessions?page=${page}&limit=${limit}`);
}

export function getSessionEvents(id) {
  return get(`/api/sessions/${encodeURIComponent(id)}/events`);
}

export function getPages() {
  return get("/api/pages");
}

export function getHeatmap(url, sessionId) {
  const params = new URLSearchParams({ url });
  if (sessionId) {
    params.set("session_id", sessionId);
  }
  return get(`/api/heatmap?${params}`);
}
