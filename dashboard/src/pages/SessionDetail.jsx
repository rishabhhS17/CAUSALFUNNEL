import { Link, useParams } from "react-router-dom";
import { getSessionEvents } from "../api.js";
import { useFetch } from "../hooks/useFetch.js";
import { formatTime, formatDuration, plural } from "../utils/format.js";
import Timeline from "../components/Timeline.jsx";
import "./SessionDetail.css";

function Summary({ events }) {
  const first = events[0].timestamp;
  const last = events[events.length - 1].timestamp;
  const clicks = events.filter((event) => event.event_type === "click").length;

  return (
    <div className="session-summary">
      <span>Started {formatTime(first)}</span>
      <span>Duration {formatDuration(first, last)}</span>
      <span>{plural(events.length - clicks, "page view")}</span>
      <span>{plural(clicks, "click")}</span>
    </div>
  );
}

export default function SessionDetail() {
  const { id } = useParams();
  const { data, error, loading } = useFetch(() => getSessionEvents(id), id);

  if (loading) return <p className="status">Loading journey…</p>;
  if (error) return <p className="status status-error">Could not load this session ({error}).</p>;

  return (
    <>
      <Link to="/sessions">← All sessions</Link>
      <h1 className="page-title session-title">
        Session <code>{id}</code>
      </h1>
      <Summary events={data.events} />
      <Timeline events={data.events} />
    </>
  );
}
