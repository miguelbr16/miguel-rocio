"use client";

import { useMemo } from "react";
import { ParticleStory, type Chapter } from "@/components/three/ParticleStory";
import { MemoryTunnel, type Memory } from "@/components/three/MemoryTunnel";
import { photosOf } from "@/data/journey";
import { useTrips } from "@/lib/shared-store";

const CHAPTERS: Chapter[] = [
  { kicker: "18 · 11 · 2025", title: "Un año contigo", line: "Dos cobras, un beso y todo lo que vino después." },
  { kicker: "Los protagonistas", title: "Miguel & Rocío", line: "Un cruasán con servilleta, una tableta de chocolate y una multa personalizada." },
  { kicker: "Desde Valencia", title: "Siete sellos", line: "Altea, Fallas, París, Dénia, Asturias, Mallorca y Londres. Y en diciembre, Dolomitas." },
  { kicker: "El día que empezó todo", title: "18 de noviembre", line: "La fecha que abre esta web y la que vamos a celebrar." },
  { kicker: "Año dos", title: "Y esto solo es el principio", line: "Te quiero, Rocío." },
];

const LABELS: [string, string] = ["M & R", "18·11"];

/** Prototipo 3D (no enlazado): para ver el nuevo diseño antes de llevarlo a toda la web. */
export default function Prototipo() {
  const trips = useTrips();
  const visited = useMemo(
    () => Array.from(new Set(trips.filter((t) => !t.upcoming).map((t) => t.countryId ?? ""))).filter(Boolean),
    [trips],
  );
  const memories: Memory[] = useMemo(
    () =>
      trips.map((t) => ({
        id: t.id,
        place: t.place,
        when: t.when,
        photo: photosOf(t.album)[0] ?? (t.id === "paris" ? "/photos/portada.jpeg" : undefined),
      })),
    [trips],
  );

  return (
    <main className="proto">
      <ParticleStory chapters={CHAPTERS} labels={LABELS} visited={visited} />
      <MemoryTunnel memories={memories} />
      <section className="proto-end">
        <p>Prototipo · Así empezaría la web nueva.</p>
      </section>
    </main>
  );
}
