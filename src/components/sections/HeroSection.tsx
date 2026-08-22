"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { COUPLE } from "@/lib/constants";
import { countdownParts, daysTogether, nextAnniversary } from "@/lib/dates";
import { useEffect, useState } from "react";

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-4xl font-light text-rose-deep sm:text-5xl">{value}</div>
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
    <section
      id="inicio"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 pb-16 pt-24 text-center"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-rose/30 blur-3xl" />
        <div className="absolute -right-16 bottom-32 h-80 w-80 rounded-full bg-sky/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative mx-auto mb-6 aspect-[4/5] max-h-[340px] w-full overflow-hidden rounded-[20px] shadow-[0_8px_32px_rgba(232,137,154,0.25)]">
          <Image
            src="/photos/portada.jpeg"
            alt={`${COUPLE.name1} y ${COUPLE.name2}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 700px) 100vw, 420px"
          />
        </div>

        <p className="mb-4 text-xs uppercase tracking-[0.15em] text-text-light">
          Desde el 18 de noviembre de 2025
        </p>

        <h1 className="font-serif text-[clamp(2.75rem,12vw,5rem)] font-light leading-none">
          <span className="text-[#111]">{COUPLE.name1}</span>{" "}
          <span className="text-text">&</span>{" "}
          <span className="text-[#e8a6b7]">{COUPLE.name2}</span>
        </h1>

        <span className="my-4 block text-3xl text-rose-deep">♥</span>

        <p className="font-serif text-xl italic text-text-mid sm:text-2xl">
          Camino a nuestro primer año
        </p>

        <p className="mt-4 text-sm text-text-light">
          Llevamos juntos{" "}
          <strong className="text-base text-rose-deep">{days}</strong> días
        </p>

        {cd ? (
          <div className="mt-8">
            <p className="mb-3 text-[11px] uppercase tracking-[0.1em] text-text-light">
              Próximo aniversario en
            </p>
            <div className="flex items-start justify-center gap-2 sm:gap-3">
              <CountdownUnit value={String(cd.days)} label="días" />
              <span className="mt-2 font-serif text-3xl text-rose">:</span>
              <CountdownUnit value={String(cd.hours).padStart(2, "0")} label="horas" />
              <span className="mt-2 font-serif text-3xl text-rose">:</span>
              <CountdownUnit value={String(cd.minutes).padStart(2, "0")} label="min" />
              <span className="mt-2 font-serif text-3xl text-rose">:</span>
              <CountdownUnit value={String(cd.seconds).padStart(2, "0")} label="seg" />
            </div>
          </div>
        ) : null}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 text-xs uppercase tracking-[0.2em] text-text-light"
      >
        desliza · nuestra historia ↓
      </motion.p>
    </section>
  );
}
