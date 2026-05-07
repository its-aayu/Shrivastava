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
  { title: "Editorial Brochure", category: "Brochure", image: imageBank.paper },
  { title: "Restaurant Menu Set", category: "Menu", image: imageBank.studio },
  { title: "Premium Business Cards", category: "Cards", image: imageBank.cards },
  { title: "Custom Shirt Drop", category: "Apparel", image: imageBank.apparel },
  { title: "Product Label Suite", category: "Packaging", image: imageBank.packaging },
  { title: "Launch Posters", category: "Poster", image: imageBank.press },
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
