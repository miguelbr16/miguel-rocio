"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
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
      <div className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-text-light">
        {label}
      </div>
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
    <section id="inicio" className="home-page">
      <div className="hero-grid">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 md:order-none"
        >
          <div className="photo-frame relative mx-auto aspect-[3/4] w-full max-w-md md:max-w-none">
            <Image
              src="/photos/portada.jpeg"
              alt={`${config.couple.name1} y ${config.couple.name2}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="flex flex-col justify-center text-center md:text-left"
        >
          <Badge tone="rose">{config.hero.tagline}</Badge>

          <h1 className="mt-5 font-serif text-[clamp(2.5rem,9vw,3.5rem)] font-normal leading-[1.08] tracking-tight">
            {config.couple.name1}
            <span className="mx-2 text-rose-deep">&</span>
            <span className="text-rose-deep">{config.couple.name2}</span>
          </h1>

          <div className="hero-meta md:justify-start">
            <span>{formatRelationshipStartDisplay(relationshipStart)}</span>
            <span className="hero-meta-dot">·</span>
            <span>
              <strong className="text-rose-deep">{days}</strong> días juntos
            </span>
          </div>

          {cd ? (
            <Card variant="soft" padding="lg" className="mt-8">
              <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-text-light md:text-left">
                Próximo aniversario
              </p>
              <div className="flex items-start justify-center gap-2 md:justify-start">
                <CountdownUnit value={String(cd.days)} label="días" />
                <span className="countdown-sep">:</span>
                <CountdownUnit value={String(cd.hours).padStart(2, "0")} label="horas" />
                <span className="countdown-sep">:</span>
                <CountdownUnit value={String(cd.minutes).padStart(2, "0")} label="min" />
                <span className="countdown-sep">:</span>
                <CountdownUnit value={String(cd.seconds).padStart(2, "0")} label="seg" />
              </div>
            </Card>
          ) : null}

          {CASO002_UI_ACTIVE ? (
            <Link
              href="/caso-002"
              className="btn btn-primary btn-lg mt-8 inline-flex w-full md:w-auto"
            >
              Caso 002 — investigación activa
            </Link>
          ) : (
            <Card variant="outline" padding="md" className="mt-8 border-dashed">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-text">Caso 002 · Próximamente</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-mid">
                    La investigación se abre el {casoOpensLabel}. La ruta{" "}
                    <code className="rounded bg-cream px-1 py-0.5 text-rose-deep">/caso-002</code>{" "}
                    sigue abierta para pruebas.
                  </p>
                </div>
                <Badge tone="neutral">8 nov 2026</Badge>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  );
}
