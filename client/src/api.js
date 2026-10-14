const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function get(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json();
}

export function getProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return get(`/api/products${query}`);
}

export function getProduct(slug) {
  return get(`/api/products/${encodeURIComponent(slug)}`);
}

export const CATEGORIES = ["clothing", "footwear", "accessories"];

export function itemCount(count) {
  if (count === 1) {
    return "1 item";
  }
  return `${count} items`;
}

export function formatPrice(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
