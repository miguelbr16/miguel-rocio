"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Heart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export function FloatingHearts({ count = 14 }: { count?: number }) {
  const reduced = useReducedMotion();

  const hearts = useMemo<Heart[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 4 + Math.random() * 92,
      delay: Math.random() * 8,
      duration: 14 + Math.random() * 12,
      size: 10 + Math.random() * 14,
      opacity: 0.12 + Math.random() * 0.22,
    }));
  }, [count]);

  if (reduced) return null;

  return (
    <div className="floating-hearts" aria-hidden>
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.x}%`,
            fontSize: h.size,
            opacity: h.opacity,
          }}
          initial={{ y: "105vh", rotate: 0 }}
          animate={{ y: "-10vh", rotate: [0, 12, -8, 0] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}
