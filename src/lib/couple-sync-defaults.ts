import { destinations, type Destination } from "@/data/destinations";
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

/** Keep user status/edits, but restore seed memory/url when missing in saved data */
function enrichDestinations(saved: Destination[]): Destination[] {
  const seedByName = new Map(destinations.map((d) => [d.name, d]));
  return saved.map((d) => {
    const seed = seedByName.get(d.name);
    if (!seed) return d;
    return {
      ...d,
      url: d.url ?? seed.url,
      memory: d.memory ?? seed.memory,
      lat: d.lat ?? seed.lat,
      lng: d.lng ?? seed.lng,
    };
  });
}

export function mergeCoupleSync(partial: Partial<CoupleSyncData> | null): CoupleSyncData {
  const base = createDefaultCoupleSync();
  if (!partial) return base;
  return {
    ...base,
    ...partial,
    destinations: enrichDestinations(partial.destinations ?? base.destinations),
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
