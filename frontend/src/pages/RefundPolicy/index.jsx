import "./style.css";

export default function RefundPolicy({ onNavigate }) {
  return (
    <div className="policyPage">
      <div className="policyPage__hero">
        <p className="eyebrow">VELORA</p>
        <h1>Return &amp; Refund Policy</h1>
        <p>Last updated: July 2026</p>
      </div>

      <div className="policyPage__body">
        <section>
          <h2>1. Custom-printed items</h2>
          <p>Because all products are made to order and personalised to your specifications, we do not accept returns or exchanges unless the item is defective or we made an error on our end.</p>
        </section>

        <section>
          <h2>2. Defective or incorrect items</h2>
          <p>If you receive a damaged, defective, or incorrectly printed item, please contact us within <strong>48 hours</strong> of delivery with clear photos. We will arrange a replacement or refund at no additional charge.</p>
        </section>

        <section>
          <h2>3. Cancellations</h2>
          <p>Orders can be cancelled <strong>before production starts</strong> for a full refund. Once production has begun, cancellations are not accepted. We notify you before production commences.</p>
        </section>

        <section>
          <h2>4. Refund process</h2>
          <p>Approved refunds are processed within 5–7 business days to the original payment method. Bank processing times may vary.</p>
        </section>

        <section>
          <h2>5. Colour variation</h2>
          <p>Screen colours may differ slightly from the printed output due to monitor calibration. Minor colour variation is not grounds for a return. We share a digital proof before printing to minimise this.</p>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>To raise a return or refund request, contact us at <strong>hello@velorastudio.in</strong> or via WhatsApp within 48 hours of delivery.</p>
        </section>

        <button className="policyPage__back" type="button" onClick={() => onNavigate("home")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
