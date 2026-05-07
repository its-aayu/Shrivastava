import clsx from "clsx";
import Button from "../Button";

export default function Card({
  title,
  price,
  subtitle,
  features = [],
  variant = "basic",
}) {
  return (
    <article className={clsx("price-card", variant === "featured" && "featured")}>
      <p>{title}</p>
      <h3>{price}<span>{subtitle}</span></h3>
      <ul>
        {features.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Button size="sm" variant={variant === "featured" ? "light" : "primary"}>
        Request Package Quote
      </Button>
    </article>
  );
}
