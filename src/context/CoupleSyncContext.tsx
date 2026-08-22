"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createDefaultCoupleSync, mergeCoupleSync, pickNewerSync } from "@/lib/couple-sync-defaults";
import { STORAGE_KEYS } from "@/lib/constants";
import type { CoupleSyncData, SyncStatus } from "@/types/couple-sync";
import type { Destination } from "@/data/destinations";
import type { FechaEspecial } from "@/data/fechas";

interface CoupleSyncContextValue {
  data: CoupleSyncData;
  status: SyncStatus;
  cloudEnabled: boolean;
  saveDestinations: (destinations: Destination[]) => void;
  saveFechas: (fechas: FechaEspecial[]) => void;
  saveBingo: (bingo: Record<number, string>) => void;
  refresh: () => Promise<void>;
}

const CoupleSyncContext = createContext<CoupleSyncContextValue | null>(null);

const POLL_MS = 20_000;

function loadLocalSync(): CoupleSyncData {
  if (typeof window === "undefined") return createDefaultCoupleSync();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.coupleSync);
    if (raw) return mergeCoupleSync(JSON.parse(raw) as Partial<CoupleSyncData>);
  } catch {
    /* ignore */
  }
  return migrateFromLegacyLocal();
}

function migrateFromLegacyLocal(): CoupleSyncData {
  const base = createDefaultCoupleSync();
  if (typeof window === "undefined") return base;

  try {
    const destRaw = localStorage.getItem(STORAGE_KEYS.destinations);
    if (destRaw) base.destinations = JSON.parse(destRaw) as Destination[];
  } catch {
    /* ignore */
  }
  try {
    const fechasRaw = localStorage.getItem(STORAGE_KEYS.fechas);
    if (fechasRaw) base.fechas = JSON.parse(fechasRaw) as FechaEspecial[];
  } catch {
    /* ignore */
  }
  try {
    const bingoRaw = localStorage.getItem(STORAGE_KEYS.bingo);
    if (bingoRaw) {
      const bingo = JSON.parse(bingoRaw) as Record<number, string>;
      base.bingo = Object.fromEntries(
        Object.entries(bingo).map(([k, v]) => [String(k), v]),
      );
    }
  } catch {
    /* ignore */
  }
  return base;
}

function persistLocal(data: CoupleSyncData) {
  localStorage.setItem(STORAGE_KEYS.coupleSync, JSON.stringify(data));
  localStorage.setItem(STORAGE_KEYS.destinations, JSON.stringify(data.destinations));
  localStorage.setItem(STORAGE_KEYS.fechas, JSON.stringify(data.fechas));
  const bingoNumeric = Object.fromEntries(
    Object.entries(data.bingo).map(([k, v]) => [Number(k), v]),
  );
  localStorage.setItem(STORAGE_KEYS.bingo, JSON.stringify(bingoNumeric));
}

export function CoupleSyncProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CoupleSyncData>(() => createDefaultCoupleSync());
  const [status, setStatus] = useState<SyncStatus>("loading");
  const [cloudEnabled, setCloudEnabled] = useState(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const pushCloud = useCallback(async (payload: CoupleSyncData) => {
    try {
      const res = await fetch("/api/sync", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 503) {
        setCloudEnabled(false);
        setStatus("local");
        return;
      }
      if (!res.ok) throw new Error("push failed");
      setCloudEnabled(true);
      setStatus("synced");
    } catch {
      setStatus("error");
    }
  }, []);

  const schedulePush = useCallback(
    (payload: CoupleSyncData) => {
      persistLocal(payload);
      setData(payload);
      if (!cloudEnabled) {
        setStatus("local");
        return;
      }
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(() => pushCloud(payload), 800);
    },
    [cloudEnabled, pushCloud],
  );

  const pullCloud = useCallback(async () => {
    try {
      const res = await fetch("/api/sync", { cache: "no-store" });
      const json = (await res.json()) as {
        configured?: boolean;
        data?: CoupleSyncData | null;
      };

      if (!json.configured) {
        setCloudEnabled(false);
        setStatus("local");
        return;
      }

      setCloudEnabled(true);

      if (!json.data) {
        const local = dataRef.current;
        await pushCloud(local);
        setStatus("synced");
        return;
      }

      const remote = mergeCoupleSync(json.data);
      const merged = pickNewerSync(dataRef.current, remote);
      persistLocal(merged);
      setData(merged);
      setStatus("synced");
    } catch {
      setStatus("error");
    }
  }, [pushCloud]);

  useEffect(() => {
    const local = loadLocalSync();
    setData(local);
    persistLocal(local);
    void pullCloud();
    const id = setInterval(() => void pullCloud(), POLL_MS);
    return () => clearInterval(id);
  }, [pullCloud]);

  const saveDestinations = useCallback(
    (destinations: Destination[]) => {
      schedulePush({
        ...dataRef.current,
        destinations,
        updatedAt: new Date().toISOString(),
      });
    },
    [schedulePush],
  );

  const saveFechas = useCallback(
    (fechas: FechaEspecial[]) => {
      schedulePush({
        ...dataRef.current,
        fechas,
        updatedAt: new Date().toISOString(),
      });
    },
    [schedulePush],
  );

  const saveBingo = useCallback(
    (bingo: Record<number, string>) => {
      schedulePush({
        ...dataRef.current,
        bingo: Object.fromEntries(Object.entries(bingo).map(([k, v]) => [String(k), v])),
        updatedAt: new Date().toISOString(),
      });
    },
    [schedulePush],
  );

  const value = useMemo(
    () => ({
      data,
      status,
      cloudEnabled,
      saveDestinations,
      saveFechas,
      saveBingo,
      refresh: pullCloud,
    }),
    [data, status, cloudEnabled, saveDestinations, saveFechas, saveBingo, pullCloud],
  );

  return <CoupleSyncContext.Provider value={value}>{children}</CoupleSyncContext.Provider>;
}

export function useCoupleSync(): CoupleSyncContextValue {
  const ctx = useContext(CoupleSyncContext);
  if (!ctx) throw new Error("useCoupleSync must be used within CoupleSyncProvider");
  return ctx;
}
