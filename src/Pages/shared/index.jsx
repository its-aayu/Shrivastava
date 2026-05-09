import Button from "../../components/ui/Button";
import { imageBank, services, stats, trustSignals } from "../../data/site";
import { handleImageError } from "../../utils/images";

function SmartImage({ alt, eager = false, ...props }) {
  return (
    <img
      alt={alt}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      onError={handleImageError}
      {...props}
    />
  );
}

export function PageHero({ eyebrow = "Aayu Printing", title, copy, image = imageBank.studio }) {
  return (
    <section className="pageHero">
      <div className="pageHero__media">
        <SmartImage src={image} alt="" eager />
      </div>
      <div className="pageHero__content reveal">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <span>{copy}</span>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, copy, align = "left" }) {
  return (
    <div className={`sectionHeader sectionHeader--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {copy && <span>{copy}</span>}
    </div>
  );
}

export function ImagePanel({ src, title, copy, tall = false }) {
  return (
    <figure className={`imagePanel ${tall ? "imagePanel--tall" : ""}`}>
      <SmartImage src={src} alt={title || ""} />
      {(title || copy) && (
        <figcaption>
          <strong>{title}</strong>
          {copy && <span>{copy}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export function StatsStrip() {
  return (
    <section className="statsStrip" aria-label="Aayu Printing results">
      {stats.map((item) => (
        <article key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </article>
      ))}
    </section>
  );
}

export function TrustStrip() {
  return (
    <section className="trustStrip" aria-label="Why customers trust Aayu Printing">
      {trustSignals.map((signal) => (
        <span key={signal}>{signal}</span>
      ))}
    </section>
  );
}

export function PromoBand({ onNavigate }) {
  return (
    <section className="premiumPromo">
      <div>
        <p className="eyebrow">Limited production slot</p>
        <h2>Get a print-ready brand kit with paper, finish, and delivery planned for you.</h2>
      </div>
      <Button onClick={() => onNavigate?.("contact")}>Request a Quote</Button>
    </section>
  );
}

export function ServiceCards({ onNavigate }) {
  return (
    <div className="serviceShowcase">
      {services.map((service, index) => (
        <article key={service.title} style={{ "--delay": `${index * 90}ms` }}>
          <SmartImage src={service.image} alt={service.title} />
          <div>
            <span>0{index + 1}</span>
            <h3>{service.title}</h3>
            <p>{service.copy}</p>
            <button onClick={() => onNavigate?.("services")} type="button">Explore service</button>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ReviewSection() {
  return (
    <section className="reviewBlock">
      <ImagePanel src={imageBank.cards} title="Premium customer kits" copy="Cards, inserts, stickers, and launch packs." />
      <div>
        <p className="eyebrow">Customer review</p>
        <h2>"Aayu made our launch feel sharper, faster, and more premium than we imagined."</h2>
        <p>
          The team checked every file, suggested the right finish, and delivered a polished print set before our event.
        </p>
        <strong>Sarah Patel, Founder at Nova Studio</strong>
      </div>
    </section>
  );
}

export function QuoteForm({ compact = false, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form className={`quoteForm ${compact ? "quoteForm--compact" : ""}`} onSubmit={handleSubmit}>
      <div className="formField">
        <label htmlFor="quote-name">Name</label>
        <input id="quote-name" name="name" required autoComplete="name" placeholder="Your name" />
      </div>
      <div className="formField">
        <label htmlFor="quote-email">Email address</label>
        <input id="quote-email" name="email" required type="email" autoComplete="email" placeholder="you@example.com" />
        <small>We use this only to reply with your quote.</small>
      </div>
      <div className="formField">
        <label htmlFor="quote-phone">Phone number</label>
        <input id="quote-phone" name="phone" required type="tel" autoComplete="tel" placeholder="+91 98765 43210" />
      </div>
      <div className="formField">
        <label htmlFor="quote-service">Service</label>
        <select id="quote-service" name="service" defaultValue="" required>
          <option value="" disabled>Choose service</option>
          {services.map((service) => <option key={service.title}>{service.title}</option>)}
        </select>
      </div>
      <div className="formField formField--full">
        <label htmlFor="quote-brief">Project details</label>
        <textarea id="quote-brief" name="brief" required placeholder="Quantity, size, paper, deadline, or anything you already know." />
      </div>
      <p className="quoteForm__note">No spam. No production starts until you approve the quote and proof.</p>
      <Button type="submit">Send Quote Request</Button>
    </form>
  );
}
