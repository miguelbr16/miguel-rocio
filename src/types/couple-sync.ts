import type { Destination } from "@/data/destinations";
import type { FechaEspecial } from "@/data/fechas";
import type { StampArt } from "@/data/journey";

/** Sitio añadido desde la pestaña Pasaporte */
export interface PassportPlace {
  id: string;
  place: string;
  country: string;
  when: string;
  art: StampArt;
  lat?: number;
  lng?: number;
  addedAt: string;
}

export const COUPLE_SYNC_VERSION = 1 as const;

export interface CoupleSyncData {
  version: typeof COUPLE_SYNC_VERSION;
  updatedAt: string;
  destinations: Destination[];
  fechas: FechaEspecial[];
  /** Bingo cell index → image URL or data URL */
  bingo: Record<string, string>;
  /** Sitios añadidos a mano en el pasaporte */
  passport?: PassportPlace[];
  /** Fotos subidas por página del pasaporte (id del viaje o del sitio) → data URLs */
  passportPhotos?: Record<string, string[]>;
  /** Textos que edita Miguel (caso, gran noche…) y deben llegar a los dos móviles */
  shared?: import("@/lib/miguel").SharedContent;
}

export type SyncStatus = "loading" | "local" | "synced" | "error";
