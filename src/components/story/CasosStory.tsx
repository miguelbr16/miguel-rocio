"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { StoryPage } from "@/components/story/StoryPage";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Los dos expedientes como carpetas de verdad. */
export function CasosStory() {
  const reduced = useReducedMotion();
  const files = [
    {
      href: "/expediente/",
      n: "001",
      title: "Cómo empezó todo",
      line: "La multa, el cruasán, las cobras y París. Se cerró el 15 de mayo con flores y una carta.",
      stamp: "Cerrado · 15 may",
      closed: true,
    },
    {
      href: "/caso-002",
      n: "002",
      title: "El primer año",
      line: "Todo lo que vino después. Se juega entero el 18 de noviembre y, al resolverlo, se abre todo.",
      stamp: "Se abre el 18 nov",
      closed: false,
    },
  ];
  return (
    <StoryPage id="casos" kicker="Casos" title={<>Agencia de <em>Inteligencia Sentimental</em></>} lead="Dos expedientes sobre la misma historia.">
      <div className="cs-grid">
        {files.map((f, i) => (
          <motion.div
            key={f.n}
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={f.href} className={`cs-folder ${f.closed ? "is-closed" : "is-open"}`}>
              <span className="cs-tab">Caso Nº {f.n}</span>
              <span className="cs-paper" aria-hidden />
              <span className="cs-inner">
                <span className="cs-n">{f.n}</span>
                <span className="cs-title">{f.title}</span>
                <span className="cs-line">{f.line}</span>
                <span className="cs-cta">{f.closed ? "Releer el expediente" : "Ver el expediente"}</span>
              </span>
              <span className="cs-stamp">{f.stamp}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </StoryPage>
  );
}
