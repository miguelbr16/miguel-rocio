"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { CASO002_UI_ACTIVE, CASO002_OPENS } from "@/lib/constants";
import {
  countdownParts,
  daysTogether,
  formatRelationshipStartDisplay,
  nextAnniversary,
} from "@/lib/dates";

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="countdown-unit text-center">
      <div className="countdown-value">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-text-light">{label}</div>
    </div>
  );
}

export function HeroSection() {
  const { config, relationshipStart } = useSiteConfig();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const days = mounted ? daysTogether(now, relationshipStart) : "—";
  const cd = mounted ? countdownParts(nextAnniversary(now, relationshipStart), now) : null;
  const casoOpensLabel = CASO002_OPENS.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });

  return (
    <section
      id="inicio"
      className="home-page relative flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center px-5 py-10 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="photo-frame relative mx-auto mb-8 aspect-[3/4] w-full max-h-[min(48vh,400px)]">
          <Image
            src="/photos/portada.jpeg"
            alt={`${config.couple.name1} y ${config.couple.name2}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 700px) 100vw, 420px"
          />
        </div>

        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-text-light">
          {config.hero.tagline}
        </p>

        <h1 className="font-serif text-[clamp(2.25rem,10vw,3.25rem)] font-normal leading-tight">
          <span className="text-text">{config.couple.name1}</span>
          <span className="mx-2 text-rose-deep">&</span>
          <span className="text-rose-deep">{config.couple.name2}</span>
        </h1>

        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-text-light">
          {formatRelationshipStartDisplay(relationshipStart)}
          <span className="mx-2">·</span>
          <span className="text-rose-deep">{days}</span> días juntos
        </p>

        {cd ? (
          <div className="countdown-box mt-8 px-4 py-5">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-text-light">
              Próximo aniversario
            </p>
            <div className="flex items-start justify-center gap-1.5">
              <CountdownUnit value={String(cd.days)} label="días" />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={String(cd.hours).padStart(2, "0")} label="horas" />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={String(cd.minutes).padStart(2, "0")} label="min" />
              <span className="countdown-sep">:</span>
              <CountdownUnit value={String(cd.seconds).padStart(2, "0")} label="seg" />
            </div>
          </div>
        ) : null}

        {CASO002_UI_ACTIVE ? (
          <a href="/caso-002" className="btn-primary mt-8 inline-flex min-h-[48px] w-full items-center justify-center gap-2 text-sm">
            🔍 Caso 002 — investigación activa
          </a>
        ) : (
          <div className="mt-8 rounded-xl border border-border bg-white px-4 py-4 text-sm text-text-mid">
            <p className="font-medium text-text">Caso 002 · Próximamente</p>
            <p className="mt-1 text-xs text-text-light">
              La investigación se abre el {casoOpensLabel}. La ruta{" "}
              <code className="text-rose-deep">/caso-002</code> sigue disponible para pruebas.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
