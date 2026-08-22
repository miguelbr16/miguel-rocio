import { destinations } from "@/data/destinations";
import { fechasEspeciales } from "@/data/fechas";
import { COUPLE_SYNC_VERSION, type CoupleSyncData } from "@/types/couple-sync";

export function createDefaultCoupleSync(): CoupleSyncData {
  return {
    version: COUPLE_SYNC_VERSION,
    updatedAt: new Date().toISOString(),
    destinations: destinations.map((d) => ({ ...d })),
    fechas: fechasEspeciales.map((f) => ({ ...f })),
    bingo: {},
  };
}

export function mergeCoupleSync(partial: Partial<CoupleSyncData> | null): CoupleSyncData {
  const base = createDefaultCoupleSync();
  if (!partial) return base;
  return {
    ...base,
    ...partial,
    destinations: partial.destinations ?? base.destinations,
    fechas: partial.fechas ?? base.fechas,
    bingo: partial.bingo ?? base.bingo,
  };
}

/** Prefer cloud if newer than local timestamp */
export function pickNewerSync(local: CoupleSyncData, remote: CoupleSyncData): CoupleSyncData {
  const localTs = new Date(local.updatedAt).getTime();
  const remoteTs = new Date(remote.updatedAt).getTime();
  return remoteTs >= localTs ? remote : local;
}
