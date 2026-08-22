"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LOCK_CODE, COUPLE } from "@/lib/constants";

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (code === LOCK_CODE) {
      sessionStorage.setItem("unlocked", "1");
      onUnlock();
      return;
    }
    setError("Código incorrecto. Inténtalo de nuevo.");
    setCode("");
    setTimeout(() => setError(""), 2500);
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lock-screen"
    >
      <div className="ambient-bg" aria-hidden>
        <div className="ambient-mesh" />
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-grain" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="lock-icon">✦</div>
        <h1 className="lock-title">{COUPLE.name1} & {COUPLE.name2}</h1>
        <p className="mb-8 text-sm text-text-light">
          Introduce el código para entrar
        </p>

        <div className="glass-card p-6">
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={code}
            placeholder="······"
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="lock-input mb-4"
          />
          <button type="button" onClick={submit} className="btn-gold w-full">
            Entrar
          </button>
          {error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-rose"
            >
              {error}
            </motion.p>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
