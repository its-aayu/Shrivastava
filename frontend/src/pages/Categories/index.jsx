import { useState, useMemo } from "react";
import { SectionHeader, ProductCard, ProductCardSkeleton, ProductsEmpty } from "../../components/shared";
import products from "../../mock-data/products.json";
import "./style.css";

const TABS = [
  { id: "cat_men",   label: "Men" },
  { id: "cat_women", label: "Women" },
  { id: "cat_kids",  label: "Kids" },
];

const SKELETON_COUNT = 8;

export default function Categories({ onNavigate, pageData }) {
  const [activeTab, setActiveTab]       = useState(pageData?.activeTab ?? "cat_men");
  const [activeSubcat, setActiveSubcat] = useState(pageData?.subcategory ?? null);
  const [loading, setLoading]           = useState(false);

  const tabProducts = useMemo(
    () => products.filter((p) => p.category_id === activeTab),
    [activeTab]
  );

  const subcats = useMemo(
    () => [...new Set(tabProducts.map((p) => p.subcategory))],
    [tabProducts]
  );

  const visible = useMemo(
    () =>
      activeSubcat
        ? tabProducts.filter((p) => p.subcategory === activeSubcat)
        : tabProducts,
    [tabProducts, activeSubcat]
  );

  const handleTabChange = (id) => {
    setLoading(true);
    setActiveTab(id);
    setActiveSubcat(null);
    // Simulate brief transition so skeleton is visible when switching tabs
    setTimeout(() => setLoading(false), 300);
  };

  const activeLabel = TABS.find((t) => t.id === activeTab)?.label;

  return (
    <div className="categoriesPage">

      <div className="categoriesPage__hero">
        <p className="eyebrow">VELORA</p>
        <h1>Shop by Category</h1>
        <p>Custom-printed apparel for every style and every age.</p>
      </div>

      {/* GENDER TABS */}
      <div className="categoriesPage__tabs" role="tablist" aria-label="Gender categories">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBCATEGORY FILTER */}
      <div className="categoriesPage__subfilter" aria-label="Filter by type">
        <button
          type="button"
          className={`subcat-btn ${!activeSubcat ? "active" : ""}`}
          onClick={() => setActiveSubcat(null)}
        >
          All
        </button>
        {subcats.map((s) => (
          <button
            key={s}
            type="button"
            className={`subcat-btn ${activeSubcat === s ? "active" : ""}`}
            onClick={() => setActiveSubcat(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <section className="categoriesPage__grid" aria-label="Products">
        <SectionHeader
          eyebrow={activeLabel}
          title={
            loading
              ? "Loading…"
              : `${visible.length} product${visible.length !== 1 ? "s" : ""}${activeSubcat ? ` · ${activeSubcat}` : ""}`
          }
          viewAll="View all"
          onViewAll={() => setActiveSubcat(null)}
        />

        {loading ? (
          <div className="productGrid" aria-busy="true" aria-label="Loading products">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <ProductsEmpty
            message={`No products found${activeSubcat ? ` for "${activeSubcat}"` : ""}.`}
            onReset={() => setActiveSubcat(null)}
            resetLabel="Clear filter"
          />
        ) : (
          <div className="productGrid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
