import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { CATEGORIES, getProducts } from "../api.js";
import "./Home.css";

const CATEGORY_EMOJI = { clothing: "👕", footwear: "👟", accessories: "🎒" };

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.slice(0, 4)))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="home">
      <section className="home-hero">
        <div>
          <h1>The Big Demo Sale</h1>
          <p>Fresh styles at prices you will love. Free delivery on every order.</p>
          <Link to="/products" className="btn btn-buy">Shop now</Link>
        </div>
        <div className="home-hero-emoji">🛍️</div>
      </section>

      <section className="home-categories card">
        {CATEGORIES.map((category) => (
          <Link key={category} to={`/products?category=${category}`} className="home-category">
            <span className="home-category-emoji">{CATEGORY_EMOJI[category]}</span>
            {category}
          </Link>
        ))}
      </section>

      <section className="home-featured card">
        <div className="home-featured-header">
          <h2>Featured products</h2>
          <Link to="/products" className="btn btn-primary">View all</Link>
        </div>
        {error && <div className="status">Could not load products: {error}</div>}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
