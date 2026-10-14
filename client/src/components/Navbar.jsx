import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          ShopDemo
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart" className="navbar-cart">
            Cart
            {count > 0 && <span className="navbar-badge">{count}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
