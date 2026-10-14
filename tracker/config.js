// Settings, and whether this page should be tracked at all.

export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
export const FLUSH_INTERVAL_MS = 2000;

// Don't track inside iframes or the dashboard's heatmap preview,
// otherwise previewing a page would create fake events.
export function shouldTrack() {
  return !isInIframe() && new URLSearchParams(location.search).get("cf_preview") !== "1";
}

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true; // cross-origin parent
  }
}

// Where to send events: the script tag's data-endpoint attribute,
// or /api/events on the server this script was loaded from.
export function getEndpoint() {
  const script = document.querySelector("script[data-endpoint]");
  return script?.getAttribute("data-endpoint") || new URL("/api/events", import.meta.url).href;
}
