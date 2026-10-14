export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
export const FLUSH_INTERVAL_MS = 2000;

export function shouldTrack() {
  return !isInIframe() && new URLSearchParams(location.search).get("cf_preview") !== "1";
}

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function getEndpoint() {
  const script = document.querySelector("script[data-endpoint]");
  return script?.getAttribute("data-endpoint") || new URL("/api/events", import.meta.url).href;
}
