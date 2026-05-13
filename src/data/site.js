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
  hero: "/images/print-press.svg",
  studio: "/images/design-studio.svg",
  press: "/images/print-press.svg",
  paper: "/images/paper-colors.svg",
  apparel: "/images/apparel-print.svg",
  cards: "/images/business-cards.svg",
  packaging: "/images/packaging-labels.svg",
  team: "/images/studio-team.svg",
  map: "/images/studio-map.svg",
  fallback: "/images/print-fallback.svg",
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
  {
    id: "editorial-brochure",
    title: "Editorial Brochure",
    category: "Brochure",
    image: imageBank.paper,
    images: [imageBank.paper, imageBank.studio, imageBank.press],
    price: "$25",
    pricingUnit: "/brochure",
    description: "Elegant tri-fold brochures with premium paper stock and professional finishing. Perfect for editorial content, portfolios, and brand presentations.",
    specs: {
      finish: "Matte laminate",
      material: "100lb gloss text",
      delivery: "3-5 business days",
      printingQuality: "300 DPI CMYK"
    },
    trustIndicators: ["File pre-check", "Color accuracy", "Premium finish"]
  },
  {
    id: "restaurant-menu-set",
    title: "Restaurant Menu Set",
    category: "Menu",
    image: imageBank.studio,
    images: [imageBank.studio, imageBank.paper, imageBank.cards],
    price: "$45",
    pricingUnit: "/set",
    description: "Complete menu sets including covers, inserts, and table tents. Printed on durable cardstock with food-safe inks.",
    specs: {
      finish: "UV spot gloss",
      material: "12pt cardstock",
      delivery: "2-3 business days",
      printingQuality: "High-resolution digital"
    },
    trustIndicators: ["Food-safe inks", "Durable stock", "Quick turnaround"]
  },
  {
    id: "premium-business-cards",
    title: "Premium Business Cards",
    category: "Cards",
    image: imageBank.cards,
    images: [imageBank.cards, imageBank.paper, imageBank.studio],
    price: "$15",
    pricingUnit: "/100 cards",
    description: "Luxury business cards with custom finishes and premium paper options. Make a lasting impression with every handshake.",
    specs: {
      finish: "Soft gloss laminate",
      material: "14pt cardstock",
      delivery: "1-2 business days",
      printingQuality: "Offset quality digital"
    },
    trustIndicators: ["Premium stock", "Custom finishes", "Bulk discounts"]
  },
  {
    id: "custom-shirt-drop",
    title: "Custom Shirt Drop",
    category: "Apparel",
    image: imageBank.apparel,
    images: [imageBank.apparel, imageBank.press, imageBank.team],
    price: "$20",
    pricingUnit: "/shirt",
    description: "Custom apparel printing for events, teams, and brand launches. High-quality screen printing on premium cotton blends.",
    specs: {
      finish: "Screen print",
      material: "100% cotton",
      delivery: "5-7 business days",
      printingQuality: "Multi-color screen"
    },
    trustIndicators: ["Premium fabrics", "Color matching", "Event-ready"]
  },
  {
    id: "product-label-suite",
    title: "Product Label Suite",
    category: "Packaging",
    image: imageBank.packaging,
    images: [imageBank.packaging, imageBank.cards, imageBank.paper],
    price: "$30",
    pricingUnit: "/100 labels",
    description: "Professional product labels and packaging stickers. Waterproof, durable, and designed for retail presentation.",
    specs: {
      finish: "Waterproof laminate",
      material: "Adhesive vinyl",
      delivery: "2-4 business days",
      printingQuality: "Weather-resistant ink"
    },
    trustIndicators: ["Weatherproof", "Custom shapes", "Retail ready"]
  },
  {
    id: "launch-posters",
    title: "Launch Posters",
    category: "Poster",
    image: imageBank.press,
    images: [imageBank.press, imageBank.studio, imageBank.apparel],
    price: "$10",
    pricingUnit: "/poster",
    description: "Eye-catching launch posters and promotional materials. Printed on high-quality poster paper with vibrant colors.",
    specs: {
      finish: "Uncoated",
      material: "100lb poster paper",
      delivery: "1-3 business days",
      printingQuality: "Vivid color reproduction"
    },
    trustIndicators: ["Vibrant colors", "Large format", "Event timing"]
  },
];

export const team = [
  { name: "Aarav Mehta", role: "Creative Director", image: "/images/team-aarav.svg" },
  { name: "Ira Kapoor", role: "Production Lead", image: "/images/team-ira.svg" },
  { name: "Neel Shah", role: "Color Specialist", image: "/images/team-neel.svg" },
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
