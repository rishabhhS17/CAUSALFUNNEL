import { formatPrice } from "../api.js";
import "./PriceSummary.css";

export default function PriceSummary({ count, total, children }) {
  return (
    <aside className="price-summary card">
      <h3 className="price-summary-title">Price details</h3>
      <div className="price-summary-row">
        <span>Price ({count} items)</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="price-summary-row">
        <span>Delivery charges</span>
        <span className="price-summary-free">Free</span>
      </div>
      <div className="price-summary-row price-summary-total">
        <span>Total amount</span>
        <span>{formatPrice(total)}</span>
      </div>
      {children}
    </aside>
  );
}
