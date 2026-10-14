import { Link, useNavigate } from "react-router-dom";
import { shortId, formatTime, formatDuration } from "../utils/format.js";
import "./SessionTable.css";

function SessionRow({ session }) {
  const navigate = useNavigate();
  const link = `/sessions/${session.session_id}`;

  return (
    <tr onClick={() => navigate(link)}>
      <td>
        <Link to={link}>
          <code>{shortId(session.session_id)}</code>
        </Link>
      </td>
      <td>{session.event_count}</td>
      <td>{session.page_views}</td>
      <td>{session.clicks}</td>
      <td>{session.pages}</td>
      <td>{formatTime(session.first_seen)}</td>
      <td>{formatDuration(session.first_seen, session.last_seen)}</td>
    </tr>
  );
}

export default function SessionTable({ sessions }) {
  if (sessions.length === 0) {
    return <p className="status">No sessions yet. Open the store and click around.</p>;
  }

  return (
    <table className="session-table">
      <thead>
        <tr>
          <th>Session</th>
          <th>Events</th>
          <th>Page views</th>
          <th>Clicks</th>
          <th>Pages</th>
          <th>Started</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <SessionRow key={session.session_id} session={session} />
        ))}
      </tbody>
    </table>
  );
}
