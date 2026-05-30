import "./services.css";

import { motion as Motion } from "framer-motion";

import {
  fadeUp,
  staggerContainer,
} from "@/animations/motion";

const services = [
  {
    title: "Luxury Packaging",
    description:
      "Packaging systems designed to elevate your product experience and brand identity.",

    tag: "Packaging",
  },

  {
    title: "Premium Business Cards",
    description:
      "Minimal, elegant, and high-quality business cards crafted with premium finishes.",

    tag: "Brand Identity",
  },

  {
    title: "Custom Merchandise",
    description:
      "Shirts, stickers, posters, and custom printed merchandise for modern brands.",

    tag: "Merch",
  },
];

export default function Services() {
  return (
    <section className="services-section">

      <div className="container">

        {/* HEADER */}
        <Motion.div
          className="services-header"

          variants={fadeUp}

          initial="hidden"
          whileInView="visible"

          viewport={{
            once: true,
            amount: 0.2,
          }}
        >

          <span className="services-badge">
            Premium Print Solutions
          </span>

          <h2 className="services-title">
            Crafted print systems
            for modern brands.
          </h2>

        </Motion.div>

        {/* GRID */}
        <Motion.div
          className="services-grid"

          variants={staggerContainer}

          initial="hidden"
          whileInView="visible"

          viewport={{
            once: true,
            amount: 0.2,
          }}
        >

          {services.map((service, index) => (
            <Motion.div
              key={index}

              className="service-card"

              variants={fadeUp}

              whileHover={{
                y: -10,
              }}
            >

              <span className="service-tag">
                {service.tag}
              </span>

              <h3>
                {service.title}
              </h3>

              <p>
                {service.description}
              </p>

              <button>
                Learn More
              </button>

            </Motion.div>
          ))}

        </Motion.div>

      </div>

    </section>
  );
}
