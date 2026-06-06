import clsx from "clsx";

import Button from "../Button";

import "./style.css";

export default function Card({
  title,
  price,
  subtitle,
  description,
  features = [],
  variant = "basic",
}) {
  return (
    <article
      className={clsx(
        "ui-card",

        variant === "featured" &&
          "ui-card-featured"
      )}
    >

      {/* TOP */}
      <div className="ui-card-top">

        <span className="ui-card-label">
          {title}
        </span>

        <h3 className="ui-card-price">
          {price}

          <span>
            {subtitle}
          </span>
        </h3>

        {description && (
          <p className="ui-card-description">
            {description}
          </p>
        )}

      </div>

      {/* FEATURES */}
      <ul className="ui-card-features">

        {features.map((item) => (
          <li key={item}>
            {item}
          </li>
        ))}

      </ul>

      {/* BUTTON */}
      <Button
        size="md"

        variant={
          variant === "featured"
            ? "light"
            : "primary"
        }

        fullWidth
      >
        Request Package Quote
      </Button>

    </article>
  );
}
