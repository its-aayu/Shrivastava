export default function Footer({ onNavigate }) {
  const go = (page) => () => onNavigate(page);

  return (
    <footer className="app-footer">
      <div className="footer-top">
        <div>
          <span className="brand-mark">Aayu</span>
          <h2>Print work that feels considered before anyone reads a word.</h2>
        </div>
        <button className="footer-cta" onClick={go("contact")} type="button">
          Start a project
        </button>
      </div>
      <div className="footer-grid">
        <div>
          <h3>Studio</h3>
          <p>Premium digital printing, material guidance, file checking, and finishing for brands that care about detail.</p>
        </div>
        <div>
          <h3>Services</h3>
          <button onClick={go("services")} type="button">Digital Print</button>
          <button onClick={go("services")} type="button">Doc Print</button>
          <button onClick={go("services")} type="button">Shirt Print</button>
          <button onClick={go("services")} type="button">Sticker Print</button>
        </div>
        <div>
          <h3>Links</h3>
          <button onClick={go("about")} type="button">About Us</button>
          <button onClick={go("pricing")} type="button">Pricing</button>
          <button onClick={go("faq")} type="button">FAQ</button>
        </div>
        <div>
          <h3>Contact</h3>
          <p>+91 546 84272</p>
          <p>aayu.printing@domain.com</p>
          <p>George Tower, Burn Swiss</p>
        </div>
        <div>
          <h3>Visit</h3>
          <div className="footer-map" />
        </div>
        <div>
          <h3>Social</h3>
          <div className="social-row">
            <span>f</span>
            <span>i</span>
            <span>x</span>
            <span>in</span>
          </div>
        </div>
      </div>
      <div className="copyright">copyright Aayu 2026 all rights reserved</div>
    </footer>
  );
}
