import { photoAlbums } from "@/data/destinations";

/**
 * Nuestros viajes desde casa (Valencia), en orden. Alimenta el globo del
 * Inicio y las páginas del Pasaporte.
 *
 * ✏️ Se edita desde la propia web en modo Miguel; esto son los valores de serie.
 * Las fotos salen de public/photos/<album>/ (luego: node scripts/sync-photo-albums.mjs).
 */
export type Vehicle = "plane" | "car" | "home";

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
  url?: string;
  /** Viaje que aún no hemos hecho (sale como «próximo») */
  upcoming?: boolean;
}

export const HOME = { place: "Valencia", lat: 39.47, lng: -0.376 };

export const defaultTrips: Trip[] = [
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
    id: "fallas",
    place: "Fallas",
    country: "España",
    countryId: "724",
    when: "Marzo 2026",
    line: "Nuestras primeras Fallas juntos: mascletà, pólvora y la ciudad patas arriba. Sin salir de casa.",
    by: "home",
    lat: 39.47,
    lng: -0.376,
    album: "fallas",
    art: "heart",
  },
  {
    id: "paris",
    place: "París y Disney",
    country: "Francia",
    countryId: "250",
    when: "2–6 abr 2026",
    line: "Tu regalo de cumpleaños hecho viaje: la Torre Eiffel, Disneyland y la foto que ya es nuestra portada.",
    by: "plane",
    lat: 48.857,
    lng: 2.352,
    album: "paris",
    art: "tower",
  },
  {
    id: "denia",
    place: "Dénia",
    country: "España",
    countryId: "724",
    when: "2026",
    line: "El Montgó de fondo y el mar delante.",
    by: "car",
    lat: 38.84,
    lng: 0.107,
    album: "denia",
    art: "castle",
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
    url: "https://london-miguelbr16s-projects.vercel.app",
  },
  {
    id: "dolomitas",
    place: "Dolomitas",
    country: "Italia",
    countryId: "380",
    when: "Diciembre 2026",
    line: "El siguiente sello. Montañas, nieve y nosotros dos.",
    by: "plane",
    lat: 46.41,
    lng: 11.84,
    album: "dolomitas",
    art: "snow",
    upcoming: true,
  },
];

/** @deprecated usa useTrips(): los viajes se pueden editar desde la web */
export const trips = defaultTrips;

/** Lo que queda por sellar (páginas en blanco del pasaporte) */
export const wishlist = ["Roma", "Núremberg", "Japón", "Suiza", "Auroras boreales", "Boston", "San Diego", "Orlando"];

export function photosOf(album: string): string[] {
  return photoAlbums[album] ?? [];
}
