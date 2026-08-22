import type { Destination } from "@/data/destinations";
import type { FechaEspecial } from "@/data/fechas";

export const COUPLE_SYNC_VERSION = 1 as const;

export interface CoupleSyncData {
  version: typeof COUPLE_SYNC_VERSION;
  updatedAt: string;
  destinations: Destination[];
  fechas: FechaEspecial[];
  /** Bingo cell index → image URL or data URL */
  bingo: Record<string, string>;
}

export type SyncStatus = "loading" | "local" | "synced" | "error";
