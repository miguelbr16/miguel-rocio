"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { defaultTrips, type Trip } from "@/data/journey";
import { SHARED_EVENT, TEXTS_KEY, TRIPS_KEY, isMiguel, pushShared, type SharedContent } from "@/lib/miguel";

/* ── lectura ─────────────────────────────────────────────────── */

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(SHARED_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(SHARED_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function useStored(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
}

/** Viajes: los editados por Miguel o los de serie. */
export function useTrips(): Trip[] {
  const raw = useStored(TRIPS_KEY);
  return useMemo(() => {
    if (!raw) return defaultTrips;
    try {
      const list = JSON.parse(raw) as Trip[];
      return Array.isArray(list) && list.length ? list : defaultTrips;
    } catch {
      return defaultTrips;
    }
  }, [raw]);
}

/** Texto editable: el editado o el de serie. */
export function useText(key: string, fallback: string): string {
  const raw = useStored(TEXTS_KEY);
  if (!raw) return fallback;
  try {
    const map = JSON.parse(raw) as Record<string, string>;
    return map[key] ?? fallback;
  } catch {
    return fallback;
  }
}

/* ── escritura (modo Miguel) ─────────────────────────────────── */

let pending: Partial<SharedContent> = {};
let timer: ReturnType<typeof setTimeout> | null = null;
let chain: Promise<unknown> = Promise.resolve();
type SaveState = "idle" | "saving" | "saved" | "local" | "error";
let saveState: SaveState = "idle";
const SAVE_EVENT = "mr-save-state";

function setSaveState(s: SaveState) {
  saveState = s;
  window.dispatchEvent(new Event(SAVE_EVENT));
}

function flush() {
  const patch = pending;
  pending = {};
  timer = null;
  chain = chain.then(async () => {
    const r = await pushShared(patch);
    setSaveState(r === "ok" ? "saved" : r === "local" ? "local" : "error");
  });
}

function queue(patch: Partial<SharedContent>) {
  pending = { ...pending, ...patch };
  setSaveState("saving");
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, 900);
}

export function saveTrips(list: Trip[]) {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(SHARED_EVENT));
  queue({ trips: list });
}

export function saveText(key: string, value: string) {
  const map = read<Record<string, string>>(TEXTS_KEY) ?? {};
  map[key] = value;
  localStorage.setItem(TEXTS_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(SHARED_EVENT));
  queue({ texts: map });
}

export function resetTrips() {
  saveTrips(defaultTrips);
}

export function useSaveState(): SaveState {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener(SAVE_EVENT, cb);
      return () => window.removeEventListener(SAVE_EVENT, cb);
    },
    () => saveState,
    () => "idle",
  );
}

/* ── modo edición ────────────────────────────────────────────── */

const EDIT_KEY = "modo-edicion";
const EDIT_EVENT = "mr-edit-mode";

export function setEditMode(on: boolean) {
  try {
    if (on) localStorage.setItem(EDIT_KEY, "1");
    else localStorage.removeItem(EDIT_KEY);
  } catch {
    /* sin almacenamiento */
  }
  window.dispatchEvent(new Event(EDIT_EVENT));
}

/** true solo si es Miguel y tiene la edición activada. */
export function useEditMode(): boolean {
  const on = useSyncExternalStore(
    (cb) => {
      window.addEventListener(EDIT_EVENT, cb);
      return () => window.removeEventListener(EDIT_EVENT, cb);
    },
    () => {
      try {
        return localStorage.getItem(EDIT_KEY) === "1" && isMiguel();
      } catch {
        return false;
      }
    },
    () => false,
  );
  return on;
}

/** Evita diferencias entre servidor y cliente al pintar valores guardados. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setM(true), 0);
    return () => clearTimeout(t);
  }, []);
  return m;
}
