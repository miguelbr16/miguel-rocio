"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { resetCase } from "@/data/caso002";
import { STORAGE_KEYS } from "@/lib/constants";
import { setMiguel } from "@/lib/miguel";

/** Barra solo para Miguel: probar y ver todo antes de tiempo. */
export function MiguelBar() {
  const [open, setOpen] = useState(false);

  function capsule() {
    sessionStorage.setItem(STORAGE_KEYS.capsulePreview, "1");
    window.location.href = "/#inicio";
    window.location.reload();
  }

  return (
    <div className="mbar">
      <AnimatePresence>
        {open ? (
          <motion.div
            className="mbar-panel"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="mbar-title">Modo Miguel</p>
            <p className="mbar-text">Ves todo abierto: cartas, cápsula y caso. Rocío no ve esto.</p>
            <button
              type="button"
              onClick={() => {
                resetCase();
                window.location.href = "/caso-002";
              }}
            >
              Probar el Caso 002 desde el principio
            </button>
            <button type="button" onClick={capsule}>
              Ver la cápsula abierta
            </button>
            <a href="#cartas">Leer todas las cartas</a>
            <Link href="/configurador">Editar caso, gran noche y textos</Link>
            <button
              type="button"
              className="mbar-exit"
              onClick={() => {
                setMiguel(false);
                sessionStorage.removeItem(STORAGE_KEYS.capsulePreview);
                window.location.reload();
              }}
            >
              Salir del modo Miguel
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button type="button" className="mbar-pill" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Cerrar" : "Modo Miguel"}
      </button>
    </div>
  );
}
