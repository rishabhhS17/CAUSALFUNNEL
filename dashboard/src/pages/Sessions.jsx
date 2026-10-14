import { useSearchParams } from "react-router-dom";
import { getSessions } from "../api.js";
import { useFetch } from "../hooks/useFetch.js";
import SessionTable from "../components/SessionTable.jsx";
import "./Sessions.css";

const PAGE_SIZE = 20;

function Pager({ page, total, onChange }) {
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="pager">
      <button className="btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Previous
      </button>
      <span>
        Page {page} of {pageCount} · {total} sessions
      </span>
      <button className="btn" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
        Next →
      </button>
    </div>
  );
}

export default function Sessions() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const { data, error, loading } = useFetch(() => getSessions(page, PAGE_SIZE), `sessions-${page}`);

  let body;
  if (loading) {
    body = <p className="status">Loading sessions…</p>;
  } else if (error) {
    body = <p className="status status-error">Could not load sessions: {error}</p>;
  } else {
    body = (
      <>
        <SessionTable sessions={data.sessions} />
        <Pager page={page} total={data.total} onChange={(next) => setParams({ page: next })} />
      </>
    );
  }

  return (
    <>
      <h1 className="page-title">Sessions</h1>
      <section className="card">{body}</section>
    </>
  );
}
