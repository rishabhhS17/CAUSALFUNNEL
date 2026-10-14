import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PriceSummary from "../components/PriceSummary.jsx";
import { useCart } from "../context/CartContext.jsx";
import "./Checkout.css";

const EMPTY_FORM = { name: "", phone: "", address: "", city: "", pincode: "", payment: "cod" };

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [placed, setPlaced] = useState(false);

  if (placed) return null;

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const orderId = `OD${Date.now()}`;
    setPlaced(true);
    navigate("/thank-you", { replace: true, state: { orderId, total, name: form.name } });
    clearCart();
  }

  return (
    <div className="checkout">
      <form id="checkout-form" className="checkout-form card" onSubmit={handleSubmit}>
        <h2 className="checkout-step">1. Delivery address</h2>
        <div className="checkout-fields">
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input
            name="phone"
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            title="10-digit mobile number"
            required
          />
          <textarea
            name="address"
            placeholder="Address (house no, street, area)"
            value={form.address}
            onChange={handleChange}
            rows={3}
            required
          />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            pattern="[0-9]{6}"
            title="6-digit pincode"
            required
          />
        </div>

        <h2 className="checkout-step">2. Payment</h2>
        <div className="checkout-payment">
          <label>
            <input type="radio" name="payment" value="cod" checked={form.payment === "cod"} onChange={handleChange} />
            Cash on delivery
          </label>
          <label>
            <input type="radio" name="payment" value="upi" checked={form.payment === "upi"} onChange={handleChange} />
            UPI (demo — no real payment)
          </label>
        </div>
      </form>

      <PriceSummary>
        <button type="submit" form="checkout-form" className="btn btn-buy">
          Confirm order
        </button>
      </PriceSummary>
    </div>
  );
}
