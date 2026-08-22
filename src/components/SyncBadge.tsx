"use client";

import { useCoupleSync } from "@/context/CoupleSyncContext";

export function SyncBadge() {
  const { status, cloudEnabled } = useCoupleSync();

  if (status === "loading") return null;

  const label =
    status === "synced"
      ? "Sincronizado"
      : status === "local"
        ? "Solo este dispositivo"
        : status === "error"
          ? "Error de sync"
          : "";

  const tone =
    status === "synced"
      ? "bg-sky-pale text-sky-deep"
      : status === "error"
        ? "bg-rose-pale text-rose-deep"
        : "bg-cream text-text-light border border-border";

  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${tone}`}
      title={
        cloudEnabled
          ? "Los cambios se comparten entre dispositivos"
          : "Configura Supabase en Vercel para compartir cambios"
      }
    >
      {status === "synced" ? "☁️" : "📱"} {label}
    </span>
  );
}
