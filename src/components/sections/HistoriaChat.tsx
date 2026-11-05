"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { timelineEvents, type TimelineEvent } from "@/data/timeline";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Mensaje que primero enseña «escribiendo…» y luego aparece. */
function Bubble({ side, children, delay = 0, reaction }: { side: "me" | "you"; children: React.ReactNode; delay?: number; reaction?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });
  const reduced = useReducedMotion();
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setTyping(false), reduced ? 0 : 650 + delay);
    return () => clearTimeout(t);
  }, [seen, reduced, delay]);

  return (
    <div ref={ref} className={`hc-row hc-${side}`}>
      <AnimatePresence mode="wait" initial={false}>
        {!seen || typing ? (
          <motion.div key="typing" className="hc-typing" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: seen ? 1 : 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
            <i />
            <i />
            <i />
          </motion.div>
        ) : (
          <motion.div
            key="msg"
            className="hc-bubble"
            initial={reduced ? false : { opacity: 0, y: 14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            {children}
            {reaction ? <span className="hc-reaction">{reaction}</span> : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Gran momento: tarjeta en el centro con corazones que salen. */
function Moment({ item }: { item: TimelineEvent }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const reduced = useReducedMotion();
  return (
    <div ref={ref} className="hc-moment-wrap">
      <motion.div
        className="hc-moment"
        initial={reduced ? false : { opacity: 0, scale: 0.85, y: 30 }}
        animate={seen ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {seen && !reduced ? (
          <span className="hc-burst" aria-hidden>
            {Array.from({ length: 12 }, (_, i) => (
              <motion.i
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                animate={{
                  opacity: 0,
                  x: Math.cos((i / 12) * Math.PI * 2) * 140,
                  y: Math.sin((i / 12) * Math.PI * 2) * 110,
                  scale: 1.2,
                }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.15 }}
              >
                ♥
              </motion.i>
            ))}
          </span>
        ) : null}
        <p className="hc-moment-date">{item.date}</p>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
        {item.photo ? (
          <div className="hc-moment-photo">
            <Image
              src={item.photo}
              alt={item.title}
              fill
              sizes="320px"
              className="object-cover"
              onError={(e) => ((e.target as HTMLImageElement).parentElement!.style.display = "none")}
            />
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}

/** «Cómo empezó» contado como una conversación de Instagram. */
export function HistoriaChat() {
  const { value: events } = useLocalStorage<TimelineEvent[]>(STORAGE_KEYS.timeline, timelineEvents);

  return (
    <section className="hc" id="historia">
      <div className="hc-phone">
        <header className="hc-head">
          <div className="hc-avatars" aria-hidden>
            <span>M</span>
            <span>R</span>
          </div>
          <div>
            <p className="hc-name">Miguel & Rocío</p>
            <p className="hc-status">Empezó con un mensaje · agosto de 2025</p>
          </div>
        </header>

        <div className="hc-body">
          <p className="hc-intro">Así empezó todo. Ve bajando: los mensajes van llegando.</p>
          {events.map((e, i) =>
            e.dot === "big" ? (
              <Moment key={e.title + i} item={e} />
            ) : (
              <div key={e.title + i} className="hc-block">
                <p className="hc-sep">{e.date}</p>
                <Bubble side="me">{e.title}</Bubble>
                <Bubble side="you" delay={250} reaction={e.tag}>
                  {e.text}
                </Bubble>
              </div>
            ),
          )}
          <div className="hc-end">
            <p className="hc-seen">Visto ✓✓</p>
            <div className="hc-composer">
              <span>Y seguimos escribiendo…</span>
              <b aria-hidden>♥</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
