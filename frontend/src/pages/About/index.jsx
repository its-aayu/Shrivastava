import { motion as Motion } from "framer-motion";
import { imageBank } from "../../data/site";
import Reveal from "../../components/ui/Reveal";
import { cardItem, gridContainer } from "../../animations/motion";
import { ImagePanel, PageHero, PromoBand, SectionHeader } from "../../components/shared";
import "./style.css";

const timelineSteps = [
  {
    step: "Browse",
    desc: "Explore our range of custom apparel and personalised gifts across men, women, kids, and gift collections.",
  },
  {
    step: "Design",
    desc: "Place your order on WhatsApp with your artwork or idea. We'll send a free digital preview before anything goes to print.",
  },
  {
    step: "Print",
    desc: "Your order is printed on quality fabrics using wash-resistant inks, then quality-checked by our team.",
  },
  {
    step: "Deliver",
    desc: "Packed securely and shipped fast — most apparel in 5–7 days, gifts in 2–5 days, tracked all the way to your door.",
  },
];

const coreValues = [
  {
    num: "01",
    name: "Preview before print",
    body: "You see a digital proof before we print anything. No surprises, no wasted orders.",
  },
  {
    num: "02",
    name: "Quality materials",
    body: "180–320 GSM cotton fabrics and wash-resistant inks. Clothes that look and feel premium.",
  },
  {
    num: "03",
    name: "Made to order",
    body: "Every piece is printed fresh for you. No minimum order quantity — one piece is fine.",
  },
];

export default function About({ onNavigate }) {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="Custom apparel & gifts, made with care."
        copy="We started VELORA to make personalised printing simple — your design, on quality products, delivered fast across India."
        image={imageBank.studio}
      />

      {/* Story + Timeline */}
      <section className="aboutStory">
        <Reveal>
          <SectionHeader
            eyebrow="How it works"
            title="Browse, design, print — delivered to your door."
            copy="Ordering custom apparel or a personalised gift with VELORA takes minutes. Here's what happens after you reach out."
          />
          <div className="aboutStory__timeline">
            {timelineSteps.map((item, index) => (
              <article key={item.step}>
                <span>{index + 1}</span>
                <strong>{item.step}</strong>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </Reveal>
        <Motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ImagePanel
            src={imageBank.studio}
            title="Printed with care"
            copy="Quality inks, quality fabrics, delivered fast."
            tall
          />
        </Motion.div>
      </section>

      {/* Mission quote */}
      <section className="aboutMission">
        <Reveal y={32} duration={0.7} className="aboutMission__inner">
          <p className="eyebrow">Our mission</p>
          <h2>"Your design deserves to look as good on the product as it does on your screen."</h2>
          <p>Every preview, every quality check, every careful shipment — we do it so your order arrives exactly as you imagined it.</p>
        </Reveal>
      </section>

      {/* Values */}
      <section className="aboutValues">
        <Reveal>
          <SectionHeader
            align="center"
            eyebrow="What we stand for"
            title="Custom printing that's fast, honest, and high quality."
          />
        </Reveal>
        <Motion.div
          className="aboutValues__cards"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {coreValues.map((item) => (
            <Motion.article key={item.name} variants={cardItem}>
              <span>{item.num}</span>
              <h3>{item.name}</h3>
              <p>{item.body}</p>
            </Motion.article>
          ))}
        </Motion.div>
      </section>

      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
