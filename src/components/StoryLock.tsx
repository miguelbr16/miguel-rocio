"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UnlockScene, type UnlockHandle } from "@/components/three/UnlockScene";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { STORAGE_KEYS } from "@/lib/constants";
import { isMiguelCode, setMiguel } from "@/lib/miguel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Entrada del diseño nuevo: un corazón de partículas que late con cada número.
 * Con la clave buena se convierte en «Hola, Rocío», estalla hacia la pantalla
 * y se abre la web.
 */
export function StoryLock({ onUnlock }: { onUnlock: () => void }) {
  const { config } = useSiteConfig();
  const reduced = useReducedMotion();
  const scene = useRef<UnlockHandle>(null);
  const input = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(0);
  const [phase, setPhase] = useState<"idle" | "playing" | "flash">("idle");
  const label = `Hola, ${config.couple.name2}`;
  const len = Math.max(6, config.lockCode.length);

  async function submit(value: string) {
    let ok = value === config.lockCode;
    if (!ok && (await isMiguelCode(value))) {
      setMiguel(true);
      ok = true;
    }
    if (!ok) {
      scene.current?.error();
      setShake((s) => s + 1);
      setCode("");
      return;
    }
    sessionStorage.setItem(STORAGE_KEYS.unlocked, "1");
    input.current?.blur();
    if (reduced) {
      onUnlock();
      return;
    }
    setPhase("playing");
    scene.current?.play(() => {
      setPhase("flash");
      setTimeout(onUnlock, 650);
    });
  }

  return (
    <motion.div className="slock" exit={{ opacity: 0 }} transition={{ duration: 0.8 }} onClick={() => input.current?.focus()}>
      <UnlockScene ref={scene} label={label} />

      <AnimatePresence>
        {phase === "idle" ? (
          <motion.div
            className="slock-ui"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            transition={{ duration: 0.6 }}
          >
            <p className="slock-names">
              {config.couple.name1} & {config.couple.name2}
            </p>
            <p className="slock-ask">Escribe el día que empezó todo</p>
            <motion.label
              key={shake}
              className="slock-slots"
              animate={shake ? { x: [0, -12, 10, -6, 4, 0] } : undefined}
              transition={{ duration: 0.4 }}
            >
              <span className="sr-only">Clave</span>
              {Array.from({ length: len }, (_, i) => (
                <span key={i} className={`slock-slot ${i < code.length ? "is-on" : ""} ${i === code.length ? "is-cur" : ""}`}>
                  {i < code.length ? "♥" : ""}
                </span>
              ))}
              <input
                ref={input}
                className="slock-input"
                value={code}
                autoFocus
                autoComplete="off"
                inputMode={code.length < 6 && /^\d*$/.test(code) ? "numeric" : "text"}
                maxLength={24}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v.length > code.length) scene.current?.pulse();
                  setCode(v);
                  if (v === config.lockCode) void submit(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submit(code);
                }}
              />
            </motion.label>
            <p className="slock-hint">dd · mm · aa</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "flash" ? (
          <motion.div
            className="slock-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
