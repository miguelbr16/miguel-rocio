import { photoAlbums } from "@/data/destinations";

/**
 * Nuestros viajes desde casa (Valencia), en orden. Alimenta el globo del
 * Inicio y las páginas del Pasaporte.
 *
 * ✏️ Para cambiar orden, fechas o el medio (coche / avión), edita esta lista.
 * Las fotos salen de public/photos/<album>/ (luego: node scripts/sync-photo-albums.mjs).
 */
export type Vehicle = "plane" | "car";

/** Dibujo del sello: lo que mejor representa el sitio. */
export type StampArt =
  | "city"
  | "tower"
  | "clock"
  | "mountain"
  | "beach"
  | "island"
  | "village"
  | "castle"
  | "stadium"
  | "music"
  | "lake"
  | "snow"
  | "heart";

export interface Trip {
  id: string;
  place: string;
  country: string;
  /** ISO numérico del país (para pintarlo en el globo) */
  countryId?: string;
  when: string;
  line: string;
  by: Vehicle;
  lat: number;
  lng: number;
  album: string;
  art: StampArt;
}

export const HOME = { place: "Valencia", lat: 39.47, lng: -0.376 };

export const trips: Trip[] = [
  {
    id: "altea",
    place: "Altea",
    country: "España",
    countryId: "724",
    when: "16 ene 2026",
    line: "Primera escapada. Media hora metiendo el código en la puerta de otro apartamento.",
    by: "car",
    lat: 38.598,
    lng: -0.051,
    album: "altea",
    art: "village",
  },
  {
    id: "paris",
    place: "París",
    country: "Francia",
    countryId: "250",
    when: "2–6 abr 2026",
    line: "Tu regalo de cumpleaños hecho viaje: la Torre, Disneyland y la foto que ya es nuestra portada.",
    by: "plane",
    lat: 48.857,
    lng: 2.352,
    album: "paris",
    art: "tower",
  },
  {
    id: "asturias",
    place: "Asturias",
    country: "España",
    countryId: "724",
    when: "Junio 2026",
    line: "Verde, mar y Oviedo. El norte nos salió redondo.",
    by: "car",
    lat: 43.361,
    lng: -5.849,
    album: "asturias",
    art: "mountain",
  },
  {
    id: "mallorca",
    place: "Mallorca",
    country: "España",
    countryId: "724",
    when: "Agosto 2026",
    line: "Calma, agua transparente y ese calor que solo tiene la isla.",
    by: "plane",
    lat: 39.57,
    lng: 2.65,
    album: "mallorca",
    art: "island",
  },
  {
    id: "londres",
    place: "Londres",
    country: "Reino Unido",
    countryId: "826",
    when: "9–14 ago 2026",
    line: "Cinco días con el plan hecho a nuestra medida: Big Ben, el Támesis y nosotros.",
    by: "plane",
    lat: 51.507,
    lng: -0.128,
    album: "londres",
    art: "clock",
  },
  {
    id: "mestalla",
    place: "Mestalla",
    country: "España",
    countryId: "724",
    when: "Agosto 2026",
    line: "Noche de partido en casa, los dos en la grada.",
    by: "car",
    lat: 39.474,
    lng: -0.358,
    album: "mestalla",
    art: "stadium",
  },
  {
    id: "denia",
    place: "Dénia",
    country: "España",
    countryId: "724",
    when: "Verano 2026",
    line: "El Montgó de fondo y el mar delante.",
    by: "car",
    lat: 38.84,
    lng: 0.107,
    album: "denia",
    art: "castle",
  },
  {
    id: "shakira",
    place: "Concierto de Shakira",
    country: "España",
    countryId: "724",
    when: "2026",
    line: "Gritando las canciones juntos hasta quedarnos sin voz.",
    by: "car",
    // ✏️ Pon la ciudad real del concierto
    lat: 40.416,
    lng: -3.703,
    album: "shakira",
    art: "music",
  },
];

export function photosOf(album: string): string[] {
  return photoAlbums[album] ?? [];
}
