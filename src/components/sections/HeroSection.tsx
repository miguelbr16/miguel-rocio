"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FlipDigit } from "@/components/effects/FlipDigit";
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

  const name1Letters = config.couple.name1.split("");
  const name2Letters = config.couple.name2.split("");

  return (
    <section id="inicio" className="home-page">
      <div className="hero-grid">
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.94, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 md:order-none"
        >
          <div className="photo-frame hero-photo-glow relative mx-auto aspect-[3/4] w-full max-w-md md:max-w-none">
            <Image
              src="/photos/portada.jpeg"
              alt={`${config.couple.name1} y ${config.couple.name2}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
            />
            <div className="hero-photo-shimmer" aria-hidden />
          </div>
        </motion.div>

        <motion.div
          variants={reduced ? undefined : staggerContainer}
          initial={reduced ? false : "initial"}
          animate="animate"
          className="flex flex-col justify-center text-center md:text-left"
        >
          <motion.div variants={reduced ? undefined : staggerItem}>
            <Badge tone="rose">{config.hero.tagline}</Badge>
          </motion.div>

          <h1 className="mt-5 font-serif text-[clamp(2.5rem,9vw,3.5rem)] font-normal leading-[1.08] tracking-tight">
            <span className="hero-name-line">
              {name1Letters.map((char, i) => (
                <motion.span
                  key={`n1-${i}`}
                  initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.15 + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-text"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            <motion.span
              initial={reduced ? false : { opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="mx-2 inline-block text-rose-deep"
            >
              &
            </motion.span>
            <span className="hero-name-line">
              {name2Letters.map((char, i) => (
                <motion.span
                  key={`n2-${i}`}
                  initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.55 + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-rose-deep"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.div variants={reduced ? undefined : staggerItem} className="hero-meta md:justify-start">
            <span>{formatRelationshipStartDisplay(relationshipStart)}</span>
            <span className="hero-meta-dot">·</span>
            <span>
              <strong className="text-rose-deep">{days}</strong> días juntos
            </span>
          </motion.div>

          {cd ? (
            <motion.div variants={reduced ? undefined : staggerItem}>
              <Card variant="soft" padding="lg" className="mt-8 hero-countdown-glow">
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
            </motion.div>
          ) : null}

          <motion.div variants={reduced ? undefined : staggerItem}>
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
        </motion.div>
      </div>

      <StatsSection />
    </section>
  );
}
