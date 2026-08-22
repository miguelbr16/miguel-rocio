"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FlipDigit } from "@/components/effects/FlipDigit";
import { CapsuleCard } from "@/components/CapsuleCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatsSection } from "@/components/sections/StatsSection";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { CASO002_UI_ACTIVE, CASO002_OPENS } from "@/lib/constants";
import {
  countdownParts,
  daysTogether,
  formatRelationshipStartDisplay,
  nextAnniversary,
} from "@/lib/dates";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="countdown-unit text-center">
      <div className="countdown-value">
        <FlipDigit value={value} />
      </div>
      <div className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-text-light">
        {label}
      </div>
    </div>
  );
}

export function HeroSection() {
  const { config, relationshipStart } = useSiteConfig();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const days = mounted ? String(daysTogether(now, relationshipStart)) : "—";
  const cd = mounted ? countdownParts(nextAnniversary(now, relationshipStart), now) : null;
  const casoOpensLabel = CASO002_OPENS.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });

  const name1 = config.couple.name1;
  const name2 = config.couple.name2;

  function go(section: string) {
    window.location.hash = section;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  return (
    <section id="inicio" className="home-page home-page-cinematic">
      <div className="hero-cinematic">
        <div className="hero-cinematic-media">
          <Image
            src="/photos/portada.jpeg"
            alt={`${name1} y ${name2}`}
            fill
            priority
            className="object-cover object-[center_78%]"
            sizes="100vw"
          />
          <div className="hero-cinematic-scrim" aria-hidden />
        </div>

        <motion.div
          className="hero-cinematic-content"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hero-cinematic-kicker">{config.hero.tagline}</p>
          <h1 className="hero-cinematic-title">
            {name1} <span>&</span> {name2}
          </h1>
          <p className="hero-cinematic-meta">
            {formatRelationshipStartDisplay(relationshipStart)}
            <span>·</span>
            <strong>{days}</strong> días juntos
          </p>

          {cd ? (
            <div className="hero-cinematic-countdown">
              <p className="hero-countdown-label">Próximo aniversario</p>
              <div className="hero-countdown-row">
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

          <div className="hero-cinematic-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                document.getElementById("capsula-home")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Ver la cápsula
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => go("libro")}>
              Abrir el libro
            </button>
          </div>
        </motion.div>
      </div>

      <div className="hero-mobile-stack">
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="photo-frame hero-photo-glow relative mx-auto aspect-[3/4] w-full max-w-md"
        >
          <Image
            src="/photos/portada.jpeg"
            alt={`${name1} y ${name2}`}
            fill
            priority
            className="object-cover object-[center_72%]"
            sizes="100vw"
          />
        </motion.div>

        <motion.div
          variants={reduced ? undefined : staggerContainer}
          initial={reduced ? false : "initial"}
          animate="animate"
          className="mt-8 text-center"
        >
          <motion.div variants={reduced ? undefined : staggerItem}>
            <Badge tone="rose">{config.hero.tagline}</Badge>
          </motion.div>
          <h1 className="hero-title mt-4 font-serif">
            {name1} <span className="text-rose-deep">&</span> {name2}
          </h1>
          <motion.p variants={reduced ? undefined : staggerItem} className="hero-meta justify-center">
            {formatRelationshipStartDisplay(relationshipStart)}
            <span className="hero-meta-dot">·</span>
            <span>
              <strong className="text-rose-deep">{days}</strong> días juntos
            </span>
          </motion.p>

          {cd ? (
            <motion.div variants={reduced ? undefined : staggerItem}>
              <Card variant="soft" padding="lg" className="mt-6">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-light">
                  Próximo aniversario
                </p>
                <div className="flex items-start justify-center gap-2">
                  <CountdownUnit value={String(cd.days)} label="días" />
                  <span className="countdown-sep">:</span>
                  <CountdownUnit value={String(cd.hours).padStart(2, "0")} label="horas" />
                  <span className="countdown-sep">:</span>
                  <CountdownUnit value={String(cd.minutes).padStart(2, "0")} label="min" />
                  <span className="countdown-sep">:</span>
                  <CountdownUnit value={String(cd.seconds).padStart(2, "0")} label="seg" />
                </div>
              </Card>
            </motion.div>
          ) : null}
        </motion.div>
      </div>

      <div className="home-below-hero">
        <StatsSection />

        <div id="capsula-home" className="mt-10">
          <CapsuleCard />
        </div>

        <div className="mt-8">
          {CASO002_UI_ACTIVE ? (
            <a href="/caso-002" className="btn btn-primary btn-lg inline-flex w-full sm:w-auto">
              Caso 002 — investigación activa
            </a>
          ) : (
            <Card variant="outline" padding="md" className="border-dashed">
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
        </div>
      </div>
    </section>
  );
}
