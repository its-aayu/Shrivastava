import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { faqs, imageBank } from "../../data/site";
import { cardItem, gridContainer } from "../../animations/motion";
import { PageHero, PromoBand, SectionHeader } from "../shared";
import "./style.css";

export default function FAQ({ onNavigate }) {
  const [open, setOpen] = useState(0);

  return (
    <>
      <PageHero
        title="Answers before your print job begins."
        copy="Quick clarity on artwork, turnaround, quantities, finishes, delivery, and production planning."
        image={imageBank.paper}
      />
      <section className="faqPage">
        <Motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeader align="center" eyebrow="FAQ" title="Good print starts with clear decisions." />
        </Motion.div>
        <Motion.div
          className="faqList"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqs.map(([question, answer], index) => (
            <Motion.div
              key={question}
              className={`faqItem${open === index ? " isOpen" : ""}`}
              variants={cardItem}
            >
              <button
                onClick={() => setOpen(open === index ? -1 : index)}
                aria-expanded={open === index}
                type="button"
              >
                <span>{question}</span>
                <strong aria-hidden="true" className="faqItem__icon" />
              </button>
              <p>{answer}</p>
            </Motion.div>
          ))}
        </Motion.div>
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
