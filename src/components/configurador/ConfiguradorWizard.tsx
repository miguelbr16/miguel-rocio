"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { loadSiteConfig } from "@/lib/site-config-storage";
import { createDefaultSiteConfig } from "@/lib/site-config";
import { useSiteConfig } from "@/context/SiteConfigContext";
import type { SiteConfig } from "@/types/site-config";
import type { FechaEspecial } from "@/data/fechas";
import { defaultCaseSteps, getCaseSteps, type CaseStep } from "@/data/caso002";
import { CASE_STEPS_KEY, isMiguel, isMiguelCode, pushShared, setMiguel } from "@/lib/miguel";

const STEPS = [
  { id: "identidad", label: "Identidad", icon: "🪪" },
  { id: "carta", label: "Carta", icon: "💌" },
  { id: "sorpresa", label: "Gran noche", icon: "🥂" },
  { id: "caso", label: "Caso 002", icon: "🔍" },
  { id: "fechas", label: "Fechas", icon: "📅" },
  { id: "historia", label: "Hito", icon: "📖" },
  { id: "cerrar", label: "Cerrar", icon: "✅" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.15em] text-[#c8607a]">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-[#666]">{hint}</span> : null}
    </label>
  );
}

function inputClass(extra = "") {
  return `exp-input w-full ${extra}`.trim();
}

export function ConfiguradorWizard() {
  const { config: liveConfig, applyAndSave, resetConfig } = useSiteConfig();
  const [gateOk, setGateOk] = useState(false);
  const [gateCode, setGateCode] = useState("");
  const [gateError, setGateError] = useState("");
  const [step, setStep] = useState<StepId>("identidad");
  const [draft, setDraft] = useState<SiteConfig>(() => createDefaultSiteConfig());
  const [saved, setSaved] = useState(false);
  const [importText, setImportText] = useState("");
  const [steps, setSteps] = useState<CaseStep[]>(defaultCaseSteps);
  const [shareMsg, setShareMsg] = useState("");

  useEffect(() => {
    setDraft(loadSiteConfig());
  }, [liveConfig.updatedAt]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSteps(getCaseSteps());
      if (isMiguel()) setGateOk(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  function updateStep(index: number, patch: Partial<CaseStep>) {
    setSteps((prev) => prev.map((s, k) => (k === index ? { ...s, ...patch } : s)));
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const patch = useCallback((partial: Partial<SiteConfig>) => {
    setDraft((prev) => ({
      ...prev,
      ...partial,
      couple: { ...prev.couple, ...partial.couple },
      hero: { ...prev.hero, ...partial.hero },
      cartaIntro: { ...prev.cartaIntro, ...partial.cartaIntro },
      sorpresa: {
        ...prev.sorpresa,
        ...partial.sorpresa,
        cena: { ...prev.sorpresa.cena, ...partial.sorpresa?.cena },
        flores: { ...prev.sorpresa.flores, ...partial.sorpresa?.flores },
        extra: { ...prev.sorpresa.extra, ...partial.sorpresa?.extra },
        cartaFisica: { ...prev.sorpresa.cartaFisica, ...partial.sorpresa?.cartaFisica },
      },
    }));
  }, []);

  async function tryGate() {
    if (await isMiguelCode(gateCode)) {
      setMiguel(true);
      setGateOk(true);
      setGateError("");
      return;
    }
    setGateError("Código incorrecto.");
    setGateCode("");
  }

  function updateFecha(index: number, field: keyof FechaEspecial, value: string | boolean) {
    setDraft((prev) => {
      const fechas = [...prev.fechas];
      fechas[index] = { ...fechas[index], [field]: value };
      return { ...prev, fechas };
    });
  }

  async function handleSave() {
    applyAndSave({ ...draft, timelineExtra: draft.timelineExtra });
    const clean = steps.filter((s) => s.title.trim() && s.brief.trim());
    localStorage.setItem(CASE_STEPS_KEY, JSON.stringify(clean));
    setSaved(true);
    const saved = loadSiteConfig();
    setDraft(saved);
    setShareMsg("Enviando al móvil de Rocío…");
    const r = await pushShared({ siteConfig: saved, caseSteps: clean });
    setShareMsg(
      r === "ok"
        ? "Enviado: le llegará a Rocío la próxima vez que abra la web."
        : r === "local"
          ? "Guardado solo en este móvil: falta activar la sincronización en Vercel."
          : "No se pudo enviar. Revisa la conexión y vuelve a guardar.",
    );
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `site-config-${draft.couple.name1}-${draft.couple.name2}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    try {
      const parsed = JSON.parse(importText) as Partial<SiteConfig>;
      setDraft((prev) => ({
        ...createDefaultSiteConfig(),
        ...prev,
        ...parsed,
        couple: { ...prev.couple, ...parsed.couple },
        sorpresa: {
          ...prev.sorpresa,
          ...parsed.sorpresa,
          cena: { ...prev.sorpresa.cena, ...parsed.sorpresa?.cena },
          flores: { ...prev.sorpresa.flores, ...parsed.sorpresa?.flores },
          extra: { ...prev.sorpresa.extra, ...parsed.sorpresa?.extra },
          cartaFisica: { ...prev.sorpresa.cartaFisica, ...parsed.sorpresa?.cartaFisica },
        },
        fechas: parsed.fechas ?? prev.fechas,
      }));
      setImportText("");
    } catch {
      setGateError("JSON inválido.");
    }
  }

  const preview = useMemo(
    () => ({
      names: `${draft.couple.name1} & ${draft.couple.name2}`,
      start: draft.relationshipStart,
      cena: draft.sorpresa.cena.restaurante,
    }),
    [draft],
  );

  if (!gateOk) {
    return (
      <div className="exp-root flex min-h-[100dvh] flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8607a]">Acceso restringido</p>
          <h1 className="mt-4 font-serif text-3xl text-[#f5e6d3]">Configurador del expediente</h1>
          <p className="mt-3 text-sm text-[#a89080]">
            Solo para Miguel. Introduce tu código de Miguel (no el de la web).
          </p>
          <input
            type="password"
            value={gateCode}
            onChange={(e) => setGateCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void tryGate()}
            placeholder="······"
            className={`${inputClass()} mt-6 text-center`}
          />
          <button type="button" onClick={() => void tryGate()} className="exp-btn mt-4 w-full">
            Entrar al configurador
          </button>
          {gateError ? <p className="mt-3 text-sm text-[#c8607a]">{gateError}</p> : null}
          <Link href="/" className="mt-8 inline-block text-sm text-[#e8d5a3]/80 underline">
            ← Volver a la web
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="exp-root min-h-[100dvh] pb-10">
      <header className="exp-header sticky top-0 z-10 px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="text-xs tracking-wider text-[#e8d5a3]/80">
            ← Web
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c8607a]">
            Configurador · M&R
          </span>
          <span className="text-[10px] text-[#666]">
            {stepIndex + 1}/{STEPS.length}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-6">
        <div className="mb-6 flex justify-between gap-1">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-[9px] uppercase tracking-wide transition ${
                step === s.id
                  ? "bg-[#c8607a]/20 text-[#e8d5a3]"
                  : i < stepIndex
                    ? "text-[#c8607a]"
                    : "text-[#555]"
              }`}
            >
              <span className="text-base">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            {step === "identidad" ? (
              <section className="space-y-4">
                <div className="exp-briefing">
                  <strong>Paso 1 — Identidad del caso.</strong> Datos básicos que verá en la home y
                  el acceso a la web.
                </div>
                <div className="exp-card space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Nombre 1">
                      <input
                        className={inputClass()}
                        value={draft.couple.name1}
                        onChange={(e) => patch({ couple: { ...draft.couple, name1: e.target.value } })}
                      />
                    </Field>
                    <Field label="Nombre 2">
                      <input
                        className={inputClass()}
                        value={draft.couple.name2}
                        onChange={(e) => patch({ couple: { ...draft.couple, name2: e.target.value } })}
                      />
                    </Field>
                  </div>
                  <Field label="Fecha de inicio" hint="Primer beso / inicio oficial">
                    <input
                      type="date"
                      className={inputClass()}
                      value={draft.relationshipStart}
                      onChange={(e) => patch({ relationshipStart: e.target.value })}
                    />
                  </Field>
                  <Field label="Código de acceso" hint="El que usa para entrar a la web">
                    <input
                      className={inputClass()}
                      value={draft.lockCode}
                      onChange={(e) => patch({ lockCode: e.target.value })}
                    />
                  </Field>
                  <Field label="Subtítulo de la home">
                    <input
                      className={inputClass()}
                      value={draft.hero.tagline}
                      onChange={(e) => patch({ hero: { tagline: e.target.value } })}
                    />
                  </Field>
                </div>
              </section>
            ) : null}

            {step === "carta" ? (
              <section className="space-y-4">
                <div className="exp-briefing">
                  <strong>Paso 2 — Carta principal.</strong> El texto fijo de la sección Cartas (Para
                  ti).
                </div>
                <div className="exp-card space-y-4">
                  <Field label="Saludo">
                    <input
                      className={inputClass()}
                      value={draft.cartaIntro.saludo}
                      onChange={(e) =>
                        patch({ cartaIntro: { ...draft.cartaIntro, saludo: e.target.value } })
                      }
                    />
                  </Field>
                  <Field label="Párrafos" hint="Separa párrafos con una línea en blanco">
                    <textarea
                      className={`${inputClass()} min-h-[140px] resize-y`}
                      value={draft.cartaIntro.paragraphs.join("\n\n")}
                      onChange={(e) =>
                        patch({
                          cartaIntro: {
                            ...draft.cartaIntro,
                            paragraphs: e.target.value
                              .split("\n\n")
                              .map((p) => p.trim())
                              .filter(Boolean),
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Firma">
                    <input
                      className={inputClass()}
                      value={draft.cartaIntro.firma}
                      onChange={(e) =>
                        patch({ cartaIntro: { ...draft.cartaIntro, firma: e.target.value } })
                      }
                    />
                  </Field>
                </div>
              </section>
            ) : null}

            {step === "sorpresa" ? (
              <section className="space-y-4">
                <div className="exp-briefing">
                  <strong>Paso 3 — Operación gran noche.</strong> Lo que Rocío verá al completar el
                  Caso 002 el 18 de noviembre.
                </div>
                <div className="exp-card space-y-4">
                  <Field label="Fecha y hora del reveal">
                    <input
                      type="datetime-local"
                      className={inputClass()}
                      value={draft.sorpresa.revealAt}
                      onChange={(e) =>
                        patch({ sorpresa: { ...draft.sorpresa, revealAt: e.target.value } })
                      }
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-sm text-[#c4b5a5]">
                    <input
                      type="checkbox"
                      checked={draft.sorpresa.devUnlockAll}
                      onChange={(e) =>
                        patch({ sorpresa: { ...draft.sorpresa, devUnlockAll: e.target.checked } })
                      }
                    />
                    Modo prueba — desbloquear todo (solo para ti)
                  </label>
                </div>
                <div className="exp-card space-y-3">
                  <p className="exp-card-stamp">🍽️ Cena</p>
                  <Field label="Restaurante">
                    <input
                      className={inputClass()}
                      value={draft.sorpresa.cena.restaurante}
                      onChange={(e) =>
                        patch({
                          sorpresa: {
                            ...draft.sorpresa,
                            cena: { ...draft.sorpresa.cena, restaurante: e.target.value },
                          },
                        })
                      }
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Hora">
                      <input
                        className={inputClass()}
                        value={draft.sorpresa.cena.hora}
                        onChange={(e) =>
                          patch({
                            sorpresa: {
                              ...draft.sorpresa,
                              cena: { ...draft.sorpresa.cena, hora: e.target.value },
                            },
                          })
                        }
                      />
                    </Field>
                    <Field label="Dirección">
                      <input
                        className={inputClass()}
                        value={draft.sorpresa.cena.direccion}
                        onChange={(e) =>
                          patch({
                            sorpresa: {
                              ...draft.sorpresa,
                              cena: { ...draft.sorpresa.cena, direccion: e.target.value },
                            },
                          })
                        }
                      />
                    </Field>
                  </div>
                  <Field label="Nota">
                    <input
                      className={inputClass()}
                      value={draft.sorpresa.cena.nota}
                      onChange={(e) =>
                        patch({
                          sorpresa: {
                            ...draft.sorpresa,
                            cena: { ...draft.sorpresa.cena, nota: e.target.value },
                          },
                        })
                      }
                    />
                  </Field>
                </div>
                <div className="exp-card space-y-3">
                  <p className="exp-card-stamp">🌹 Flores</p>
                  <Field label="Mensaje">
                    <input
                      className={inputClass()}
                      value={draft.sorpresa.flores.mensaje}
                      onChange={(e) =>
                        patch({
                          sorpresa: {
                            ...draft.sorpresa,
                            flores: { ...draft.sorpresa.flores, mensaje: e.target.value },
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Dónde">
                    <input
                      className={inputClass()}
                      value={draft.sorpresa.flores.detalle}
                      onChange={(e) =>
                        patch({
                          sorpresa: {
                            ...draft.sorpresa,
                            flores: { ...draft.sorpresa.flores, detalle: e.target.value },
                          },
                        })
                      }
                    />
                  </Field>
                </div>
                <div className="exp-card space-y-3">
                  <p className="exp-card-stamp">✨ Sorpresa extra</p>
                  <div className="grid gap-3 sm:grid-cols-[4rem_1fr]">
                    <Field label="Emoji">
                      <input
                        className={inputClass()}
                        value={draft.sorpresa.extra.emoji}
                        onChange={(e) =>
                          patch({
                            sorpresa: {
                              ...draft.sorpresa,
                              extra: { ...draft.sorpresa.extra, emoji: e.target.value },
                            },
                          })
                        }
                      />
                    </Field>
                    <Field label="Título">
                      <input
                        className={inputClass()}
                        value={draft.sorpresa.extra.titulo}
                        onChange={(e) =>
                          patch({
                            sorpresa: {
                              ...draft.sorpresa,
                              extra: { ...draft.sorpresa.extra, titulo: e.target.value },
                            },
                          })
                        }
                      />
                    </Field>
                  </div>
                  <Field label="Mensaje">
                    <textarea
                      className={`${inputClass()} min-h-[80px]`}
                      value={draft.sorpresa.extra.mensaje}
                      onChange={(e) =>
                        patch({
                          sorpresa: {
                            ...draft.sorpresa,
                            extra: { ...draft.sorpresa.extra, mensaje: e.target.value },
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Pista">
                    <input
                      className={inputClass()}
                      value={draft.sorpresa.extra.hint}
                      onChange={(e) =>
                        patch({
                          sorpresa: {
                            ...draft.sorpresa,
                            extra: { ...draft.sorpresa.extra, hint: e.target.value },
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Carta física">
                    <input
                      className={inputClass()}
                      value={draft.sorpresa.cartaFisica.mensaje}
                      onChange={(e) =>
                        patch({
                          sorpresa: {
                            ...draft.sorpresa,
                            cartaFisica: { ...draft.sorpresa.cartaFisica, mensaje: e.target.value },
                          },
                        })
                      }
                    />
                  </Field>
                </div>
              </section>
            ) : null}

            {step === "caso" ? (
              <section className="space-y-4">
                <div className="exp-briefing">
                  <strong>Caso 002 — preguntas del 18.</strong> Cada prueba: título, el texto que lee
                  Rocío (usa **así** para negrita), las respuestas válidas separadas por comas, una pista
                  si falla dos veces y la frase al acertar. Se guarda en el último paso.
                </div>
                {steps.map((st, k) => (
                  <div key={st.id} className="exp-card space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="exp-card-stamp">Prueba {k + 1}</p>
                      <div className="flex gap-3 text-xs text-[#a89080]">
                        <button
                          type="button"
                          disabled={k === 0}
                          onClick={() =>
                            setSteps((p) => {
                              const n = [...p];
                              [n[k - 1], n[k]] = [n[k], n[k - 1]];
                              return n;
                            })
                          }
                        >
                          Subir
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("¿Borrar esta prueba?")) setSteps((p) => p.filter((_, j) => j !== k));
                          }}
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                    <Field label="Título">
                      <input className={inputClass()} value={st.title} onChange={(e) => updateStep(k, { title: e.target.value })} />
                    </Field>
                    <Field label="Texto de la prueba">
                      <textarea
                        className={`${inputClass()} min-h-[120px]`}
                        value={st.brief}
                        onChange={(e) => updateStep(k, { brief: e.target.value })}
                      />
                    </Field>
                    <Field label="Respuestas válidas" hint="Separadas por comas. Da igual mayúsculas y tildes.">
                      <input
                        className={inputClass()}
                        value={(st.keys ?? []).join(", ")}
                        onChange={(e) =>
                          updateStep(k, {
                            keys: e.target.value
                              .split(",")
                              .map((x) => x.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </Field>
                    <Field label="Pista (tras 2 fallos)">
                      <input className={inputClass()} value={st.hint ?? ""} onChange={(e) => updateStep(k, { hint: e.target.value })} />
                    </Field>
                    <Field label="Frase al acertar">
                      <input className={inputClass()} value={st.solved} onChange={(e) => updateStep(k, { solved: e.target.value })} />
                    </Field>
                  </div>
                ))}
                <button
                  type="button"
                  className="exp-btn w-full"
                  onClick={() =>
                    setSteps((p) => [
                      ...p.slice(0, -1),
                      { id: `s-${Date.now().toString(36)}`, title: "Nueva prueba", brief: "", kind: "q", keys: [], solved: "" },
                      ...p.slice(-1),
                    ])
                  }
                >
                  Añadir prueba (antes del cierre)
                </button>
                <button
                  type="button"
                  className="w-full py-2 text-xs text-[#666] underline"
                  onClick={() => {
                    if (confirm("¿Volver a las preguntas de serie?")) setSteps(defaultCaseSteps);
                  }}
                >
                  Volver a las de serie
                </button>
              </section>
            ) : null}

            {step === "fechas" ? (
              <section className="space-y-4">
                <div className="exp-briefing">
                  <strong>Paso 4 — Fechas especiales.</strong> Calendario de la web. Edita las que
                  quieras.
                </div>
                <div className="space-y-3">
                  {draft.fechas.map((f, i) => (
                    <div key={`${f.nombre}-${i}`} className="exp-card space-y-2">
                      <div className="grid grid-cols-[3rem_1fr] gap-2">
                        <input
                          className={inputClass()}
                          value={f.emoji}
                          onChange={(e) => updateFecha(i, "emoji", e.target.value)}
                        />
                        <input
                          className={inputClass()}
                          value={f.nombre}
                          onChange={(e) => updateFecha(i, "nombre", e.target.value)}
                        />
                      </div>
                      <input
                        type="date"
                        className={inputClass()}
                        value={f.dateStr}
                        onChange={(e) => updateFecha(i, "dateStr", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {step === "historia" ? (
              <section className="space-y-4">
                <div className="exp-briefing">
                  <strong>Paso 5 — Nuevo hito (opcional).</strong> Añade un momento a la timeline al
                  guardar.
                </div>
                <div className="exp-card space-y-4">
                  {draft.timelineExtra.length === 0 ? (
                    <button
                      type="button"
                      className="exp-btn w-full"
                      onClick={() =>
                        patch({
                          timelineExtra: [
                            {
                              date: "Nuevo hito",
                              dot: "normal",
                              title: "",
                              text: "",
                              tag: "Reciente",
                              tagColor: "rosa",
                            },
                          ],
                        })
                      }
                    >
                      + Añadir hito
                    </button>
                  ) : (
                    draft.timelineExtra.map((ev, i) => (
                      <div key={i} className="space-y-3">
                        <Field label="Fecha (texto libre)">
                          <input
                            className={inputClass()}
                            value={ev.date}
                            onChange={(e) => {
                              const next = [...draft.timelineExtra];
                              next[i] = { ...ev, date: e.target.value };
                              patch({ timelineExtra: next });
                            }}
                          />
                        </Field>
                        <Field label="Título">
                          <input
                            className={inputClass()}
                            value={ev.title}
                            onChange={(e) => {
                              const next = [...draft.timelineExtra];
                              next[i] = { ...ev, title: e.target.value };
                              patch({ timelineExtra: next });
                            }}
                          />
                        </Field>
                        <Field label="Texto">
                          <textarea
                            className={`${inputClass()} min-h-[100px]`}
                            value={ev.text}
                            onChange={(e) => {
                              const next = [...draft.timelineExtra];
                              next[i] = { ...ev, text: e.target.value };
                              patch({ timelineExtra: next });
                            }}
                          />
                        </Field>
                        <button
                          type="button"
                          className="text-xs text-[#666] underline"
                          onClick={() => patch({ timelineExtra: [] })}
                        >
                          Quitar hito
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            ) : null}

            {step === "cerrar" ? (
              <section className="space-y-4">
                <div className="exp-briefing">
                  <strong>Paso 6 — Cerrar expediente.</strong> Revisa y aplica los cambios a la web.
                </div>
                <div className="exp-card space-y-2 text-sm text-[#c4b5a5]">
                  <p>
                    <span className="text-[#c8607a]">Pareja:</span> {preview.names}
                  </p>
                  <p>
                    <span className="text-[#c8607a]">Inicio:</span> {preview.start}
                  </p>
                  <p>
                    <span className="text-[#c8607a]">Cena:</span> {preview.cena}
                  </p>
                  <p>
                    <span className="text-[#c8607a]">Fechas:</span> {draft.fechas.length} en
                    calendario
                  </p>
                  {draft.timelineExtra.length > 0 ? (
                    <p>
                      <span className="text-[#c8607a]">Nuevo hito:</span>{" "}
                      {draft.timelineExtra[0]?.title || "(sin título)"}
                    </p>
                  ) : null}
                </div>

                <button type="button" onClick={() => void handleSave()} className="exp-btn w-full">
                  ✅ Aplicar cambios a la web
                </button>

                {shareMsg ? <p className="text-center text-sm text-[#e8d5a3]">{shareMsg}</p> : null}
                {saved ? (
                  <p className="text-center text-sm text-[#e8d5a3]">
                    ¡Guardado!{" "}
                    <Link href="/" className="underline">
                      Ver la web →
                    </Link>
                  </p>
                ) : null}

                <div className="exp-card space-y-3">
                  <p className="exp-card-stamp">Backup</p>
                  <button type="button" onClick={handleExport} className="exp-btn w-full">
                    Exportar JSON
                  </button>
                  <textarea
                    className={`${inputClass()} min-h-[80px] text-xs`}
                    placeholder="Pegar JSON para importar…"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                  />
                  <button type="button" onClick={handleImport} className="exp-btn w-full">
                    Importar JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("¿Restaurar valores por defecto del código?")) resetConfig();
                    }}
                    className="w-full py-2 text-xs text-[#666] underline"
                  >
                    Restaurar defaults
                  </button>
                </div>
              </section>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStep(STEPS[stepIndex - 1].id)}
            className="flex-1 rounded-xl border border-[#c8607a]/30 py-3 text-sm text-[#c4b5a5] disabled:opacity-40"
          >
            ← Anterior
          </button>
          <button
            type="button"
            disabled={stepIndex >= STEPS.length - 1}
            onClick={() => setStep(STEPS[stepIndex + 1].id)}
            className="exp-btn flex-1"
          >
            Siguiente →
          </button>
        </div>
      </main>
    </div>
  );
}
