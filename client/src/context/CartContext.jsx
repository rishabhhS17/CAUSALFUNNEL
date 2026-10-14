import { createContext, useContext, useEffect, useReducer } from "react";

const STORAGE_KEY = "shopdemo_cart";
const CartContext = createContext(null);

function lineKey(slug, size) {
  return size ? `${slug}:${size}` : slug;
}

function cartReducer(items, action) {
  switch (action.type) {
    case "add": {
      const { product, size } = action;
      const key = lineKey(product.slug, size);
      const existing = items.find((item) => item.key === key);
      if (existing) {
        return items.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...items,
        {
          key,
          slug: product.slug,
          name: product.name,
          price: product.price,
          color: product.color,
          emoji: product.emoji,
          size,
          qty: 1,
        },
      ];
    }
    case "setQty":
      return items.map((item) =>
        item.key === action.key ? { ...item, qty: Math.max(1, action.qty) } : item
      );
    case "remove":
      return items.filter((item) => item.key !== action.key);
    case "clear":
      return [];
    default:
      throw new Error(`Unknown cart action: ${action.type}`);
  }
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = {
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    addItem: (product, size = null) => dispatch({ type: "add", product, size }),
    setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
    removeItem: (key) => dispatch({ type: "remove", key }),
    clearCart: () => dispatch({ type: "clear" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
