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
import Link from "next/link";

const DestinationsMap = dynamic(
  () => import("@/components/map/DestinationsMap").then((m) => m.DestinationsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[260px] items-center justify-center rounded-2xl bg-sky-pale text-sm text-text-mid">
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
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-white px-3 py-3 sm:flex-row sm:items-center">
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
            className="rounded-full bg-rose-pale px-2.5 py-1.5 text-[11px] text-rose-deep"
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
          className="min-h-[44px] flex-1 rounded-lg border border-border bg-cream px-2 py-2 text-xs text-text outline-none focus:border-rose-deep sm:min-w-[130px] sm:flex-none"
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
  const { value: dests, save } = useLocalStorage("destinations-v2", destinations);

  function updateStatus(index: number, status: DestStatus) {
    save((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status };
      return next;
    });
  }

  return (
    <section className="section-wrap">
      <SectionHeader
        label="El mundo es nuestro"
        title="Nuestros destinos"
        description="Toca el estado de cada destino para cambiarlo — visitado, planificado o futuro."
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
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
