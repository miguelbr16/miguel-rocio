"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { STORAGE_KEYS } from "@/lib/constants";

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const { config } = useSiteConfig();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (code === config.lockCode) {
      sessionStorage.setItem(STORAGE_KEYS.unlocked, "1");
      onUnlock();
      return;
    }
    setError("Código incorrecto. Inténtalo de nuevo.");
    setCode("");
    setTimeout(() => setError(""), 2500);
  }

  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="lock-screen">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-4 text-4xl">♥</div>
        <h1 className="lock-title">
          {config.couple.name1} & {config.couple.name2}
        </h1>
        <p className="mb-6 mt-2 text-sm text-text-light">Introduce el código para entrar</p>

        <div className="glass-card p-6">
          <input
            type="password"
            inputMode="numeric"
            maxLength={Math.max(config.lockCode.length, 6)}
            value={code}
            placeholder="······"
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="lock-input mb-4"
          />
          <button type="button" onClick={submit} className="btn-primary w-full">
            Entrar
          </button>
          {error ? <p className="mt-3 text-sm text-rose-deep">{error}</p> : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
