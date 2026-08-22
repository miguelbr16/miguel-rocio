"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { bookPages } from "@/data/book";

export function BookSection() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const current = bookPages[page]!;
  const total = bookPages.length;
  const isCover = current.kind === "cover";

  function go(next: number) {
    if (next < 0 || next >= total) return;
    setDirection(next > page ? 1 : -1);
    setPage(next);
  }

  return (
    <section id="libro" className="section-wrap">
      <SectionHeader
        label="Nuestro año"
        title="El libro de nosotros"
        description="Ábrelo. Dentro hay fotos y frases de este primer año."
      />

      <div className="book-shelf">
        <div className={`physical-book ${isCover ? "is-cover" : "is-open"}`}>
          <div className="book-spine" aria-hidden />
          <div className="book-edge" aria-hidden />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              className={`book-leaf ${isCover ? "book-leaf-cover" : "book-leaf-spread"}`}
              custom={direction}
              initial={{ opacity: 0, rotateY: direction > 0 ? 28 : -28, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: direction > 0 ? -22 : 22, x: direction > 0 ? -30 : 30 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
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

        <div className="book-controls">
          <Button variant="secondary" disabled={page === 0} onClick={() => go(page - 1)}>
            ← Anterior
          </Button>
          <span className="book-pager">
            {page + 1} / {total}
          </span>
          <Button variant="secondary" disabled={page === total - 1} onClick={() => go(page + 1)}>
            Siguiente →
          </Button>
        </div>

        <div className="book-dots">
          {bookPages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`book-dot ${i === page ? "book-dot-active" : ""}`}
              onClick={() => go(i)}
              aria-label={p.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
