import "./products.css";

import { motion as Motion } from "framer-motion";

import {
  fadeUp,
  staggerContainer,
} from "@/animations/motion";

const products = [
  {
    title: "Luxury Packaging",
    category: "Packaging",

    description:
      "Elegant premium packaging systems designed for modern brands.",

    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
  },

  {
    title: "Minimal Business Cards",
    category: "Brand Identity",

    description:
      "Beautifully printed cards crafted with premium finishes and textures.",

    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },

  {
    title: "Creative Merchandise",
    category: "Merch",

    description:
      "Custom apparel, stickers, and printed products for modern creators.",

    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb",
  },
];

export default function Products() {
  return (
    <section className="products-section">

      <div className="container">

        {/* HEADER */}
        <Motion.div
          className="products-header"

          variants={fadeUp}

          initial="hidden"
          whileInView="visible"

          viewport={{
            once: true,
            amount: 0.2,
          }}
        >

          <span className="products-badge">
            Featured Products
          </span>

          <h2 className="products-title">
            Crafted to feel premium
            before it's even touched.
          </h2>

        </Motion.div>

        {/* GRID */}
        <Motion.div
          className="products-grid"

          variants={staggerContainer}

          initial="hidden"
          whileInView="visible"

          viewport={{
            once: true,
            amount: 0.2,
          }}
        >

          {products.map((product) => (
            <Motion.div
              key={product.title}

              className="product-card"

              variants={fadeUp}

              whileHover={{
                y: -10,
              }}
            >

              {/* IMAGE */}
              <div className="product-image-wrapper">

                <img
                  src={product.image}
                  alt={product.title}
                />

              </div>

              {/* CONTENT */}
              <div className="product-content">

                <span className="product-category">
                  {product.category}
                </span>

                <h3>
                  {product.title}
                </h3>

                <p>
                  {product.description}
                </p>

                <button>
                  Explore Product
                </button>

              </div>

            </Motion.div>
          ))}

        </Motion.div>

      </div>

    </section>
  );
}

