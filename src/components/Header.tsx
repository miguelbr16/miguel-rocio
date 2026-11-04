"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS, type SectionId } from "@/lib/constants";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeaderProps {
  active: SectionId;
  menuOpen: boolean;
  onNavigate: (id: SectionId) => void;
  onMenuToggle: () => void;
}

/** Pocas cosas a la vista; el resto en el menú a pantalla completa. */
const PRIMARY: SectionId[] = ["inicio", "historia", "cartas", "juegos"];

export function Header({ active, menuOpen, onMenuToggle, onNavigate }: HeaderProps) {
  const { initials } = useSiteConfig();
  const reduced = useReducedMotion();
  const primary = NAV_ITEMS.filter((i) => PRIMARY.includes(i.id));

  return (
    <>
      <header className="hdr">
        <div className="hdr-bar">
          <button type="button" className="hdr-brand" onClick={() => onNavigate("inicio")}>
            {initials}
          </button>
          <nav className="hdr-links" aria-label="Principal">
            {primary.map((item) => (
              <button
                key={item.id}
                type="button"
                id={`tab-${item.id}`}
                aria-current={active === item.id ? "page" : undefined}
                onClick={() => onNavigate(item.id)}
                className={`hdr-link ${active === item.id ? "is-on" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button type="button" className="hdr-menu" onClick={onMenuToggle} aria-expanded={menuOpen}>
            Todo
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            className="drawer"
            aria-label="Todo"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="drawer-head">
              <span className="hdr-brand">{initials}</span>
              <button type="button" className="hdr-menu" onClick={onMenuToggle}>
                Cerrar
              </button>
            </div>
            <ul className="drawer-list">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.03, duration: 0.35 }}
                >
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`drawer-item ${active === item.id ? "is-on" : ""}`}
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="drawer-foot">
              <a href="/caso-002">Caso 002</a>
              <Link href="/configurador" onClick={onMenuToggle}>
                Configurador
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
