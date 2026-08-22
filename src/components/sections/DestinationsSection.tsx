"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SyncBadge } from "@/components/SyncBadge";
import { STATUS_LABELS, type DestStatus, type Destination } from "@/data/destinations";
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

export function DestinationsSection() {
  const { data, saveDestinations } = useCoupleSync();
  const dests = data.destinations;
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [flag, setFlag] = useState("✈️");
  const [label, setLabel] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [photosOpen, setPhotosOpen] = useState<number | null>(null);

  function updateStatus(index: number, status: DestStatus) {
    const next = [...dests];
    next[index] = { ...next[index]!, status };
    saveDestinations(next);
  }

  function openFromMap(dest: Destination) {
    const index = dests.findIndex((d) => d.name === dest.name);
    if (index < 0) return;
    setExpanded(index);
    if (dest.memory?.photos?.length) setPhotosOpen(index);
    requestAnimationFrame(() => {
      document.getElementById(`dest-row-${index}`)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }

  function addDestination() {
    if (!name.trim()) return;
    const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    saveDestinations([
      ...dests,
      {
        name: name.trim(),
        flag: flag || "🌍",
        status: "future" as const,
        label: label.trim() || "Nuevo destino",
        lat: 40 + (hash % 20) - 10,
        lng: -3 + (hash % 30) - 15,
      },
    ]);
    setName("");
    setFlag("✈️");
    setLabel("");
    setShowAdd(false);
  }

  return (
    <section id="destinos" className="section-wrap">
      <SectionHeader
        label="Mapa de recuerdos"
        title="Nuestros destinos"
        description="Clic en el mapa o despliega cada destino: las fotos se abren ahí mismo."
        action={<SyncBadge />}
      />

      <div className="dest-card">
        <DestinationsMap destinations={dests} onSelectDestination={openFromMap} />
        <div className="space-y-2 p-4">
          {dests.map((d, i) => {
            const isOpen = expanded === i;
            const showPhotos = photosOpen === i && Boolean(d.memory?.photos?.length);
            return (
              <div
                key={`${d.name}-${i}`}
                id={`dest-row-${i}`}
                className={`dest-row-wrap ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="dest-row"
                  onClick={() => {
                    setExpanded(isOpen ? null : i);
                    if (isOpen) setPhotosOpen(null);
                  }}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                      {d.flag}
                    </span>
                    <div className="min-w-0 text-left">
                      <div className="truncate text-sm font-semibold">{d.name}</div>
                      {d.label ? <div className="text-xs text-text-light">{d.label}</div> : null}
                    </div>
                  </div>
                  <span className="text-text-light">{isOpen ? "▾" : "▸"}</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="dest-expand-inner">
                        <p className="text-sm leading-relaxed text-text-mid">
                          {d.memory?.blurb ?? "Destino en el mapa de sueños."}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {d.memory?.photos?.length ? (
                            <Button
                              size="sm"
                              onClick={() => setPhotosOpen(showPhotos ? null : i)}
                            >
                              {showPhotos ? "Ocultar fotos" : "Ver fotos"}
                            </Button>
                          ) : null}
                          {d.url ? (
                            <Link href={d.url} className="btn btn-secondary btn-sm">
                              Ver web
                            </Link>
                          ) : null}
                          <select
                            value={d.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateStatus(i, e.target.value as DestStatus)}
                            className="status-select min-w-[130px]"
                            aria-label={`Estado de ${d.name}`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <AnimatePresence initial={false}>
                          {showPhotos ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="dest-inline-photos mt-4">
                                {d.memory!.photos.map((src) => (
                                  <div key={src} className="dest-inline-photo">
                                    <Image
                                      src={src}
                                      alt={d.name}
                                      fill
                                      className="object-cover object-[center_72%]"
                                      sizes="(max-width: 640px) 50vw, 220px"
                                    />
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
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
                aria-label="Emoji"
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
