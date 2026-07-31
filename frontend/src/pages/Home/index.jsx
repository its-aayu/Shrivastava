import { useMemo } from "react";
import { motion as Motion } from "framer-motion";
import { handleImageError } from "../../utils/images";
import {
  CategoryCards,
  ProductCard,
  PromoBand,
  SectionHeader,
  TrustStrip,
} from "../../components/shared";
import products from "../../mock-data/products.json";
import "./style.css";

const heroTrustBadges = ["Custom Prints", "Free Design Preview", "Fast Delivery across India"];

const whyUs = [
  { icon: "01", title: "Upload any design", copy: "Send your artwork file — we print it exactly as you want it." },
  { icon: "02", title: "Premium materials", copy: "180–320 GSM fabrics, safe inks, and quality-checked every run." },
  { icon: "03", title: "Fast & tracked", copy: "Most orders ship in 5–7 days with full delivery tracking." },
];

export default function Home({ onNavigate }) {
  const newArrivals = useMemo(() => products.filter((p) => p.is_new).slice(0, 4), []);
  const featured    = useMemo(
    () => products.filter((p) => p.is_featured && !p.is_new).slice(0, 4),
    []
  );

  return (
    <div className="homePage">

      {/* HERO */}
      <section className="homeHero">
        <div className="homeHero__mesh homeHero__mesh--one" />
        <div className="homeHero__mesh homeHero__mesh--two" />
        <div className="homeHero__grain" />
        <Motion.div
          className="homeHero__copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="eyebrow">VELORA</p>
          <h1>
            <span>Custom apparel</span>
            <span>& gifts, printed</span>
            <span>just for you.</span>
          </h1>
          <p>
            T-shirts, hoodies, mugs, frames, and more — all personalised with your design and delivered fast across India.
          </p>
          <div className="homeHero__trust" aria-label="Highlights">
            {heroTrustBadges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
          <div className="homeHero__actions">
            <button className="btn btn--primary" type="button" onClick={() => onNavigate("categories")}>
              Shop Now
            </button>
            <button className="btn btn--outline" type="button" onClick={() => onNavigate("newArrivals")}>
              New Arrivals
            </button>
          </div>
        </Motion.div>

        <Motion.div
          className="heroShowcase"
          aria-label="Custom printed apparel"
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          <img
            className="heroShowcase__main"
            src="/images/hero-apparel.svg"
            alt="Custom printed apparel and gifts"
            decoding="async"
            loading="eager"
            onError={handleImageError}
          />
          <div className="heroShowcase__shine" />
          <div className="heroShowcase__card heroShowcase__card--top">
            <span>Design preview</span>
            <strong>Before every print</strong>
          </div>
          <div className="heroShowcase__card heroShowcase__card--bottom">
            <span>Fast delivery</span>
            <strong>Tracked & on time</strong>
          </div>
        </Motion.div>
      </section>

      <TrustStrip />

      {/* WHY US */}
      <section className="homeIntro homeSection">
        <div>
          <SectionHeader
            eyebrow="Why VELORA"
            title="Your design. Our print. Delivered to your door."
            copy="We combine top-quality fabrics, vivid custom printing, and fast nationwide delivery so your order looks great and arrives on time."
          />
          <div className="homeIntro__points">
            {whyUs.map((item) => (
              <article key={item.title}>
                <span>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section className="homeCategories homeSection">
        <SectionHeader
          align="center"
          eyebrow="Shop by category"
          title="Men, Women, Kids & Gifts — all under one roof."
          copy="Click any category to browse products and place your custom order."
        />
        <CategoryCards onNavigate={onNavigate} />
      </section>

      {/* NEW ARRIVALS TEASER */}
      {newArrivals.length > 0 && (
        <section className="homeTeaser homeSection">
          <SectionHeader
            eyebrow="New arrivals"
            title="Fresh drops — just added."
            viewAll="View all"
            onViewAll={() => onNavigate("newArrivals")}
          />
          <div className="productGrid">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {/* FEATURED TEASER */}
      {featured.length > 0 && (
        <section className="homeTeaser homeSection">
          <SectionHeader
            eyebrow="Best sellers"
            title="Customer favourites."
            viewAll="Browse all"
            onViewAll={() => onNavigate("categories")}
          />
          <div className="productGrid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      <PromoBand onNavigate={onNavigate} />

    </div>
  );
}
