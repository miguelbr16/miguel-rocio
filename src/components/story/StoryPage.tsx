"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Marco de cada pestaña en el diseño nuevo: cabecera editorial y contenido ancho. */
export function StoryPage({
  id,
  kicker,
  title,
  lead,
  children,
}: {
  id: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <section id={id} className="sp">
      <motion.header
        className="sp-head"
        initial={reduced ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="sp-kicker">{kicker}</p>
        <h1 className="sp-title">{title}</h1>
        {lead ? <p className="sp-lead">{lead}</p> : null}
      </motion.header>
      <div className="sp-body">{children}</div>
    </section>
  );
}
