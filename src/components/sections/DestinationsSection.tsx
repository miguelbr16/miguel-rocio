"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
      <div className="flex h-[280px] items-center justify-center bg-sky-muted text-sm text-text-mid">
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
    <div className="dest-row">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
          {dest.flag}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{dest.name}</div>
          {dest.label ? <div className="text-xs text-text-light">{dest.label}</div> : null}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:shrink-0">
        {dest.url ? (
          <Link
            href={dest.url}
            className="rounded-full bg-rose-muted px-3 py-2 text-[11px] font-semibold text-rose-deep"
          >
            Ver web
          </Link>
        ) : null}
        <label className="sr-only" htmlFor={`dest-status-${index}`}>
          Estado de {dest.name}
        </label>
        <select
          id={`dest-status-${index}`}
          value={dest.status}
          onChange={(e) => onStatusChange(index, e.target.value as DestStatus)}
          className="status-select min-w-[130px]"
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
        action={<SyncBadge />}
      />

      <div className="dest-card">
        <DestinationsMap destinations={dests} />
        <div className="space-y-2.5 p-4">
          {dests.map((d, i) => (
            <DestRow key={`${d.name}-${i}`} dest={d} index={i} onStatusChange={updateStatus} />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <Button variant="secondary" fullWidth onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Cancelar" : "+ Añadir destino"}
        </Button>
        {showAdd ? (
          <Card variant="soft" padding="md" className="mt-3 space-y-3">
            <div className="grid gap-2 sm:grid-cols-[4rem_1fr]">
              <input
                className="form-input text-center text-xl"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="🌍"
                aria-label="Emoji del destino"
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
            <Button fullWidth onClick={addDestination}>
              Guardar destino
            </Button>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
