"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { StampArt, Trip, Vehicle } from "@/data/journey";
import { ART_LABELS, findPlace, guessArt } from "@/lib/passport";
import { resetTrips, saveTrips, useSaveState, useTrips } from "@/lib/shared-store";

const BY: Record<Vehicle, string> = { car: "Coche", plane: "Avión", home: "En Valencia" };

/** Editor de viajes (solo modo Miguel): orden, textos, coche/avión, próximo. */
export function TripsEditor({ onClose }: { onClose: () => void }) {
  const trips = useTrips();
  const state = useSaveState();
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  function update(i: number, patch: Partial<Trip>) {
    saveTrips(trips.map((t, k) => (k === i ? { ...t, ...patch } : t)));
  }

  function move(i: number, d: -1 | 1) {
    const j = i + d;
    if (j < 0 || j >= trips.length) return;
    const next = [...trips];
    [next[i], next[j]] = [next[j], next[i]];
    saveTrips(next);
  }

  async function add() {
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    let found = null;
    try {
      found = await findPlace(name);
    } catch {
      /* sin conexión */
    }
    setBusy(false);
    const trip: Trip = {
      id: `t-${Date.now().toString(36)}`,
      place: name,
      country: found?.country ?? "",
      when: "",
      line: "",
      by: "plane",
      lat: found?.lat ?? 39.47,
      lng: found?.lng ?? -0.376,
      album: "",
      art: found?.art ?? guessArt(name),
    };
    saveTrips([...trips, trip]);
    setNewName("");
  }

  return (
    <div className="editor-scrim" role="dialog" aria-modal="true" aria-label="Editar viajes" onClick={onClose}>
      <motion.div
        className="editor"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="editor-head">
          <div>
            <h2>Editar viajes</h2>
            <p>
              {state === "saving"
                ? "Guardando…"
                : state === "saved"
                  ? "Guardado. Le llega a Rocío."
                  : state === "local"
                    ? "Guardado solo aquí (sin sincronización)."
                    : state === "error"
                      ? "No se pudo guardar en la nube."
                      : "Los cambios se guardan solos."}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Listo
          </button>
        </header>

        <ol className="editor-list">
          {trips.map((t, i) => (
            <li key={t.id} className="editor-item">
              <div className="editor-row editor-row-top">
                <span className="editor-n">{i + 1}</span>
                <input className="field-input" value={t.place} onChange={(e) => update(i, { place: e.target.value })} aria-label="Sitio" />
                <div className="editor-move">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === trips.length - 1} aria-label="Bajar">
                    ↓
                  </button>
                </div>
              </div>
              <div className="editor-row">
                <label>
                  Cuándo
                  <input className="field-input" value={t.when} onChange={(e) => update(i, { when: e.target.value })} />
                </label>
                <label>
                  Cómo
                  <select className="field-input" value={t.by} onChange={(e) => update(i, { by: e.target.value as Vehicle })}>
                    {Object.entries(BY).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Frase
                <textarea className="field-input" rows={2} value={t.line} onChange={(e) => update(i, { line: e.target.value })} />
              </label>
              <div className="editor-row">
                <label>
                  País
                  <input className="field-input" value={t.country} onChange={(e) => update(i, { country: e.target.value })} />
                </label>
                <label>
                  Sello
                  <select className="field-input" value={t.art} onChange={(e) => update(i, { art: e.target.value as StampArt })}>
                    {Object.entries(ART_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="editor-row editor-row-foot">
                <label className="editor-check">
                  <input type="checkbox" checked={!!t.upcoming} onChange={(e) => update(i, { upcoming: e.target.checked })} />
                  Aún no lo hemos hecho
                </label>
                <button
                  type="button"
                  className="editor-del"
                  onClick={() => {
                    if (confirm(`¿Quitar ${t.place}?`)) saveTrips(trips.filter((_, k) => k !== i));
                  }}
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ol>

        <form
          className="editor-add"
          onSubmit={(e) => {
            e.preventDefault();
            void add();
          }}
        >
          <input className="field-input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Añadir viaje: p. ej. Roma" />
          <button type="submit" className="btn btn-primary" disabled={busy || !newName.trim()}>
            {busy ? "Buscando…" : "Añadir"}
          </button>
        </form>
        <button
          type="button"
          className="editor-reset"
          onClick={() => {
            if (confirm("¿Volver a la lista de serie?")) resetTrips();
          }}
        >
          Volver a la lista de serie
        </button>
      </motion.div>
    </div>
  );
}
