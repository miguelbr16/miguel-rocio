/**
 * Modo Miguel: un código solo suyo (distinto del de la web) para ver y probar
 * todo antes de tiempo y editar textos. En el código solo está su huella.
 */
import type { SiteConfig } from "@/types/site-config";
import type { CaseStep } from "@/data/caso002";
import type { Trip } from "@/data/journey";
import { STORAGE_KEYS } from "@/lib/constants";

const MIGUEL_HASH = "198e1dcea2098423fb6bc75be4a6d61a2d65880af6792eb46ac6cc7c74dd2c95";
const KEY = "modo-miguel";
export const CASE_STEPS_KEY = "caso002-steps-shared";
export const TRIPS_KEY = "trips-shared";
export const TEXTS_KEY = "texts-shared";
export const SHARED_EVENT = "mr-shared-updated";

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s.trim().toLowerCase()));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function isMiguelCode(code: string) {
  try {
    return (await sha256(code)) === MIGUEL_HASH;
  } catch {
    return false;
  }
}

export function isMiguel() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setMiguel(on: boolean) {
  try {
    if (on) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    /* sin almacenamiento */
  }
}

/** Lo que Miguel edita y tiene que llegar al móvil de Rocío. */
export type SharedContent = {
  updatedAt: string;
  siteConfig?: SiteConfig;
  caseSteps?: CaseStep[];
  trips?: Trip[];
  /** Textos sueltos editados en la web: clave → texto */
  texts?: Record<string, string>;
};

/** Guarda en este dispositivo lo compartido si es más nuevo. Devuelve true si cambió algo. */
export function applyShared(shared: SharedContent | undefined | null): boolean {
  if (!shared) return false;
  let changed = false;
  try {
    if (shared.siteConfig) {
      const raw = localStorage.getItem(STORAGE_KEYS.siteConfig);
      const local = raw ? (JSON.parse(raw) as SiteConfig) : null;
      if (!local || new Date(shared.siteConfig.updatedAt) > new Date(local.updatedAt)) {
        localStorage.setItem(STORAGE_KEYS.siteConfig, JSON.stringify(shared.siteConfig));
        localStorage.setItem(STORAGE_KEYS.fechas, JSON.stringify(shared.siteConfig.fechas));
        changed = true;
      }
    }
    if (shared.caseSteps?.length) {
      const next = JSON.stringify(shared.caseSteps);
      if (localStorage.getItem(CASE_STEPS_KEY) !== next) {
        localStorage.setItem(CASE_STEPS_KEY, next);
        changed = true;
      }
    }
    if (shared.trips?.length) {
      const next = JSON.stringify(shared.trips);
      if (localStorage.getItem(TRIPS_KEY) !== next) {
        localStorage.setItem(TRIPS_KEY, next);
        changed = true;
      }
    }
    if (shared.texts) {
      const next = JSON.stringify(shared.texts);
      if (localStorage.getItem(TEXTS_KEY) !== next) {
        localStorage.setItem(TEXTS_KEY, next);
        changed = true;
      }
    }
  } catch {
    /* sin almacenamiento */
  }
  if (changed && typeof window !== "undefined") window.dispatchEvent(new Event(SHARED_EVENT));
  return changed;
}

/** Trae lo compartido del servidor (si la sincronización está activa). */
export async function pullShared(): Promise<boolean> {
  try {
    const res = await fetch("/api/sync", { cache: "no-store" });
    const json = (await res.json()) as { data?: { shared?: SharedContent } | null };
    return applyShared(json.data?.shared);
  } catch {
    return false;
  }
}

/** Sube lo editado por Miguel para que le llegue a Rocío. */
export async function pushShared(patch: Omit<SharedContent, "updatedAt">): Promise<"ok" | "local" | "error"> {
  try {
    const res = await fetch("/api/sync", { cache: "no-store" });
    const json = (await res.json()) as { configured?: boolean; data?: Record<string, unknown> | null };
    if (!json.configured) return "local";
    const current = (json.data ?? {}) as { shared?: SharedContent };
    const shared: SharedContent = { ...(current.shared ?? {}), ...patch, updatedAt: new Date().toISOString() };
    const put = await fetch("/api/sync", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...(json.data ?? {}), shared, sharedPush: true }),
    });
    return put.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}
