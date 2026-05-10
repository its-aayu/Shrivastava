import "./hero.css";

import { motion as Motion } from "framer-motion";

import {
  fadeUp,
  fadeLeft,
  fadeRight,
  staggerContainer,
  floatingAnimation,
} from "@/animations/motion";

export default function Hero({ onNavigate }) {
  return (
    <section className="hero-section">

      {/* BACKGROUND BLURS */}
      <div className="hero-background-blur hero-blur-1" />
      <div className="hero-background-blur hero-blur-2" />

      {/* MAIN CONTAINER */}
      <Motion.div
        className="container hero-container"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >

        {/* LEFT CONTENT */}
        <Motion.div
          className="hero-content"
          variants={fadeLeft}
        >

          {/* BADGE */}
          <Motion.span
            className="hero-badge"
            whileHover={{
              scale: 1.04,
            }}
          >
            Premium Printing Studio
          </Motion.span>

          {/* TITLE */}
          <Motion.h1
            className="hero-title"
            variants={fadeLeft}
          >
            Print experiences
            designed to feel
            unforgettable.
          </Motion.h1>

          {/* DESCRIPTION */}
          <Motion.p
            className="hero-description"
            variants={fadeLeft}
          >
            Modern printing solutions for brands,
            creators, businesses, and products
            that care deeply about presentation,
            quality, and identity.
          </Motion.p>

          {/* BUTTONS */}
          <Motion.div
            className="hero-actions"
            variants={fadeUp}
          >

            {/* PRIMARY BUTTON */}
            <Motion.button
              className="hero-primary-btn"
              onClick={() => onNavigate("contact")}

              whileHover={{
                y: -4,
                scale: 1.03,
              }}

              whileTap={{
                scale: 0.97,
              }}
            >
              Start Your Project
            </Motion.button>

            {/* SECONDARY BUTTON */}
            <Motion.button
              className="hero-secondary-btn"
              onClick={() => onNavigate("services")}

              whileHover={{
                y: -4,
              }}

              whileTap={{
                scale: 0.98,
              }}
            >
              Explore Services
            </Motion.button>

          </Motion.div>

          {/* TRUST ROW */}
          <Motion.div
            className="hero-trust-row"
            variants={fadeUp}
          >

            <span>Premium Finish</span>
            <span>Fast Delivery</span>
            <span>Brand Packaging</span>

          </Motion.div>

          {/* STATS */}
          <Motion.div
            className="hero-stats"
            variants={fadeUp}
          >

            <Motion.div
              className="hero-stat-card"

              whileHover={{
                y: -8,
              }}
            >
              <h3>500+</h3>
              <p>Projects Printed</p>
            </Motion.div>

            <Motion.div
              className="hero-stat-card"

              whileHover={{
                y: -8,
              }}
            >
              <h3>98%</h3>
              <p>Client Satisfaction</p>
            </Motion.div>

            <Motion.div
              className="hero-stat-card"

              whileHover={{
                y: -8,
              }}
            >
              <h3>24/7</h3>
              <p>Support System</p>
            </Motion.div>

          </Motion.div>

        </Motion.div>

        {/* RIGHT VISUAL */}
        <Motion.div
          className="hero-visual"
          variants={fadeRight}
        >

          {/* FLOATING CARD LARGE */}
          <Motion.div
            className="floating-card card-large"
            animate={floatingAnimation.animate}
          >
            <span>Brand Identity</span>
          </Motion.div>

          {/* FLOATING CARD SMALL */}
          <Motion.div
            className="floating-card card-small"

            animate={{
              y: [0, 10, 0],
            }}

            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span>Packaging Design</span>
          </Motion.div>

          {/* MAIN PREVIEW */}
          <Motion.div
            className="hero-main-preview"

            whileHover={{
              scale: 1.01,
            }}

            transition={{
              duration: 0.3,
            }}
          >

            <div className="preview-content">

              <h3>
                Creative Print Studio
              </h3>

              <p>
                Elegant print systems for
                modern brands.
              </p>

            </div>

          </Motion.div>

        </Motion.div>

      </Motion.div>

    </section>
  );
}

