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

  window.CFTracker = {
    getSessionId,
    resetSession() {
      flush();
      const id = startSession();
      forgetLastPage();
      trackPageView();
      flush();
      return id;
    },
  };
}

if (shouldTrack()) {
  start();
}
