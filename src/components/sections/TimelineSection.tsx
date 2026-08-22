"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { timelineEvents, type TimelineEvent } from "@/data/timeline";
import { useLocalStorage } from "@/hooks/useLocalStorage";

function TimelineCard({ item, index }: { item: TimelineEvent; index: number }) {
  const dotClass =
    item.dot === "big"
      ? "tl-dot-big"
      : item.dot === "funny"
        ? "tl-dot-funny"
        : "tl-dot-normal";

  return (
    <motion.article
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="timeline-item"
    >
      <div className={`tl-dot ${dotClass}`} />
      <p className="text-xs uppercase tracking-wide text-text-light">{item.date}</p>
      {item.tag ? (
        <span className={`tl-tag ${item.tagColor === "azul" ? "tl-tag-azul" : "tl-tag-rosa"}`}>
          {item.tag}
        </span>
      ) : null}
      <h3 className="mt-1 font-serif text-xl font-normal text-text">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-mid">{item.text}</p>
      {item.photo ? (
        <div className="relative mt-3 aspect-[4/3] max-w-[280px] overflow-hidden rounded-xl border border-border">
          <Image
            src={item.photo}
            alt={item.title}
            fill
            className="object-cover"
            sizes="280px"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : null}
    </motion.article>
  );
}

export function TimelineSection() {
  const { value: events } = useLocalStorage("timelineData-v2", timelineEvents);

  return (
    <section id="historia" className="section-wrap">
      <SectionHeader
        label="Capítulo uno"
        title={
          <>
            Cómo costó <em className="italic text-rose-deep">lo suyo</em>
          </>
        }
      />
      <div className="timeline">
        {events.map((item, i) => (
          <TimelineCard key={`${item.title}-${i}`} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
