import { motion as Motion } from "framer-motion";
import Reveal from "../../components/ui/Reveal";
import { imageBank, team } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { cardItem, gridContainer } from "../../animations/motion";
import { PageHero, PromoBand, SectionHeader } from "../shared";
import "./style.css";

export default function Team({ onNavigate }) {
  return (
    <>
      <PageHero
        title="Meet the people who turn files into beautiful physical things."
        copy="Design taste, production discipline, color control, and clear communication under one roof."
        image={imageBank.team}
      />
      <section className="teamPage">
        <Reveal>
          <SectionHeader align="center" eyebrow="Our team" title="A compact studio team with serious production instincts." />
        </Reveal>
        <Motion.div
          className="teamCards"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {team.map((member, index) => (
            <Motion.article key={member.name} style={{ "--delay": `${index * 120}ms` }} variants={cardItem}>
              <img src={member.image} alt={member.name} decoding="async" loading="lazy" onError={handleImageError} />
              <div>
                <span>{member.role}</span>
                <h3>{member.name}</h3>
              </div>
            </Motion.article>
          ))}
        </Motion.div>
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
