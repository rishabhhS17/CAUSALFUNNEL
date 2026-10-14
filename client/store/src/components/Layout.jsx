import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "./Layout.css";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">ShopDemo · a demo store for CausalFunnel analytics</footer>
    </>
  );
}
