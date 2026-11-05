"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StoryPage } from "@/components/story/StoryPage";
import { CartaModalBody, isCartaUnlocked } from "@/components/sections/CartasSection";
import { cartas, type Carta } from "@/data/cartas";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function state(c: Carta) {
  if (c.type === "open") return "Ábrela cuando quieras";
  if (c.type === "locked") return isCartaUnlocked(c) ? "Ya puedes abrirla" : `Se abre el ${c.lockDate}`;
  return "Con contraseña";
}

/** Cartas como sobres de verdad con su lacre. */
export function CartasStory() {
  const [active, setActive] = useState<Carta | null>(null);
  const { config } = useSiteConfig();
  const reduced = useReducedMotion();
  const { cartaIntro } = config;

  return (
    <StoryPage id="cartas" kicker="Cartas" title={<>Lo que se dice <em>mejor por escrito</em></>} lead="Cada sobre se abre cuando toca. Algunos ya, otros el día que llegue.">
      <div className="ct-layout">
        <article className="ct-letter">
          <p className="ct-letter-hi">{cartaIntro.saludo}</p>
          {cartaIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="ct-letter-sign">{cartaIntro.firma}</p>
        </article>
        <ul className="ct-grid">
          {cartas.map((c, i) => {
            const locked = c.type !== "open" && !(c.type === "locked" && isCartaUnlocked(c));
            return (
              <motion.li
                key={c.titulo}
                initial={reduced ? false : { opacity: 0, y: 30, rotate: i % 2 ? 3 : -3 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.2 : -1.2 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <button type="button" className={`ct-env ${locked ? "is-locked" : ""} ${c.blur ? "is-blur" : ""}`} onClick={() => setActive(c)}>
                  <span className="ct-flap" aria-hidden />
                  <span className="ct-seal" aria-hidden>
                    M&R
                  </span>
                  <span className="ct-to">Para Rocío</span>
                  <span className="ct-title">{c.titulo}</span>
                  <span className="ct-state">{state(c)}</span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <AnimatePresence>{active ? <CartaModalBody key={active.titulo} carta={active} onClose={() => setActive(null)} /> : null}</AnimatePresence>
    </StoryPage>
  );
}
