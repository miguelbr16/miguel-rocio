"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SyncBadge } from "@/components/SyncBadge";
import {
  STATUS_LABELS,
  type DestStatus,
  type Destination,
} from "@/data/destinations";
import { useCoupleSync } from "@/context/CoupleSyncContext";

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
        <span className="shrink-0 text-2xl">{dest.flag}</span>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{dest.name}</div>
          {dest.label ? <div className="text-xs text-text-light">{dest.label}</div> : null}
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
  const { data, saveDestinations } = useCoupleSync();
  const dests = data.destinations;
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [flag, setFlag] = useState("✈️");
  const [label, setLabel] = useState("");

  function updateStatus(index: number, status: DestStatus) {
    const next = [...dests];
    next[index] = { ...next[index], status };
    saveDestinations(next);
  }

  function addDestination() {
    if (!name.trim()) return;
    const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const next: Destination = {
      name: name.trim(),
      flag: flag || "🌍",
      status: "future",
      label: label.trim() || "Nuevo destino",
      lat: 40 + (hash % 20) - 10,
      lng: -3 + (hash % 30) - 15,
    };
    saveDestinations([...dests, next]);
    setName("");
    setFlag("✈️");
    setLabel("");
    setShowAdd(false);
  }

  return (
    <section id="destinos" className="section-wrap">
      <SectionHeader
        label="El mundo es nuestro"
        title="Nuestros destinos"
        description="Cambia el status o añade un viaje — Rocío lo verá al instante si la sync está activa."
      />
      <div className="mb-6">
        <SyncBadge />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <DestinationsMap destinations={dests} />
        <div className="space-y-2 p-3 sm:p-4">
          {dests.map((d, i) => (
            <DestRow key={`${d.name}-${i}`} dest={d} index={i} onStatusChange={updateStatus} />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <button type="button" className="btn-secondary w-full" onClick={() => setShowAdd(!showAdd)}>
          + Añadir destino
        </button>
        {showAdd ? (
          <div className="glass-card mt-3 space-y-3 p-4">
            <div className="grid gap-2 sm:grid-cols-[4rem_1fr]">
              <input
                className="form-input text-center"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="🌍"
              />
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del destino"
              />
            </div>
            <input
              className="form-input w-full"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Etiqueta · ej: Verano 2027"
            />
            <button type="button" className="btn-primary w-full" onClick={addDestination}>
              Guardar destino
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
