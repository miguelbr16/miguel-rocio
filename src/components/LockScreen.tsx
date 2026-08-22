"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { launchConfetti } from "@/lib/confetti";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { STORAGE_KEYS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
      className="lock-screen"
    >
      <AnimatePresence>
        {!blooming ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
            transition={{ duration: 0.45 }}
            className="lock-panel"
          >
            <motion.div
              className="lock-heart"
              animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              ♥
            </motion.div>
            <h1 className="lock-title">
              {config.couple.name1}
              <span className="text-rose-deep"> & </span>
              {config.couple.name2}
            </h1>
            <p className="mt-2 text-sm text-text-mid">Un espacio solo para vosotros</p>

            <Card variant="elevated" padding="lg" className="mt-8 text-left">
              <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.14em] text-text-light">
                Introduce el código
              </p>
              <input
                type="password"
                inputMode="numeric"
                maxLength={Math.max(config.lockCode.length, 6)}
                value={code}
                placeholder="······"
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="lock-input mx-auto mb-4 block"
              />
              <Button fullWidth onClick={submit}>
                Entrar
              </Button>
              {error ? (
                <motion.p
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-3 text-center text-sm text-rose-deep"
                >
                  {error}
                </motion.p>
              ) : null}
            </Card>
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
            <p className="mt-4 font-serif text-2xl text-rose-deep">Bienvenida, {config.couple.name2}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
