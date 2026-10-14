import { getSessionId, touchSession } from "./session.js";
import { enqueue, flush } from "./transport.js";

const CLICKABLE = "a, button, input, select, textarea, label, [role='button']";

let lastPageUrl = null;

function currentPageUrl() {
  return location.origin + location.pathname;
}

function record(type, extra = {}) {
  enqueue({
    session_id: getSessionId(),
    event_type: type,
    page_url: currentPageUrl(),
    timestamp: new Date().toISOString(),
    viewport_width: window.innerWidth,
    page_height: document.documentElement.scrollHeight,
    ...extra,
  });
  touchSession();
}

export function trackPageView() {
  const url = currentPageUrl();
  if (url === lastPageUrl) {
    return;
  }
  lastPageUrl = url;
  record("page_view");
  flush();
}

export function forgetLastPage() {
  lastPageUrl = null;
}

export function trackClick(e) {
  const el = e.target instanceof Element ? e.target : null;
  if (el?.closest("[data-cf-ignore]")) {
    return;
  }
  const pageWidth = document.documentElement.scrollWidth || window.innerWidth;
  record("click", {
    x: Math.round(e.pageX),
    y: Math.round(e.pageY),
    x_percent: Math.round((e.pageX / pageWidth) * 10000) / 100,
    target: el ? describe(el.closest(CLICKABLE) || el) : null,
  });
}

function firstWordyLine(el) {
  const lines = (el.innerText || el.textContent || "").split(/\n/);
  for (const line of lines) {
    const text = line.trim().replace(/\s+/g, " ");
    if (/\p{L}/u.test(text)) {
      return text;
    }
  }
  return "";
}

function describe(el) {
  const text = el.getAttribute("aria-label") || firstWordyLine(el) || el.placeholder || el.alt || "";
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    text: text.slice(0, 50) || null,
  };
}
