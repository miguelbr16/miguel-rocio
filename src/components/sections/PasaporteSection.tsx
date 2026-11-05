"use client";

/* eslint-disable @next/next/no-img-element -- las fotos subidas son data URLs */
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SyncBadge } from "@/components/SyncBadge";
import { Stamp } from "@/components/passport/Stamp";
import { useCoupleSync } from "@/context/CoupleSyncContext";
import { photosOf, wishlist, type StampArt } from "@/data/journey";
import { useTrips } from "@/lib/shared-store";
import { ART_LABELS, PHOTO_ERROR, compressImage, findPlace, guessArt } from "@/lib/passport";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PassportPlace } from "@/types/couple-sync";

type Page = {
  id: string;
  place: string;
  country: string;
  when: string;
  art: StampArt;
  album?: string;
  added?: boolean;
  upcoming?: boolean;
  blank?: boolean;
  url?: string;
};

const MAX_PHOTOS = 3;

export function PasaporteSection() {
  const reduced = useReducedMotion();
  const trips = useTrips();
  const { data, savePassport } = useCoupleSync();
  const added = useMemo(() => data.passport ?? [], [data.passport]);
  const uploaded = useMemo(() => data.passportPhotos ?? {}, [data.passportPhotos]);

  const pages: Page[] = useMemo(() => {
    const list: Page[] = [
      ...trips.map((t) => ({
        id: t.id,
        place: t.place,
        country: t.country,
        when: t.when,
        art: t.art,
        album: t.album,
        upcoming: t.upcoming,
        url: t.url,
      })),
      ...added.map((p) => ({ id: p.id, place: p.place, country: p.country, when: p.when, art: p.art, added: true })),
    ];
    const done = new Set(list.map((p) => p.place.toLowerCase()));
    for (const w of wishlist) {
      if (!done.has(w.toLowerCase())) list.push({ id: `w-${w}`, place: w, country: "", when: "", art: "city", blank: true });
    }
    return list;
  }, [trips, added]);

  const spreads = Math.ceil(pages.length / 2);
  const [s, setS] = useState(0);
  const [dir, setDir] = useState(1);
  const [adding, setAdding] = useState(false);
  const si = Math.min(s, spreads - 1);
  const left = pages[si * 2];
  const right = pages[si * 2 + 1];

  function go(n: number) {
    const next = Math.max(0, Math.min(spreads - 1, n));
    setDir(next >= si ? 1 : -1);
    setS(next);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) go(si + 1);
    else if (info.offset.x > 60) go(si - 1);
  }

  function photosFor(p: Page) {
    return [...(p.album ? photosOf(p.album) : []), ...(uploaded[p.id] ?? [])].slice(0, MAX_PHOTOS);
  }

  async function addPhotos(p: Page, files: FileList | null) {
    if (!files?.length) return;
    const room = MAX_PHOTOS - photosFor(p).length;
    const list = Array.from(files).slice(0, Math.max(0, room));
    const urls: string[] = [];
    for (const f of list) {
      try {
        urls.push(await compressImage(f));
      } catch {
        /* foto ilegible: se ignora */
      }
    }
    if (!urls.length) {
      window.alert(PHOTO_ERROR);
      return;
    }
    savePassport(added, { ...uploaded, [p.id]: [...(uploaded[p.id] ?? []), ...urls] });
  }

  function removePhoto(p: Page, src: string) {
    savePassport(added, { ...uploaded, [p.id]: (uploaded[p.id] ?? []).filter((x) => x !== src) });
  }

  function removePlace(p: Page) {
    if (!window.confirm(`¿Quitar ${p.place} del pasaporte?`)) return;
    const rest = { ...uploaded };
    delete rest[p.id];
    savePassport(
      added.filter((x) => x.id !== p.id),
      rest,
    );
  }

  function onAdded(place: PassportPlace, photos: string[]) {
    savePassport([...added, place], photos.length ? { ...uploaded, [place.id]: photos } : uploaded);
    setAdding(false);
    const at = trips.length + added.length; // índice de la nueva hoja
    setDir(1);
    setS(Math.floor(at / 2));
  }

  const stamped = pages.filter((p) => !p.blank && !p.upcoming).length;

  function renderPage(p: Page | undefined, n: number, side: "l" | "r") {
    if (!p) return <div className={`pp-page pp-page-${side} pp-page-end`} aria-hidden />;
    return (
      <article className={`pp-page pp-page-${side}`}>
        <div className="pp-page-head">
          <span>{p.blank ? "Pendiente" : p.country || " "}</span>
          <span>{n}</span>
        </div>
        {p.blank ? (
          <div className="pp-blank">
            <div className="pp-blank-slot">{p.place}</div>
            <p>Página reservada. El sello lo ponemos juntos.</p>
          </div>
        ) : (
          <>
            <motion.div
              className={`pp-stamp ${p.upcoming ? "is-upcoming" : ""}`}
              initial={reduced ? false : { scale: 1.7, rotate: -18, opacity: 0 }}
              animate={{ scale: 1, rotate: n % 2 ? 7 : -6, opacity: p.upcoming ? 0.45 : 1 }}
              transition={{ delay: side === "l" ? 0.2 : 0.35, type: "spring", stiffness: 420, damping: 18 }}
            >
              <Stamp place={p.place} country={p.country || "—"} date={p.when} art={p.art} size={170} />
            </motion.div>
            <h3 className="pp-place">{p.place}</h3>
            <p className="pp-when">
              {p.upcoming ? `Próximo · ${p.when}` : p.when}
              {p.url ? (
                <>
                  {" · "}
                  <a href={p.url} target="_blank" rel="noreferrer">
                    guía del viaje
                  </a>
                </>
              ) : null}
            </p>
            <PhotoRow
              photos={photosFor(p)}
              uploaded={uploaded[p.id] ?? []}
              onAdd={(files) => addPhotos(p, files)}
              onRemove={(src) => removePhoto(p, src)}
            />
            {p.added ? (
              <button type="button" className="pp-remove" onClick={() => removePlace(p)}>
                Quitar esta hoja
              </button>
            ) : null}
          </>
        )}
      </article>
    );
  }

  return (
    <section id="pasaporte" className="section-wrap">
      <div className="page-container pp-container">
        <SectionHeader
          label="Pasaporte"
          title="Nuestro pasaporte"
          description={`${stamped} sellos desde Valencia. Cada viaje, su hoja.`}
          action={<SyncBadge />}
        />

        <div className="pp-book">
          <div className="pp-spread-wrap">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={si}
                className="pp-spread"
                drag={reduced ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={onDragEnd}
                initial={reduced ? { opacity: 0 } : { rotateY: dir > 0 ? 35 : -35, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { rotateY: dir > 0 ? -35 : 35, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderPage(left, si * 2 + 1, "l")}
                <div className="pp-spine" aria-hidden />
                {renderPage(right, si * 2 + 2, "r")}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="pp-controls">
            <button type="button" className="btn btn-ghost" onClick={() => go(si - 1)} disabled={si === 0}>
              Anterior
            </button>
            <span className="pp-count">
              {si + 1} / {spreads}
            </span>
            <button type="button" className="btn btn-primary" onClick={() => go(si + 1)} disabled={si === spreads - 1}>
              Pasar página
            </button>
          </div>
        </div>

        <div className="pp-side">
          <ul className="pp-index" aria-label="Hojas del pasaporte">
            {pages.map((p, k) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`${Math.floor(k / 2) === si ? "is-on" : ""} ${p.blank ? "is-blank" : ""}`}
                  onClick={() => go(Math.floor(k / 2))}
                >
                  {p.place}
                </button>
              </li>
            ))}
          </ul>
          <AddPlace open={adding} onOpen={() => setAdding(true)} onCancel={() => setAdding(false)} onAdded={onAdded} />
        </div>
      </div>
    </section>
  );
}

function PhotoRow({
  photos,
  uploaded,
  onAdd,
  onRemove,
}: {
  photos: string[];
  uploaded: string[];
  onAdd: (files: FileList | null) => void;
  onRemove: (src: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const empty = MAX_PHOTOS - photos.length;
  return (
    <div className="pp-photos">
      {photos.map((src, k) => (
        <figure key={src.slice(0, 64) + k} className={`pp-photo pp-photo-${k}`}>
          {src.startsWith("data:") ? (
            <img src={src} alt="" />
          ) : (
            <Image src={src} alt="" fill sizes="140px" className="object-cover" />
          )}
          {uploaded.includes(src) ? (
            <button type="button" className="pp-photo-x" aria-label="Quitar foto" onClick={() => onRemove(src)}>
              ×
            </button>
          ) : null}
        </figure>
      ))}
      {empty > 0 ? (
        <button type="button" className="pp-photo pp-photo-add" onClick={() => input.current?.click()}>
          <span>+ Foto</span>
          <input
            ref={input}
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            hidden
            onChange={(e) => {
              onAdd(e.target.files);
              e.target.value = "";
            }}
          />
        </button>
      ) : null}
      {Array.from({ length: Math.max(0, empty - 1) }, (_, k) => (
        <div key={`e${k}`} className="pp-photo pp-photo-empty" aria-hidden />
      ))}
    </div>
  );
}

function AddPlace({
  open,
  onOpen,
  onCancel,
  onAdded,
}: {
  open: boolean;
  onOpen: () => void;
  onCancel: () => void;
  onAdded: (p: PassportPlace, photos: string[]) => void;
}) {
  const [name, setName] = useState("");
  const [when, setWhen] = useState("");
  const [country, setCountry] = useState("");
  const [art, setArt] = useState<StampArt>("city");
  const [artTouched, setArtTouched] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [looking, setLooking] = useState(false);

  // Mientras escribes, busca el sitio y propone país y sello.
  useEffect(() => {
    const q = name.trim();
    if (q.length < 3) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLooking(true);
      try {
        const found = await findPlace(q, ctrl.signal);
        if (found) {
          setCountry(found.country);
          setCoords({ lat: found.lat, lng: found.lng });
          if (!artTouched) setArt(found.art);
        }
      } catch {
        /* sin conexión: se queda la suposición por nombre */
      } finally {
        setLooking(false);
      }
    }, 600);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [name, artTouched]);

  if (!open) {
    return (
      <button type="button" className="pp-add-open" onClick={onOpen}>
        <span className="pp-add-plus">+</span>
        <span>
          <strong>Añadir un sitio</strong>
          <br />
          Escribe el nombre y sale su sello.
        </span>
      </button>
    );
  }

  const shown = name.trim() || "Nuevo sitio";

  return (
    <form
      className="pp-add"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdded(
          {
            id: `p-${Date.now().toString(36)}`,
            place: name.trim(),
            country: country.trim(),
            when: when.trim() || new Date().getFullYear().toString(),
            art,
            lat: coords?.lat,
            lng: coords?.lng,
            addedAt: new Date().toISOString(),
          },
          photos,
        );
        setName("");
        setWhen("");
        setCountry("");
        setPhotos([]);
        setArtTouched(false);
      }}
    >
      <div className="pp-add-preview">
        <Stamp place={shown} country={country || "…"} date={when || "2026"} art={art} size={150} />
      </div>
      <label className="pp-field">
        <span>Sitio</span>
        <input
          className="field-input"
          value={name}
          placeholder="Dolomitas"
          autoFocus
          onChange={(e) => {
            setName(e.target.value);
            if (!artTouched) setArt(guessArt(e.target.value));
          }}
        />
      </label>
      <div className="pp-field-row">
        <label className="pp-field">
          <span>País {looking ? "· buscando…" : ""}</span>
          <input className="field-input" value={country} placeholder="Italia" onChange={(e) => setCountry(e.target.value)} />
        </label>
        <label className="pp-field">
          <span>Cuándo</span>
          <input className="field-input" value={when} placeholder="Jul 2027" onChange={(e) => setWhen(e.target.value)} />
        </label>
      </div>
      <label className="pp-field">
        <span>Sello</span>
        <select
          className="field-input"
          value={art}
          onChange={(e) => {
            setArt(e.target.value as StampArt);
            setArtTouched(true);
          }}
        >
          {Object.entries(ART_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <label className="pp-field">
        <span>Fotos (hasta 3)</span>
        <input
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS);
            const out: string[] = [];
            for (const f of files) {
              try {
                out.push(await compressImage(f));
              } catch {
                /* ignorada */
              }
            }
            if (files.length && !out.length) window.alert(PHOTO_ERROR);
            setPhotos(out);
          }}
        />
      </label>
      <div className="pp-add-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
          Sellar
        </button>
      </div>
    </form>
  );
}
