import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import Button from "../../components/ui/Button";
import { imageBank } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { useProduct, useProducts } from "../../hooks/useProducts";
import { PageHero, PromoBand, SectionHeader } from "../shared";
import "./style.css";

function ProductSkeleton() {
  return (
    <div className="productDetail">
      <div className="productHero productHero--loading">
        <div className="productSkeleton__gallery" />
        <div className="productSkeleton__content">
          {[80, 140, 60, 100, 80].map((w, i) => (
            <div key={i} className="productSkeleton__line" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail({ onNavigate, productId }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  const { product, loading, error } = useProduct(productId);

  // Fetch siblings of same category for "Related" section
  const { products: allProducts } = useProducts(
    product ? { category: product.category_id } : {}
  );
  const relatedProducts = allProducts
    .filter((p) => p.id !== productId)
    .slice(0, 3);

  useEffect(() => {
    setSelectedImage(0);
  }, [productId]);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector(".productHero");
      if (hero) setIsSticky(hero.getBoundingClientRect().bottom <= 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return <ProductSkeleton />;

  if (error || !product) {
    return (
      <div className="productDetail">
        <PageHero
          title="Product not found"
          copy="The product you're looking for doesn't exist or couldn't be loaded."
        />
        <div style={{ textAlign: "center", padding: "48px 24px" }}>
          <Button onClick={() => onNavigate("gallery")}>Browse all products</Button>
        </div>
        <PromoBand onNavigate={onNavigate} />
      </div>
    );
  }

  const images = product.images?.length ? product.images : [imageBank.fallback];
  const specs = [
    { label: "Finish", value: product.finish },
    { label: "Material", value: product.material },
    { label: "Size", value: product.size },
    { label: "Delivery", value: product.delivery_time },
    { label: "Min. Qty", value: product.min_quantity ? `${product.min_quantity} units` : null },
    { label: "Rating", value: product.rating ? `${product.rating} / 5 (${product.review_count} reviews)` : null },
  ].filter((s) => s.value);

  const trustBadges = product.features?.slice(0, 3) ?? [];

  return (
    <div className="productDetail">
      {/* Sticky bar */}
      <div className={`productSticky ${isSticky ? "isVisible" : ""}`}>
        <div className="productSticky__content">
          <div className="productSticky__image">
            <img src={images[0]} alt={product.title} onError={handleImageError} />
          </div>
          <div className="productSticky__info">
            <h3>{product.title}</h3>
            <span>{product.category}</span>
            <strong>
              ₹{product.price.toLocaleString("en-IN")}{" "}
              <small>{product.price_unit}</small>
            </strong>
          </div>
          <Button onClick={() => onNavigate("contact")}>Request Quote</Button>
        </div>
      </div>

      {/* Hero */}
      <section className="productHero">
        <div className="productHero__gallery">
          <div className="productHero__main">
            <Motion.img
              key={selectedImage}
              src={images[selectedImage]}
              alt={product.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onError={handleImageError}
            />
          </div>
          {images.length > 1 && (
            <div className="productHero__thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={selectedImage === i ? "isActive" : ""}
                  onClick={() => setSelectedImage(i)}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} onError={handleImageError} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="productHero__content">
          <div className="productHero__header">
            <span className="eyebrow">{product.category}</span>
            <h1>{product.title}</h1>
            <div className="productHero__pricing">
              <strong>₹{product.price.toLocaleString("en-IN")}</strong>
              <span>{product.price_unit}</span>
            </div>
          </div>
          <p className="productHero__description">{product.description}</p>
          {trustBadges.length > 0 && (
            <div className="productHero__trust">
              {trustBadges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          )}
          <div className="productHero__cta">
            <Button onClick={() => onNavigate("contact")}>Request a Quote</Button>
            <Button variant="outline" onClick={() => onNavigate("gallery")}>View More Work</Button>
          </div>
        </div>
      </section>

      {/* Specs */}
      {specs.length > 0 && (
        <section className="productSpecs">
          <SectionHeader
            align="center"
            eyebrow="Product Details"
            title="Specifications and production details"
            copy="Every detail chosen so your print project meets the highest quality standard."
          />
          <div className="productSpecs__grid">
            {specs.map(({ label, value }) => (
              <article key={label} className="specCard">
                <h3>{label}</h3>
                <p>{value}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Features list */}
      {product.features?.length > 0 && (
        <section className="productFeatures">
          <SectionHeader
            align="center"
            eyebrow="What's included"
            title="Production features"
          />
          <ul className="productFeatures__list">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="relatedProducts">
          <SectionHeader
            align="center"
            eyebrow="Related Work"
            title="More products in this category"
            copy="Explore similar print products that might work for your next project."
          />
          <div className="relatedProducts__grid">
            {relatedProducts.map((item) => (
              <article
                key={item.id}
                className="relatedProduct"
                onClick={() => onNavigate("product", item.id)}
              >
                <img
                  src={item.images?.[0] || imageBank.fallback}
                  alt={item.title}
                  onError={handleImageError}
                />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <strong>
                    ₹{item.price.toLocaleString("en-IN")}{" "}
                    <small>{item.price_unit}</small>
                  </strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <PromoBand onNavigate={onNavigate} />
    </div>
  );
}
