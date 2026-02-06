import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline:
      "border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white",
    ghost: "text-indigo-600 hover:bg-indigo-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-lg",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && disabledStyles,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
