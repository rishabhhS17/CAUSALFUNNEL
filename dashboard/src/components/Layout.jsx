import { NavLink, Outlet } from "react-router-dom";
import { STORE_URL } from "../api.js";
import "./Layout.css";

export default function Layout() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <span className="topbar-logo">
            CausalFunnel <span className="topbar-tag">analytics</span>
          </span>
          <nav className="topbar-links">
            <NavLink to="/" end>Overview</NavLink>
            <NavLink to="/sessions">Sessions</NavLink>
            <NavLink to="/heatmap">Heatmap</NavLink>
            <a href={STORE_URL} target="_blank" rel="noreferrer">
              Open store ↗
            </a>
          </nav>
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
}
