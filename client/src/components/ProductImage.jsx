import "./ProductImage.css";

export default function ProductImage({ product, size = "md" }) {
  return (
    <div className={`product-image product-image-${size}`} style={{ background: product.color }}>
      {product.emoji}
    </div>
  );
}
