export const navItems = [
  { id: "home",        label: "Home" },
  { id: "categories",  label: "Categories" },
  { id: "newArrivals", label: "New Arrivals" },
  { id: "gift",        label: "Gift" },
  { id: "about",       label: "About" },
];

export const imageBank = {
  hero:     "/images/hero-apparel.svg",
  men:      "/images/category-men.svg",
  women:    "/images/category-women.svg",
  kids:     "/images/category-kids.svg",
  gift:     "/images/category-gift.svg",
  studio:   "/images/about-studio.svg",
  fallback: "/images/print-fallback.svg",
};

export const trustSignals = [
  "100% custom-printed to your design",
  "Safe, wash-resistant inks",
  "Free design preview before production",
  "Nationwide delivery",
];

export const categoryHighlights = [
  {
    page:  "categories",
    data:  { activeTab: "cat_men" },
    label: "Men",
    sub:   "T-shirts · Hoodies · Jackets · More",
    image: imageBank.men,
  },
  {
    page:  "categories",
    data:  { activeTab: "cat_women" },
    label: "Women",
    sub:   "Tees · Tops · Sweatshirts · More",
    image: imageBank.women,
  },
  {
    page:  "categories",
    data:  { activeTab: "cat_kids" },
    label: "Kids",
    sub:   "Tees · Sweatshirts · Hoodies · More",
    image: imageBank.kids,
  },
  {
    page:  "gift",
    data:  null,
    label: "Gifts",
    sub:   "Mugs · Frames · Keychains · Tumblers",
    image: imageBank.gift,
  },
];

export const faqs = [
  ["Can I upload my own design?",        "Yes — you can upload your artwork file when placing the order. We'll send a design preview before production starts."],
  ["What file format should I send?",    "PNG, JPG, PDF, or AI works best. We check resolution and colours before printing."],
  ["What's the minimum order quantity?", "You can order as few as 1 piece. No minimum on most products."],
  ["How long does delivery take?",       "Most apparel ships in 5–7 business days. Gifts in 2–5 business days. Rush slots available."],
  ["Do you do family / couple sets?",    "Absolutely — matching sets across men's, women's, and kids' are very popular with us."],
  ["Is the print quality wash-resistant?", "Yes. We use wash-resistant inks and sublimation methods rated for 50+ washes."],
];
