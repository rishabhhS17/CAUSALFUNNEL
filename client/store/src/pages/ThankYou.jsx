import { Link, Navigate, useLocation } from "react-router-dom";
import { formatPrice } from "../api.js";
import "./ThankYou.css";

export default function ThankYou() {
  const { state } = useLocation();

  // Only reachable right after placing an order
  if (!state?.orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="thank-you card">
      <div className="thank-you-check">✓</div>
      <h1>Order placed successfully!</h1>
      <p>Thank you, {state.name}. Your order will be delivered soon.</p>

      <div className="thank-you-details">
        <div>
          <span>Order ID</span>
          <strong>{state.orderId}</strong>
        </div>
        <div>
          <span>Amount</span>
          <strong>{formatPrice(state.total)}</strong>
        </div>
      </div>

      <Link to="/products" className="btn btn-primary">Continue shopping</Link>
    </div>
  );
}
