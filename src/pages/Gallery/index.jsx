import { useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import Reveal from "../../components/ui/Reveal";
import { imageBank } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { cardItem, gridContainer } from "../../animations/motion";
import { useProducts } from "../../hooks/useProducts";
import { PageHero, PromoBand, SectionHeader } from "../shared";
import "./style.css";

function GallerySkeleton() {
  return (
    <div className="galleryMasonry">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`gallerySkeleton ${i % 3 === 0 ? "isLarge" : ""}`} />
      ))}
    </div>
  );
}

export default function Gallery({ onNavigate }) {
  const [filter, setFilter] = useState("All");
  const { products, loading, error } = useProducts();

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const visibleItems = useMemo(
    () => filter === "All" ? products : products.filter((p) => p.category === filter),
    [filter, products]
  );

  return (
    <>
      <PageHero
        title="A gallery of tactile work made to be picked up and remembered."
        copy="Explore sample projects for brochures, cards, apparel, posters, menus, labels, and launch kits."
        image={imageBank.cards}
      />
      <section className="galleryPage">
        <Reveal>
          <SectionHeader align="center" eyebrow="Our work" title="Print work with texture, color, and presence." />
        </Reveal>

        {error && (
          <p className="galleryError" role="alert">
            Could not load products — make sure the backend is running at{" "}
            <code>http://localhost:8000</code>.
          </p>
        )}

        {!error && (
          <Reveal className="galleryFilters" delay={0.1} y={14}>
            {categories.map((cat) => (
              <button
                className={filter === cat ? "isActive" : ""}
                key={cat}
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                type="button"
              >
                {cat}
              </button>
            ))}
          </Reveal>
        )}

        {loading ? (
          <GallerySkeleton />
        ) : (
          <Motion.div
            className="galleryMasonry"
            variants={gridContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {visibleItems.map((item, index) => (
              <Motion.article
                key={item.id}
                className={index % 3 === 0 ? "isLarge" : ""}
                onClick={() => onNavigate("product", item.id)}
                style={{ cursor: "pointer" }}
                variants={cardItem}
              >
                <img
                  src={item.images?.[0] || imageBank.fallback}
                  alt={item.title}
                  decoding="async"
                  loading="lazy"
                  onError={handleImageError}
                />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                </div>
              </Motion.article>
            ))}
          </Motion.div>
        )}
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
