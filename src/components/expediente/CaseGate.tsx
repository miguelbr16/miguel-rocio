"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  caseTesting,
  checkStep,
  getCaseSteps,
  getStepProgress,
  markCaseSolved,
  setStepProgress,
  stepOpensAt,
  type CaseStep,
} from "@/data/caso002";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { launchConfetti } from "@/lib/confetti";
import { pullShared } from "@/lib/miguel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Phase = "intro" | "step" | "solved" | "board" | "finale";

const ease = [0.22, 1, 0.36, 1] as const;

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((para, i) => (
        <p key={i}>
          {para.split(/(\*\*[^*]+\*\*)/g).map((chunk, k) =>
            chunk.startsWith("**") ? <strong key={k}>{chunk.slice(2, -2)}</strong> : <span key={k}>{chunk}</span>,
          )}
        </p>
      ))}
    </>
  );
}

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

function left(to: Date, now: Date) {
  const diff = Math.max(0, to.getTime() - now.getTime());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Caso 002, en la línea del Caso 1: Agencia de Inteligencia Sentimental,
 * briefing, respuesta y cada prueba resuelta se clava en la pizarra.
 * Mientras no se resuelva, es lo único que se ve de la web el día 18.
 */
export function CaseGate({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const { reload } = useSiteConfig();
  const [steps, setSteps] = useState<CaseStep[]>(() => getCaseSteps());
  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [fails, setFails] = useState(0);
  const [shake, setShake] = useState(0);
  const now = useNow();

  useEffect(() => {
    // Trae los textos que Miguel haya editado y retoma el progreso.
    void pullShared().then((changed) => {
      if (changed) {
        setSteps(getCaseSteps());
        reload();
      }
    });
    const saved = getStepProgress();
    if (saved > 0) {
      const t = setTimeout(() => {
        setI(Math.min(saved, getCaseSteps().length - 1));
        setPhase("step");
      }, 0);
      return () => clearTimeout(t);
    }
  }, [reload]);

  const step = steps[Math.min(i, steps.length - 1)];
  const last = i >= steps.length - 1;
  const opensAt = stepOpensAt(step);
  const waiting = step.kind === "wait" && opensAt != null && now < opensAt && !caseTesting();

  function solve() {
    if (!reduced) launchConfetti(26);
    setAnswer("");
    setFails(0);
    setPhase("solved");
  }

  function submit() {
    if (step.kind === "wait") {
      if (!waiting) solve();
      return;
    }
    if (checkStep(step, answer)) solve();
    else {
      setFails((f) => f + 1);
      setShake((s) => s + 1);
      setAnswer("");
    }
  }

  function next() {
    if (last) {
      markCaseSolved();
      setPhase("board");
      return;
    }
    const n = i + 1;
    setI(n);
    setStepProgress(n);
    setPhase("step");
  }

  function reveal() {
    setPhase("finale");
    if (!reduced) {
      launchConfetti(90);
      setTimeout(() => launchConfetti(60), 900);
    }
  }

  return (
    <div className="case2">
      <header className="case2-head">
        <span>Agencia de Inteligencia Sentimental</span>
        <span>Caso Nº 002 · Clasificado</span>
      </header>

      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.section
            key="intro"
            className="case2-screen"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
          >
            <p className="case2-kicker">Expediente reabierto · 18 nov 2026</p>
            <h1 className="case2-title">
              Caso 002
              <br />
              <em>El primer año</em>
            </h1>
            <div className="case2-brief">
              <p>
                Agente Ro. El <strong>Caso 001</strong> contó cómo empezó todo y se cerró el 15 de mayo con flores y una carta.
              </p>
              <p>
                Este expediente documenta lo que vino después. Hoy la web está cerrada: hay {steps.length} pruebas y, cuando
                las resuelvas, se abre todo.
              </p>
            </div>
            <button type="button" className="exp-btn case2-cta" onClick={() => setPhase("step")}>
              Aceptar la misión
            </button>
          </motion.section>
        ) : null}

        {phase === "step" ? (
          <motion.section
            key={`step-${i}`}
            className="case2-screen"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease }}
          >
            <Progress steps={steps} i={i} />
            <p className="case2-kicker">
              Prueba {i + 1} de {steps.length} · {step.title}
            </p>
            <div className="case2-brief">
              <Rich text={step.brief} />
            </div>

            {step.kind === "wait" ? (
              waiting && opensAt ? (
                <div>
                  <p className="case2-clock">{left(opensAt, now)}</p>
                  <p className="case2-note">Se abre a las {step.at}. Tu progreso se queda guardado.</p>
                </div>
              ) : (
                <button type="button" className="exp-btn case2-cta" onClick={submit}>
                  Continuar
                </button>
              )
            ) : (
              <motion.form
                key={shake}
                className="case2-form"
                animate={shake && !reduced ? { x: [0, -10, 9, -5, 3, 0] } : undefined}
                transition={{ duration: 0.4 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <label htmlFor="case-answer" className="sr-only">
                  Respuesta
                </label>
                <input
                  id="case-answer"
                  className="exp-input case2-input"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={step.kind === "code" ? "La palabra del sobre" : "Tu respuesta…"}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoFocus
                />
                <button type="submit" className="exp-btn case2-cta">
                  Verificar
                </button>
              </motion.form>
            )}
            {fails > 0 && step.kind !== "wait" ? (
              <p className="case2-fail" role="status">
                {fails >= 2 && step.hint ? `Pista de la agencia: ${step.hint}` : "Casi… inténtalo de nuevo."}
              </p>
            ) : null}

            {i > 0 ? <Board steps={steps} solved={i} compact /> : null}
          </motion.section>
        ) : null}

        {phase === "solved" ? (
          <motion.section
            key={`ok-${i}`}
            className="case2-screen case2-ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="case2-stamp"
              initial={reduced ? false : { scale: 2.2, rotate: -28, opacity: 0 }}
              animate={{ scale: 1, rotate: -7, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              {last ? "Caso cerrado" : "Prueba archivada"}
            </motion.div>
            <p className="case2-solved">{step.solved}</p>
            <button type="button" className="exp-btn case2-cta" onClick={next}>
              {last ? "Ver la pizarra" : "Siguiente prueba"}
            </button>
          </motion.section>
        ) : null}

        {phase === "board" ? (
          <motion.section
            key="board"
            className="case2-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="case2-kicker">Pizarra del caso · completa</p>
            <h2 className="case2-title case2-title-sm">Todas las pruebas apuntan a lo mismo.</h2>
            <Board steps={steps} solved={steps.length} />
            <button type="button" className="exp-btn case2-cta" onClick={reveal}>
              Abrir el último sobre
            </button>
          </motion.section>
        ) : null}

        {phase === "finale" ? <Finale key="finale" onDone={onDone} reduced={reduced} /> : null}
      </AnimatePresence>
    </div>
  );
}

function Progress({ steps, i }: { steps: CaseStep[]; i: number }) {
  return (
    <ol className="case2-track" aria-label="Progreso">
      {steps.map((s, k) => (
        <li key={s.id} className={k < i ? "is-done" : k === i ? "is-now" : ""}>
          <span className="sr-only">{s.title}</span>
        </li>
      ))}
    </ol>
  );
}

/** Pizarra: una nota por prueba resuelta, unidas con hilo rojo. */
function Board({ steps, solved, compact = false }: { steps: CaseStep[]; solved: number; compact?: boolean }) {
  const cols = compact ? 4 : 3;
  const spots = useMemo(
    () =>
      steps.map((_, k) => {
        const r = Math.sin(k * 12.9898) * 43758.5453;
        const j = r - Math.floor(r);
        const col = k % cols;
        const row = Math.floor(k / cols);
        return { x: (col + 0.5) / cols, y: row, rot: (j - 0.5) * 10, dx: (j - 0.5) * 0.08 };
      }),
    [steps, cols],
  );
  const rows = Math.ceil(steps.length / cols);
  const rowH = compact ? 84 : 128;
  const h = rows * rowH + 20;
  const shown = steps.slice(0, solved);

  return (
    <div className={`case2-board ${compact ? "is-compact" : ""}`} style={{ height: h }}>
      <svg className="case2-thread" viewBox={`0 0 1000 ${h}`} preserveAspectRatio="none" aria-hidden>
        {shown.slice(1).map((_, k) => {
          const a = spots[k];
          const b = spots[k + 1];
          return (
            <line
              key={k}
              x1={(a.x + a.dx) * 1000}
              y1={a.y * rowH + 22}
              x2={(b.x + b.dx) * 1000}
              y2={b.y * rowH + 22}
            />
          );
        })}
      </svg>
      {shown.map((s, k) => (
        <motion.div
          key={s.id}
          className="case2-note-card"
          style={{
            left: `${(spots[k].x + spots[k].dx) * 100}%`,
            top: spots[k].y * rowH + 10,
            rotate: spots[k].rot,
          }}
          initial={k === solved - 1 ? { scale: 1.4, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
        >
          <span className="case2-pin" aria-hidden />
          <strong>{s.title}</strong>
          {!compact ? <span>{s.solved}</span> : null}
        </motion.div>
      ))}
    </div>
  );
}

function Finale({ onDone, reduced }: { onDone: () => void; reduced: boolean }) {
  const { sorpresa } = useSiteConfig();
  const { cena, flores, extra, cartaFisica } = sorpresa;

  return (
    <motion.section className="case2-finale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      {!reduced ? (
        <motion.svg
          className="case2-plane"
          viewBox="-40 -30 80 60"
          initial={{ x: "-30vw", y: "8vh", rotate: -10 }}
          animate={{ x: "130vw", y: "-4vh", rotate: -4 }}
          transition={{ duration: 3.4, ease: "easeInOut" }}
          aria-hidden
        >
          <path
            d="M-22 -3h30l14-14h6l-7 14h11l6-6h4l-3 9 3 9h-4l-6-6H21l7 14h-6L8 9h-30c-4 0-6-2-6-6s2-6 6-6Z"
            fill="#c96b88"
          />
        </motion.svg>
      ) : null}
      <motion.div
        className="case2-finale-head"
        initial={reduced ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease }}
      >
        <p className="case2-finale-kicker">El objetivo eras tú. Otra vez.</p>
        <h1>Feliz primer año</h1>
        <p>Caso 002 cerrado, Agente Ro. Esto es lo que hay preparado para hoy.</p>
      </motion.div>

      <div className="case2-plan">
        {[
          { h: cena.titulo, p: `${cena.restaurante} · ${cena.hora}`, s: `${cena.direccion}. ${cena.nota}` },
          { h: flores.titulo, p: flores.mensaje, s: flores.detalle },
          { h: cartaFisica.titulo, p: cartaFisica.mensaje, s: "La de la web ya está abierta, en Cartas." },
          { h: extra.titulo, p: extra.mensaje, s: extra.hint },
        ].map((c, k) => (
          <motion.article
            key={c.h}
            className="case2-plan-item"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + k * 0.15, duration: 0.5, ease }}
          >
            <h2>{c.h}</h2>
            <p>{c.p}</p>
            <p className="case2-plan-small">{c.s}</p>
          </motion.article>
        ))}
      </div>

      <button type="button" className="btn btn-primary btn-lg case2-enter" onClick={onDone}>
        Entrar en nuestra web
      </button>
    </motion.section>
  );
}
