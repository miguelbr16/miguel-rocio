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
    line: "Tu regalo de cumpleaños hecho viaje: Louvre, Torre Eiffel, Montmartre y el Sacré-Cœur, nuestro primer fotomatón, nuestro primer brunch y Disneyland como niños pequeños.",
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
    place: "Cantabria y Asturias",
    country: "España",
    countryId: "724",
    when: "Junio 2026",
    line: "En coche desde Valencia: Santillana del Mar, Cangas de Onís, Covadonga y los Picos con las vacas sueltas, «Pravis» y la playa de las Catedrales. Y nos pusimos las botas a comer.",
    by: "car",
    lat: 43.35,
    lng: -5.13,
    album: "asturias",
    art: "mountain",
  },
  {
    id: "mallorca",
    place: "Mallorca",
    country: "España",
    countryId: "724",
    when: "Verano 2026",
    line: "Con tu familia. Cine en la habitación y palmitas con Ali y Lucía, y un «te quiero» de las dos que no se me olvida.",
    by: "plane",
    lat: 39.57,
    lng: 2.65,
    album: "mallorca",
    art: "island",
  },
  {
    id: "mestalla",
    place: "Mestalla",
    country: "España",
    countryId: "724",
    when: "8 ago 2026",
    line: "Trofeu Taronja, Valencia–Newcastle: la presentación del equipo y el último Taronja en el Mestalla de siempre. Los dos en la grada.",
    by: "home",
    lat: 39.4747,
    lng: -0.3583,
    album: "mestalla",
    art: "stadium",
  },
  {
    id: "shakira",
    place: "Shakira en Madrid",
    country: "España",
    countryId: "724",
    when: "Septiembre 2026",
    line: "El Estadio Shakira, más de 50.000 personas y nosotros gritando las canciones hasta quedarnos sin voz.",
    by: "car",
    lat: 40.416,
    lng: -3.703,
    album: "shakira",
    art: "music",
  },
  {
    id: "londres",
    place: "Londres",
    country: "Reino Unido",
    countryId: "826",
    when: "9–14 oct 2026",
    line: "Anduvimos más que nunca: ardillas en el parque, fotomatón en Camden Lock y tú en bici, rompiendo tu miedo. Nos quedó un museo pendiente.",
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
