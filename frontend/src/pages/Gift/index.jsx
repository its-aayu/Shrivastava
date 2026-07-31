import { useState, useMemo } from "react";
import { SectionHeader, ProductCard, ProductCardSkeleton, ProductsEmpty, PromoBand } from "../../components/shared";
import products from "../../mock-data/products.json";
import "./style.css";

const giftProducts = products.filter((p) => p.category_id === "cat_gift");

export default function Gift({ onNavigate }) {
  const [activeSubcat, setActiveSubcat] = useState(null);
  const [loading, setLoading]           = useState(false);

  const subcats = useMemo(
    () => [...new Set(giftProducts.map((p) => p.subcategory))],
    []
  );

  const visible = useMemo(
    () =>
      activeSubcat
        ? giftProducts.filter((p) => p.subcategory === activeSubcat)
        : giftProducts,
    [activeSubcat]
  );

  const handleSubcat = (s) => {
    setLoading(true);
    setActiveSubcat(s);
    setTimeout(() => setLoading(false), 250);
  };

  return (
    <div className="giftPage">

      <div className="giftPage__hero">
        <p className="eyebrow">VELORA</p>
        <h1>Personalised Gifts</h1>
        <p>Mugs, frames, keychains, tumblers — custom-made with your photo or message.</p>
      </div>

      {/* FILTER */}
      <div className="giftPage__filter" aria-label="Filter by gift type">
        <button
          type="button"
          className={`subcat-btn ${!activeSubcat ? "active" : ""}`}
          onClick={() => handleSubcat(null)}
        >
          All Gifts
        </button>
        {subcats.map((s) => (
          <button
            key={s}
            type="button"
            className={`subcat-btn ${activeSubcat === s ? "active" : ""}`}
            onClick={() => handleSubcat(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <section className="giftPage__grid">
        <SectionHeader
          eyebrow="Gift collection"
          title={
            loading
              ? "Loading…"
              : `${visible.length} gift${visible.length !== 1 ? "s" : ""}${activeSubcat ? ` · ${activeSubcat}` : ""}`
          }
          copy="Every gift is personalised to order. No minimum quantity."
          viewAll={activeSubcat ? "View all gifts" : undefined}
          onViewAll={() => handleSubcat(null)}
        />

        {loading ? (
          <div className="productGrid" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <ProductsEmpty
            message={`No gifts found${activeSubcat ? ` for "${activeSubcat}"` : ""}.`}
            onReset={() => handleSubcat(null)}
            resetLabel="View all gifts"
          />
        ) : (
          <div className="productGrid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </section>

      {/* WHY GIFT WITH VELORA */}
      <section className="giftPage__why">
        <SectionHeader
          align="center"
          eyebrow="Why gift with VELORA"
          title="Thoughtful gifts, fast delivery."
        />
        <div className="giftPage__pillars">
          {[
            { icon: "🎁", title: "100% personalised", body: "Your photo, your message, your design — printed perfectly." },
            { icon: "📦", title: "Gift-ready packaging", body: "Most gifts arrive in gift-ready boxes, perfect to hand straight over." },
            { icon: "🚀", title: "Quick turnaround", body: "Most gifts delivered in 2–5 business days — great even for last-minute giving." },
          ].map((p) => (
            <article key={p.title}>
              <span className="giftPage__icon">{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <PromoBand onNavigate={onNavigate} />

    </div>
  );
}
