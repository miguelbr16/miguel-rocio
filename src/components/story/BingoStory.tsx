"use client";

/* eslint-disable @next/next/no-img-element -- fotos subidas como data URL */
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StoryPage } from "@/components/story/StoryPage";
import { bingoItems, bingoPhotoPath } from "@/data/bingo";
import { useCoupleSync } from "@/context/CoupleSyncContext";
import { compressImage, PHOTO_ERROR } from "@/lib/passport";
import { launchConfetti } from "@/lib/confetti";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SIZE = 5;

function lines(done: boolean[]) {
  const out: number[][] = [];
  for (let r = 0; r < SIZE; r++) out.push(Array.from({ length: SIZE }, (_, c) => r * SIZE + c));
  for (let c = 0; c < SIZE; c++) out.push(Array.from({ length: SIZE }, (_, r) => r * SIZE + c));
  out.push(Array.from({ length: SIZE }, (_, i) => i * SIZE + i));
  out.push(Array.from({ length: SIZE }, (_, i) => i * SIZE + (SIZE - 1 - i)));
  return out.filter((l) => l.every((i) => done[i]));
}

/** El bingo como un cartón de papel: tinta rosa en lo cumplido y foto si la hay. */
export function BingoStory() {
  const reduced = useReducedMotion();
  const { data, saveBingo } = useCoupleSync();
  const saved = useMemo(
    () => Object.fromEntries(Object.entries(data.bingo).map(([k, v]) => [Number(k), v])) as Record<number, string>,
    [data.bingo],
  );
  const [shout, setShout] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const target = useRef<number | null>(null);

  const cells = bingoItems.slice(0, SIZE * SIZE).map((item, i) => {
    const photo = saved[i] ?? (!item.pending ? bingoPhotoPath(item.photoFile) : undefined);
    return { item, i, photo, done: Boolean(saved[i]) || !item.pending };
  });
  const done = cells.map((c) => c.done);
  const count = done.filter(Boolean).length;
  const full = lines(done);
  const inLine = new Set(full.flat());
  const photos = cells.filter((c) => c.photo).map((c) => c);

  function pick(i: number) {
    target.current = i;
    fileRef.current?.click();
  }

  async function onFile(f: File | undefined) {
    const i = target.current;
    if (!f || i == null) return;
    let url: string;
    try {
      url = await compressImage(f);
    } catch {
      window.alert(PHOTO_ERROR);
      return;
    }
    const before = lines(done).length;
    const next = { ...saved, [i]: url };
    saveBingo(next);
    const nowDone = cells.map((c) => c.done || c.i === i);
    const after = lines(nowDone).length;
    if (nowDone.every(Boolean)) {
      setShout("¡Bingo!");
      if (!reduced) launchConfetti(140);
    } else if (after > before) {
      setShout("¡Línea!");
      if (!reduced) launchConfetti(60);
    }
    setTimeout(() => setShout(null), 1800);
  }

  return (
    <StoryPage
      id="bingo"
      kicker="Bingo"
      title={
        <>
          Lo que siempre <em>nos pasa</em>
        </>
      }
      lead="Cada casilla es un plan. Cuando lo hacemos, se marca; si le subimos foto, se queda en el cartón."
    >
      <div className="bg-layout">
        <div className="bg-card">
          <div className="bg-card-head">
            <span>Cartón Nº 18·11</span>
            <span>Miguel & Rocío</span>
          </div>
          <div className="bg-grid">
            {cells.map(({ item, i, photo, done: d }) => (
              <motion.button
                key={i}
                type="button"
                className={`bg-cell ${d ? "is-done" : ""} ${inLine.has(i) ? "is-line" : ""} ${photo ? "has-photo" : ""}`}
                onClick={() => (photo ? setOpen(i) : pick(i))}
                whileTap={{ scale: 0.95 }}
              >
                {photo ? <img src={photo} alt={item.label} loading="lazy" /> : null}
                {d && !photo ? (
                  <motion.span
                    className="bg-dab"
                    initial={reduced ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14, delay: (i % 5) * 0.04 }}
                    aria-hidden
                  />
                ) : null}
                <span className="bg-label">{item.label}</span>
              </motion.button>
            ))}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.heic,.heif"
            hidden
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        <aside className="bg-side">
          <p className="bg-count">
            <b>{count}</b> de {cells.length}
          </p>
          <p className="bg-sub">
            {full.length === 0
              ? "Aún sin línea. Toca una casilla para subir su foto."
              : `${full.length} ${full.length === 1 ? "línea completa" : "líneas completas"}.`}
          </p>
          <div className="bg-bar">
            <i style={{ width: `${(count / cells.length) * 100}%` }} />
          </div>
          {photos.length ? (
            <div className="bg-strip">
              {photos.slice(0, 6).map((c) => (
                <button key={c.i} type="button" onClick={() => setOpen(c.i)} className="bg-thumb">
                  <img src={c.photo} alt={c.item.label} loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
          <p className="bg-quote">«365 días y mil planes para hacer contigo.»</p>
        </aside>
      </div>

      <AnimatePresence>
        {shout ? (
          <motion.div
            className="bg-shout"
            initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: -6 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 16 }}
          >
            {shout}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open != null && cells[open]?.photo ? (
          <motion.div className="bg-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.figure initial={{ scale: 0.9, rotate: -3 }} animate={{ scale: 1, rotate: -1 }} onClick={(e) => e.stopPropagation()}>
              <img src={cells[open].photo} alt={cells[open].item.label} />
              <figcaption>{cells[open].item.label}</figcaption>
              <button type="button" className="bg-change" onClick={() => pick(open)}>
                Cambiar foto
              </button>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </StoryPage>
  );
}
