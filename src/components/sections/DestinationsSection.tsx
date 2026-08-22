"use client";

import dynamic from "next/dynamic";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  destinations,
  STATUS_LABELS,
  type DestStatus,
  type Destination,
} from "@/data/destinations";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import Link from "next/link";

const DestinationsMap = dynamic(
  () => import("@/components/map/DestinationsMap").then((m) => m.DestinationsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[260px] items-center justify-center rounded-2xl glass-card text-sm text-text-mid">
        Cargando mapa…
      </div>
    ),
  },
);

const STATUS_OPTIONS: { value: DestStatus; label: string }[] = [
  { value: "done", label: STATUS_LABELS.done },
  { value: "planned", label: STATUS_LABELS.planned },
  { value: "future", label: STATUS_LABELS.future },
];

function DestRow({
  dest,
  index,
  onStatusChange,
}: {
  dest: Destination;
  index: number;
  onStatusChange: (index: number, status: DestStatus) => void;
}) {
  return (
    <div className="glass-card flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="text-2xl shrink-0">{dest.flag}</span>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{dest.name}</div>
          {dest.label ? (
            <div className="text-xs text-text-light">{dest.label}</div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:shrink-0">
        {dest.url ? (
          <Link
            href={dest.url}
            className="rounded-full bg-rose-pale px-2.5 py-1.5 text-[11px] text-rose"
          >
            Web
          </Link>
        ) : null}
        <label className="sr-only" htmlFor={`dest-status-${index}`}>
          Estado de {dest.name}
        </label>
        <select
          id={`dest-status-${index}`}
          value={dest.status}
          onChange={(e) => onStatusChange(index, e.target.value as DestStatus)}
          className="form-input min-h-[44px] flex-1 text-xs sm:min-w-[130px] sm:flex-none"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function DestinationsSection() {
  const { value: dests, save } = useLocalStorage(STORAGE_KEYS.destinations, destinations);

  function updateStatus(index: number, status: DestStatus) {
    save((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status };
      return next;
    });
  }

  return (
    <section id="destinos" className="section-wrap">
      <SectionHeader
        label="El mundo es nuestro"
        title="Nuestros destinos"
        description="Toca el estado de cada destino para cambiarlo — visitado, planificado o futuro."
      />
      <div className="glass-card overflow-hidden">
        <DestinationsMap destinations={dests} />
        <div className="space-y-2 p-3 sm:p-4">
          {dests.map((d, i) => (
            <DestRow key={d.name} dest={d} index={i} onStatusChange={updateStatus} />
          ))}
        </div>
      </div>
    </section>
  );
}
