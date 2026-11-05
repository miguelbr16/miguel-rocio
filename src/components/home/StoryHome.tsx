"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ParticleStory, type Chapter, type ShapeSpec } from "@/components/three/ParticleStory";
import { MemoryTunnel, type Memory } from "@/components/three/MemoryTunnel";
import { TripsGlobe } from "@/components/home/TripsGlobe";
import { Editable } from "@/components/edit/Editable";
import { photosOf } from "@/data/journey";
import { timelineEvents } from "@/data/timeline";
import { defaultPromises } from "@/data/promises";
import { cartas } from "@/data/cartas";
import { capsuleContent } from "@/data/capsule";
import { useTrips, useText } from "@/lib/shared-store";
import { isMiguel } from "@/lib/miguel";
import { launchConfetti } from "@/lib/confetti";
import { ANNIVERSARY_DATE, RELATIONSHIP_START } from "@/lib/constants";
import { countdownParts, daysTogether } from "@/lib/dates";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const CHAPTERS = ["Portada", "Antes del beso", "18 · 11", "Viajes", "Recuerdos", "Año dos", "El regalo"];

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return now;
}

function ChapterHead({ n, kicker, title, lead }: { n: number; kicker: string; title: ReactNode; lead?: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="ch-kicker">
        <b>{n}</b> Capítulo {n} · {kicker}
      </p>
      <h2 className="ch-title">{title}</h2>
      {lead ? <div className="ch-lead">{lead}</div> : null}
    </motion.header>
  );
}

/** Barra de abajo: en qué capítulo vas. */
function ChapterBar() {
  const [cur, setCur] = useState(0);
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-ch]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCur(Number(e.target.getAttribute("data-ch")));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => setHidden(window.scrollY < window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return (
    <div className={`chbar ${hidden ? "is-hidden" : ""}`} aria-hidden>
      <span>
        {cur > 0 ? `Capítulo ${cur} · ` : ""}
        {CHAPTERS[cur]}
      </span>
      <ol>
        {CHAPTERS.map((c, i) => (
          <li key={c} className={i < cur ? "is-done" : i === cur ? "is-on" : ""} />
        ))}
      </ol>
    </div>
  );
}

function Intro() {
  const now = useNow();
  const reduced = useReducedMotion();
  const days = now ? daysTogether(now, RELATIONSHIP_START) : null;
  const cd = now ? countdownParts(ANNIVERSARY_DATE, now) : null;
  const after = now != null && now >= ANNIVERSARY_DATE;
  return (
    <section className="intro" data-ch={0}>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <Editable k="story.hi" as="p" className="intro-hi">
          Rocío,
        </Editable>
        <h1 className="intro-title">
          esto es nuestro <em>primer año</em>
        </h1>
        <Editable k="story.intro" as="p" className="ch-lead">
          Te he preparado un pequeño viaje. Ve bajando despacio: hay seis capítulos y al final te espera algo.
        </Editable>
        <div className="intro-meta">
          <div>
            <b>{days ?? "—"}</b>
            <span>días juntos</span>
          </div>
          {!after && cd ? (
            <div>
              <b>
                {cd.days}d {String(cd.hours).padStart(2, "0")}:{String(cd.minutes).padStart(2, "0")}
              </b>
              <span>para el 18 de noviembre</span>
            </div>
          ) : (
            <div>
              <b>1 año</b>
              <span>desde el 18·11·2025</span>
            </div>
          )}
        </div>
        <a href="#ch-1" className="ch-next">
          Empezar <span aria-hidden>↓</span>
        </a>
      </motion.div>
      <motion.div
        className="intro-photo"
        initial={reduced ? false : { opacity: 0, rotate: 10, y: 60 }}
        animate={{ opacity: 1, rotate: 3, y: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="intro-photo-back" />
        <div className="intro-photo-frame">
          <div className="img">
            <Image src="/photos/portada.jpeg" alt="Miguel y Rocío en París" fill priority sizes="(max-width: 860px) 74vw, 440px" className="object-cover object-[center_75%]" />
          </div>
          <p className="intro-photo-cap">París, abril de 2026</p>
        </div>
      </motion.div>
    </section>
  );
}

/** Capítulo 1: la historia antes del beso, en una tira que avanza de lado al bajar. */
function BeforeTheKiss() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const events = timelineEvents.slice(0, 9);

  useEffect(() => {
    let raf = 0;
    function frame() {
      raf = 0;
      const w = wrap.current;
      const t = track.current;
      if (!w || !t) return;
      const r = w.getBoundingClientRect();
      const total = w.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, total)));
      const max = Math.max(0, t.scrollWidth - window.innerWidth);
      t.style.transform = `translate3d(${-p * max}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="ch-1" className="strip" data-ch={1} ref={wrap} style={{ height: `${events.length * 45 + 60}svh` }}>
      <div className="strip-stage">
        <div className="strip-head">
          <ChapterHead n={1} kicker="Antes del beso" title={<>No te lo puse <em>fácil</em></>} />
        </div>
        <div className="strip-track" ref={track}>
          {events.map((e, i) => (
            <article key={e.title + i} className={`strip-card ${e.dot === "big" ? "is-big" : ""}`}>
              <span className="strip-tape" aria-hidden />
              <p className="strip-date">{e.date}</p>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </article>
          ))}
        </div>
        <div className="strip-bar">
          <i ref={bar} />
        </div>
      </div>
    </section>
  );
}

function GiftButton() {
  const now = useNow();
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const reduced = useReducedMotion();
  const ready = now != null && (now >= ANNIVERSARY_DATE || isMiguel());
  const letter = cartas.find((c) => c.titulo === "Un año juntos");
  const body = useText(`carta.Un año juntos.content`, letter?.content ?? "");
  const sign = useText(`carta.Un año juntos.firma`, letter?.firma ?? "Miguel");

  function reveal() {
    setFlash(true);
    if (!reduced) {
      launchConfetti(120);
      setTimeout(() => launchConfetti(80), 700);
    }
    setTimeout(() => setOpen(true), reduced ? 0 : 450);
    setTimeout(() => setFlash(false), 1300);
  }

  if (!now) return null;
  if (!ready) {
    const c = countdownParts(ANNIVERSARY_DATE, now);
    return (
      <div className="gift-locked">
        <p>Tu regalo se abre el 18 de noviembre.</p>
        <b>
          {c.days}d {String(c.hours).padStart(2, "0")}:{String(c.minutes).padStart(2, "0")}:{String(c.seconds).padStart(2, "0")}
        </b>
      </div>
    );
  }

  return (
    <>
      <button type="button" className="gift-cta" onClick={reveal}>
        Abrir mi regalo
      </button>
      {createPortal(
        <>
      <AnimatePresence>
        {flash ? (
          <motion.div
            className="gift-flash"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {open ? (
          <motion.div className="gift-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true">
            <div className="gift-inner">
              <motion.h2 initial={reduced ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9 }}>
                Feliz primer año, Rocío
              </motion.h2>
              <p className="gift-sub">Primero el vídeo. Después, la carta.</p>
              <div className="gift-video">
                <video src={capsuleContent.videoSrc} poster={capsuleContent.videoPoster} controls playsInline>
                  El vídeo del año.
                </video>
              </div>
              <motion.div
                className="gift-letter"
                initial={reduced ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
              >
                {body}
                <p className="sign">{sign}</p>
              </motion.div>
              <div className="gift-close">
                <button type="button" className="btn btn-primary btn-lg" onClick={() => setOpen(false)}>
                  Seguir explorando nuestra web
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
        </>,
        document.body,
      )}
    </>
  );
}

/** Inicio como recorrido: seis capítulos que acaban en el regalo. */
export function StoryHome() {
  const trips = useTrips();
  const done = trips.filter((t) => !t.upcoming);
  const next = trips.find((t) => t.upcoming);

  const kissShapes: ShapeSpec[] = useMemo(
    () => [{ kind: "heart", scale: 1.05 }, { kind: "text", label: "M & R" }, { kind: "text", label: "18·11·25", width: 4.8 }],
    [],
  );
  const kissChapters: Chapter[] = [
    { kicker: "Capítulo 2 · 18 de noviembre de 2025", title: "Y entonces, el beso", line: "Antes de despedirnos, en la puerta. Desde ahí empieza a contar todo." },
    { kicker: "Capítulo 2 · Los protagonistas", title: "Miguel & Rocío", line: "Dos cobras después, por fin nosotros." },
    { kicker: "Capítulo 2 · La fecha", title: "18 · 11 · 25", line: "La clave de esta web. Y de casi todo." },
  ];
  const finalShapes: ShapeSpec[] = useMemo(() => [{ kind: "text", label: "Te quiero", width: 4.6 }, { kind: "heart", scale: 1.25 }], []);
  const finalChapters: Chapter[] = [
    { kicker: "Capítulo 6 · El final", title: "Te quiero", line: "Un año después, más que el primer día." },
    { kicker: "Capítulo 6 · El regalo", title: "Esto es para ti", line: "Lo he guardado hasta hoy." },
  ];
  const memories: Memory[] = useMemo(
    () =>
      trips.map((t) => ({
        id: t.id,
        place: t.place,
        when: t.when,
        photo: photosOf(t.album)[0] ?? (t.id === "paris" ? "/photos/portada.jpeg" : undefined),
      })),
    [trips],
  );

  return (
    <div className="story-home">
      <ChapterBar />
      <Intro />
      <BeforeTheKiss />

      <div data-ch={2}>
        <ParticleStory id="ch-2" chapters={kissChapters} shapes={kissShapes} heightPerChapter={100} />
      </div>

      <div data-ch={3}>
        <div className="story-wrap ch-head">
          <ChapterHead
            n={3}
            kicker="Viajes"
            title={
              <>
                {done.length} sellos <em>desde Valencia</em>
              </>
            }
            lead={<>Baja despacio: el coche o el avión sale de casa hacia cada sitio.{next ? ` Y el siguiente: ${next.place}.` : ""}</>}
          />
        </div>
        <TripsGlobe />
      </div>

      <div data-ch={4}>
        <div className="story-wrap ch-head">
          <ChapterHead n={4} kicker="Recuerdos" title={<>Lo que nos <em>llevamos</em></>} lead="Una foto por viaje. Avanza entre ellas." />
        </div>
        <MemoryTunnel memories={memories} />
      </div>

      <section className="year2" data-ch={5}>
        <div className="story-wrap">
          <ChapterHead n={5} kicker="Año dos" title={<>Lo que nos <em>prometemos</em></>} />
          <div className="year2-grid">
            <ol className="year2-list">
              {defaultPromises.map((p, i) => (
                <li key={p.id}>
                  <span>{i + 1}</span>
                  <Editable k={`promesa.${p.id}`}>{p.text}</Editable>
                </li>
              ))}
            </ol>
            {next ? (
              <aside className="year2-next">
                <small>Próximo sello</small>
                <h3>{next.place}</h3>
                <p>{next.when}. {next.line}</p>
              </aside>
            ) : null}
          </div>
        </div>
      </section>

      <div data-ch={6}>
        <ParticleStory id="ch-6" chapters={finalChapters} shapes={finalShapes} extras={{ 1: <GiftButton /> }} heightPerChapter={110} />
      </div>
    </div>
  );
}
