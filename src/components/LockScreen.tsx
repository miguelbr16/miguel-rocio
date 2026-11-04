"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { launchConfetti } from "@/lib/confetti";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { STORAGE_KEYS } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const { config } = useSiteConfig();
  const reduced = useReducedMotion();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [blooming, setBlooming] = useState(false);

  function submit() {
    if (code === config.lockCode) {
      setBlooming(true);
      if (!reduced) launchConfetti(30);
      sessionStorage.setItem(STORAGE_KEYS.unlocked, "1");
      setTimeout(() => onUnlock(), reduced ? 200 : 900);
      return;
    }
    setError("Código incorrecto. Inténtalo de nuevo.");
    setCode("");
    setTimeout(() => setError(""), 2500);
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.5 }}
      className="lock-screen lock2-screen"
    >
      <AnimatePresence>
        {!blooming ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45 }}
            className="lock2"
          >
            <h1 className="lock2-title">
              {config.couple.name1} & {config.couple.name2}
            </h1>
            <p className="lock2-sub">Solo para nosotros. La clave es el día que empezó todo.</p>
            <form
              className="lock2-form"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <label htmlFor="lock-code" className="sr-only">
                Código
              </label>
              <input
                id="lock-code"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={Math.max(config.lockCode.length, 6)}
                value={code}
                placeholder="dd mm aa"
                onChange={(e) => setCode(e.target.value)}
                className="lock2-input"
              />
              <button type="submit" className="btn-solid">
                Entrar
              </button>
            </form>
            {error ? (
              <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="lock2-error">
                {error}
              </motion.p>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="bloom"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.4, 1], opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lock-bloom"
          >
            <span className="lock-bloom-heart">♥</span>
            <p className="lock2-welcome">Bienvenida, {config.couple.name2}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
