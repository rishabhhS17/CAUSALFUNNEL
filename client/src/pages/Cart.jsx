import { Link, useNavigate } from "react-router-dom";
import ProductImage from "../components/ProductImage.jsx";
import PriceSummary from "../components/PriceSummary.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../api.js";
import "./Cart.css";

export default function Cart() {
  const { items, count, total, setQty, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-empty card">
        <div className="cart-empty-emoji">🛒</div>
        <h2>Your cart is empty!</h2>
        <p>Add items to it now.</p>
        <Link to="/products" className="btn btn-primary">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <section className="cart-items card">
        <h1 className="cart-title">My Cart ({count})</h1>

        {items.map((item) => (
          <div key={item.key} className="cart-item">
            <ProductImage product={item} size="sm" />

            <div className="cart-item-info">
              <Link to={`/products/${item.slug}`} className="cart-item-name">{item.name}</Link>
              {item.size && <div className="cart-item-size">Size: {item.size}</div>}
              <div className="cart-item-price">{formatPrice(item.price * item.qty)}</div>

              <div className="cart-item-controls">
                <button
                  className="cart-qty-btn"
                  disabled={item.qty <= 1}
                  onClick={() => setQty(item.key, item.qty - 1)}
                >
                  −
                </button>
                <span className="cart-qty">{item.qty}</span>
                <button className="cart-qty-btn" onClick={() => setQty(item.key, item.qty + 1)}>
                  +
                </button>
                <button className="cart-remove" onClick={() => removeItem(item.key)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <PriceSummary count={count} total={total}>
        <button className="btn btn-buy" onClick={() => navigate("/checkout")}>
          Place order
        </button>
      </PriceSummary>
    </div>
  );
}
