"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FlipDigitProps {
  value: string;
  className?: string;
}

export function FlipDigit({ value, className = "" }: FlipDigitProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span className={`flip-digit-wrap ${className}`.trim()}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="flip-digit"
          initial={{ y: 14, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -14, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
