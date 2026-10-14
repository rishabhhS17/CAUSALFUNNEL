import { Link } from "react-router-dom";
import { formatDuration, pagePath, plural } from "../utils/format.js";
import "./Timeline.css";

function groupByPage(events) {
  const groups = [];
  let current = null;
  for (const event of events) {
    const isView = event.event_type === "page_view";
    if (isView || !current || current.url !== event.page_url) {
      current = { url: event.page_url, time: event.timestamp, clicks: [] };
      groups.push(current);
    }
    if (!isView) {
      current.clicks.push(event);
    }
  }
  return groups;
}

function heatmapLink(event) {
  const params = new URLSearchParams({ url: event.page_url, session: event.session_id });
  return `/heatmap?${params}`;
}

function clickLabel(event) {
  if (event.target && event.target.text) {
    return `Clicked “${event.target.text}”`;
  }
  return "Clicked on page";
}

function ClickItem({ event, start }) {
  return (
    <li className="timeline-click">
      <span className="timeline-time">+{formatDuration(start, event.timestamp)}</span>
      <span>{clickLabel(event)}</span>
      <Link to={heatmapLink(event)} className="timeline-link">see on heatmap</Link>
    </li>
  );
}

function PageGroup({ group, start }) {
  return (
    <li className="timeline-group">
      <div className="timeline-page">
        <span className="timeline-time">+{formatDuration(start, group.time)}</span>
        <code className="timeline-path">{pagePath(group.url)}</code>
        <span className="timeline-count">{plural(group.clicks.length, "click")}</span>
      </div>
      {group.clicks.length > 0 && (
        <ul className="timeline-clicks">
          {group.clicks.map((event, i) => (
            <ClickItem key={i} event={event} start={start} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Timeline({ events }) {
  const start = events[0].timestamp;
  const groups = groupByPage(events);

  return (
    <ol className="card timeline">
      {groups.map((group, i) => (
        <PageGroup key={i} group={group} start={start} />
      ))}
    </ol>
  );
}
