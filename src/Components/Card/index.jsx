import clsx from "clsx";
import Button from "../Button";

export default function Card({
  title,
  price,
  subtitle,
  features = [],
  variant = "basic",
}) {
  const baseStyles =
    "w-full max-w-4xl mx-auto rounded-xl border p-8 flex flex-col items-center text-center transition";

  const variants = {
    basic: "bg-white border-black text-slate-800",
    featured: "bg-[#3C3288] border-black text-white shadow-xl",
    premium: "bg-white border-black text-slate-800",
  };

  const titleStyles = {
    basic: "text-slate-500",
    featured: "text-[#FF9247]",
    premium: "text-slate-500",
  };

  return (
    <div className={clsx(baseStyles, variants[variant])}>
      <p className={clsx("text-sm font-semibold mb-2", titleStyles[variant])}>
        {title}
      </p>

      <h2 className="text-4xl font-bold mb-1">{price}</h2>

      <p className="text-sm mb-6 opacity-80">{subtitle}</p>

      <ul className="space-y-3 mb-8 text-sm text-left w-full">
        {features.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-[#FF9247]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Button className="w-full bg-[#FF9247] text-white hover:bg-[#ff7f2a]">
        Choose Now
      </Button>
    </div>
  );
}
