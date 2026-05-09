import { imageBank, team } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { PageHero, PromoBand, SectionHeader } from "../shared";

export default function Team({ onNavigate }) {
  return (
    <>
      <PageHero
        title="Meet the people who turn files into beautiful physical things."
        copy="Design taste, production discipline, color control, and clear communication under one roof."
        image={imageBank.team}
      />
      <section className="teamPage">
        <SectionHeader align="center" eyebrow="Our team" title="A compact studio team with serious production instincts." />
        <div className="teamCards">
          {team.map((member, index) => (
            <article key={member.name} style={{ "--delay": `${index * 120}ms` }}>
              <img src={member.image} alt={member.name} decoding="async" loading="lazy" onError={handleImageError} />
              <div>
                <span>{member.role}</span>
                <h3>{member.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
