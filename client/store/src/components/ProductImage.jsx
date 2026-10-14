import "./ProductImage.css";

// Products have no photos yet: show a coloured tile with the product emoji
export default function ProductImage({ product, size = "md" }) {
  return (
    <div className={`product-image product-image-${size}`} style={{ background: product.color }}>
      {product.emoji}
    </div>
  );
}
