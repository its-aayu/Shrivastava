import { useState } from "react";
import Button from "../../components/ui/Button";
import { blogs, imageBank } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { PageHero, PromoBand, SectionHeader } from "../shared";

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
        <SectionHeader align="center" eyebrow="Journal" title="Latest thinking from the Aayu studio." />
        <div className="blogLayout">
          <article className="blogFeatured">
            <img src={selected.image} alt={selected.title} decoding="async" loading="lazy" onError={handleImageError} />
            <div>
              <p className="eyebrow">Featured article</p>
              <h2>{selected.title}</h2>
              <p>{selected.copy}</p>
              <Button onClick={() => onNavigate("contact")}>Discuss a Project</Button>
            </div>
          </article>
          <div className="blogList">
            {blogs.map((blog, index) => (
              <button className={active === index ? "isActive" : ""} key={blog.title} onClick={() => setActive(index)} aria-pressed={active === index} type="button">
                <img src={blog.image} alt="" decoding="async" loading="lazy" onError={handleImageError} />
                <span>{blog.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
