import "./style.css";

export default function Terms({ onNavigate }) {
  return (
    <div className="policyPage">
      <div className="policyPage__hero">
        <p className="eyebrow">VELORA</p>
        <h1>Terms of Service</h1>
        <p>Last updated: July 2026</p>
      </div>

      <div className="policyPage__body">
        <section>
          <h2>1. Acceptance</h2>
          <p>By using the Velora Studio website or placing an order with us, you agree to these Terms of Service. If you do not agree, please do not use our services.</p>
        </section>

        <section>
          <h2>2. Orders &amp; payment</h2>
          <p>All orders are placed via WhatsApp and confirmed by our team. Payment is collected before production begins. Prices are in Indian Rupees (INR) and include applicable GST.</p>
        </section>

        <section>
          <h2>3. Custom printing</h2>
          <p>You are responsible for ensuring you own the rights to any artwork, logo, or design you submit. Velora Studio will not print content that is illegal, defamatory, or infringes third-party intellectual property.</p>
        </section>

        <section>
          <h2>4. Production &amp; delivery</h2>
          <p>Production begins only after artwork approval and payment confirmation. Estimated delivery timelines are communicated at the time of order. Velora Studio is not liable for courier delays beyond its control.</p>
        </section>

        <section>
          <h2>5. Limitation of liability</h2>
          <p>Velora Studio's liability for any order is limited to the order value paid. We are not liable for indirect, incidental, or consequential damages.</p>
        </section>

        <section>
          <h2>6. Governing law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>For questions about these terms, contact us at <strong>hello@velorastudio.in</strong>.</p>
        </section>

        <button className="policyPage__back" type="button" onClick={() => onNavigate("home")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
