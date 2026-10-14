import { makeLine } from "./context/CartContext.jsx";

const SAMPLE_PRODUCT = {
  slug: "classic-white-tee",
  name: "Classic White Tee",
  price: 499,
  color: "#f3f4f6",
  emoji: "👕",
};

export function isPreview() {
  return new URLSearchParams(window.location.search).get("cf_preview") === "1";
}

export function previewCart() {
  const items = [makeLine(SAMPLE_PRODUCT, "M")];
  return { items, count: 1, total: SAMPLE_PRODUCT.price };
}

export function previewOrder() {
  return { orderId: "OD0000000000000", total: SAMPLE_PRODUCT.price, name: "Sample Customer" };
}
