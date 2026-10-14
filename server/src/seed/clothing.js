function item(slug, name, price, description, color, emoji, sizes) {
  return { slug, name, price, category: "clothing", description, color, emoji, sizes };
}

const LETTER_SIZES = ["S", "M", "L", "XL"];

export const clothing = [
  item("classic-white-tee", "Classic White Tee", 499, "A soft cotton t-shirt that goes with everything.", "#f3f4f6", "👕", LETTER_SIZES),
  item("denim-jacket", "Denim Jacket", 2499, "A sturdy denim jacket for cooler evenings.", "#bfdbfe", "🧥", ["S", "M", "L"]),
  item("summer-dress", "Summer Dress", 1799, "Light and breezy, made for warm days.", "#fbcfe8", "👗", ["XS", "S", "M", "L"]),
  item("slim-fit-jeans", "Slim Fit Jeans", 1999, "Stretch denim jeans with a modern slim cut.", "#93c5fd", "👖", ["28", "30", "32", "34", "36"]),
  item("oxford-shirt", "Oxford Shirt", 1299, "A crisp button-down shirt for work or weekends.", "#e0f2fe", "👔", LETTER_SIZES),
  item("striped-blouse", "Striped Blouse", 999, "A relaxed blouse with classic navy stripes.", "#fef3c7", "👚", ["XS", "S", "M", "L"]),
  item("cargo-shorts", "Cargo Shorts", 899, "Roomy shorts with plenty of pockets.", "#d9f99d", "🩳", LETTER_SIZES),
  item("wool-scarf", "Wool Scarf", 699, "A warm knitted scarf for chilly days.", "#fecaca", "🧣", []),
  item("silk-saree", "Silk Saree", 4499, "A rich silk saree with a woven border.", "#fda4af", "🥻", []),
  item("swimsuit", "Swimsuit", 1499, "A quick-dry one-piece for the pool or beach.", "#a5f3fc", "🩱", ["XS", "S", "M", "L"]),
];
