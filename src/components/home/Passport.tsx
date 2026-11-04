"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Landmark } from "@/components/home/Landmark";
import { nextStops, photosOf, stops } from "@/data/journey";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Page =
  | { kind: "id" }
  | { kind: "stop"; i: number }
  | { kind: "empty"; place: string };

const PAGES: Page[] = [
  { kind: "id" },
  ...stops.map((_, i) => ({ kind: "stop" as const, i })),
  ...nextStops.slice(0, 4).map((place) => ({ kind: "empty" as const, place })),
];

/** El pasaporte: tapa cerrada, se abre y se pasa de página arrastrando o con los botones. */
export function Passport() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  function go(n: number) {
    const next = Math.max(0, Math.min(PAGES.length - 1, n));
    setDir(next >= page ? 1 : -1);
    setPage(next);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) go(page + 1);
    else if (info.offset.x > 60) go(page - 1);
  }

  const current = PAGES[page];

  return (
    <section className="passport-field" id="pasaporte" aria-labelledby="pasaporte-h">
      <div className="passport-copy">
        <h2 id="pasaporte-h" className="field-head">
          Nuestro pasaporte
        </h2>
        <p className="field-lead">
          {stops.length} sellos en un año. Cada viaje deja su tinta; las páginas en blanco son los que nos quedan.
        </p>
        <ul className="passport-index">
          {stops.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                  go(i + 1);
                }}
                className={page === i + 1 && open ? "is-on" : ""}
                style={{ ["--dot" as string]: s.stampInk }}
              >
                {s.place}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="passport-stage">
        <AnimatePresence mode="wait" initial={false}>
          {!open ? (
            <motion.button
              key="cover"
              type="button"
              className="passport-cover"
              onClick={() => setOpen(true)}
              initial={reduced ? false : { rotateY: -70, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { rotateY: -100, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduced ? undefined : { rotate: -1.5, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="passport-cover-top">Pasaporte</span>
              <svg viewBox="0 0 100 100" className="passport-crest" aria-hidden>
                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M50 74S24 58 24 40c0-9 7-15 14-15 6 0 10 4 12 8 2-4 6-8 12-8 7 0 14 6 14 15 0 18-26 34-26 34Z" fill="currentColor" />
              </svg>
              <span className="passport-cover-names">Miguel & Rocío</span>
              <span className="passport-cover-hint">Tócalo para abrirlo</span>
            </motion.button>
          ) : (
            <motion.div
              key="book"
              className="passport-book"
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="passport-pages">
                <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                  <motion.div
                    key={page}
                    className="passport-page"
                    custom={dir}
                    drag={reduced ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.35}
                    onDragEnd={onDragEnd}
                    initial={reduced ? { opacity: 0 } : { rotateY: dir > 0 ? 70 : -70, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { rotateY: dir > 0 ? -70 : 70, opacity: 0 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <PageBody page={current} reduced={reduced} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="passport-controls">
                <button type="button" className="btn-solid btn-quiet" onClick={() => go(page - 1)} disabled={page === 0}>
                  Anterior
                </button>
                <span className="passport-count">
                  {page + 1} de {PAGES.length}
                </span>
                <button
                  type="button"
                  className="btn-solid"
                  onClick={() => (page === PAGES.length - 1 ? (setOpen(false), setPage(0)) : go(page + 1))}
                >
                  {page === PAGES.length - 1 ? "Cerrar" : "Siguiente"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function PageBody({ page, reduced }: { page: Page; reduced: boolean }) {
  if (page.kind === "id") {
    return (
      <div className="pp-id">
        <div className="pp-id-photo">
          <Image src="/photos/portada.jpeg" alt="Miguel y Rocío" fill sizes="(max-width: 700px) 40vw, 180px" className="object-cover object-[center_75%]" />
        </div>
        <dl className="pp-id-data">
          <div>
            <dt>Titulares</dt>
            <dd>Miguel & Rocío</dd>
          </div>
          <div>
            <dt>Expedido</dt>
            <dd>18 · 11 · 2025, Valencia</dd>
          </div>
          <div>
            <dt>Válido hasta</dt>
            <dd>Siempre</dd>
          </div>
          <div>
            <dt>Señas</dt>
            <dd>Dos cobras y un beso</dd>
          </div>
        </dl>
        <p className="pp-mrz" aria-hidden>
          P&lt;ESPMIGUEL&lt;&lt;ROCIO&lt;&lt;&lt;&lt;181125&lt;&lt;&lt;&lt;&lt;&lt;
          <br />
          TE&lt;QUIERO&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;181126&lt;&lt;&lt;
        </p>
      </div>
    );
  }

  if (page.kind === "empty") {
    return (
      <div className="pp-empty">
        <div className="pp-empty-slot">
          <span>{page.place}</span>
        </div>
        <p>Página reservada. El sello lo ponemos juntos.</p>
      </div>
    );
  }

  const s = stops[page.i];
  const photo = photosOf(s)[0];
  return (
    <div className="pp-stop">
      <div className="pp-stop-photo" style={{ background: s.field }}>
        {photo ? (
          <Image src={photo} alt={s.place} fill sizes="(max-width: 700px) 80vw, 340px" className="object-cover" />
        ) : (
          <Landmark id={s.landmark} ink={s.ink} accent={s.stampInk} paper={s.field} className="pp-stop-drawing" />
        )}
      </div>
      <motion.div
        className="stamp stamp-big"
        style={{ color: s.stampInk, borderColor: s.stampInk }}
        initial={reduced ? false : { scale: 2, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: page.i % 2 ? 9 : -8 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 480, damping: 20 }}
      >
        <span className="stamp-place">{s.stamp}</span>
        <span className="stamp-date">{s.when}</span>
      </motion.div>
      <p className="pp-stop-line">{s.line}</p>
    </div>
  );
}
