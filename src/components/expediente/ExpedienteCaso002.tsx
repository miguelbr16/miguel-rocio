"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { launchConfetti } from "@/lib/confetti";
import {
  caso002Days,
  getCaso002Progress,
  getUnlockedDayIndex,
  isFinaleRevealed,
  setCaso002Progress,
  type Caso002Day,
} from "@/data/caso002";
import { sorpresaConfig } from "@/data/sorpresa-config";

type Screen = "intro" | "wait" | "clue" | "evidence" | "finale";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function checkAnswer(day: Caso002Day, input: string): boolean {
  if (day.mode !== "q" || !day.keys) return false;
  const n = normalize(input);
  return day.keys.some((k) => n.includes(normalize(k)));
}

function CountdownTo({ date }: { date: Date }) {
  const [left, setLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = date.getTime() - Date.now();
      if (diff <= 0) {
        setLeft("¡Ya!");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setLeft(`${d}d ${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [date]);

  return <span>{left}</span>;
}

function FinaleReveal() {
  const { cena, flores, extra, cartaFisica } = sorpresaConfig;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <div className="text-center">
        <div className="text-5xl">🥂</div>
        <h2 className="mt-4 font-serif text-3xl text-[#f5e6d3]">Feliz primer año</h2>
        <p className="mt-2 text-sm text-[#a89080]">Agente Ro, misión cumplida.</p>
      </div>

      <div className="exp-card">
        <div className="exp-card-stamp">🍽️ CENA</div>
        <h3 className="font-serif text-xl text-[#f5e6d3]">{cena.titulo}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#c4b5a5]">
          <strong className="text-[#e8d5a3]">{cena.restaurante}</strong>
          <br />
          {cena.hora} · {cena.direccion}
        </p>
        <p className="mt-2 text-xs italic text-[#a89080]">{cena.nota}</p>
      </div>

      <div className="exp-card">
        <div className="exp-card-stamp">🌹 FLORES</div>
        <h3 className="font-serif text-xl text-[#f5e6d3]">{flores.titulo}</h3>
        <p className="mt-2 text-sm text-[#c4b5a5]">{flores.mensaje}</p>
        <p className="mt-1 text-xs text-[#e8d5a3]">{flores.detalle}</p>
      </div>

      <div className="exp-card border-[#e8d5a3]/30">
        <div className="exp-card-stamp">{extra.emoji} SORPRESA</div>
        <h3 className="font-serif text-xl text-[#f5e6d3]">{extra.titulo}</h3>
        <p className="mt-2 text-sm text-[#c4b5a5]">{extra.mensaje}</p>
        <p className="mt-2 text-xs italic text-[#e8d5a3]">{extra.hint}</p>
      </div>

      <div className="exp-card">
        <div className="exp-card-stamp">💌 CARTA</div>
        <p className="text-sm text-[#c4b5a5]">{cartaFisica.mensaje}</p>
      </div>

      <Link
        href="/#cartas"
        className="block w-full rounded-xl bg-[#c8607a] py-4 text-center text-sm font-medium text-white"
      >
        Abrir carta del año en la web 💌
      </Link>
    </motion.div>
  );
}

export function ExpedienteCaso002() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [dayIndex, setDayIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [retoTaps, setRetoTaps] = useState(0);
  const [mounted, setMounted] = useState(false);

  const maxUnlocked = useMemo(() => (mounted ? getUnlockedDayIndex() : -1), [mounted]);
  const day = caso002Days[dayIndex];
  const finaleReady = mounted && isFinaleRevealed();

  useEffect(() => {
    setMounted(true);
    const saved = getCaso002Progress();
    const unlocked = getUnlockedDayIndex();
    const start = saved >= 0 ? Math.min(saved, unlocked) : 0;
    if (unlocked < 0) {
      setScreen("wait");
    } else if (unlocked >= caso002Days.length - 1 && saved >= caso002Days.length - 1 && finaleReady) {
      setScreen("finale");
      setDayIndex(caso002Days.length - 1);
    } else {
      setDayIndex(Math.max(0, start <= unlocked ? start : unlocked));
      setScreen(saved >= 0 ? "clue" : "intro");
    }
  }, [finaleReady]);

  const completeDay = useCallback(() => {
    launchConfetti(40);
    setCaso002Progress(dayIndex);
    if (dayIndex >= caso002Days.length - 1) {
      if (isFinaleRevealed()) {
        setScreen("finale");
      } else {
        setScreen("evidence");
      }
    } else {
      setScreen("evidence");
    }
  }, [dayIndex]);

  function submitAnswer() {
    if (!day) return;
    if (day.mode === "q") {
      if (checkAnswer(day, answer)) {
        setError("");
        completeDay();
      } else {
        setError("Respuesta incorrecta. Piensa en vuestra historia.");
        setAnswer("");
      }
    }
  }

  function handleRetoTap() {
    const next = retoTaps + 1;
    setRetoTaps(next);
    if (next >= 3) {
      setRetoTaps(0);
      completeDay();
    }
  }

  function nextDay() {
    const unlocked = getUnlockedDayIndex();
    const next = dayIndex + 1;
    if (next > unlocked) {
      setScreen("wait");
      return;
    }
    setDayIndex(next);
    setCaso002Progress(next - 1);
    setAnswer("");
    setError("");
    setRetoTaps(0);
    setScreen("clue");
  }

  if (!mounted) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#0a0a0a] text-[#c8607a]">
        Cargando expediente…
      </div>
    );
  }

  const firstUnlock = caso002Days[0]?.unlockDate;

  return (
    <div className="exp-root min-h-[100dvh] pb-[env(safe-area-inset-bottom)]">
      <header className="exp-header sticky top-0 z-40 flex items-center justify-between px-4 py-3">
        <Link href="/#casos" className="text-xs tracking-wider text-[#e8d5a3]/80">
          ← Volver
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c8607a]">
          Caso 002 · Año 1
        </span>
        <span className="text-[10px] text-[#666]">
          {maxUnlocked >= 0 ? `${Math.min(dayIndex + 1, maxUnlocked + 1)}/${caso002Days.length}` : "—"}
        </span>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        <AnimatePresence mode="wait">
          {screen === "wait" && firstUnlock ? (
            <motion.div
              key="wait"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 text-center"
            >
              <div className="text-5xl">🔒</div>
              <h1 className="mt-6 font-serif text-3xl text-[#f5e6d3]">Expediente en preparación</h1>
              <p className="mt-4 text-sm leading-relaxed text-[#a89080]">
                El Caso 002 se abre el <strong className="text-[#e8d5a3]">8 de noviembre</strong>.
                <br />
                Hasta entonces, M sigue preparando algo especial.
              </p>
              <p className="mt-8 font-serif text-2xl text-[#c8607a]">
                <CountdownTo date={firstUnlock} />
              </p>
              <Link href="/" className="mt-10 inline-block text-sm text-[#e8d5a3] underline">
                Volver a la web
              </Link>
            </motion.div>
          ) : null}

          {screen === "intro" ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8607a]">
                Agencia de Inteligencia Sentimental
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-[#f5e6d3]">
                Caso 002
                <br />
                <span className="italic text-[#c8607a]">El primer año</span>
              </h1>
              <p className="mt-6 text-sm leading-relaxed text-[#a89080]">
                Agente Ro, el <strong className="text-[#e8d5a3]">Caso 001</strong> contó vuestra
                historia entera (multa, París, llaves…) y se cerró el{" "}
                <strong className="text-[#e8d5a3]">15 de mayo</strong> con flores y carta.
                <br />
                <br />
                Este es otro expediente: lo que pasó{" "}
                <em>después de aquel cierre</em> hasta hoy.
                <br />
                <br />
                Una pista al día · gran noche el 18 nov.
              </p>
              <button
                type="button"
                onClick={() => setScreen("clue")}
                className="mt-10 w-full max-w-xs rounded-xl bg-[#c8607a] py-4 text-sm font-medium text-white"
              >
                Aceptar misión 🔍
              </button>
            </motion.div>
          ) : null}

          {screen === "clue" && day ? (
            <motion.div
              key={`clue-${dayIndex}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="pb-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{day.icon}</span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#c8607a]">{day.dia}</p>
                  <p className="text-xs text-[#666]">{day.tipo}</p>
                </div>
              </div>

              <div className="exp-briefing whitespace-pre-line">{day.txt}</div>

              {day.mode === "q" ? (
                <div className="mt-6">
                  <input
                    type="text"
                    value={answer}
                    placeholder="Tu respuesta…"
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                    className="exp-input w-full"
                    autoComplete="off"
                  />
                  {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
                  <button type="button" onClick={submitAnswer} className="exp-btn mt-4 w-full">
                    Verificar respuesta
                  </button>
                </div>
              ) : null}

              {day.mode === "reto" ? (
                <div className="mt-6">
                  <p className="rounded-lg border border-[#c8607a]/30 bg-[#c8607a]/10 p-4 text-sm text-[#e8d5a3]">
                    {day.reto}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetoTap}
                    className="mt-6 flex w-full flex-col items-center gap-2"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c8607a] bg-[#1a1014] text-2xl">
                      🛡️
                    </span>
                    <span className="text-xs text-[#666]">
                      Sello agencia · {retoTaps}/3 toques
                    </span>
                  </button>
                </div>
              ) : null}

              {day.mode === "final" ? (
                <button type="button" onClick={completeDay} className="exp-btn mt-6 w-full">
                  {finaleReady ? "Ver lo que M ha preparado 🥂" : "Cerrar el caso"}
                </button>
              ) : null}
            </motion.div>
          ) : null}

          {screen === "evidence" && day ? (
            <motion.div
              key={`ev-${dayIndex}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pb-8"
            >
              <p className="text-center font-serif text-xl italic text-[#c8607a]">{day.unlock}</p>

              <div className="exp-card mt-8">
                <div className="exp-card-stamp">{day.evidence.stamp}</div>
                <h3 className="font-serif text-lg text-[#f5e6d3]">{day.evidence.title}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-[#c4b5a5]">
                  {day.evidence.lines.map((line) => (
                    <li key={line}>· {line}</li>
                  ))}
                </ul>
                {day.evidence.photo ? (
                  <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-lg border border-[#333]">
                    <Image
                      src={day.evidence.photo}
                      alt={day.evidence.photoLabel ?? "Evidencia"}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                ) : null}
              </div>

              {dayIndex >= caso002Days.length - 1 && !finaleReady ? (
                <div className="mt-6 rounded-xl border border-[#e8d5a3]/20 p-4 text-center text-sm text-[#a89080]">
                  El gran reveal se desbloquea el 18 nov a las{" "}
                  {sorpresaConfig.revealAt.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  .<br />
                  <CountdownTo date={sorpresaConfig.revealAt} />
                </div>
              ) : null}

      <button type="button" onClick={() => {
                if (dayIndex >= caso002Days.length - 1) {
                  if (isFinaleRevealed()) setScreen("finale");
                  return;
                }
                nextDay();
              }} className="exp-btn mt-6 w-full">
                {dayIndex >= caso002Days.length - 1
                  ? finaleReady
                    ? "Ver sorpresa final"
                    : "Esperar al gran día"
                  : "Siguiente pista →"}
              </button>
            </motion.div>
          ) : null}

          {screen === "finale" ? (
            <motion.div key="finale" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <FinaleReveal />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
