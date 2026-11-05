"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { geoDistance, geoInterpolate, geoOrthographic, geoPath, geoGraticule10, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import { HOME, photosOf, type Trip } from "@/data/journey";
import { useEditMode, useTrips } from "@/lib/shared-store";
import { TripsEditor } from "@/components/edit/TripsEditor";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Countries = FeatureCollection<Geometry, { name: string }>;

const SIZE = 520;

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}
function clamp01(t: number) {
  return Math.max(0, Math.min(1, t));
}

/**
 * Nuestros viajes en un solo bloque: el bloque se queda fijo mientras haces
 * scroll; a la derecha el globo gira y el coche o el avión sale de Valencia
 * hacia cada sitio; a la izquierda, el sitio y sus fotos.
 */
export function TripsGlobe() {
  const reduced = useReducedMotion();
  const trips = useTrips();
  const editing = useEditMode();
  const [editorOpen, setEditorOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [countries, setCountries] = useState<Countries | null>(null);
  const [detail, setDetail] = useState<Countries | null>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = (url: string, set: (c: Countries) => void) =>
      fetch(url)
        .then((r) => r.json())
        .then((topo: Topology<{ countries: GeometryCollection<{ name: string }> }>) => {
          if (alive) set(feature(topo, topo.objects.countries) as unknown as Countries);
        })
        .catch(() => undefined);
    load("/geo/countries-110m.json", setCountries).then(() => load("/geo/countries-50m.json", setDetail));
    return () => {
      alive = false;
    };
  }, []);

  // t va de 0 a trips.length: la parte entera es el viaje, la decimal cuánto llevamos.
  useEffect(() => {
    let raf = 0;
    function frame() {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = clamp01(-r.top / Math.max(1, total));
      setT(p * trips.length);
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(frame);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [trips.length]);

  const k = Math.min(trips.length - 1, Math.floor(t));
  const f = t - k;
  const trip = trips[k];
  // 0–0.2 el globo gira, 0.2–0.8 el viaje, 0.8–1 llegado
  const travel = ease(clamp01((f - 0.15) / 0.6));
  const arrived = f >= 0.75;

  return (
    <section className="trips" aria-labelledby="trips-h">
      <div ref={wrapRef} className="trips-scroll" style={{ height: `${trips.length * 85 + 100}svh` }}>
        <div className="trips-stage">
          <div className="trips-text">
            <h2 id="trips-h" className="trips-eyebrow">
              Nuestros viajes desde Valencia
            </h2>
            {editing ? (
              <button type="button" className="edit-chip" onClick={() => setEditorOpen(true)}>
                Editar viajes
              </button>
            ) : null}
            <AnimatePresence mode="wait" initial={false}>
              <TripText key={trip.id} trip={trip} reduced={reduced} />
            </AnimatePresence>
            <ol className="trips-dots" aria-label="Viajes">
              {trips.map((x, i) => (
                <li key={x.id} className={i < k || (i === k && arrived) ? "is-done" : i === k ? "is-now" : ""}>
                  <span className="sr-only">{x.place}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="trips-globe">
            <Globe trips={trips} countries={countries} detail={detail} trip={trip} k={k} f={f} travel={travel} arrived={arrived} />
          </div>
        </div>
      </div>
      {editorOpen ? <TripsEditor onClose={() => setEditorOpen(false)} /> : null}
    </section>
  );
}

function TripText({ trip, reduced }: { trip: Trip; reduced: boolean }) {
  const photos = photosOf(trip.album).slice(0, 2);
  return (
    <motion.div
      className="trips-card"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="trips-meta">
        {trip.upcoming ? "Próximo viaje · " : ""}
        {trip.when} · {trip.by === "plane" ? "en avión" : trip.by === "car" ? "en coche" : "en casa, en Valencia"}
      </p>
      <h3 className="trips-place">{trip.place}</h3>
      <p className="trips-line">{trip.line}</p>
      <div className="trips-photos">
        {photos.length > 0
          ? photos.map((src, i) => (
              <div key={src} className={`trips-photo trips-photo-${i}`}>
                <Image src={src} alt={`${trip.place}, foto ${i + 1}`} fill sizes="(max-width: 768px) 40vw, 220px" className="object-cover" />
              </div>
            ))
          : [0, 1].map((i) => (
              <div key={i} className={`trips-photo trips-photo-${i} trips-photo-empty`}>
                <span>{trip.place}</span>
              </div>
            ))}
      </div>
    </motion.div>
  );
}

function Globe({
  trips,
  countries,
  detail,
  trip,
  k,
  f,
  travel,
  arrived,
}: {
  trips: Trip[];
  countries: Countries | null;
  detail: Countries | null;
  trip: Trip;
  k: number;
  f: number;
  travel: number;
  arrived: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const home: [number, number] = [HOME.lng, HOME.lat];
  const dest: [number, number] = [trip.lng, trip.lat];
  const R = SIZE / 2 - 8;

  // Gira hacia el viaje, se acerca hasta ver el trayecto y al final se aleja.
  const prev: [number, number] = k > 0 ? midpoint(home, [trips[k - 1].lng, trips[k - 1].lat]) : home;
  const target = midpoint(home, dest);
  const center = geoInterpolate(prev, target)(ease(clamp01(f / 0.2)));
  const span = Math.max(geoDistance(home, dest), 0.0005);
  const Z = Math.max(1, Math.min(trip.by === "home" ? 7 : 24, (0.42 * SIZE) / (R * span)));
  const zIn = ease(clamp01((f - 0.05) / 0.2));
  const zOut = k < trips.length - 1 ? ease(clamp01((f - 0.9) / 0.1)) : 0;
  const zoom = 1 + (Z - 1) * zIn * (1 - zOut);

  const projection = geoOrthographic()
    .clipAngle(90)
    .precision(0.4)
    .translate([SIZE / 2, SIZE / 2])
    .scale(R * zoom)
    .rotate([-center[0], -center[1]]);
  const path = geoPath(projection);

  const visited = new Set(
    trips
      .slice(0, k + (arrived ? 1 : 0))
      .filter((x) => !x.upcoming)
      .map((x) => x.countryId),
  );
  visited.add("724");

  const land = zoom > 2.2 && detail ? detail : countries;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !land) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const px = canvas.clientWidth * dpr;
    if (canvas.width !== px) {
      canvas.width = px;
      canvas.height = px;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = px / SIZE;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);
    const p = geoPath(projection, ctx);
    const css = getComputedStyle(canvas);
    const v = (name: string, fb: string) => css.getPropertyValue(name).trim() || fb;
    const sea = v("--globe-sea", "#f6e3ea");
    const grid = v("--globe-grid", "rgba(255,255,255,0.75)");
    const landOn = v("--globe-visited", "#e8a4b8");
    const landOff = v("--globe-land", "#fffaf7");
    const edgeOn = v("--globe-visited-edge", "#ffffff");
    const edgeOff = v("--globe-land-edge", "#ead7dd");
    const rim = v("--globe-rim", "rgba(201,107,136,0.28)");
    ctx.save();
    ctx.beginPath();
    p({ type: "Sphere" });
    ctx.fillStyle = sea;
    ctx.fill();
    ctx.clip();
    ctx.beginPath();
    p(geoGraticule10());
    ctx.strokeStyle = grid;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    for (const c of land.features) {
      ctx.beginPath();
      p(c);
      const on = visited.has(String(c.id));
      ctx.fillStyle = on ? landOn : landOff;
      ctx.fill();
      ctx.strokeStyle = on ? edgeOn : edgeOff;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
    ctx.restore();
    ctx.beginPath();
    p({ type: "Sphere" });
    ctx.strokeStyle = rim;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  const pos = dist(home, dest, travel);
  const ahead = dist(home, dest, Math.min(1, travel + 0.02));
  const a = projection(pos);
  const b = projection(ahead);
  const angle = a && b ? (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI : 0;
  const route: GeoPermissibleObjects = { type: "LineString", coordinates: [home, dest] };
  const done: GeoPermissibleObjects = { type: "LineString", coordinates: [home, pos] };

  const homeXY = projection(home);
  const destXY = projection(dest);
  const flip = trip.by === "car" && Math.abs(angle) > 90;

  return (
    <div className="globe-wrap" role="img" aria-label={`Globo: de Valencia a ${trip.place}`}>
      <canvas ref={canvasRef} className="globe-canvas" />
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="globe-svg" aria-hidden>
        {trips.slice(0, k).map((x) => {
          const xy = projection([x.lng, x.lat]);
          return xy ? <circle key={x.id} cx={xy[0]} cy={xy[1]} r="4" className="globe-pin-old" /> : null;
        })}
        <path d={path(route) ?? ""} className="globe-route" />
        {trip.by !== "home" ? <path d={path(done) ?? ""} className={trip.upcoming ? "globe-done is-upcoming" : "globe-done"} /> : null}
        {homeXY ? (
          <g transform={`translate(${homeXY[0]} ${homeXY[1]}) scale(1.3)`}>
            <path d="M0 6 S-9 0 -9 -5 C-9 -9 -5 -11 -2.5 -11 C-1 -11 0 -10 0 -8.5 C0 -10 1 -11 2.5 -11 C5 -11 9 -9 9 -5 C9 0 0 6 0 6 Z" className="globe-home" />
          </g>
        ) : null}
        {homeXY && zoom > 3 ? (
          <text x={homeXY[0]} y={homeXY[1] + 26} textAnchor="middle" className="globe-label globe-label-home">
            Valencia
          </text>
        ) : null}
        {destXY ? <circle cx={destXY[0]} cy={destXY[1]} r={arrived ? 9 : 5} className="globe-dest" /> : null}
        {a && f > 0.18 && !arrived && trip.by !== "home" ? (
          <g transform={`translate(${a[0]} ${a[1]}) rotate(${flip ? angle - 180 : angle}) ${flip ? "scale(-1 1)" : ""}`}>
            <circle r="19" className="globe-vehicle-pad" />
            {trip.by === "plane" ? <Plane /> : <Car />}
          </g>
        ) : null}
        {destXY && arrived ? (
          <text x={destXY[0]} y={destXY[1] - 18} textAnchor="middle" className="globe-label">
            {trip.upcoming ? `${trip.place} · pronto` : trip.place}
          </text>
        ) : null}
      </svg>
    </div>
  );
}

function dist(a: [number, number], b: [number, number], t: number): [number, number] {
  return geoInterpolate(a, b)(t);
}

function midpoint(a: [number, number], b: [number, number]): [number, number] {
  return geoInterpolate(a, b)(0.5);
}

function Plane() {
  return (
    <path
      transform="scale(0.55)"
      d="M-22 -3h30l14-14h6l-7 14h11l6-6h4l-3 9 3 9h-4l-6-6H21l7 14h-6L8 9h-30c-4 0-6-2-6-6s2-6 6-6Z"
      className="globe-vehicle"
    />
  );
}

function Car() {
  return (
    <g transform="scale(0.6)">
      <path d="M-24 4v-8c0-3 2-5 5-5h6l8-9h16l10 9h6c3 0 5 2 5 5v8Z" className="globe-vehicle" />
      <path d="M-3 -16h10l7 7H-9Z" fill="#fff" opacity=".85" />
      <circle cx="-13" cy="5" r="6" fill="#1a1216" />
      <circle cx="13" cy="5" r="6" fill="#1a1216" />
    </g>
  );
}
