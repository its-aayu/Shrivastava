import "./style.css";

export default function PrivacyPolicy({ onNavigate }) {
  return (
    <div className="policyPage">
      <div className="policyPage__hero">
        <p className="eyebrow">VELORA</p>
        <h1>Privacy Policy</h1>
        <p>Last updated: July 2026</p>
      </div>

      <div className="policyPage__body">
        <section>
          <h2>1. Information we collect</h2>
          <p>When you place an order via WhatsApp or create an account, we collect your name, email address, phone number, and delivery address. We also collect your device and usage information when you browse our website.</p>
        </section>

        <section>
          <h2>2. How we use your information</h2>
          <p>We use your information to fulfil orders, send order updates, and improve our services. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2>3. Data storage</h2>
          <p>Your data is stored on secure servers. We retain order data for up to 3 years for accounting and legal compliance purposes under Indian law.</p>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>We use essential cookies to keep you signed in and to remember your preferences. We do not use third-party advertising cookies.</p>
        </section>

        <section>
          <h2>5. Your rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by writing to us at <strong>hello@velorastudio.in</strong>.</p>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>For privacy-related queries, reach us at <strong>hello@velorastudio.in</strong> or write to: Velora Studio, George Tower, Burn Swiss, India.</p>
        </section>

        <button className="policyPage__back" type="button" onClick={() => onNavigate("home")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
