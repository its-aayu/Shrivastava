export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "Studio" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Work" },
  { id: "team", label: "Team" },
  { id: "blog", label: "Journal" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
  { id: "faq", label: "FAQ" },
];

export const imageBank = {
  hero: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Modern_printing_press_%28Unsplash%29.jpg/1600px-Modern_printing_press_%28Unsplash%29.jpg",
  studio: "https://picsum.photos/seed/aayu-design-studio/1200/900",
  press: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Modern_printing_press_%28Unsplash%29.jpg/1280px-Modern_printing_press_%28Unsplash%29.jpg",
  paper: "https://picsum.photos/seed/aayu-paper-colors/1200/900",
  apparel: "https://picsum.photos/seed/aayu-apparel-print/1200/900",
  cards: "https://picsum.photos/seed/aayu-business-card/1200/900",
  packaging: "https://picsum.photos/seed/aayu-packaging-design/1200/900",
  team: "https://picsum.photos/seed/aayu-creative-team/1200/900",
  map: "https://picsum.photos/seed/aayu-studio-street/1200/600",
  fallback: "https://picsum.photos/seed/aayu-print-fallback/1200/900",
};

export const stats = [
  { value: "12k+", label: "Print jobs delivered" },
  { value: "24h", label: "Rush turnaround" },
  { value: "98%", label: "Repeat customers" },
];

export const trustSignals = [
  "File checks before every proof",
  "Clear quote before production",
  "Pickup and delivery available",
  "Privacy-first quote requests",
];

export const services = [
  {
    title: "Digital Printing",
    copy: "Premium flyers, menus, labels, cards, posters, brochures, and brand material with vivid detail.",
    image: imageBank.paper,
    features: ["Color proofing", "Small or bulk runs", "Premium paper options"],
  },
  {
    title: "Document Printing",
    copy: "Clean black, white, and color documents with binding, lamination, scanning, and finishing.",
    image: imageBank.press,
    features: ["Fast office jobs", "Binding and lamination", "Sharp text output"],
  },
  {
    title: "Apparel Printing",
    copy: "Custom shirts, uniforms, event merch, and team apparel with durable print production.",
    image: imageBank.apparel,
    features: ["Cotton and blends", "Event batches", "Design placement help"],
  },
  {
    title: "Brand Kits",
    copy: "Business cards, stickers, packaging labels, launch kits, and presentation material.",
    image: imageBank.cards,
    features: ["Cards and stickers", "Launch material", "Packaging labels"],
  },
];

export const galleryItems = [
  { title: "Editorial Brochure", category: "Brochure", image: imageBank.paper },
  { title: "Restaurant Menu Set", category: "Menu", image: imageBank.studio },
  { title: "Premium Business Cards", category: "Cards", image: imageBank.cards },
  { title: "Custom Shirt Drop", category: "Apparel", image: imageBank.apparel },
  { title: "Product Label Suite", category: "Packaging", image: imageBank.packaging },
  { title: "Launch Posters", category: "Poster", image: imageBank.press },
];

export const team = [
  { name: "Aarav Mehta", role: "Creative Director", image: "https://picsum.photos/seed/aayu-aarav/700/850" },
  { name: "Ira Kapoor", role: "Production Lead", image: "https://picsum.photos/seed/aayu-ira/700/850" },
  { name: "Neel Shah", role: "Color Specialist", image: "https://picsum.photos/seed/aayu-neel/700/850" },
];

export const blogs = [
  {
    title: "How premium paper changes the feel of your brand",
    image: imageBank.paper,
    copy: "A guide to texture, weight, finish, and the small production decisions that make print feel expensive.",
  },
  {
    title: "Digital print campaigns that move faster than your calendar",
    image: imageBank.press,
    copy: "How short-run printing lets growing teams test, refine, and launch without waste.",
  },
  {
    title: "The practical checklist before sending artwork to print",
    image: imageBank.studio,
    copy: "Color mode, bleed, trim, resolution, export settings, and proofing habits for cleaner output.",
  },
];

export const pricingPlans = [
  {
    title: "Starter",
    price: "$45",
    subtitle: "/pack",
    features: ["100 business cards", "Basic paper stock", "Standard finish", "2 day turnaround"],
    variant: "basic",
  },
  {
    title: "Studio",
    price: "$95",
    subtitle: "/pack",
    features: ["Cards, flyers, stickers", "Premium paper stock", "Design file check", "Priority production"],
    variant: "featured",
  },
  {
    title: "Campaign",
    price: "$180",
    subtitle: "/pack",
    features: ["Full launch kit", "Custom finishing", "Color proof included", "Delivery coordination"],
    variant: "premium",
  },
];

export const faqs = [
  ["Can you help prepare my design files?", "Yes. We check bleed, trim, image quality, color mode, and export settings before production."],
  ["How fast can I get an urgent order?", "Many small jobs can be completed same day or next day after proof approval."],
  ["Do you print apparel and merchandise?", "Yes. We support event shirts, uniforms, brand drops, and small-batch merchandise."],
  ["Can I order small quantities?", "Absolutely. Digital printing is ideal for short runs, launch tests, and custom batches."],
  ["Do you offer premium paper and finishes?", "Yes. Matte, gloss, textured stock, lamination, binding, labels, and special finishes are available."],
  ["Can you deliver the final prints?", "Yes. Pickup and delivery can be arranged depending on order size and location."],
];
