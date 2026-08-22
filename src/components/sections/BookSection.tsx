"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { bookPages } from "@/data/book";

export function BookSection() {
  const [page, setPage] = useState(0);
  const current = bookPages[page]!;
  const total = bookPages.length;

  return (
    <section id="libro" className="section-wrap">
      <SectionHeader
        label="Nuestro año"
        title="El libro de nosotros"
        description="Pasa las páginas. Cada capítulo es un trozo de este primer año."
      />

      <div className="book-stage">
        <AnimatePresence mode="wait">
          <motion.article
            key={current.id}
            className="book-page"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <p className="book-chapter">{current.chapter}</p>
            <div className="book-emoji">{current.emoji}</div>
            <h3 className="book-title">{current.title}</h3>
            {current.date ? <p className="book-date">{current.date}</p> : null}
            <p className="book-body">{current.body}</p>
            {current.photo ? (
              <div className="book-photo">
                <Image src={current.photo} alt={current.title} fill className="object-cover" sizes="420px" />
              </div>
            ) : null}
          </motion.article>
        </AnimatePresence>

        <div className="book-controls">
          <Button variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            ← Anterior
          </Button>
          <span className="book-pager">
            {page + 1} / {total}
          </span>
          <Button
            variant="secondary"
            disabled={page === total - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </Button>
        </div>

        <div className="book-dots">
          {bookPages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`book-dot ${i === page ? "book-dot-active" : ""}`}
              onClick={() => setPage(i)}
              aria-label={p.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
