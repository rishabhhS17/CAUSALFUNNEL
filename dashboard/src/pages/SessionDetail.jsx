import { Link, useParams } from "react-router-dom";
import { getSessionEvents } from "../api.js";
import { useFetch } from "../hooks/useFetch.js";
import { formatTime, formatDuration, pagePath, plural } from "../utils/format.js";
import "./SessionDetail.css";

function heatmapLink(event) {
  const params = new URLSearchParams({ url: event.page_url, session: event.session_id });
  return `/heatmap?${params}`;
}

function ClickInfo({ event }) {
  let label = "";
  if (event.target) {
    label = `<${event.target.tag}>`;
    if (event.target.text) label += ` “${event.target.text}”`;
  }

  return (
    <span className="timeline-detail">
      {label} at ({event.x}, {event.y}) · <Link to={heatmapLink(event)}>see on heatmap</Link>
    </span>
  );
}

function EventItem({ event, start }) {
  const isClick = event.event_type === "click";

  return (
    <li className={isClick ? "timeline-item is-click" : "timeline-item is-view"}>
      <span className="timeline-time">+{formatDuration(start, event.timestamp)}</span>
      <span className="timeline-type">{isClick ? "Click" : "Page view"}</span>
      <span className="timeline-page">{pagePath(event.page_url)}</span>
      {isClick && <ClickInfo event={event} />}
    </li>
  );
}

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

  const start = data.events[0].timestamp;
  return (
    <>
      <Link to="/sessions">← All sessions</Link>
      <h1 className="page-title session-title">
        Session <code>{id}</code>
      </h1>
      <Summary events={data.events} />
      <ol className="card timeline">
        {data.events.map((event, i) => (
          <EventItem key={i} event={event} start={start} />
        ))}
      </ol>
    </>
  );
}
