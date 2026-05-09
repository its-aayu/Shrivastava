import { useState } from "react";
import { imageBank } from "../../data/site";
import { ImagePanel, PageHero, QuoteForm, SectionHeader } from "../shared";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        title="Tell us what you want to print. We will shape the production plan."
        copy="Send artwork, ask about materials, request rush production, or start with a loose idea."
        image={imageBank.studio}
      />
      <section className="contactPage">
        <div>
          <SectionHeader eyebrow="Contact" title="Let's make the next print piece feel premium." />
          <QuoteForm onSubmit={() => setSent(true)} />
          {sent && <p className="contactPage__success">Your request is ready. The next step would be a proof and production quote.</p>}
        </div>
        <aside>
          <ImagePanel src={imageBank.map} title="Visit the studio" copy="George Tower, Burn Swiss" />
          <div className="contactDetails">
            <span>+91 546 84272</span>
            <span>aayu.printing@domain.com</span>
            <span>Mon-Sat, 9:00 AM - 7:00 PM</span>
          </div>
        </aside>
      </section>
    </>
  );
}
