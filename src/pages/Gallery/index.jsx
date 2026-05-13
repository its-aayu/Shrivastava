import { useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import { galleryItems, imageBank } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { cardItem, gridContainer } from "../../animations/motion";
import { PageHero, PromoBand, SectionHeader } from "../shared";
import "./style.css";

export default function Gallery({ onNavigate }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(galleryItems.map((item) => item.category))];
  const visibleItems = useMemo(
    () => filter === "All" ? galleryItems : galleryItems.filter((item) => item.category === filter),
    [filter]
  );

  return (
    <>
      <PageHero
        title="A gallery of tactile work made to be picked up and remembered."
        copy="Explore sample projects for brochures, cards, apparel, posters, menus, labels, and launch kits."
        image={imageBank.cards}
      />
      <section className="galleryPage">
        <Motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeader align="center" eyebrow="Our work" title="Print work with texture, color, and presence." />
        </Motion.div>
        <Motion.div
          className="galleryFilters"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {categories.map((category) => (
            <button className={filter === category ? "isActive" : ""} key={category} onClick={() => setFilter(category)} aria-pressed={filter === category} type="button">
              {category}
            </button>
          ))}
        </Motion.div>
        <Motion.div
          className="galleryMasonry"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {visibleItems.map((item, index) => (
            <Motion.article
              key={item.title}
              className={index % 3 === 0 ? "isLarge" : ""}
              onClick={() => onNavigate("product", item.id)}
              style={{ cursor: "pointer" }}
              variants={cardItem}
            >
              <img src={item.image} alt={item.title} decoding="async" loading="lazy" onError={handleImageError} />
              <div>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
              </div>
            </Motion.article>
          ))}
        </Motion.div>
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
