import { motion as Motion } from "framer-motion";
import Card from "../../components/ui/Card";
import { imageBank, pricingPlans } from "../../data/site";
import { cardItem, gridContainer } from "../../animations/motion";
import { PageHero, PromoBand, SectionHeader } from "../shared";
import "./style.css";

export default function Pricing({ onNavigate }) {
  return (
    <>
      <PageHero
        title="Transparent packages for beautiful print outcomes."
        copy="Start with a package, then customize paper, quantity, finish, and delivery around your exact project."
        image={imageBank.packaging}
      />
      <section className="pricingPage">
        <Motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeader align="center" eyebrow="Pricing" title="Choose a print package and make it yours." />
        </Motion.div>
        <Motion.div
          className="pricingCards"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {pricingPlans.map((plan) => (
            <Motion.div key={plan.title} variants={cardItem}>
              <Card {...plan} />
            </Motion.div>
          ))}
        </Motion.div>
      </section>
      <PromoBand onNavigate={onNavigate} />
    </>
  );
}
