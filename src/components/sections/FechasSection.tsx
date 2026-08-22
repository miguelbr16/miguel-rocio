"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SyncBadge } from "@/components/SyncBadge";
import type { FechaEspecial } from "@/data/fechas";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useCoupleSync } from "@/context/CoupleSyncContext";
import { daysUntilDate, formatSpanishDate } from "@/lib/dates";

function FechaRow({
  f,
  idx,
  onDelete,
}: {
  f: FechaEspecial & { idx: number; days: number };
  idx: number;
  onDelete: (i: number) => void;
}) {
  const isToday = f.days === 0;
  const isSoon = f.days <= 7;
  const badge = isToday ? "¡Hoy!" : f.days === 1 ? "Mañana" : `En ${f.days} días`;
  const badgeTone = isToday ? "rose" : isSoon ? "sky" : "neutral";

  return (
    <div className={`fecha-row ${isToday ? "fecha-row-today" : ""}`}>
      <span className="fecha-emoji">{f.emoji}</span>
      <div className="min-w-0 flex-1">
        <div className={`truncate text-sm ${isToday ? "font-semibold" : "font-medium"}`}>
          {f.nombre}
        </div>
        <div className="text-xs text-text-light">{formatSpanishDate(f.dateStr)}</div>
      </div>
      <Badge tone={badgeTone}>{badge}</Badge>
      <button
        type="button"
        onClick={() => onDelete(idx)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-text-light transition hover:bg-cream hover:text-text"
        aria-label="Eliminar"
      >
        ×
      </button>
    </div>
  );
}

export function FechasSection() {
  const { config } = useSiteConfig();
  const { data, saveFechas } = useCoupleSync();
  const fechas = data.fechas.length > 0 ? data.fechas : config.fechas;
  const [showForm, setShowForm] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [nombre, setNombre] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [anual, setAnual] = useState(true);

  const sorted = fechas
    .map((f, idx) => ({ ...f, idx, days: daysUntilDate(f.dateStr) }))
    .sort((a, b) => a.days - b.days);

  function addFecha() {
    if (!nombre.trim() || !dateStr) return;
    saveFechas([...fechas, { emoji: emoji || "📅", nombre: nombre.trim(), dateStr, anual }]);
    setEmoji("");
    setNombre("");
    setDateStr("");
    setShowForm(false);
  }

  function deleteFecha(idx: number) {
    saveFechas(fechas.filter((_, i) => i !== idx));
  }

  return (
    <section id="fechas" className="section-wrap">
      <SectionHeader
        label="Nuestro calendario"
        title="Fechas especiales"
        description="Las fechas que importan — compartidas entre vosotros."
        action={<SyncBadge />}
      />

      <div className="space-y-2.5">
        {sorted.map((f) => (
          <FechaRow key={`${f.nombre}-${f.idx}`} f={f} idx={f.idx} onDelete={deleteFecha} />
        ))}
      </div>

      <div className="mt-6">
        <Button variant="secondary" fullWidth onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "+ Añadir fecha especial"}
        </Button>
        {showForm ? (
          <Card variant="soft" padding="md" className="mt-3 space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                placeholder="Emoji · ej: 🎂"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="form-input"
              />
              <input
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-input"
              />
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="form-input sm:col-span-2"
              />
              <label className="flex items-center gap-2 text-sm text-text-mid sm:col-span-2">
                <input type="checkbox" checked={anual} onChange={(e) => setAnual(e.target.checked)} />
                Se repite cada año
              </label>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={addFecha}>
                Guardar
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
