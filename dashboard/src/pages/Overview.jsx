import { Link } from "react-router-dom";
import { getStats, getSessions, STORE_URL } from "../api.js";
import { useFetch } from "../hooks/useFetch.js";
import SessionTable from "../components/SessionTable.jsx";
import "./Overview.css";

const CARDS = [
  { key: "sessions", label: "Sessions" },
  { key: "total_events", label: "Events" },
  { key: "page_views", label: "Page views" },
  { key: "clicks", label: "Clicks" },
  { key: "pages", label: "Pages tracked" },
];

function StatCards() {
  const { data, error, loading } = useFetch(getStats, "stats");
  if (loading) return <p className="status">Loading stats…</p>;
  if (error) return <p className="status status-error">Could not load stats: {error}</p>;

  return (
    <div className="stat-cards">
      {CARDS.map((card) => (
        <div key={card.key} className="card stat-card">
          <div className="stat-value">{data[card.key]}</div>
          <div className="stat-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

function HowToTest() {
  return (
    <section className="card">
      <h2 className="section-title">How to test</h2>
      <ol className="how-to">
        <li>
          Open the <a href={STORE_URL} target="_blank" rel="noreferrer">ShopDemo store</a> and click around.
        </li>
        <li>Your session id is shown in the bottom-right badge; use “View journey” to open it here.</li>
        <li>Every page you visit and every click appears in your session’s timeline.</li>
        <li>Open the Heatmap tab and pick a page to see where people clicked.</li>
      </ol>
    </section>
  );
}

function RecentSessions() {
  const { data, error, loading } = useFetch(() => getSessions(1, 5), "recent");
  if (loading) return <p className="status">Loading sessions…</p>;
  if (error) return <p className="status status-error">Could not load sessions: {error}</p>;
  return <SessionTable sessions={data.sessions} />;
}

export default function Overview() {
  return (
    <>
      <h1 className="page-title">Overview</h1>
      <StatCards />
      <div className="overview-grid">
        <HowToTest />
        <section className="card">
          <div className="section-head">
            <h2 className="section-title">Recent sessions</h2>
            <Link to="/sessions">View all →</Link>
          </div>
          <RecentSessions />
        </section>
      </div>
    </>
  );
}
