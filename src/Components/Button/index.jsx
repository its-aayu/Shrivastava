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
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none";

  const variants = {
    primary: "bg-[#FF9247] text-white hover:bg-orange-500",
    outline:
      "bg-transparent border border-[#FF9247] text-[#FF9247] hover:bg-orange-500 hover:text-white",
    ghost:
      "bg-transparent text-[#FF9247] hover:bg-orange-200 hover:text-orange-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-1.5 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const disabledStyles =
    "opacity-50 cursor-not-allowed pointer-events-none";

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
