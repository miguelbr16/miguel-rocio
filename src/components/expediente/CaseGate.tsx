"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  caseSteps,
  caseTesting,
  checkStep,
  getStepProgress,
  markCaseSolved,
  setStepProgress,
  stepOpensAt,
} from "@/data/caso002";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { launchConfetti } from "@/lib/confetti";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Phase = "intro" | "step" | "solved" | "finale";

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
 * El Caso 002 a pantalla completa. Mientras no se resuelva, es lo único que
 * se ve de la web el día 18.
 */
export function CaseGate({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [fails, setFails] = useState(0);
  const [shake, setShake] = useState(0);
  const now = useNow();

  useEffect(() => {
    const saved = Math.min(getStepProgress(), caseSteps.length - 1);
    if (saved > 0) {
      const t = setTimeout(() => {
        setI(saved);
        setPhase("step");
      }, 0);
      return () => clearTimeout(t);
    }
  }, []);

  const step = caseSteps[i];
  const opensAt = stepOpensAt(step);
  const waiting = step.kind === "wait" && opensAt != null && now < opensAt && !caseTesting();

  function solve() {
    if (!reduced) launchConfetti(30);
    setAnswer("");
    setFails(0);
    setPhase("solved");
  }

  function submit() {
    if (step.kind === "wait") {
      if (!waiting) solve();
      return;
    }
    if (checkStep(step, answer)) {
      solve();
    } else {
      setFails((f) => f + 1);
      setShake((s) => s + 1);
      setAnswer("");
    }
  }

  function next() {
    if (i >= caseSteps.length - 1) {
      markCaseSolved();
      setPhase("finale");
      if (!reduced) {
        launchConfetti(90);
        setTimeout(() => launchConfetti(60), 900);
      }
      return;
    }
    const n = i + 1;
    setI(n);
    setStepProgress(n);
    setPhase("step");
  }

  return (
    <div className="case">
      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.section
            key="intro"
            className="case-screen case-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease }}
          >
            <h1 className="case-huge">
              Caso
              <br />
              002
            </h1>
            <div className="case-intro-foot">
              <p className="case-lead">
                Hoy la web está cerrada. Hay {caseSteps.length} pasos entre tú y lo que hay dentro; algunos se resuelven
                pensando, otro moviéndote, y el último no llega hasta la noche.
              </p>
              <button type="button" className="btn-solid case-btn" onClick={() => setPhase("step")}>
                Abrir el expediente
              </button>
            </div>
          </motion.section>
        ) : null}

        {phase === "step" ? (
          <motion.section
            key={`step-${i}`}
            className="case-screen"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease }}
          >
            <ol className="case-track" aria-label="Progreso del caso">
              {caseSteps.map((s, k) => (
                <li key={s.id} className={k < i ? "is-done" : k === i ? "is-now" : ""}>
                  <span className="sr-only">{s.title}</span>
                </li>
              ))}
            </ol>
            <p className="case-kicker">
              Paso {i + 1} de {caseSteps.length} · {step.title}
            </p>
            <div className="case-brief">
              <Rich text={step.brief} />
            </div>

            {step.kind === "wait" ? (
              <div className="case-wait">
                {waiting && opensAt ? (
                  <>
                    <p className="case-clock">{left(opensAt, now)}</p>
                    <p className="case-lead">Se abre a las {step.at}. Puedes cerrar esto y volver luego: tu progreso se queda.</p>
                  </>
                ) : (
                  <button type="button" className="btn-solid case-btn" onClick={submit}>
                    Seguir
                  </button>
                )}
              </div>
            ) : (
              <motion.form
                key={shake}
                className="case-form"
                animate={shake && !reduced ? { x: [0, -12, 10, -6, 4, 0] } : undefined}
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
                  className="case-input"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={step.kind === "code" ? "La palabra del sobre" : "Tu respuesta"}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoFocus
                />
                <button type="submit" className="btn-solid case-btn">
                  Comprobar
                </button>
              </motion.form>
            )}
            {fails > 0 && step.kind !== "wait" ? (
              <p className="case-fail" role="status">
                {fails >= 2 && step.hint ? `Pista: ${step.hint}` : "Esa no es. Piénsalo otra vez."}
              </p>
            ) : null}
          </motion.section>
        ) : null}

        {phase === "solved" ? (
          <motion.section
            key={`ok-${i}`}
            className="case-screen case-ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="case-stamp"
              initial={reduced ? false : { scale: 2.2, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: -8, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              {i >= caseSteps.length - 1 ? "Cerrado" : "Resuelto"}
            </motion.div>
            <p className="case-solved">{step.solved}</p>
            <button type="button" className="btn-solid case-btn" onClick={next}>
              {i >= caseSteps.length - 1 ? "Abrirlo todo" : "Siguiente paso"}
            </button>
          </motion.section>
        ) : null}

        {phase === "finale" ? <Finale key="finale" onDone={onDone} reduced={reduced} /> : null}
      </AnimatePresence>
    </div>
  );
}

function Finale({ onDone, reduced }: { onDone: () => void; reduced: boolean }) {
  const { sorpresa } = useSiteConfig();
  const { cena, flores, extra, cartaFisica } = sorpresa;

  return (
    <motion.section
      className="case-finale"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="case-finale-sky">
        {!reduced ? (
          <motion.svg
            className="case-finale-plane"
            viewBox="-40 -30 80 60"
            initial={{ x: "-30vw", y: "10vh", rotate: -12 }}
            animate={{ x: "130vw", y: "-6vh", rotate: -6 }}
            transition={{ duration: 3.2, ease: "easeInOut" }}
            aria-hidden
          >
            <PlaneGlyph color="#f53fd6" />
          </motion.svg>
        ) : null}
        <motion.h1
          className="case-finale-title"
          initial={reduced ? false : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease }}
        >
          Un año
          <br />
          contigo
        </motion.h1>
        <motion.p
          className="case-lead"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Caso 002 cerrado. Feliz aniversario, Rocío.
        </motion.p>
      </div>

      <div className="case-plan">
        {[
          { h: cena.titulo, p: `${cena.restaurante} · ${cena.hora}`, s: `${cena.direccion}. ${cena.nota}` },
          { h: flores.titulo, p: flores.mensaje, s: flores.detalle },
          { h: cartaFisica.titulo, p: cartaFisica.mensaje, s: "La de la web también está abierta, en Cartas." },
          { h: extra.titulo, p: extra.mensaje, s: extra.hint },
        ].map((c, k) => (
          <motion.article
            key={c.h}
            className="case-plan-item"
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 + k * 0.15, duration: 0.5, ease }}
          >
            <h2>{c.h}</h2>
            <p>{c.p}</p>
            <p className="case-plan-small">{c.s}</p>
          </motion.article>
        ))}
      </div>

      <div className="case-finale-foot">
        <button type="button" className="btn-solid case-btn" onClick={onDone}>
          Entrar en nuestra web
        </button>
      </div>
    </motion.section>
  );
}

function PlaneGlyph({ color }: { color: string }) {
  return (
    <path
      d="M-22 -3h30l14-14h6l-7 14h11l6-6h4l-3 9 3 9h-4l-6-6H21l7 14h-6L8 9h-30c-4 0-6-2-6-6s2-6 6-6Z"
      fill={color}
    />
  );
}
