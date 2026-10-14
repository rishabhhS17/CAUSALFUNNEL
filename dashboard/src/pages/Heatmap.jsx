import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPages, getHeatmap } from "../api.js";
import { useFetch } from "../hooks/useFetch.js";
import { pagePath, shortId, plural } from "../utils/format.js";
import HeatmapOverlay from "../components/HeatmapOverlay.jsx";
import "./Heatmap.css";

function Controls({ pages, url, mode, onPage, onMode }) {
  return (
    <div className="heatmap-controls">
      <select value={url} onChange={(e) => onPage(e.target.value)}>
        {pages.map((page) => (
          <option key={page.page_url} value={page.page_url}>
            {pagePath(page.page_url)} ({plural(page.clicks, "click")})
          </option>
        ))}
      </select>
      <div className="mode-toggle">
        <button className={mode === "dots" ? "btn btn-active" : "btn"} onClick={() => onMode("dots")}>Dots</button>
        <button className={mode === "grid" ? "btn btn-active" : "btn"} onClick={() => onMode("grid")}>Grid</button>
      </div>
    </div>
  );
}

function ClickMap({ url, session, mode }) {
  const { data, error, loading } = useFetch(() => getHeatmap(url, session), `${url}|${session}`);
  if (loading) return <p className="status">Loading clicks…</p>;
  if (error) return <p className="status status-error">Could not load clicks: {error}</p>;

  return (
    <>
      <p className="heatmap-count">{plural(data.count, "click")} on {pagePath(url)}</p>
      <HeatmapOverlay url={url} clicks={data.clicks} mode={mode} />
    </>
  );
}

function SessionFilter({ session, onClear }) {
  return (
    <p className="session-filter">
      Showing clicks from session <code>{shortId(session)}</code> only ·{" "}
      <button className="link-button" onClick={onClear}>show all sessions</button>
    </p>
  );
}

export default function Heatmap() {
  const [params, setParams] = useSearchParams();
  const [mode, setMode] = useState("dots");
  const { data: pages, error, loading } = useFetch(getPages, "pages");

  if (loading) return <p className="status">Loading pages…</p>;
  if (error) return <p className="status status-error">Could not load pages: {error}</p>;
  if (pages.length === 0) return <p className="status">No pages tracked yet. Click around the store first.</p>;

  const url = params.get("url") || pages[0].page_url;
  const session = params.get("session") || "";

  return (
    <>
      <h1 className="page-title">Heatmap</h1>
      <Controls pages={pages} url={url} mode={mode} onPage={(next) => setParams({ url: next })} onMode={setMode} />
      {session && <SessionFilter session={session} onClear={() => setParams({ url })} />}
      <ClickMap url={url} session={session} mode={mode} />
    </>
  );
}
