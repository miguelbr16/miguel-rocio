"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden>
      <div className="ambient-mesh" />
      <motion.div
        className="ambient-orb ambient-orb-1"
        animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ambient-orb ambient-orb-2"
        animate={{ x: [0, -25, 35, 0], y: [0, 30, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ambient-orb ambient-orb-3"
        animate={{ x: [0, 20, -30, 0], y: [0, -20, 35, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="ambient-grain" />
      <div className="ambient-stars" />
    </div>
  );
}
