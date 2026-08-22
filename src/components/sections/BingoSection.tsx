"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SyncBadge } from "@/components/SyncBadge";
import { bingoItems, bingoPhotoPath } from "@/data/bingo";
import { useCoupleSync } from "@/context/CoupleSyncContext";
import { countBingoDone } from "@/lib/bingo";
import { launchConfetti } from "@/lib/confetti";

export function BingoSection() {
  const { data, saveBingo } = useCoupleSync();
  const saved = Object.fromEntries(
    Object.entries(data.bingo).map(([k, v]) => [Number(k), v]),
  ) as Record<number, string>;
  const [flashIdx, setFlashIdx] = useState<number | null>(null);
  const winShown = useRef(false);

  function flashCell(idx: number) {
    setFlashIdx(idx);
    setTimeout(() => setFlashIdx(null), 600);
  }

  function checkWin(next: Record<number, string>) {
    const done = countBingoDone(next);
    if (done >= bingoItems.length && !winShown.current) {
      winShown.current = true;
      launchConfetti();
    }
  }

  function upload(idx: number, file: File) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = ev.target?.result;
      if (typeof img !== "string") return;
      const next = { ...saved, [idx]: img };
      saveBingo(next);
      flashCell(idx);
      setTimeout(() => checkWin(next), 300);
    };
    reader.readAsDataURL(file);
  }

  const doneCount = countBingoDone(saved);
  const complete = doneCount >= bingoItems.length;
  const progressPct = Math.round((doneCount / bingoItems.length) * 100);

  return (
    <section id="bingo" className="section-wrap">
      <SectionHeader
        label="2025 — 2026"
        title="Bingo de planes"
        description="Sube fotos de cada plan cumplido — se sincronizan para los dos."
        action={<SyncBadge />}
      />

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-text-mid">
          <span>
            {doneCount} / {bingoItems.length} completados
          </span>
          <Badge tone={complete ? "success" : "rose"}>{progressPct}%</Badge>
        </div>
        <div className="bingo-progress">
          <div className="bingo-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="bingo-grid">
        {bingoItems.map((item, i) => {
          const uploaded = saved[i];
          const staticPhoto = !uploaded && !item.pending ? bingoPhotoPath(item.photoFile) : undefined;
          const imgSrc = uploaded ?? staticPhoto;
          const isDone = Boolean(imgSrc) || !item.pending;

          return (
            <motion.div
              key={i}
              layout
              animate={
                flashIdx === i
                  ? { scale: [1, 1.08, 1], boxShadow: "0 0 0 3px rgba(201, 107, 136, 0.5)" }
                  : { scale: 1, boxShadow: "0 0 0 0px transparent" }
              }
              transition={{ duration: 0.45 }}
              className={`bingo-cell ${isDone ? (imgSrc ? "bingo-done-photo" : "bingo-done-empty") : "bingo-pending"}`}
            >
              {imgSrc ? (
                <>
                  <Image
                    src={imgSrc}
                    alt={item.label}
                    fill
                    className="object-cover"
                    sizes="120px"
                    unoptimized={imgSrc.startsWith("data:")}
                  />
                  <div className="bingo-overlay">{item.label}</div>
                </>
              ) : (
                <>
                  <div className="text-2xl">{item.icon}</div>
                  <div className="bingo-label">{item.label}</div>
                  {!item.pending ? <div className="bingo-add">+ foto</div> : null}
                </>
              )}
              {!item.pending || imgSrc ? (
                <label className="bingo-file-label">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) upload(i, f);
                    }}
                  />
                </label>
              ) : null}
            </motion.div>
          );
        })}
      </div>

      {complete ? (
        <Card variant="elevated" padding="lg" className="mt-8 border-rose-deep/20 bg-rose-muted text-center">
          <div className="text-4xl">🎉</div>
          <p className="mt-3 font-serif text-2xl text-text">¡Bingo completado!</p>
          <p className="mt-2 text-sm text-text-mid">
            {bingoItems.length} planes, {bingoItems.length} recuerdos. Esto es solo el principio. ♥
          </p>
        </Card>
      ) : (
        <p className="bingo-footer">&ldquo;365 días y mil planes para hacer contigo.&rdquo;</p>
      )}
    </section>
  );
}
