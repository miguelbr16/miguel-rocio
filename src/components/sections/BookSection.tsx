"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { AnimatePresence, motion, useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { bookPages } from "@/data/book";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type BookPhase = "closed" | "opening" | "open" | "closing";

const flipVariants = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 92 : -92,
    opacity: 0.35,
    zIndex: 2,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    zIndex: 3,
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? -92 : 92,
    opacity: 0.25,
    zIndex: 1,
  }),
};

export function BookSection() {
  const prefersReduced = useReducedMotion();
  const framerReduced = useFramerReducedMotion();
  const reduceMotion = prefersReduced || Boolean(framerReduced);

  const [phase, setPhase] = useState<BookPhase>("closed");
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [flipping, setFlipping] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const current = bookPages[page]!;
  const total = bookPages.length;
  const isCover = current.kind === "cover";
  const isReading = phase === "open" || phase === "opening";

  const openBook = useCallback(() => {
    if (phase !== "closed") return;
    setPage(0);
    setDirection(1);
    if (reduceMotion) {
      setPhase("open");
      return;
    }
    setPhase("opening");
    window.setTimeout(() => setPhase("open"), 700);
  }, [phase, reduceMotion]);

  const closeBook = useCallback(() => {
    if (phase !== "open") return;
    if (reduceMotion) {
      setPhase("closed");
      setPage(0);
      return;
    }
    setPhase("closing");
    window.setTimeout(() => {
      setPhase("closed");
      setPage(0);
    }, 550);
  }, [phase, reduceMotion]);

  const go = useCallback(
    (next: number) => {
      if (phase !== "open" || flipping) return;
      if (next < 0 || next >= total) return;
      setDirection(next > page ? 1 : -1);
      setFlipping(true);
      setPage(next);
      window.setTimeout(() => setFlipping(false), reduceMotion ? 0 : 520);
    },
    [phase, flipping, total, page, reduceMotion],
  );

  useEffect(() => {
    if (phase !== "open") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(page + 1);
      if (e.key === "ArrowLeft") go(page - 1);
      if (e.key === "Escape") closeBook();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, page, go, closeBook]);

  function onTouchStart(e: TouchEvent) {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: TouchEvent) {
    if (touchStartX.current == null || phase !== "open") return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return;
    if (delta < 0) go(page + 1);
    else go(page - 1);
  }

  return (
    <section id="libro" className="section-wrap">
      <SectionHeader
        label="Nuestro año"
        title="El libro de nosotros"
        description="Ábrelo. Pasa las páginas. Dentro está escrito nuestro primer año — y lo que viene."
      />

      <div className="book-shelf">
        <AnimatePresence mode="wait">
          {phase === "closed" || phase === "closing" ? (
            <motion.button
              key="closed-book"
              type="button"
              className="book-closed"
              onClick={openBook}
              initial={phase === "closing" ? { rotateY: -18, scale: 0.96, opacity: 0.7 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0, rotateY: -8, scale: 1 }}
              exit={{ opacity: 0, rotateY: 12, scale: 1.02 }}
              transition={{ duration: reduceMotion ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Abrir el libro de Miguel y Rocío"
            >
              <span className="book-closed-shadow" aria-hidden />
              <span className="book-closed-spine" aria-hidden />
              <span className="book-closed-pages" aria-hidden />
              <span className="book-closed-cover">
                <span className="book-closed-photo">
                  <Image
                    src="/photos/portada.jpeg"
                    alt=""
                    fill
                    className="object-cover object-[center_72%]"
                    sizes="280px"
                    priority
                  />
                  <span className="book-closed-veil" aria-hidden />
                </span>
                <span className="book-closed-copy">
                  <span className="book-closed-kicker">Primer año</span>
                  <span className="book-closed-title">Miguel & Rocío</span>
                  <span className="book-closed-cta">Toca para abrir</span>
                </span>
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="open-book"
              className={`physical-book ${isCover ? "is-cover" : "is-open"} ${phase === "opening" ? "is-opening" : ""}`}
              initial={reduceMotion ? false : { rotateY: -28, scale: 0.94, opacity: 0.75 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="book-spine" aria-hidden />
              <div className="book-edge" aria-hidden />
              <div className="book-stack-hint" aria-hidden />

              <div className="book-flip-stage">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current.id}
                    className={`book-leaf ${isCover ? "book-leaf-cover" : "book-leaf-spread"}`}
                    custom={direction}
                    variants={reduceMotion ? undefined : flipVariants}
                    initial={reduceMotion ? { opacity: 0 } : "enter"}
                    animate={reduceMotion ? { opacity: 1 } : "center"}
                    exit={reduceMotion ? { opacity: 0 } : "exit"}
                    transition={{
                      duration: reduceMotion ? 0.18 : 0.55,
                      ease: [0.4, 0.0, 0.2, 1],
                    }}
                    style={{ transformOrigin: "left center" }}
                  >
                    <div className="book-leaf-shade" aria-hidden />
                    {isCover ? (
                      <div className="book-cover-face">
                        <div className="book-cover-photo">
                          {current.photo ? (
                            <Image
                              src={current.photo}
                              alt={current.title}
                              fill
                              className="object-cover object-[center_72%]"
                              sizes="420px"
                              priority
                            />
                          ) : null}
                          <div className="book-cover-veil" aria-hidden />
                        </div>
                        <div className="book-cover-copy">
                          <p className="book-cover-kicker">Primer año</p>
                          <h3 className="book-cover-title">{current.title}</h3>
                          {current.date ? <p className="book-cover-date">{current.date}</p> : null}
                          <p className="book-cover-body">{current.body}</p>
                          {current.quote ? <p className="book-cover-quote">“{current.quote}”</p> : null}
                          <p className="book-cover-hint">Pasa la página →</p>
                        </div>
                      </div>
                    ) : (
                      <div className="book-spread">
                        <div className="book-spread-text">
                          {current.chapter ? <p className="book-chapter">{current.chapter}</p> : null}
                          {current.emoji ? <div className="book-emoji">{current.emoji}</div> : null}
                          <h3 className="book-title">{current.title}</h3>
                          {current.date ? <p className="book-date">{current.date}</p> : null}
                          <p className="book-body">{current.body}</p>
                          {current.quote ? (
                            <blockquote className="book-quote">“{current.quote}”</blockquote>
                          ) : null}
                        </div>
                        {current.photo ? (
                          <div className="book-spread-photo">
                            <div className="book-photo">
                              <Image
                                src={current.photo}
                                alt={current.photoCaption ?? current.title}
                                fill
                                className="object-cover object-[center_72%]"
                                sizes="320px"
                              />
                            </div>
                            {current.photoCaption ? (
                              <p className="book-photo-caption">{current.photoCaption}</p>
                            ) : null}
                          </div>
                        ) : (
                          <div className="book-spread-ornament" aria-hidden>
                            <span>M</span>
                            <span>&</span>
                            <span>R</span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isReading ? (
          <div className="book-controls">
            <Button variant="secondary" disabled={page === 0 || flipping} onClick={() => go(page - 1)}>
              ← Anterior
            </Button>
            <span className="book-pager">
              {page + 1} / {total}
            </span>
            <Button
              variant="secondary"
              disabled={page === total - 1 || flipping}
              onClick={() => go(page + 1)}
            >
              Siguiente →
            </Button>
          </div>
        ) : (
          <div className="book-controls book-controls-closed">
            <Button onClick={openBook}>Abrir el libro</Button>
          </div>
        )}

        {isReading ? (
          <>
            <div className="book-dots" role="tablist" aria-label="Páginas del libro">
              {bookPages.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={`book-dot ${i === page ? "book-dot-active" : ""}`}
                  onClick={() => go(i)}
                  disabled={flipping}
                  aria-label={p.title}
                  aria-current={i === page ? "page" : undefined}
                />
              ))}
            </div>
            <div className="book-close-row">
              <button type="button" className="book-close-link" onClick={closeBook}>
                Cerrar libro
              </button>
              <p className="book-swipe-hint">Desliza o usa ← →</p>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
