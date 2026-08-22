"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { capsuleContent, daysUntilCapsule, isCapsuleOpen } from "@/data/capsule";
import { STORAGE_KEYS } from "@/lib/constants";

export function CapsuleCard() {
  const [now, setNow] = useState(() => new Date());
  const [forcePreview, setForcePreview] = useState(false);

  useEffect(() => {
    setForcePreview(sessionStorage.getItem(STORAGE_KEYS.capsulePreview) === "1");
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const open = isCapsuleOpen(now, forcePreview);
  const daysLeft = daysUntilCapsule(now);

  return (
    <Card variant="elevated" padding="lg" className="capsule-card">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="rose">Cápsula</Badge>
        <Badge tone={open ? "success" : "neutral"}>
          {open ? "Abierta" : "Sellada hasta el 18 nov"}
        </Badge>
      </div>

      <h3 className="mt-4 font-serif text-2xl">{capsuleContent.title}</h3>
      <p className="mt-1 text-sm text-text-mid">{capsuleContent.subtitle}</p>

      {!open ? (
        <>
          <p className="mt-4 text-sm leading-relaxed text-text-mid">{capsuleContent.teaser}</p>
          <div className="capsule-lock mt-6 text-center">
            <div className="text-4xl">🔐</div>
            <p className="mt-3 text-sm font-medium text-rose-deep">
              {daysLeft > 0
                ? capsuleContent.lockedHint.replace("{days}", String(daysLeft))
                : "Se abre hoy"}
            </p>
            <p className="mt-2 text-xs text-text-light">
              Vídeo del año + carta del aniversario (en Cartas).
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => {
                sessionStorage.setItem(STORAGE_KEYS.capsulePreview, "1");
                setForcePreview(true);
              }}
            >
              Vista previa (Miguel · pruebas)
            </Button>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <h4 className="font-serif text-xl">{capsuleContent.unlockedTitle}</h4>
          <p className="mt-2 text-sm text-text-mid">{capsuleContent.unlockedBody}</p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-black">
            <video
              className="aspect-video w-full"
              controls
              playsInline
              poster={capsuleContent.videoPoster}
              preload="metadata"
            >
              <source src={capsuleContent.videoSrc} type="video/mp4" />
            </video>
          </div>
          <p className="mt-2 text-center text-[11px] text-text-light">
            Sube el montaje a{" "}
            <code className="text-rose-deep">public/videos/capsula-primer-anyo.mp4</code>
          </p>
          <Button
            className="mt-5 w-full sm:w-auto"
            onClick={() => {
              window.location.hash = "cartas";
              window.dispatchEvent(new HashChangeEvent("hashchange"));
            }}
          >
            {capsuleContent.cartaLinkLabel}
          </Button>
          {forcePreview ? (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                sessionStorage.removeItem(STORAGE_KEYS.capsulePreview);
                setForcePreview(false);
              }}
            >
              Salir de vista previa
            </Button>
          ) : null}
        </motion.div>
      )}
    </Card>
  );
}
