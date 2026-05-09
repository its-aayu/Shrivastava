import Card from "../../components/ui/Card";
import { imageBank, pricingPlans } from "../../data/site";
import { PageHero, PromoBand, SectionHeader } from "../shared";

export default function Pricing({ onNavigate }) {
  return (
    <>
      <PageHero
        title="Transparent packages for beautiful print outcomes."
        copy="Start with a package, then customize paper, quantity, finish, and delivery around your exact project."
        image={imageBank.packaging}
      />
      <section className="pricingPage">
        <SectionHeader align="center" eyebrow="Pricing" title="Choose a print package and make it yours." />
        <div className="pricingCards">
          {pricingPlans.map((plan) => <Card key={plan.title} {...plan} />)}
        </div>
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
