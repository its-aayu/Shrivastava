import { useState } from "react";
import { motion as Motion } from "framer-motion";
import Button from "../../components/ui/Button";
import Reveal from "../../components/ui/Reveal";
import { blogs, imageBank } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { cardItem, fadeLeft, gridContainer } from "../../animations/motion";
import { PageHero, PromoBand, SectionHeader } from "../shared";
import "./style.css";

export default function Blog({ onNavigate }) {
  const [active, setActive] = useState(0);
  const selected = blogs[active];

  return (
    <>
      <PageHero
        title="Print notes, production advice, and ideas for better brand materials."
        copy="A small journal for teams who want their printed work to feel sharper and more intentional."
        image={imageBank.paper}
      />
      <section className="blogPage">
        <Reveal>
          <SectionHeader align="center" eyebrow="Journal" title="Latest thinking from the Aayu studio." />
        </Reveal>
        <div className="blogLayout">
          <Motion.article className="blogFeatured" variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <img src={selected.image} alt={selected.title} decoding="async" loading="lazy" onError={handleImageError} />
            <div>
              <p className="eyebrow">Featured article</p>
              <h2>{selected.title}</h2>
              <p>{selected.copy}</p>
              <Button onClick={() => onNavigate("contact")}>Discuss a Project</Button>
            </div>
          </Motion.article>
          <Motion.div className="blogList" variants={gridContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {blogs.map((blog, index) => (
              <Motion.button
                key={blog.title}
                className={active === index ? "isActive" : ""}
                onClick={() => setActive(index)}
                aria-pressed={active === index}
                type="button"
                variants={cardItem}
              >
                <img src={blog.image} alt="" decoding="async" loading="lazy" onError={handleImageError} />
                <span>{blog.title}</span>
              </Motion.button>
            ))}
          </Motion.div>
        </div>
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
