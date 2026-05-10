import "./testimonials.css";

import { motion as Motion } from "framer-motion";

import {
  fadeUp,
  staggerContainer,
} from "@/animations/motion";

const testimonials = [
  {
    name: "Sophia Carter",
    role: "Creative Director",

    review:
      "The quality, presentation, and finishing exceeded everything we expected. Every detail felt intentional and premium.",
  },

  {
    name: "Daniel Brooks",
    role: "Startup Founder",

    review:
      "Their packaging and print execution completely elevated our product launch experience.",
  },

  {
    name: "Emma Wilson",
    role: "Brand Strategist",

    review:
      "Beautifully crafted prints with a modern aesthetic. It genuinely feels like a luxury creative studio.",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">

      <div className="container">

        {/* HEADER */}
        <Motion.div
          className="testimonials-header"

          variants={fadeUp}

          initial="hidden"
          whileInView="visible"

          viewport={{
            once: true,
            amount: 0.2,
          }}
        >

          <span className="testimonials-badge">
            Client Experience
          </span>

          <h2 className="testimonials-title">
            Trusted by brands
            that care about detail.
          </h2>

        </Motion.div>

        {/* GRID */}
        <Motion.div
          className="testimonials-grid"

          variants={staggerContainer}

          initial="hidden"
          whileInView="visible"

          viewport={{
            once: true,
            amount: 0.2,
          }}
        >

          {testimonials.map((item) => (
            <Motion.div
              key={item.name}

              className="testimonial-card"

              variants={fadeUp}

              whileHover={{
                y: -10,
              }}
            >

              {/* QUOTE */}
              <div className="quote-mark">
                "
              </div>

              {/* REVIEW */}
              <p className="testimonial-review">
                {item.review}
              </p>

              {/* USER */}
              <div className="testimonial-user">

                <div className="testimonial-avatar">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h4>{item.name}</h4>
                  <span>{item.role}</span>
                </div>

              </div>

            </Motion.div>
          ))}

        </Motion.div>

      </div>

    </section>
  );
}

