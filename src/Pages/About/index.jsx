import { imageBank, stats } from "../../data/site";
import { ImagePanel, PageHero, PromoBand, ReviewSection, SectionHeader, StatsStrip } from "../shared";
import "./style.css";

export default function About({ onNavigate }) {
  return (
    <>
      <PageHero
        title="A design-led print studio built for modern brands."
        copy="We bring the discipline of production together with the eye of a brand studio, so every piece feels considered."
        image={imageBank.studio}
      />
      <section className="aboutStory">
        <div>
          <SectionHeader
            eyebrow="About us"
            title="From quick prints to complete launch kits, every job gets a studio eye."
            copy="Aayu is built for teams who need speed without losing taste. We help you choose the right paper, finish, color approach, and delivery path before ink touches stock."
          />
          <div className="aboutStory__timeline">
            {["Consult", "Proof", "Produce", "Deliver"].map((item, index) => (
              <article key={item}>
                <span>{index + 1}</span>
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </div>
        <ImagePanel src={imageBank.press} title="Production with polish" copy="Fast machines, careful hands, beautiful output." tall />
      </section>
      <StatsStrip />
      <section className="aboutValues">
        <SectionHeader align="center" eyebrow="What we care about" title="Print should be fast, but it should never feel careless." />
        <div>
          {stats.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <h3>{item.label}</h3>
              <p>Every number is backed by practical process, file checks, proofing, and clear communication.</p>
            </article>
          ))}
        </div>
      </section>
      <PromoBand onNavigate={onNavigate} />
      <ReviewSection />
    </>
  );
}
