"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LOCK_CODE } from "@/lib/constants";

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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream px-6 text-center"
    >
      <div className="mb-5 text-5xl">🔒</div>
      <p className="mb-6 text-sm tracking-wide text-text-light">
        Introduce el código para entrar
      </p>
      <input
        type="password"
        inputMode="numeric"
        maxLength={8}
        value={code}
        placeholder="······"
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="mb-3 w-full max-w-[260px] rounded-[10px] border border-border bg-white px-4 py-3.5 text-center font-sans text-xl tracking-[0.25em] text-text outline-none focus:border-rose-deep"
      />
      <button
        type="button"
        onClick={submit}
        className="w-full max-w-[260px] rounded-[10px] bg-rose-deep py-3.5 text-[15px] text-white transition hover:brightness-105"
      >
        Entrar
      </button>
      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
    </motion.div>
  );
}
