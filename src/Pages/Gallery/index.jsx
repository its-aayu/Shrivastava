import { useMemo, useState } from "react";
import { galleryItems, imageBank } from "../../data/site";
import { handleImageError } from "../../utils/images";
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
        <SectionHeader align="center" eyebrow="Our work" title="Print work with texture, color, and presence." />
        <div className="galleryFilters">
          {categories.map((category) => (
            <button className={filter === category ? "isActive" : ""} key={category} onClick={() => setFilter(category)} aria-pressed={filter === category} type="button">
              {category}
            </button>
          ))}
        </div>
        <div className="galleryMasonry">
          {visibleItems.map((item, index) => (
            <article className={index % 3 === 0 ? "isLarge" : ""} key={item.title}>
              <img src={item.image} alt={item.title} decoding="async" loading="lazy" onError={handleImageError} />
              <div>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
