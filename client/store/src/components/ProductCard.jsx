import { Link } from "react-router-dom";
import ProductImage from "./ProductImage.jsx";
import { formatPrice } from "../api.js";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.slug}`} className="product-card card">
      <ProductImage product={product} />
      <div className="product-card-name">{product.name}</div>
      <div className="product-card-category">{product.category}</div>
      <div className="product-card-price">{formatPrice(product.price)}</div>
      <div className="product-card-delivery">Free delivery</div>
    </Link>
  );
}
