import { motion as Motion } from "framer-motion";
import { imageBank, stats } from "../../data/site";
import { ImagePanel, PageHero, PromoBand, ReviewSection, SectionHeader, StatsStrip } from "../shared";
import "./style.css";

const timelineSteps = [
  { step: "Consult", desc: "We listen to your brief — materials, quantity, timeline, and brand expectations." },
  { step: "Proof", desc: "A digital proof is prepared and sent to you before a single sheet prints." },
  { step: "Produce", desc: "Our team prints, finishes, and quality-checks every item in the order." },
  { step: "Deliver", desc: "Packed and ready for pickup or delivery, on schedule, no chasing required." },
];

const coreValues = [
  { num: "01", name: "Proof first", body: "Nothing prints until you approve it. No surprises at delivery, ever." },
  { num: "02", name: "File care", body: "Bleed, trim, color mode, and resolution reviewed on every single job." },
  { num: "03", name: "Real materials", body: "Paper weight, texture, and finish guided around your specific brand." },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

export default function About({ onNavigate }) {
  return (
    <>
      <PageHero
        title="A design-led print studio built for modern brands."
        copy="We bring the discipline of production together with the eye of a brand studio, so every piece feels considered."
        image={imageBank.studio}
      />

      {/* Story + Timeline */}
      <section className="aboutStory">
        <Motion.div {...fade()}>
          <SectionHeader
            eyebrow="About us"
            title="From quick prints to complete launch kits, every job gets a studio eye."
            copy="Aayu is built for teams who need speed without losing taste. We help you choose the right paper, finish, color approach, and delivery path before ink touches stock."
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
        </Motion.div>
        <Motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ImagePanel src={imageBank.press} title="Production with polish" copy="Fast machines, careful hands, beautiful output." tall />
        </Motion.div>
      </section>

      <StatsStrip />

      {/* Mission quote */}
      <section className="aboutMission">
        <Motion.div
          className="aboutMission__inner"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow">Our mission</p>
          <h2>"Print should feel calm before production and impressive after delivery."</h2>
          <p>Every file check, every proof, every material choice exists to remove friction from the process and put quality into the hands of the client.</p>
        </Motion.div>
      </section>

      {/* Values */}
      <section className="aboutValues">
        <SectionHeader
          align="center"
          eyebrow="What we care about"
          title="Print should be fast, but it should never feel careless."
        />
        <div className="aboutValues__cards">
          {coreValues.map((item, i) => (
            <Motion.article key={item.name} {...fade(i * 0.1)}>
              <span>{item.num}</span>
              <h3>{item.name}</h3>
              <p>{item.body}</p>
            </Motion.article>
          ))}
        </div>
        <div className="aboutStats">
          {stats.map((item, i) => (
            <Motion.article key={item.label} {...fade(i * 0.1)}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </Motion.article>
          ))}
        </div>
      </section>

      <PromoBand onNavigate={onNavigate} />
      <ReviewSection />
    </>
  );
}
