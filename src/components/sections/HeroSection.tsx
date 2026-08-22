"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COUPLE } from "@/lib/constants";
import {
  countdownParts,
  daysTogether,
  formatRelationshipStartDisplay,
  nextAnniversary,
} from "@/lib/dates";
import { useEffect, useState } from "react";

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="countdown-unit text-center">
      <div className="countdown-value">{value}</div>
      <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-text-light">
        {label}
      </div>
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
      className="home-page relative flex min-h-[calc(100dvh-6rem-env(safe-area-inset-bottom))] flex-col items-center justify-center px-5 py-10 text-center md:min-h-[calc(100dvh-5.5rem)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="photo-frame glow-ring relative mx-auto mb-8 aspect-[3/4] w-full max-h-[min(48vh,400px)] shadow-[0_20px_60px_rgba(232,84,122,0.25)]"
        >
          <Image
            src="/photos/portada.jpeg"
            alt={`${COUPLE.name1} y ${COUPLE.name2}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 700px) 100vw, 420px"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
            Nuestro primer año
          </p>

          <h1 className="font-serif text-[clamp(2.5rem,11vw,4rem)] font-normal leading-[1.05]">
            <span className="text-white">{COUPLE.name1}</span>
            <span className="mx-2 text-rose/60">&</span>
            <span className="bg-gradient-to-r from-rose to-gold bg-clip-text text-transparent">
              {COUPLE.name2}
            </span>
          </h1>

          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-text-light">
            {formatRelationshipStartDisplay()}
            <span className="mx-2 text-rose/40">·</span>
            <span className="text-gold">{days}</span> días juntos
          </p>
        </motion.div>

        {cd ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="countdown-box mt-10 px-5 py-6"
          >
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Próximo aniversario
            </p>
            <div className="flex items-start justify-center gap-1.5 sm:gap-2">
              <CountdownUnit value={String(cd.days)} label="días" />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={String(cd.hours).padStart(2, "0")} label="horas" />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={String(cd.minutes).padStart(2, "0")} label="min" />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={String(cd.seconds).padStart(2, "0")} label="seg" />
            </div>
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Link
            href="/caso-002"
            className="btn-gold mt-8 inline-flex min-h-[52px] w-full items-center justify-center gap-2 text-sm"
          >
            <span>🔍</span>
            Caso 002 — investigación activa
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
