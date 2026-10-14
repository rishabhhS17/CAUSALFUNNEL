import { useEffect, useState } from "react";
import "./DebugBadge.css";

const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5174";

export default function DebugBadge() {
  const tracker = window.CFTracker;
  const [sessionId, setSessionId] = useState(() => tracker?.getSessionId() ?? null);

  useEffect(() => {
    const onSession = (e) => setSessionId(e.detail);
    window.addEventListener("cf:session", onSession);
    return () => window.removeEventListener("cf:session", onSession);
  }, []);

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
      <a className="debug-badge-link" href={`${DASHBOARD_URL}/sessions/${sessionId}`} target="_blank" rel="noreferrer">
        View journey ↗
      </a>
    </div>
  );
}
