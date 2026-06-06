import clsx from "clsx";

import "./style.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}

      disabled={disabled || loading}

      className={clsx(
        "ui-btn",

        `ui-btn-${variant}`,
        `ui-btn-${size}`,

        fullWidth && "ui-btn-full",

        loading && "ui-btn-loading",

        className
      )}

      {...props}
    >

      {icon && (
        <span className="ui-btn-icon">
          {icon}
        </span>
      )}

      <span className="ui-btn-text">
        {loading ? "Loading..." : children}
      </span>

    </button>
  );
}