"use client";

import dynamic from "next/dynamic";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { destinations, type Destination } from "@/data/destinations";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";
import { STATUS_LABELS } from "@/data/destinations";

const DestinationsMap = dynamic(
  () => import("@/components/map/DestinationsMap").then((m) => m.DestinationsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] items-center justify-center rounded-2xl bg-sky-pale text-sm text-text-mid">
        Cargando mapa…
      </div>
    ),
  },
);

function DestRow({ dest }: { dest: Destination }) {
  const statusClass =
    dest.status === "done"
      ? "bg-rose-pale text-rose-deep"
      : dest.status === "planned"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-sky-pale text-sky-deep";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-3">
      <span className="text-2xl">{dest.flag}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{dest.name}</div>
        {dest.label ? (
          <div className="text-xs text-text-light">{dest.label}</div>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {dest.url ? (
          <Link
            href={dest.url}
            className="rounded-full bg-rose-pale px-2.5 py-1 text-[11px] text-rose-deep"
          >
            Web
          </Link>
        ) : null}
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusClass}`}>
          {STATUS_LABELS[dest.status]}
        </span>
      </div>
    </div>
  );
}

export function DestinationsSection() {
  const { value: dests } = useLocalStorage("destinations-v2", destinations);

  return (
    <section id="destinos" className="section-wrap">
      <SectionHeader
        label="El mundo es nuestro"
        title="Nuestros destinos"
        description="Donde hemos estado, donde vamos y lo que soñamos."
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <DestinationsMap destinations={dests} />
        <div className="space-y-2 p-4">
          {dests.map((d) => (
            <DestRow key={d.name} dest={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
