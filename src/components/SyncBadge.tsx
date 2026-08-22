"use client";

import { useCoupleSync } from "@/context/CoupleSyncContext";
import { Badge } from "@/components/ui/Badge";

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

  if (!label) return null;

  const tone =
    status === "synced" ? "sky" : status === "error" ? "rose" : ("neutral" as const);

  return (
    <Badge
      tone={tone}
      title={
        cloudEnabled
          ? "Los cambios se comparten entre dispositivos"
          : "Configura Supabase en Vercel para compartir cambios"
      }
    >
      {status === "synced" ? "☁️" : "📱"} {label}
    </Badge>
  );
}
