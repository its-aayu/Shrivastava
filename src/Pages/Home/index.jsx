import Button from "../../components/ui/Button";
import { galleryItems, imageBank } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { ImagePanel, PromoBand, ReviewSection, SectionHeader, ServiceCards, StatsStrip, TrustStrip } from "../shared";

export default function Home({ onNavigate }) {
  return (
    <>
      <section className="homeHero">
        <div className="homeHero__glow" />
        <div className="homeHero__copy reveal">
          <p className="eyebrow">Aayu Printing Studio</p>
          <h1>Beautiful print for brands that care about every touch.</h1>
          <p>
            Premium cards, packaging, apparel, posters, labels, and launch kits produced with sharp color, careful finishing, and calm delivery.
          </p>
          <div className="homeHero__actions">
            <Button onClick={() => onNavigate("contact")}>Request a Quote</Button>
            <Button variant="outlineLight" onClick={() => onNavigate("gallery")}>View Work</Button>
          </div>
        </div>
        <div className="heroShowcase" aria-label="Featured print work">
          <img className="heroShowcase__main" src={imageBank.hero} alt="Modern printing press producing paper" decoding="async" loading="eager" onError={handleImageError} />
          <div className="heroShowcase__card heroShowcase__card--top">
            <span>CMYK checked</span>
            <strong>Proof-ready files</strong>
          </div>
          <div className="heroShowcase__card heroShowcase__card--bottom">
            <span>24h rush slots</span>
            <strong>Launch without delay</strong>
          </div>
          <img className="heroShowcase__thumb" src={imageBank.cards} alt="Printed brand material" decoding="async" loading="lazy" onError={handleImageError} />
        </div>
      </section>
      <TrustStrip />
      <StatsStrip />
      <section className="homeIntro">
        <ImagePanel src={imageBank.studio} title="Color, texture, finish" copy="Every detail chosen for the way your brand should feel." />
        <div>
          <SectionHeader
            eyebrow="Why Aayu"
            title="A print partner for founders, teams, creators, and fast-moving brands."
            copy="We combine file checking, design guidance, material selection, and crisp production so your final prints look thoughtful from the first touch."
          />
          <div className="homeIntro__points">
            {["Design-aware file checks", "Premium material guidance", "Same-day rush planning"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="homeServices">
        <SectionHeader
          align="center"
          eyebrow="Services"
          title="Everything your brand needs from one modern print studio."
          copy="From business cards to apparel drops, we keep quality high and timelines calm."
        />
        <ServiceCards onNavigate={onNavigate} />
      </section>
      <section className="homeGallery">
        <SectionHeader eyebrow="Recent work" title="Print projects with a tactile, polished finish." />
        <div className="homeGallery__grid">
          {galleryItems.slice(0, 3).map((item) => (
            <ImagePanel key={item.title} src={item.image} title={item.title} copy={item.category} />
          ))}
        </div>
      </section>
      <PromoBand onNavigate={onNavigate} />
      <ReviewSection />
    </>
  );
}
