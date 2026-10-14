function item(slug, name, price, description, color, emoji, sizes = []) {
  return { slug, name, price, category: "accessories", description, color, emoji, sizes };
}

export const accessories = [
  item("canvas-backpack", "Canvas Backpack", 1999, "Roomy backpack with a padded laptop sleeve.", "#bbf7d0", "🎒"),
  item("sunglasses", "Sunglasses", 999, "UV-protected lenses in a lightweight frame.", "#e9d5ff", "🕶️"),
  item("wrist-watch", "Wrist Watch", 5999, "A minimal watch with a stainless steel strap.", "#cbd5e1", "⌚"),
  item("leather-handbag", "Leather Handbag", 3499, "A structured handbag with a detachable strap.", "#d6b38c", "👜"),
  item("zip-wallet", "Zip Wallet", 799, "A slim wallet with card slots and a coin pocket.", "#fcd34d", "👛"),
  item("baseball-cap", "Baseball Cap", 599, "A cotton cap with an adjustable strap.", "#fecdd3", "🧢"),
  item("silver-ring", "Silver Ring", 1499, "A simple sterling silver band.", "#e5e7eb", "💍"),
  item("winter-gloves", "Winter Gloves", 699, "Fleece-lined gloves that keep hands warm.", "#c7d2fe", "🧤", ["S", "M", "L"]),
  item("reading-glasses", "Reading Glasses", 899, "Lightweight frames with anti-glare lenses.", "#ddd6fe", "👓"),
  item("laptop-briefcase", "Laptop Briefcase", 2799, "A sleek briefcase that fits a 15-inch laptop.", "#a8a29e", "💼"),
];
