/*
 * CausalFunnel tracker — records page_view and click events and sends them
 * to the CausalFunnel API. Plain JavaScript modules, no dependencies.
 *
 * Usage:
 *   <script type="module" src="https://api.example.com/tracker/index.js"
 *           data-endpoint="https://api.example.com/api/events"></script>
 *
 * Clicks inside an element marked `data-cf-ignore` are not recorded.
 */
import { shouldTrack, getEndpoint } from "./config.js";
import { getSessionId, startSession } from "./session.js";
import { trackPageView, trackClick, forgetLastPage } from "./events.js";
import { startSending, flush } from "./transport.js";
import { watchNavigation } from "./navigation.js";

function start() {
  startSending(getEndpoint());
  watchNavigation(trackPageView);
  document.addEventListener("click", trackClick, true);
  trackPageView();

  // Used by the store's debug badge
  window.CFTracker = {
    getSessionId,
    // Ends the current session and starts a fresh one on the current page
    resetSession() {
      flush();
      const id = startSession();
      forgetLastPage();
      trackPageView();
      return id;
    },
  };
}

if (shouldTrack()) {
  start();
}
