import { useState } from "react";
import { trustSignals, categoryHighlights, imageBank } from "../../data/site";
import { handleImageError } from "../../utils/images";

function SmartImage({ alt, eager = false, ...props }) {
  return (
    <img
      alt={alt}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      onError={handleImageError}
      {...props}
    />
  );
}

export function PageHero({ eyebrow = "VELORA", title, copy, image }) {
  return (
    <section className="pageHero">
      {image && (
        <div className="pageHero__media">
          <SmartImage src={image} alt="" eager />
        </div>
      )}
      <div className="pageHero__content reveal">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {copy && <span>{copy}</span>}
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, copy, align = "left", viewAll, onViewAll }) {
  return (
    <div className={`sectionHeader sectionHeader--${align}${viewAll ? " sectionHeader--row" : ""}`}>
      <div className="sectionHeader__text">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {copy && <span>{copy}</span>}
      </div>
      {viewAll && (
        <button type="button" className="sectionHeader__viewall" onClick={onViewAll}>
          {viewAll} →
        </button>
      )}
    </div>
  );
}

export function ImagePanel({ src, title, copy, tall = false }) {
  return (
    <figure className={`imagePanel ${tall ? "imagePanel--tall" : ""}`}>
      <SmartImage src={src} alt={title || ""} />
      {(title || copy) && (
        <figcaption>
          <strong>{title}</strong>
          {copy && <span>{copy}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export function TrustStrip() {
  return (
    <section className="trustStrip" aria-label="Why customers trust VELORA">
      {trustSignals.map((signal) => (
        <span key={signal}>{signal}</span>
      ))}
    </section>
  );
}

export function CategoryCards({ onNavigate }) {
  return (
    <div className="categoryShowcase">
      {categoryHighlights.map((cat) => (
        <article
          key={cat.label}
          onClick={() => onNavigate?.(cat.page, cat.data)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onNavigate?.(cat.page, cat.data)}
          aria-label={`Explore ${cat.label}`}
        >
          <div className="categoryShowcase__img">
            <SmartImage src={cat.image} alt={cat.label} />
          </div>
          <div>
            <h3>{cat.label}</h3>
            <p>{cat.sub}</p>
            <span>Explore Now →</span>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PromoBand({ onNavigate }) {
  return (
    <section className="premiumPromo">
      <div>
        <p className="eyebrow">Custom printing</p>
        <h2>Upload your design, we handle the rest — delivered to your door.</h2>
      </div>
      <button
        type="button"
        className="btn btn-outlineLight"
        onClick={() => onNavigate?.("categories")}
      >
        Start Designing
      </button>
    </section>
  );
}

/* ── Products empty state ── */
export function ProductsEmpty({ message = "No products found.", onReset, resetLabel = "Clear filter" }) {
  return (
    <div className="productsEmpty" role="status">
      <span className="productsEmpty__icon" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      </span>
      <p>{message}</p>
      {onReset && (
        <button type="button" className="productsEmpty__btn" onClick={onReset}>
          {resetLabel}
        </button>
      )}
    </div>
  );
}

/* ── Products error state ── */
export function ProductsError({ onRetry }) {
  return (
    <div className="productsError" role="alert">
      <p>Something went wrong loading products.</p>
      {onRetry && (
        <button type="button" className="productsEmpty__btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

/* ── ProductCard skeleton (loading state) ── */
export function ProductCardSkeleton() {
  return (
    <article className="productCard productCard--skeleton" aria-hidden="true">
      <div className="productCard__img" />
      <div className="productCard__body">
        <span className="skeleton-block sk-sub" />
        <span className="skeleton-block sk-title" />
        <span className="skeleton-block sk-price" />
        <span className="skeleton-block sk-cta" />
      </div>
    </article>
  );
}

/* ── Heart icon ── */
function HeartIcon({ filled }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ── ProductCard ── */
export function ProductCard({ product, onNavigate }) {
  const [saved, setSaved] = useState(false);

  const handleCardClick = () => {
    const page = product.category_id === "cat_gift" ? "gift" : "categories";
    onNavigate?.(page);
  };

  const handleOrder = (e) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hi! I'd like to order: ${product.title} (${product.category} – ${product.subcategory}) — ₹${product.price}`
    );
    const waNumber = import.meta.env.VITE_WA_NUMBER || "915468427200";
    window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved((v) => !v);
  };

  return (
    <article
      className="productCard"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      aria-label={product.title}
    >
      <div className="productCard__img">
        <SmartImage
          src={product.images?.[0] || imageBank.fallback}
          alt={product.title}
        />
        {product.is_new && (
          <span className="productCard__badge">New</span>
        )}
        <button
          type="button"
          className={`productCard__heart${saved ? " productCard__heart--saved" : ""}`}
          aria-label={saved ? "Remove from saved" : "Save item"}
          onClick={handleSave}
        >
          <HeartIcon filled={saved} />
        </button>
      </div>
      <div className="productCard__body">
        <p className="productCard__sub">{product.subcategory}</p>
        <h3 className="productCard__title">{product.title}</h3>
        <p className="productCard__price">
          ₹{product.price}
          {product.price_unit && <small> {product.price_unit}</small>}
        </p>
        <button type="button" className="productCard__cta" onClick={handleOrder}>
          Order on WhatsApp
        </button>
      </div>
    </article>
  );
}
