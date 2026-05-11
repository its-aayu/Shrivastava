import { motion as Motion } from "framer-motion";

import Button from "../../components/ui/Button";
import { galleryItems, imageBank } from "../../data/site";
import { handleImageError } from "../../utils/images";
import { ImagePanel, PromoBand, ReviewSection, SectionHeader, ServiceCards, StatsStrip, TrustStrip } from "../shared";
import "./style.css";

const heroTrustBadges = ["24h Delivery", "500+ Orders", "Premium Finish"];

const heroMetrics = [
  { value: "98%", label: "Satisfaction" },
  { value: "500+", label: "Projects" },
  { value: "4.9", label: "Rating" },
];

const introPoints = [
  {
    icon: "01",
    title: "Design-aware checks",
    copy: "Bleed, trim, color, and finishing reviewed before production.",
  },
  {
    icon: "02",
    title: "Premium material guidance",
    copy: "Paper, stock, lamination, and texture selected around your brand.",
  },
  {
    icon: "03",
    title: "Rush planning",
    copy: "Urgent jobs get a clear proof, print, and delivery path.",
  },
];

const testimonials = [
  {
    name: "Sarah Patel",
    company: "Nova Studio",
    review: "Aayu made our launch kits feel sharper and more considered than anything we had printed before.",
  },
  {
    name: "Arjun Mehta",
    company: "Table Nine",
    review: "Menus, inserts, and labels arrived color-accurate, beautifully finished, and right on schedule.",
  },
  {
    name: "Mira Shah",
    company: "Form & Co.",
    review: "The proofing process was calm and the final cards had the exact premium texture we wanted.",
  },
];

export default function Home({ onNavigate }) {
  return (
    <div className="homePage">
      <section className="homeHero">
        <div className="homeHero__mesh homeHero__mesh--one" />
        <div className="homeHero__mesh homeHero__mesh--two" />
        <div className="homeHero__grain" />
        <Motion.div
          className="homeHero__copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="eyebrow">Aayu Printing Studio</p>
          <h1>
            <span>Beautiful print</span>
            <span>for brands that care</span>
            <span>about every touch.</span>
          </h1>
          <p>
            Premium cards, packaging, apparel, posters, labels, and launch kits produced with sharp color, careful finishing, and calm delivery.
          </p>
          <div className="homeHero__trust" aria-label="Studio highlights">
            {heroTrustBadges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
          <div className="homeHero__ctaGlass">
            <Button onClick={() => onNavigate("contact")}>Request a Quote</Button>
            <Button variant="outlineLight" onClick={() => onNavigate("gallery")}>View Work</Button>
            <span>Proof-first production. No print starts until you approve it.</span>
          </div>
          <div className="homeHero__metrics" aria-label="Aayu Printing performance metrics">
            {heroMetrics.map((metric) => (
              <article key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </Motion.div>
        <Motion.div
          className="heroShowcase"
          aria-label="Featured print work"
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          <img className="heroShowcase__main" src={imageBank.hero} alt="Modern printing press producing paper" decoding="async" loading="eager" onError={handleImageError} />
          <div className="heroShowcase__shine" />
          <div className="heroShowcase__card heroShowcase__card--top">
            <span>CMYK checked</span>
            <strong>Proof-ready files</strong>
          </div>
          <div className="heroShowcase__card heroShowcase__card--bottom">
            <span>24h rush slots</span>
            <strong>Launch without delay</strong>
          </div>
          <img className="heroShowcase__thumb" src={imageBank.cards} alt="Printed brand material" decoding="async" loading="lazy" onError={handleImageError} />
          <div className="heroShowcase__avatars" aria-label="Recent happy clients">
            {["N", "T", "F"].map((avatar) => (
              <span key={avatar}>{avatar}</span>
            ))}
            <strong>Verified brand teams</strong>
          </div>
        </Motion.div>
      </section>
      <TrustStrip />
      <StatsStrip />
      <section className="homeIntro homeSection">
        <ImagePanel src={imageBank.studio} title="Color, texture, finish" copy="Every detail chosen for the way your brand should feel." tall />
        <div>
          <SectionHeader
            eyebrow="Why Aayu"
            title="A print partner for founders, teams, creators, and fast-moving brands."
            copy="We combine file checking, design guidance, material selection, and crisp production so your final prints look thoughtful from the first touch."
          />
          <div className="homeIntro__points">
            {introPoints.map((item) => (
              <article key={item.title}>
                <span>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="homeServices homeSection">
        <SectionHeader
          align="center"
          eyebrow="Services"
          title="Everything your brand needs from one modern print studio."
          copy="From business cards to apparel drops, we keep quality high and timelines calm."
        />
        <ServiceCards onNavigate={onNavigate} />
      </section>
      <section className="homeGallery homeSection">
        <SectionHeader
          eyebrow="Recent work"
          title="Print projects with a tactile, polished finish."
          copy="A quick look at the print categories that usually sell the quality before a conversation starts."
        />
        <div className="homeGallery__grid">
          {galleryItems.slice(0, 5).map((item, index) => (
            <article className={index === 0 ? "isLarge" : ""} key={item.title}>
              <img src={item.image} alt={item.title} decoding="async" loading="lazy" onError={handleImageError} />
              <div>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="homeTestimonials homeSection" aria-label="Client testimonials">
        <SectionHeader
          align="center"
          eyebrow="Client experience"
          title="Trusted by teams who notice the finish."
          copy="Premium print should feel calm before production and impressive after delivery."
        />
        <div className="homeTestimonials__grid">
          {testimonials.map((item) => (
            <article key={item.name}>
              <div className="homeTestimonials__stars" aria-label="5 star rating">5.0 rating</div>
              <p>{item.review}</p>
              <div>
                <span>{item.name.charAt(0)}</span>
                <strong>{item.name}</strong>
                <small>{item.company} - Verified</small>
              </div>
            </article>
          ))}
        </div>
      </section>
      <PromoBand onNavigate={onNavigate} />
      <ReviewSection />
    </div>
  );
}
