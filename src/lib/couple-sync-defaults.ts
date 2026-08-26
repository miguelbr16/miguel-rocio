import { destinations, type Destination } from "@/data/destinations";
import { fechasEspeciales } from "@/data/fechas";
import { LONDON_GUIDE_URL } from "@/lib/constants";
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

/** Keep user status/edits, restore seed memory/url, and append new seed destinations */
function enrichDestinations(saved: Destination[]): Destination[] {
  const seedByName = new Map(destinations.map((d) => [d.name, d]));
  const seen = new Set<string>();
  const merged = saved.map((d) => {
    seen.add(d.name);
    const seed = seedByName.get(d.name);
    if (!seed) return d;
    return {
      ...d,
      // Seed guide URLs win (e.g. Londres → repo Vercel)
      url: seed.url ?? d.url,
      album: d.album ?? seed.album,
      memory: d.memory ?? seed.memory,
      lat: d.lat ?? seed.lat,
      lng: d.lng ?? seed.lng,
      label: d.label || seed.label,
      flag: d.flag || seed.flag,
    };
  });

  for (const seed of destinations) {
    if (seen.has(seed.name)) continue;
    const seedIndex = destinations.findIndex((d) => d.name === seed.name);
    let insertAt = merged.length;
    for (let i = seedIndex - 1; i >= 0; i--) {
      const prevName = destinations[i]!.name;
      const idx = merged.findIndex((d) => d.name === prevName);
      if (idx >= 0) {
        insertAt = idx + 1;
        break;
      }
    }
    merged.splice(insertAt, 0, { ...seed });
  }

  // Ensure Londres always points at the current guide deploy
  return merged.map((d) =>
    d.name === "Londres" ? { ...d, url: LONDON_GUIDE_URL } : d,
  );
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
