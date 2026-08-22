"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { annualPhotoSpots, defaultPromises, type PromiseItem } from "@/data/promises";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";

export function PromisesSection() {
  const { value: promises, save: setPromises } = useLocalStorage<PromiseItem[]>(
    STORAGE_KEYS.promises,
    defaultPromises,
  );
  const [text, setText] = useState("");
  const [author, setAuthor] = useState<PromiseItem["author"]>("Ambos");
  const openCount = useMemo(() => promises.filter((p) => !p.done).length, [promises]);

  function add() {
    if (!text.trim()) return;
    setPromises([...promises, { id: `p-${Date.now()}`, text: text.trim(), author }]);
    setText("");
  }

  return (
    <section id="promesas" className="section-wrap">
      <SectionHeader
        label="Año dos"
        title="Promesas & tradiciones"
        description="Lo que queremos vivir juntos — y la foto que repetiremos cada año."
      />

      <Card variant="soft" padding="lg" className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Badge tone="rose">Promesas</Badge>
          <Badge tone="neutral">{openCount} pendientes</Badge>
        </div>
        <ul className="promise-list mt-5">
          {promises.map((p) => (
            <li key={p.id} className={`promise-item ${p.done ? "promise-done" : ""}`}>
              <button
                type="button"
                className="promise-check"
                onClick={() =>
                  setPromises(promises.map((x) => (x.id === p.id ? { ...x, done: !x.done } : x)))
                }
              >
                {p.done ? "✓" : "○"}
              </button>
              <div className="min-w-0 flex-1">
                <p className="promise-text">{p.text}</p>
                <p className="promise-author">{p.author}</p>
              </div>
              <button
                type="button"
                className="promise-remove"
                onClick={() => setPromises(promises.filter((x) => x.id !== p.id))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_8rem]">
          <input
            className="form-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nueva promesa…"
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <select
            className="form-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value as PromiseItem["author"])}
          >
            <option value="Ambos">Ambos</option>
            <option value="Miguel">Miguel</option>
            <option value="Rocío">Rocío</option>
          </select>
        </div>
        <Button className="mt-3" fullWidth onClick={add}>
          Añadir promesa
        </Button>
      </Card>

      <Card variant="elevated" padding="lg">
        <Badge tone="gold">Tradición anual</Badge>
        <h3 className="mt-3 font-serif text-2xl">La misma foto, cada año</h3>
        <p className="mt-2 text-sm text-text-mid">
          Mismo sitio, misma pose — y miramos cómo evolucionamos.
        </p>
        {annualPhotoSpots.map((spot) => (
          <div key={spot.id} className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-light">
              {spot.place}
            </p>
            <h4 className="mt-1 font-serif text-xl">{spot.name}</h4>
            <p className="mt-2 text-sm text-text-mid">{spot.blurb}</p>
            <div className="annual-years mt-4">
              {spot.years.map((y) => (
                <div key={y.year} className="annual-year-card">
                  <span className="annual-year-label">{y.year}</span>
                  {y.photo ? (
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                      <Image src={y.photo} alt="" fill className="object-cover" sizes="160px" />
                    </div>
                  ) : (
                    <div className="annual-year-empty">Pendiente</div>
                  )}
                  {y.note ? <p className="annual-year-note">{y.note}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}
