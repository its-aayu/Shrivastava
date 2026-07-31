import "./style.css";

const VITE_WA = import.meta.env.VITE_WA_NUMBER || "915468427200";

function IgIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>
  );
}

function FbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function Footer({ onNavigate }) {
  const go = (page) => () => onNavigate(page);

  return (
    <footer className="app-footer">

      <div className="footer-top">
        <div className="footer-heading">
          <h2 className="footer-brand">VELORA</h2>
          <h3 className="footer-title">Custom apparel & gifts, printed just for you.</h3>
          <p className="footer-subtext">
            From personalised tees to gift hampers — everything printed with care and delivered fast across India.
          </p>
        </div>
        <button className="footer-cta" onClick={go("categories")} type="button">
          Shop Now
        </button>
      </div>

      <nav className="footer-grid" aria-label="Footer navigation">

        <div className="footer-column">
          <h4>Shop</h4>
          <button type="button" onClick={go("categories")}>Men</button>
          <button type="button" onClick={go("categories")}>Women</button>
          <button type="button" onClick={go("categories")}>Kids</button>
          <button type="button" onClick={go("gift")}>Gifts</button>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <button type="button" onClick={go("newArrivals")}>New Arrivals</button>
          <button type="button" onClick={go("gift")}>Gift Ideas</button>
          <button type="button" onClick={go("about")}>About Us</button>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <a href={`https://wa.me/${VITE_WA}`} target="_blank" rel="noopener noreferrer" className="footer-contact-link">
            WhatsApp us
          </a>
          <a href="mailto:hello@velorastudio.in" className="footer-contact-link">
            hello@velorastudio.in
          </a>
          <a href={`tel:+${VITE_WA}`} className="footer-contact-link">
            +91 54684 27200
          </a>
        </div>

        <div className="footer-column">
          <h4>Follow us</h4>
          <div className="social-row" aria-label="Social media links">
            <a
              href="https://www.instagram.com/velorastudio"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="VELORA on Instagram"
            >
              <IgIcon />
            </a>
            <a
              href="https://www.facebook.com/velorastudio"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="VELORA on Facebook"
            >
              <FbIcon />
            </a>
            <a
              href="https://x.com/velorastudio"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="VELORA on X (Twitter)"
            >
              <XIcon />
            </a>
          </div>
        </div>

      </nav>

      <div className="footer-bottom">
        <p>&copy; 2026 VELORA. All rights reserved.</p>
        <nav className="footer-legal" aria-label="Legal links">
          <button type="button" onClick={go("privacy")}>Privacy Policy</button>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={go("terms")}>Terms of Service</button>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={go("refundPolicy")}>Returns &amp; Refunds</button>
        </nav>
      </div>

    </footer>
  );
}
