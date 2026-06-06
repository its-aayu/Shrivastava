import { motion as Motion } from "framer-motion";

/**
 * Scroll-triggered fade-up reveal wrapper.
 * Replaces repeated inline whileInView patterns across all pages.
 */
export default function Reveal({ children, delay = 0, y = 22, duration = 0.55, className }) {
  return (
    <Motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </Motion.div>
  );
}
