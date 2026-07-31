import { useMemo } from "react";
import { SectionHeader, ProductCard, ProductCardSkeleton, PromoBand } from "../../components/shared";
import products from "../../mock-data/products.json";
import "./style.css";

const SKELETON_COUNT = 4;

export default function NewArrivals({ onNavigate }) {
  const newProducts = useMemo(() => products.filter((p) => p.is_new), []);

  return (
    <div className="newArrivalsPage">

      <div className="newArrivalsPage__hero">
        <p className="eyebrow">VELORA</p>
        <h1>New Arrivals</h1>
        <p>Our latest products — just added and ready to customise.</p>
      </div>

      <section className="newArrivalsPage__grid">
        <SectionHeader
          eyebrow="Fresh drops"
          title={`${newProducts.length} new product${newProducts.length !== 1 ? "s" : ""}`}
          copy="Brand new to our collection. Be the first to customise yours."
          viewAll="Browse all"
          onViewAll={() => onNavigate("categories")}
        />

        {newProducts.length === 0 ? (
          <div className="newArrivalsPage__empty">
            <p>New arrivals coming soon — check back shortly!</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onNavigate("categories")}
            >
              Browse all products
            </button>
          </div>
        ) : (
          <div className="productGrid">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </section>

      <PromoBand onNavigate={onNavigate} />

    </div>
  );
}
