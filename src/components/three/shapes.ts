/**
 * Formas para las partículas: cada una devuelve N puntos (x,y,z) y, opcionalmente,
 * cuáles brillan más (p. ej. los países visitados en el globo).
 */
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";

export type Shape = { pos: Float32Array; glow: Float32Array };

function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Corazón con volumen (muestreo dentro de la curva implícita del corazón). */
export function heart(n: number, scale = 1, seed = 1): Shape {
  const r = rand(seed);
  const pos = new Float32Array(n * 3);
  const glow = new Float32Array(n);
  let i = 0;
  while (i < n) {
    const x = (r() * 2 - 1) * 1.25;
    const y = r() * 2.5 - 1.15;
    const a = x * x + y * y - 1;
    const f = a * a * a - x * x * y * y * y;
    if (f > 0) continue;
    // cerca del borde hay más partículas (y brillan)
    const edge = f > -0.02;
    if (!edge && r() < 0.55) continue;
    const thick = Math.sqrt(Math.max(0, -f)) * 1.6 + 0.08;
    pos[i * 3] = x * 1.55 * scale;
    pos[i * 3 + 1] = (y * 1.55 - 0.35) * scale;
    pos[i * 3 + 2] = (r() - 0.5) * thick * scale;
    glow[i] = edge ? 1 : 0;
    i++;
  }
  return { pos, glow };
}

/** Texto muestreado de un canvas. */
export function text(n: number, label: string, family: string, width = 4.2, seed = 2): Shape {
  const r = rand(seed);
  const W = 900;
  const H = 360;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = 260;
  ctx.font = `600 ${size}px ${family}`;
  while (ctx.measureText(label).width > W * 0.92 && size > 40) {
    size -= 8;
    ctx.font = `600 ${size}px ${family}`;
  }
  ctx.fillText(label, W / 2, H / 2 + size * 0.04);
  const data = ctx.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4] > 128) pts.push(x, y);
    }
  }
  const pos = new Float32Array(n * 3);
  const glow = new Float32Array(n);
  const s = width / W;
  for (let i = 0; i < n; i++) {
    const j = Math.floor(r() * (pts.length / 2)) * 2;
    pos[i * 3] = (pts[j] - W / 2 + (r() - 0.5) * 2) * s;
    pos[i * 3 + 1] = -(pts[j + 1] - H / 2 + (r() - 0.5) * 2) * s;
    pos[i * 3 + 2] = (r() - 0.5) * 0.25;
    glow[i] = r() < 0.12 ? 1 : 0;
  }
  return { pos, glow };
}

type Countries = FeatureCollection<Geometry, { name: string }>;

/** Globo de puntos: tierra firme, con los países visitados brillando. */
export async function globe(n: number, visitedIds: string[], radius = 1.75, seed = 3): Promise<Shape> {
  const r = rand(seed);
  const topo = (await (await fetch("/geo/countries-110m.json")).json()) as Topology<{
    countries: GeometryCollection<{ name: string }>;
  }>;
  const countries = feature(topo, topo.objects.countries) as unknown as Countries;
  const W = 720;
  const H = 360;
  const proj = geoEquirectangular().translate([W / 2, H / 2]).scale(W / (2 * Math.PI));
  const land = document.createElement("canvas");
  land.width = W;
  land.height = H;
  const ctx = land.getContext("2d")!;
  const path = geoPath(proj, ctx);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  for (const f of countries.features) {
    ctx.beginPath();
    path(f);
    ctx.fillStyle = visitedIds.includes(String(f.id)) ? "#f00" : "#fff";
    ctx.fill();
  }
  const img = ctx.getImageData(0, 0, W, H).data;
  const pos = new Float32Array(n * 3);
  const glow = new Float32Array(n);
  let i = 0;
  let guard = 0;
  while (i < n && guard < n * 60) {
    guard++;
    // muestreo uniforme sobre la esfera
    const u = r() * 2 - 1;
    const th = r() * Math.PI * 2;
    const lat = Math.asin(u);
    const lon = th - Math.PI;
    const px = Math.floor(((lon + Math.PI) / (2 * Math.PI)) * W) % W;
    const py = Math.floor(((Math.PI / 2 - lat) / Math.PI) * H);
    const k = (py * W + px) * 4;
    const red = img[k];
    const green = img[k + 1];
    const isLand = red > 100;
    const visited = isLand && green < 100;
    // océano: muy pocos puntos para que se intuya la esfera
    if (!isLand && r() > 0.06) continue;
    const rr = radius * (isLand ? 1 : 0.985);
    pos[i * 3] = rr * Math.cos(lat) * Math.sin(lon);
    pos[i * 3 + 1] = rr * Math.sin(lat);
    pos[i * 3 + 2] = rr * Math.cos(lat) * Math.cos(lon);
    glow[i] = visited ? 1 : isLand ? 0.15 : -1;
    i++;
  }
  for (; i < n; i++) {
    pos[i * 3] = 0;
    pos[i * 3 + 1] = 0;
    pos[i * 3 + 2] = 0;
  }
  return { pos, glow };
}

/** Nube suelta (inicio y transición). */
export function cloud(n: number, spread = 7, seed = 4): Shape {
  const r = rand(seed);
  const pos = new Float32Array(n * 3);
  const glow = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = r() * 2 - 1;
    const th = r() * Math.PI * 2;
    const d = spread * Math.cbrt(r());
    pos[i * 3] = d * Math.sqrt(1 - u * u) * Math.cos(th);
    pos[i * 3 + 1] = d * u * 0.6;
    pos[i * 3 + 2] = d * Math.sqrt(1 - u * u) * Math.sin(th) - 2;
    glow[i] = r() < 0.05 ? 1 : 0;
  }
  return { pos, glow };
}
