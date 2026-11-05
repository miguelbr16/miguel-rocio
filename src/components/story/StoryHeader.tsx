"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS, type SectionId } from "@/lib/constants";
import { isMiguel } from "@/lib/miguel";

const LINES: Partial<Record<SectionId, string>> = {
  inicio: "El recorrido de nuestro primer año",
  historia: "Cómo empezó, mensaje a mensaje",
  pasaporte: "Un sello por cada viaje",
  libro: "Nuestro año en capítulos",
  cartas: "Sobres que se abren cuando toca",
  casos: "La Agencia de Inteligencia Sentimental",
  promesas: "Lo que nos prometemos",
  bingo: "Lo que siempre nos pasa",
  juegos: "Quiz y dibujos",
};

/** Cabecera del diseño nuevo: solo texto, sin iconos ni píldoras. */
export function StoryHeader({ active, onNavigate }: { active: SectionId; onNavigate: (id: SectionId) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [miguel, setMiguelState] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    const t = setTimeout(() => setMiguelState(isMiguel()), 0);
    return () => {
      window.removeEventListener("scroll", on);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function go(id: SectionId) {
    setOpen(false);
    onNavigate(id);
  }

  return (
    <>
      <header className={`sh ${scrolled ? "is-scrolled" : ""}`}>
        <button type="button" className="sh-brand" onClick={() => go("inicio")}>
          Miguel <i>&</i> Rocío
        </button>
        <nav className="sh-links" aria-label="Secciones">
          {NAV_ITEMS.map((n) => (
            <button key={n.id} type="button" className={active === n.id ? "is-on" : ""} aria-current={active === n.id ? "page" : undefined} onClick={() => go(n.id)}>
              {n.id === "promesas" ? "Año dos" : n.label}
            </button>
          ))}
        </nav>
        <button type="button" className="sh-menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Cerrar" : "Menú"}
        </button>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.nav
            className="sh-sheet"
            aria-label="Menú"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul>
              {NAV_ITEMS.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.04, duration: 0.4 }}
                >
                  <button type="button" className={active === n.id ? "is-on" : ""} onClick={() => go(n.id)}>
                    <span className="sh-sheet-t">{n.id === "promesas" ? "Año dos" : n.label}</span>
                    <span className="sh-sheet-l">{LINES[n.id]}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            {miguel ? (
              <a className="sh-sheet-admin" href="/configurador">
                Configurador
              </a>
            ) : null}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
