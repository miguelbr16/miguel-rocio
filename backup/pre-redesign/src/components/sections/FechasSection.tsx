"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { fechasEspeciales, type FechaEspecial } from "@/data/fechas";
import { daysUntilDate, formatSpanishDate } from "@/lib/dates";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState } from "react";

function FechaRow({ f, idx, onDelete }: { f: FechaEspecial & { idx: number; days: number }; idx: number; onDelete: (i: number) => void }) {
  const isToday = f.days === 0;
  const isSoon = f.days <= 7;
  const badge = isToday ? "¡Hoy! 🎉" : f.days === 1 ? "Mañana" : `En ${f.days} días`;
  const badgeClass = isToday
    ? "bg-amber-100 text-amber-800"
    : isSoon
      ? "bg-rose-pale text-rose-deep"
      : "bg-sky-pale text-sky-deep";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-3 ${isToday ? "border-rose-deep" : "border-border"}`}
    >
      <span className="text-2xl">{f.emoji}</span>
      <div className="min-w-0 flex-1">
        <div className={`truncate text-sm ${isToday ? "font-medium" : ""}`}>{f.nombre}</div>
        <div className="text-xs text-text-light">{formatSpanishDate(f.dateStr)}</div>
      </div>
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeClass}`}>
        {badge}
      </span>
      <button
        type="button"
        onClick={() => onDelete(idx)}
        className="text-lg leading-none text-text-light hover:text-text"
        aria-label="Eliminar"
      >
        ×
      </button>
    </div>
  );
}

export function FechasSection() {
  const { value: fechas, save } = useLocalStorage("fechas-v2", fechasEspeciales);
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
    save([...fechas, { emoji: emoji || "📅", nombre: nombre.trim(), dateStr, anual }]);
    setEmoji("");
    setNombre("");
    setDateStr("");
    setShowForm(false);
  }

  function deleteFecha(idx: number) {
    save(fechas.filter((_, i) => i !== idx));
  }

  return (
    <section id="fechas" className="section-wrap">
      <SectionHeader
        label="Nuestro calendario"
        title="Fechas especiales"
        description="Las fechas que importan de verdad, con aviso cuando se acercan."
      />
      <div className="space-y-2">
        {sorted.map((f) => (
          <FechaRow key={`${f.nombre}-${f.idx}`} f={f} idx={f.idx} onDelete={deleteFecha} />
        ))}
      </div>
      <div className="mt-6">
        <button type="button" className="btn-secondary w-full" onClick={() => setShowForm(!showForm)}>
          + Añadir fecha especial
        </button>
        {showForm ? (
          <div className="mt-3 space-y-3 rounded-xl border border-border bg-cream p-4">
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
              <button type="button" className="btn-primary flex-1" onClick={addFecha}>
                Guardar
              </button>
              <button type="button" className="btn-ghost flex-1" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
