import { useEffect, useState } from "react";
import "./DebugBadge.css";

// Shows the tracker's current session id so testers can find their session.
// data-cf-ignore stops the tracker from recording clicks on the badge itself.
export default function DebugBadge() {
  const tracker = window.CFTracker;
  const [sessionId, setSessionId] = useState(() => tracker?.getSessionId() ?? null);

  useEffect(() => {
    const onSession = (e) => setSessionId(e.detail);
    window.addEventListener("cf:session", onSession);
    return () => window.removeEventListener("cf:session", onSession);
  }, []);

  // Tracker not loaded (API down, or the page is inside the heatmap preview)
  if (!tracker || !sessionId) {
    return null;
  }

  return (
    <div className="debug-badge card" data-cf-ignore>
      <div className="debug-badge-label">CF session</div>
      <div className="debug-badge-row">
        <code className="debug-badge-id" title={sessionId}>
          {sessionId.slice(0, 8)}…
        </code>
        <button className="debug-badge-button" onClick={() => tracker.resetSession()}>
          New session
        </button>
      </div>
    </div>
  );
}
