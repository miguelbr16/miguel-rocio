"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CarGlyph, Landmark, PlaneGlyph } from "@/components/home/Landmark";
import { photosOf, stops, type Stop } from "@/data/journey";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Pt = { x: number; y: number };

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Curva que baja zigzagueando de una parada a la siguiente. */
function buildPath(points: Pt[]) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dy = (b.y - a.y) * 0.55;
    d += ` C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
  }
  return d;
}

/**
 * El viaje: cada parada es un capítulo de color. Un avión o un coche baja
 * por la ruta al ritmo del scroll, siempre a media pantalla, y al llegar a
 * cada sitio sella la foto.
 */
export function Journey() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const doneRef = useRef<SVGPathElement>(null);
  const vehicleRef = useRef<SVGGElement>(null);
  const padRefs = useRef<(HTMLDivElement | null)[]>([]);
  const geo = useRef<{ len: number; stopsAt: number[] }>({ len: 0, stopsAt: [] });

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [d, setD] = useState("");
  const [reached, setReached] = useState(-1);
  const [leg, setLeg] = useState(0);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const box = wrap.getBoundingClientRect();
    const pts: Pt[] = [{ x: box.width * 0.5, y: 0 }];
    padRefs.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      pts.push({ x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 });
    });
    pts.push({ x: box.width * 0.5, y: box.height });
    setSize({ w: box.width, h: box.height });
    setD(buildPath(pts));
  }, []);

  useIsoLayout(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // Longitud de la ruta en cada parada (para saber cuándo hemos llegado).
  useEffect(() => {
    const path = routeRef.current;
    if (!path || !d) return;
    const len = path.getTotalLength();
    const stopsAt: number[] = [];
    let k = 0;
    const step = 4;
    for (let l = 0; l <= len && k < stops.length; l += step) {
      const el = padRefs.current[k];
      if (!el) break;
      const p = path.getPointAtLength(l);
      const box = wrapRef.current!.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const cy = r.top - box.top + r.height / 2;
      if (p.y >= cy - 2) {
        stopsAt.push(l);
        k++;
      }
    }
    geo.current = { len, stopsAt };
    if (doneRef.current) {
      doneRef.current.style.strokeDasharray = `${len}`;
    }
  }, [d]);

  useEffect(() => {
    let raf = 0;
    function frame() {
      raf = 0;
      const path = routeRef.current;
      const wrap = wrapRef.current;
      const v = vehicleRef.current;
      if (!path || !wrap || !v || !geo.current.len) return;
      const { len, stopsAt } = geo.current;
      const top = wrap.getBoundingClientRect().top;
      const targetY = window.innerHeight * 0.5 - top;
      // La ruta siempre baja: búsqueda binaria del punto a la altura del centro de la pantalla.
      let lo = 0;
      let hi = len;
      for (let i = 0; i < 22; i++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).y < targetY) lo = mid;
        else hi = mid;
      }
      const L = Math.max(0, Math.min(len, lo));
      const p = path.getPointAtLength(L);
      const q = path.getPointAtLength(Math.min(len, L + 3));
      const theta = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;

      let next = stopsAt.findIndex((s) => s > L + 1);
      if (next === -1) next = stops.length - 1;
      const by = stops[Math.max(0, next)].by;
      let transform: string;
      if (by === "plane") {
        transform = `translate(${p.x} ${p.y}) rotate(${theta})`;
      } else if (q.x - p.x >= 0) {
        transform = `translate(${p.x} ${p.y}) rotate(${Math.max(-32, Math.min(32, theta))})`;
      } else {
        const t = theta - 180;
        const norm = ((t + 540) % 360) - 180;
        transform = `translate(${p.x} ${p.y}) rotate(${Math.max(-32, Math.min(32, norm))}) scale(-1 1)`;
      }
      v.setAttribute("transform", transform);
      if (doneRef.current) doneRef.current.style.strokeDashoffset = `${len - L}`;

      let got = -1;
      stopsAt.forEach((s, i) => {
        if (L >= s - 6) got = i;
      });
      setReached((r) => (r === got ? r : got));
      setLeg((l) => (l === next ? l : next));
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
  }, [d]);

  const vehicle = stops[Math.max(0, leg)]?.by ?? "car";

  return (
    <div ref={wrapRef} className="journey" id="viaje">
      {d ? (
        <svg className="journey-route" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden>
          <path d={d} className="journey-route-halo" />
          <path ref={routeRef} d={d} className="journey-route-ghost" />
          <path ref={doneRef} d={d} className="journey-route-done" />
          <g ref={vehicleRef}>
            <g className="journey-vehicle">
              <circle r="30" className="journey-vehicle-pad" />
              {vehicle === "plane" ? <PlaneGlyph color="#f53fd6" /> : <CarGlyph color="#f53fd6" wheel="#141414" />}
            </g>
          </g>
        </svg>
      ) : null}

      {stops.map((s, i) => (
        <Chapter
          key={s.id}
          stop={s}
          index={i}
          stamped={reached >= i}
          reduced={reduced}
          padRef={(el) => {
            padRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}

function Chapter({
  stop,
  index,
  stamped,
  reduced,
  padRef,
}: {
  stop: Stop;
  index: number;
  stamped: boolean;
  reduced: boolean;
  padRef: (el: HTMLDivElement | null) => void;
}) {
  const photos = photosOf(stop).slice(0, 3);
  const flip = index % 2 === 1;

  return (
    <section
      className={`chapter ${flip ? "chapter-flip" : ""}`}
      style={{ background: stop.field, color: stop.ink }}
      aria-labelledby={`ch-${stop.id}`}
    >
      <div className="chapter-text">
        <motion.p
          className="chapter-when"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {stop.when} · {stop.by === "plane" ? "en avión" : "en coche"}
        </motion.p>
        <motion.h2
          id={`ch-${stop.id}`}
          className="chapter-place"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {stop.place}
        </motion.h2>
        <motion.p
          className="chapter-line"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {stop.line}
        </motion.p>
        {stop.url ? (
          <a className="chapter-link" href={stop.url} target={stop.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            {stop.id === "londres" ? "Abrir la guía de Londres" : `Volver a ${stop.place}`}
          </a>
        ) : null}
      </div>

      <div className="chapter-visual">
        {photos.length > 0 ? (
          <div className="chapter-prints">
            {photos.map((src, k) => (
              <div key={src} className={`print print-${k}`}>
                <Image src={src} alt={`${stop.place}, foto ${k + 1}`} fill sizes="(max-width: 700px) 60vw, 26vw" className="object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <Landmark id={stop.landmark} ink={stop.ink} accent={stop.stampInk} paper={stop.field} className="chapter-drawing" />
        )}
        <div ref={padRef} className="chapter-pad">
          <motion.div
            className="stamp"
            style={{ color: stop.stampInk, borderColor: stop.stampInk }}
            initial={false}
            animate={
              stamped
                ? { opacity: 1, scale: 1, rotate: flip ? 8 : -10 }
                : { opacity: 0, scale: reduced ? 1 : 1.8, rotate: flip ? 20 : -24 }
            }
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 22 }}
          >
            <span className="stamp-place">{stop.stamp}</span>
            <span className="stamp-date">{stop.when}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
