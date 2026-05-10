import "./style.css";

export default function Footer({ onNavigate }) {
  const go = (page) => () => onNavigate(page);

  return (
    <footer className="app-footer">

      {/* TOP CTA SECTION */}
      <div className="footer-top">

        <div className="footer-heading">

          <h2 className="footer-brand">
            Aayu
          </h2>

          <h3 className="footer-title">
            Print work that feels considered
            before anyone reads a word.
          </h3>

          <p className="footer-subtext">
            Premium printing for brands that care about aesthetics,
            detail, and presentation.
          </p>

        </div>

        <button
          className="footer-cta"
          onClick={go("contact")}
          type="button"
        >
          Start a Project
        </button>

      </div>

      {/* FOOTER GRID */}
      <div className="footer-grid">

        {/* STUDIO */}
        <div className="footer-column">
          <h4>Studio</h4>

          <p>
            Premium digital printing,
            packaging, stickers,
            merchandise, and brand visuals.
          </p>
        </div>

        {/* SERVICES */}
        <div className="footer-column">
          <h4>Services</h4>

          <button onClick={go("services")}>
            Digital Print
          </button>

          <button onClick={go("services")}>
            Doc Print
          </button>

          <button onClick={go("services")}>
            Shirt Print
          </button>

          <button onClick={go("services")}>
            Sticker Print
          </button>
        </div>

        {/* LINKS */}
        <div className="footer-column">
          <h4>Links</h4>

          <button onClick={go("about")}>
            About
          </button>

          <button onClick={go("pricing")}>
            Pricing
          </button>

          <button onClick={go("faq")}>
            FAQ
          </button>
        </div>

        {/* CONTACT */}
        <div className="footer-column">
          <h4>Contact</h4>

          <p>+91 546 84272</p>
          <p>aayu.printing@domain.com</p>
          <p>George Tower, Burn Swiss</p>
        </div>

        {/* SOCIAL */}
        <div className="footer-column">
          <h4>Social</h4>

          <div className="social-row">

            <span>f</span>
            <span>i</span>
            <span>x</span>
            <span>in</span>

          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          &copy; 2026 Aayu. All rights reserved.
        </p>

      </div>

    </footer>
  );
}
