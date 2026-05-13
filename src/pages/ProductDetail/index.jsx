import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import Button from "../../components/ui/Button";
import { galleryItems, imageBank } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { PageHero, PromoBand, SectionHeader } from "../shared";
import "./style.css";

export default function ProductDetail({ onNavigate, productId }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  const product = galleryItems.find(item => item.id === productId);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.productHero');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setIsSticky(rect.bottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="productDetail">
        <PageHero
          title="Product Not Found"
          copy="The product you're looking for doesn't exist."
        />
      </div>
    );
  }

  const relatedProducts = galleryItems
    .filter(item => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  return (
    <div className="productDetail">
      {/* Sticky Product Info */}
      <div className={`productSticky ${isSticky ? 'isVisible' : ''}`}>
        <div className="productSticky__content">
          <div className="productSticky__image">
            <img src={product.image} alt={product.title} onError={handleImageError} />
          </div>
          <div className="productSticky__info">
            <h3>{product.title}</h3>
            <span>{product.category}</span>
            <strong>{product.price} <small>{product.pricingUnit}</small></strong>
          </div>
          <Button onClick={() => onNavigate("contact")}>Request Quote</Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="productHero">
        <div className="productHero__gallery">
          <div className="productHero__main">
            <Motion.img
              key={selectedImage}
              src={product.images[selectedImage]}
              alt={product.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onError={handleImageError}
            />
          </div>
          <div className="productHero__thumbs">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={selectedImage === index ? 'isActive' : ''}
                onClick={() => setSelectedImage(index)}
                type="button"
              >
                <img src={image} alt={`${product.title} ${index + 1}`} onError={handleImageError} />
              </button>
            ))}
          </div>
        </div>
        <div className="productHero__content">
          <div className="productHero__header">
            <span className="eyebrow">{product.category}</span>
            <h1>{product.title}</h1>
            <div className="productHero__pricing">
              <strong>{product.price}</strong>
              <span>{product.pricingUnit}</span>
            </div>
          </div>
          <p className="productHero__description">{product.description}</p>
          <div className="productHero__trust">
            {product.trustIndicators.map(indicator => (
              <span key={indicator}>{indicator}</span>
            ))}
          </div>
          <div className="productHero__cta">
            <Button onClick={() => onNavigate("contact")}>Request a Quote</Button>
            <Button variant="outline" onClick={() => onNavigate("gallery")}>View More Work</Button>
          </div>
        </div>
      </section>

      {/* Product Specs */}
      <section className="productSpecs">
        <SectionHeader
          align="center"
          eyebrow="Product Details"
          title="Premium specifications for quality results"
          copy="Every detail is chosen to ensure your print project exceeds expectations."
        />
        <div className="productSpecs__grid">
          {Object.entries(product.specs).map(([key, value]) => (
            <article key={key} className="specCard">
              <h3>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
              <p>{value}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="relatedProducts">
          <SectionHeader
            align="center"
            eyebrow="Related Work"
            title="More projects in this category"
            copy="Explore similar print projects that might inspire your next idea."
          />
          <div className="relatedProducts__grid">
            {relatedProducts.map(item => (
              <article
                key={item.id}
                className="relatedProduct"
                onClick={() => onNavigate("product", item.id)}
              >
                <img src={item.image} alt={item.title} onError={handleImageError} />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <strong>{item.price} <small>{item.pricingUnit}</small></strong>
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