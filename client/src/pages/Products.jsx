import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { CATEGORIES, getProducts } from "../api.js";
import "./Products.css";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const [result, setResult] = useState({ category: null, products: [], error: null });
  const loading = result.category !== category;
  const { products, error } = result;

  useEffect(() => {
    let ignore = false;

    getProducts(category)
      .then((data) => !ignore && setResult({ category, products: data, error: null }))
      .catch((err) => !ignore && setResult({ category, products: [], error: err.message }));

    return () => {
      ignore = true;
    };
  }, [category]);

  function selectCategory(value) {
    setSearchParams(value ? { category: value } : {});
  }

  return (
    <div className="products">
      <aside className="products-filters card">
        <h3>Categories</h3>
        {["", ...CATEGORIES].map((value) => (
          <button
            key={value || "all"}
            className={`products-filter ${category === value ? "active" : ""}`}
            onClick={() => selectCategory(value)}
          >
            {value || "All products"}
          </button>
        ))}
      </aside>

      <section className="products-list card">
        <h1 className="page-title">
          {category || "All products"}
          {!loading && <span className="products-count"> ({products.length} items)</span>}
        </h1>

        {loading && <div className="status">Loading…</div>}
        {!loading && error && <div className="status">Could not load products: {error}</div>}
        {!loading && !error && (
          <div className="product-grid products-grid">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
