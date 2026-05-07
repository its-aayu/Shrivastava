import { useState } from "react";
import Button from "../../Components/Button";
import { imageBank, services } from "../../data/site";
import { handleImageError } from "../../utils/images";
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
        <SectionHeader align="center" eyebrow="Our services" title="Pick the print path that fits your project." />
        <div className="servicesPage__grid">
          {services.map((service, index) => (
            <button
              className={active === index ? "isActive" : ""}
              key={service.title}
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              type="button"
            >
              <img src={service.image} alt="" decoding="async" loading="lazy" onError={handleImageError} />
              <span>0{index + 1}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </button>
          ))}
        </div>
      </section>
      <section className="serviceDetail">
        <ImagePanel src={selected.image} title={selected.title} copy="Detailed material, file, and finishing guidance." tall />
        <div>
          <SectionHeader eyebrow="Service detail" title={selected.title} copy={selected.copy} />
          <ul>
            {selected.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <Button onClick={() => onNavigate("contact")}>Request This Service Quote</Button>
        </div>
      </section>
      <section className="serviceQuote">
        <SectionHeader eyebrow="Quick quote" title="Send the brief and we will prepare the next step." />
        <QuoteForm compact />
      </section>
      <PromoBand onNavigate={onNavigate} />
      <ReviewSection />
    </>
  );
}
