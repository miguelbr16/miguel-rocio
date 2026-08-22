"use client";

import { motion } from "framer-motion";
import { daysTogether } from "@/lib/dates";
import { bingoItems } from "@/data/bingo";
import { timelineEvents } from "@/data/timeline";
import { destinations } from "@/data/destinations";

const stats = [
  {
    emoji: "📅",
    value: () => daysTogether(),
    suffix: "",
    label: "Días juntos",
  },
  {
    emoji: "🗼",
    value: () => destinations.filter((d) => d.status === "done").length,
    suffix: "",
    label: "Destinos visitados",
  },
  {
    emoji: "📸",
    value: () => bingoItems.filter((b) => !b.pending).length,
    suffix: ` / ${bingoItems.length}`,
    label: "Planes del bingo",
  },
  {
    emoji: "💌",
    value: () => timelineEvents.length,
    suffix: "",
    label: "Momentos en la historia",
  },
];

export function StatsSection() {
  return (
    <section className="border-y border-border bg-white/60 px-6 py-10">
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-cream p-4 text-center"
          >
            <div className="text-2xl">{stat.emoji}</div>
            <div className="mt-2 font-serif text-3xl font-light text-rose-deep">
              {stat.value()}
              {stat.suffix}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-text-light">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
