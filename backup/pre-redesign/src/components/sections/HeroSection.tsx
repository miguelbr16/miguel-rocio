"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COUPLE } from "@/lib/constants";
import { countdownParts, daysTogether, nextAnniversary } from "@/lib/dates";
import { useEffect, useState } from "react";

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center min-w-[52px]">
      <div className="font-serif text-3xl font-light text-rose-deep sm:text-4xl">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-text-light">{label}</div>
    </div>
  );
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const days = mounted ? daysTogether(now) : "—";
  const cd = mounted ? countdownParts(nextAnniversary(now), now) : null;

  return (
    <section className="home-page relative flex min-h-[calc(100dvh-4rem-env(safe-area-inset-bottom))] flex-col items-center justify-center px-4 py-8 text-center md:min-h-[calc(100dvh-3.5rem)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-rose/30 blur-3xl" />
        <div className="absolute -right-16 bottom-32 h-80 w-80 rounded-full bg-sky/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative mx-auto mb-6 aspect-[4/5] w-full max-h-[min(52vh,380px)] overflow-hidden rounded-[20px] shadow-[0_8px_32px_rgba(232,137,154,0.28)]">
          <Image
            src="/photos/portada.jpeg"
            alt={`${COUPLE.name1} y ${COUPLE.name2}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 700px) 100vw, 420px"
          />
        </div>

        <h1 className="font-serif text-[clamp(2.25rem,10vw,3.5rem)] font-light leading-none">
          <span className="text-[#111]">{COUPLE.name1}</span>{" "}
          <span className="text-text">&</span>{" "}
          <span className="text-[#e8a6b7]">{COUPLE.name2}</span>
        </h1>

        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-text-light">
          Desde el 18 · 11 · 2025 · {days} días juntos
        </p>

        {cd ? (
          <div className="mt-8 rounded-2xl border border-border bg-white/80 px-4 py-5 backdrop-blur-sm">
            <p className="mb-4 text-[11px] uppercase tracking-[0.12em] text-text-light">
              Próximo aniversario en
            </p>
            <div className="flex items-start justify-center gap-1 sm:gap-2">
              <CountdownUnit value={String(cd.days)} label="días" />
              <span className="mt-1 font-serif text-2xl text-rose">:</span>
              <CountdownUnit value={String(cd.hours).padStart(2, "0")} label="horas" />
              <span className="mt-1 font-serif text-2xl text-rose">:</span>
              <CountdownUnit value={String(cd.minutes).padStart(2, "0")} label="min" />
              <span className="mt-1 font-serif text-2xl text-rose">:</span>
              <CountdownUnit value={String(cd.seconds).padStart(2, "0")} label="seg" />
            </div>
          </div>
        ) : null}

        <Link
          href="/caso-002"
          className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-rose-deep px-5 py-3.5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(232,137,154,0.3)]"
        >
          🔍 Caso 002 — investigación activa
        </Link>
      </motion.div>
    </section>
  );
}
