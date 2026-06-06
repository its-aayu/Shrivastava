import clsx from "clsx";

import "./style.css";

export default function Input({
  label,
  error,
  className = "",
  id,
  name,
  ...props
}) {
  const inputId = id ?? name;

  return (
    <div className="ui-input-group">

      {label && (
        <label className="ui-input-label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        className={clsx(
          "ui-input",
          error && "ui-input-error",
          className
        )}

        {...props}
      />

      {error && (
        <span className="ui-input-error-text">
          {error}
        </span>
      )}

    </div>
  );
}
