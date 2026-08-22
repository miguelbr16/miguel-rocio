"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { STORAGE_KEYS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lock-panel"
      >
        <div className="lock-heart">♥</div>
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
          {error ? <p className="mt-3 text-center text-sm text-rose-deep">{error}</p> : null}
        </Card>
      </motion.div>
    </motion.div>
  );
}
