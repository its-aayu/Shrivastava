import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { imageBank } from "../../data/site";
import { cardItem, fadeLeft, fadeRight, gridContainer } from "../../animations/motion";
import { ImagePanel, PageHero, QuoteForm, SectionHeader } from "../shared";
import "./style.css";

const contactInfo = [
  { icon: "📞", label: "Phone", value: "+91 546 84272" },
  { icon: "✉️", label: "Email", value: "aayu.printing@domain.com" },
  { icon: "🕐", label: "Hours", value: "Mon–Sat, 9:00 AM – 7:00 PM" },
  { icon: "📍", label: "Studio", value: "George Tower, Burn Swiss" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        title="Tell us what you want to print. We will shape the production plan."
        copy="Send artwork, ask about materials, request rush production, or start with a loose idea."
        image={imageBank.studio}
      />
      <section className="contactPage">
        <Motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionHeader eyebrow="Contact" title="Let's make the next print piece feel premium." />
          <QuoteForm onSubmit={() => setSent(true)} />
          {sent && <p className="contactPage__success">Your request is ready. The next step would be a proof and production quote.</p>}
        </Motion.div>
        <Motion.aside
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <ImagePanel src={imageBank.map} title="Visit the studio" copy="George Tower, Burn Swiss" />
          <Motion.div
            className="contactDetails"
            variants={gridContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {contactInfo.map((item) => (
              <Motion.div key={item.label} className="contactDetail" variants={cardItem}>
                <span className="contactDetail__icon" aria-hidden="true">{item.icon}</span>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </div>
              </Motion.div>
            ))}
          </Motion.div>
        </Motion.aside>
      </section>
    </>
  );
}
