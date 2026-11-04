import { photoAlbums } from "@/data/destinations";

/**
 * El año en viajes: cada parada es un capítulo de color en Inicio y una
 * página del pasaporte. Las fotos salen de public/photos/<album>/ (ejecuta
 * `node scripts/sync-photo-albums.mjs` después de añadirlas).
 *
 * `by` es cómo llegamos desde la parada anterior: el avión o el coche que
 * recorre la ruta cambia según esto.
 */
export type Vehicle = "plane" | "car";

export type Landmark =
  | "orange"
  | "altea"
  | "eiffel"
  | "mountains"
  | "island"
  | "bigben"
  | "bat"
  | "castle"
  | "mic";

export interface Stop {
  id: string;
  place: string;
  /** Texto del sello: corto, en mayúsculas lo pone el diseño */
  stamp: string;
  when: string;
  /** Una frase nuestra, sin adornos */
  line: string;
  by: Vehicle;
  lat?: number;
  lng?: number;
  album: string;
  landmark: Landmark;
  /** Color del capítulo y su tinta */
  field: string;
  ink: string;
  /** Tinta del sello en el pasaporte */
  stampInk: string;
  url?: string;
}

export const HOME = { lat: 39.47, lng: -0.37 };

export const stops: Stop[] = [
  {
    id: "valencia",
    place: "Valencia",
    stamp: "Valencia",
    when: "18 nov 2025",
    line: "Una cobra en el Siglo 21, otra en el McDonald's y, antes de despedirnos, el primer beso.",
    by: "car",
    lat: 39.47,
    lng: -0.37,
    album: "valencia",
    landmark: "orange",
    field: "#ffb02e",
    ink: "#1b1206",
    stampInk: "#d9480f",
  },
  {
    id: "altea",
    place: "Altea",
    stamp: "Altea",
    when: "16 ene 2026",
    line: "Primera escapada. Media hora metiendo el código en la puerta de otro apartamento.",
    by: "car",
    lat: 38.6,
    lng: -0.05,
    album: "altea",
    landmark: "altea",
    field: "#f4f1ea",
    ink: "#14306b",
    stampInk: "#1c4fb8",
  },
  {
    id: "paris",
    place: "París",
    stamp: "Paris",
    when: "2–6 abr 2026",
    line: "Tu regalo de cumpleaños hecho viaje: la Torre, Disneyland y la foto que ya es nuestra portada.",
    by: "plane",
    lat: 48.85,
    lng: 2.35,
    album: "paris",
    landmark: "eiffel",
    field: "#ffc4e6",
    ink: "#3a0a26",
    stampInk: "#b0125b",
    url: "/paris",
  },
  {
    id: "asturias",
    place: "Asturias",
    stamp: "Asturias",
    when: "Junio 2026",
    line: "Verde, mar y Oviedo. El norte nos salió redondo.",
    by: "car",
    lat: 43.36,
    lng: -5.85,
    album: "asturias",
    landmark: "mountains",
    field: "#b6e68a",
    ink: "#10260b",
    stampInk: "#2f7d1f",
  },
  {
    id: "mallorca",
    place: "Mallorca",
    stamp: "Mallorca",
    when: "Agosto 2026",
    line: "Calma, agua transparente y ese calor que solo tiene la isla.",
    by: "plane",
    lat: 39.57,
    lng: 2.65,
    album: "mallorca",
    landmark: "island",
    field: "#8ff0ea",
    ink: "#05302e",
    stampInk: "#0b7c86",
  },
  {
    id: "londres",
    place: "Londres",
    stamp: "London",
    when: "9–14 ago 2026",
    line: "Cinco días con el plan hecho a nuestra medida: Big Ben, el Támesis y nosotros.",
    by: "plane",
    lat: 51.5,
    lng: -0.13,
    album: "londres",
    landmark: "bigben",
    field: "#ff5b4a",
    ink: "#1d0605",
    stampInk: "#a3140b",
    url: "https://london-miguelbr16s-projects.vercel.app",
  },
  {
    id: "mestalla",
    place: "Mestalla",
    stamp: "Mestalla",
    when: "Agosto 2026",
    line: "Noche de partido en casa, los dos en la grada.",
    by: "car",
    lat: 39.47,
    lng: -0.36,
    album: "mestalla",
    landmark: "bat",
    field: "#141414",
    ink: "#ffffff",
    stampInk: "#e8590c",
  },
  {
    id: "denia",
    place: "Dénia",
    stamp: "Denia",
    when: "Verano 2026",
    line: "El Montgó de fondo y el mar delante.",
    by: "car",
    lat: 38.84,
    lng: 0.11,
    album: "denia",
    landmark: "castle",
    field: "#ffe45c",
    ink: "#211c02",
    stampInk: "#9a6a00",
  },
  {
    id: "shakira",
    place: "Shakira",
    stamp: "Shakira live",
    when: "En directo",
    line: "Gritando las canciones juntos hasta quedarnos sin voz.",
    by: "car",
    album: "shakira",
    landmark: "mic",
    field: "#c9a6ff",
    ink: "#1d0b3a",
    stampInk: "#6a2bd9",
  },
];

/** Lo que nos queda: páginas del pasaporte esperando sello */
export const nextStops = ["Roma", "Núremberg", "Japón", "Suiza", "Auroras boreales", "Boston", "San Diego", "Orlando"];

export function photosOf(stop: Stop): string[] {
  return photoAlbums[stop.album] ?? [];
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Kilómetros de ida y vuelta desde casa, en línea recta (por lo bajo). */
export function kmTogether(): number {
  return Math.round(
    stops.reduce((sum, s) => (s.lat != null && s.lng != null ? sum + 2 * haversineKm(HOME, { lat: s.lat, lng: s.lng }) : sum), 0),
  );
}
