import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductImage from "../components/ProductImage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice, getProduct } from "../api.js";
import "./ProductDetail.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  return <ProductDetail key={id} id={id} />;
}

function ProductDetail({ id }) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let ignore = false;

    getProduct(id)
      .then((data) => !ignore && setProduct(data))
      .catch((err) => !ignore && setError(err.message));

    return () => {
      ignore = true;
    };
  }, [id]);

  if (error) return <div className="status card">Product not found.</div>;
  if (!product) return <div className="status">Loading…</div>;

  const needsSize = product.sizes.length > 0;
  const canBuy = !needsSize || size !== null;

  function handleAddToCart() {
    addItem(product, size);
    setAdded(true);
  }

  function handleBuyNow() {
    addItem(product, size);
    navigate("/checkout");
  }

  return (
    <div className="detail card">
      <div className="detail-left">
        <ProductImage product={product} size="lg" />
        <div className="detail-actions">
          <button className="btn btn-cart" disabled={!canBuy} onClick={handleAddToCart}>
            🛒 Add to cart
          </button>
          <button className="btn btn-buy" disabled={!canBuy} onClick={handleBuyNow}>
            ⚡ Buy now
          </button>
        </div>
        {added && <div className="detail-added">Added to cart ✓</div>}
      </div>

      <div className="detail-info">
        <div className="detail-category">{product.category}</div>
        <h1 className="detail-name">{product.name}</h1>
        <div className="detail-price">{formatPrice(product.price)}</div>
        <div className="detail-delivery">Free delivery · 7 day return policy</div>

        {needsSize && (
          <div className="detail-section">
            <h3>Size</h3>
            <div className="detail-size-list">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`detail-size ${size === s ? "active" : ""}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {!size && <div className="detail-hint">Please select a size</div>}
          </div>
        )}

        <div className="detail-section">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
