"use client";

import { motion } from "framer-motion";
import { useCoupleSync } from "@/context/CoupleSyncContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { bingoItems } from "@/data/bingo";
import { timelineEvents } from "@/data/timeline";
import { daysTogether } from "@/lib/dates";
import { countBingoDone } from "@/lib/bingo";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useEffect, useState } from "react";

export function StatsSection() {
  const { relationshipStart } = useSiteConfig();
  const { data } = useCoupleSync();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const dests = data.destinations;
  const bingoDone = countBingoDone(
    Object.fromEntries(Object.entries(data.bingo).map(([k, v]) => [Number(k), v])),
  );

  const stats = [
    {
      emoji: "📅",
      value: String(daysTogether(now, relationshipStart)),
      label: "Días juntos",
    },
    {
      emoji: "🗼",
      value: String(dests.filter((d) => d.status === "done").length),
      label: "Destinos visitados",
    },
    {
      emoji: "📸",
      value: `${bingoDone}/${bingoItems.length}`,
      label: "Bingo completado",
    },
    {
      emoji: "💌",
      value: String(timelineEvents.length),
      label: "Momentos en la historia",
    },
  ];

  return (
    <motion.section
      className="stats-strip"
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="stats-grid">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={staggerItem} className="stat-card">
            <span className="stat-emoji">{stat.emoji}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
