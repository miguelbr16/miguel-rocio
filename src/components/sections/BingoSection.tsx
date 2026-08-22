"use client";

import Image from "next/image";
import { useRef } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { bingoItems, bingoPhotoPath } from "@/data/bingo";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { countBingoDone, type BingoSaved } from "@/lib/bingo";
import { launchConfetti } from "@/lib/confetti";
import { STORAGE_KEYS } from "@/lib/constants";

export function BingoSection() {
  const { value: saved, save } = useLocalStorage<BingoSaved>(STORAGE_KEYS.bingo, {});
  const winShown = useRef(false);

  function checkWin(next: BingoSaved) {
    const done = countBingoDone(next);
    if (done >= bingoItems.length && !winShown.current) {
      winShown.current = true;
      launchConfetti();
    }
  }

  function upload(idx: number, file: File) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result;
      if (typeof data !== "string") return;
      save((prev) => {
        const next = { ...prev, [idx]: data };
        setTimeout(() => checkWin(next), 300);
        return next;
      });
    };
    reader.readAsDataURL(file);
  }

  const doneCount = countBingoDone(saved);
  const complete = doneCount >= bingoItems.length;

  return (
    <section id="bingo" className="section-wrap">
      <SectionHeader
        label="2025 — 2026"
        title="Bingo de planes"
        description="Los completados tienen foto. Toca los pendientes para subir la vuestra."
      />

      <div className="mb-4 text-center text-xs text-text-light">
        {doneCount} / {bingoItems.length} completados
      </div>

      <div className="bingo-grid">
        {bingoItems.map((item, i) => {
          const uploaded = saved[i];
          const staticPhoto = !uploaded && !item.pending ? bingoPhotoPath(item.photoFile) : undefined;
          const imgSrc = uploaded ?? staticPhoto;
          const isDone = Boolean(imgSrc) || !item.pending;

          return (
            <div
              key={i}
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
            </div>
          );
        })}
      </div>

      {complete ? (
        <div className="mt-6 rounded-2xl border border-rose-deep bg-rose-pale p-6 text-center">
          <div className="text-4xl">🎉</div>
          <p className="mt-2 font-serif text-2xl">¡Bingo completado!</p>
          <p className="mt-1 text-sm text-text-mid">
            {bingoItems.length} planes, {bingoItems.length} recuerdos. Esto es solo el principio. ♥
          </p>
        </div>
      ) : (
        <p className="bingo-footer">&ldquo;365 días y mil planes para hacer contigo.&rdquo;</p>
      )}
    </section>
  );
}
