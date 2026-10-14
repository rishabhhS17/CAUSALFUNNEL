function item(slug, name, price, description, color, emoji, sizes) {
  return { slug, name, price, category: "footwear", description, color, emoji, sizes };
}

const MEN_SIZES = ["7", "8", "9", "10", "11"];
const WOMEN_SIZES = ["4", "5", "6", "7", "8"];

export const footwear = [
  item("running-shoes", "Running Shoes", 3499, "Cushioned shoes for your daily run.", "#fde68a", "👟", ["7", "8", "9", "10"]),
  item("leather-boots", "Leather Boots", 4299, "Classic leather boots built to last.", "#d6b38c", "🥾", MEN_SIZES),
  item("canvas-sneakers", "Canvas Sneakers", 1499, "Everyday low-top sneakers in washed canvas.", "#bae6fd", "👟", MEN_SIZES),
  item("formal-oxfords", "Formal Oxfords", 3999, "Polished leather shoes for the office.", "#78716c", "👞", MEN_SIZES),
  item("block-heels", "Block Heels", 2299, "Comfortable heels with a steady block base.", "#fbcfe8", "👠", WOMEN_SIZES),
  item("strappy-sandals", "Strappy Sandals", 1299, "Light sandals with adjustable ankle straps.", "#fed7aa", "👡", WOMEN_SIZES),
  item("flip-flops", "Flip Flops", 399, "Soft rubber flip flops for the beach.", "#99f6e4", "🩴", MEN_SIZES),
  item("ballet-flats", "Ballet Flats", 1199, "Foldable flats that slip into any bag.", "#f5d0fe", "🥿", WOMEN_SIZES),
  item("ankle-boots", "Ankle Boots", 3299, "Suede ankle boots with a side zip.", "#c4a484", "👢", WOMEN_SIZES),
  item("dance-shoes", "Dance Shoes", 999, "Soft satin shoes for ballet practice.", "#ffe4e6", "🩰", WOMEN_SIZES),
];
