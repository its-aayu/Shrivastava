import { useState } from "react";
import { motion as Motion } from "framer-motion";
import Button from "../../components/ui/Button";
import { imageBank, services } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { cardItem, fadeLeft, fadeRight, fadeUp, gridContainer } from "../../animations/motion";
import { ImagePanel, PageHero, PromoBand, QuoteForm, ReviewSection, SectionHeader } from "../shared";
import "./style.css";

export default function Services({ onNavigate }) {
  const [active, setActive] = useState(0);
  const selected = services[active];

  return (
    <>
      <PageHero
        title="Print services for launches, offices, creators, and everyday brand moments."
        copy="Choose the service, approve your proof, and let our production team handle the details."
        image={imageBank.press}
      />
      <section className="servicesPage">
        <Motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeader align="center" eyebrow="Our services" title="Pick the print path that fits your project." />
        </Motion.div>
        <Motion.div
          className="servicesPage__grid"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <Motion.button
              key={service.title}
              className={active === index ? "isActive" : ""}
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              type="button"
              variants={cardItem}
            >
              <img src={service.image} alt="" decoding="async" loading="lazy" onError={handleImageError} />
              <span>0{index + 1}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </Motion.button>
          ))}
        </Motion.div>
      </section>
      <section className="serviceDetail">
        <Motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <ImagePanel src={selected.image} title={selected.title} copy="Detailed material, file, and finishing guidance." tall />
        </Motion.div>
        <Motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionHeader eyebrow="Service detail" title={selected.title} copy={selected.copy} />
          <ul>
            {selected.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <Button onClick={() => onNavigate("contact")}>Request This Service Quote</Button>
        </Motion.div>
      </section>
      <Motion.section
        className="serviceQuote"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <SectionHeader eyebrow="Quick quote" title="Send the brief and we will prepare the next step." />
        <QuoteForm compact />
      </Motion.section>
      <PromoBand onNavigate={onNavigate} />
      <ReviewSection />
    </>
  );
}
