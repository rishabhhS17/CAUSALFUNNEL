// Queues events and sends them to the API in batches.
import { FLUSH_INTERVAL_MS } from "./config.js";

let queue = [];
let endpoint = null;

export function enqueue(event) {
  queue.push(event);
}

export function flush() {
  if (queue.length === 0 || !endpoint) {
    return;
  }
  const body = JSON.stringify(queue);
  queue = [];

  // text/plain keeps this a "simple" request, so there is no CORS preflight.
  // sendBeacon also survives the page being closed.
  const sent = navigator.sendBeacon?.(endpoint, new Blob([body], { type: "text/plain" }));
  if (!sent) {
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

// Sends every couple of seconds, and right away when the tab is hidden or closed
export function startSending(url) {
  endpoint = url;
  setInterval(flush, FLUSH_INTERVAL_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flush();
    }
  });
  window.addEventListener("pagehide", flush);
}
