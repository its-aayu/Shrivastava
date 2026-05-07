import { useState } from "react";
import { faqs, imageBank } from "../../data/site";
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
        <SectionHeader align="center" eyebrow="FAQ" title="Good print starts with clear decisions." />
        <div className="faqList">
          {faqs.map(([question, answer], index) => (
            <button
              className={open === index ? "isOpen" : ""}
              key={question}
              onClick={() => setOpen(open === index ? -1 : index)}
              aria-expanded={open === index}
              type="button"
            >
              <span>{question}</span>
              <strong>{open === index ? "-" : "+"}</strong>
              {open === index && <p>{answer}</p>}
            </button>
          ))}
        </div>
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
