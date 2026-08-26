export type DestStatus = "done" | "planned" | "future";

export interface DestinationMemory {
  photos: string[];
  blurb: string;
  year?: string;
}

export interface Destination {
  name: string;
  flag: string;
  status: DestStatus;
  label: string;
  lat: number;
  lng: number;
  url?: string;
  /** Carpeta en public/photos/ (asturias, mallorca, …) */
  album?: string;
  memory?: DestinationMemory;
}

/**
 * Rutas de fotos por álbum. Se regenera con:
 *   node scripts/sync-photo-albums.mjs
 * Mientras no haya JPG en la carpeta, usamos la portada como placeholder.
 */
export const photoAlbums: Record<string, string[]> = {
  "valencia": [],
  "altea": [],
  "paris": [],
  "asturias": [],
  "mallorca": [],
  "mestalla": [],
  "londres": []
};

function albumPhotos(key: string, fallback: string[] = ["/photos/portada.jpeg"]): string[] {
  const list = photoAlbums[key] ?? [];
  return list.length > 0 ? list : fallback;
}

export const destinations: Destination[] = [
  {
    name: "Valencia",
    flag: "🏠",
    status: "done",
    label: "Casa",
    lat: 39.47,
    lng: -0.37,
    album: "valencia",
    memory: {
      photos: albumPhotos("valencia"),
      blurb: "Donde empezó todo. Nuestra base, nuestras calles, nuestro día a día.",
      year: "2025–2026",
    },
  },
  {
    name: "Altea",
    flag: "🌊",
    status: "done",
    label: "Enero 2026",
    lat: 38.6,
    lng: -0.05,
    album: "altea",
    memory: {
      photos: albumPhotos("altea"),
      blurb: "Mar, casco antiguo y el plan perfecto de enero. Un fin de semana que aún duele de bonito.",
      year: "Enero 2026",
    },
  },
  {
    name: "París + Disneyland",
    flag: "🗼",
    status: "done",
    label: "Abril 2026",
    lat: 48.85,
    lng: 2.35,
    url: "/paris",
    album: "paris",
    memory: {
      photos: albumPhotos("paris"),
      blurb: "La Torre, Disneyland, y esa foto que ya es nuestra portada. París nos queda para siempre.",
      year: "Abril 2026",
    },
  },
  {
    name: "Asturias",
    flag: "⛰️",
    status: "done",
    label: "Junio 2026",
    lat: 43.36,
    lng: -5.85,
    album: "asturias",
    memory: {
      photos: albumPhotos("asturias"),
      blurb: "Junio en el norte: verde, mar y Oviedo. Asturias nos salió redondo.",
      year: "Junio 2026",
    },
  },
  {
    name: "Mallorca",
    flag: "🏝️",
    status: "done",
    label: "Agosto 2026",
    lat: 39.57,
    lng: 2.65,
    album: "mallorca",
    memory: {
      photos: albumPhotos("mallorca"),
      blurb: "Agosto en la isla: calma, mar y ese calor que solo Mallorca sabe dar.",
      year: "Agosto 2026",
    },
  },
  {
    name: "Mestalla",
    flag: "🦇",
    status: "done",
    label: "Agosto 2026",
    lat: 39.4747,
    lng: -0.3584,
    album: "mestalla",
    memory: {
      photos: albumPhotos("mestalla"),
      blurb: "Noche de partido en casa. Mestalla, agosto, y vosotros en la grada.",
      year: "Agosto 2026",
    },
  },
  {
    name: "Londres",
    flag: "🇬🇧",
    status: "done",
    label: "9–14 agosto 2026",
    lat: 51.5074,
    lng: -0.1278,
    /** Guía del viaje (repo Londres → Vercel) */
    url: "https://viaje-londres.vercel.app",
    album: "londres",
    memory: {
      photos: albumPhotos("londres"),
      blurb: "Cinco días en Londres: Big Ben, el Támesis y el plan hecho a vuestra medida. La guía del viaje va aparte — ábrela desde aquí.",
      year: "9–14 agosto 2026",
    },
  },
  {
    name: "Roma",
    flag: "🍕",
    status: "planned",
    label: "Próximamente",
    lat: 41.9,
    lng: 12.48,
  },
  {
    name: "Núremberg",
    flag: "🎄",
    status: "planned",
    label: "Próximamente",
    lat: 49.45,
    lng: 11.08,
  },
  { name: "Japón", flag: "🗾", status: "future", label: "", lat: 35.68, lng: 139.69 },
  { name: "Boston", flag: "🦞", status: "future", label: "", lat: 42.36, lng: -71.06 },
  { name: "San Diego", flag: "🌴", status: "future", label: "", lat: 32.72, lng: -117.15 },
  {
    name: "Auroras Boreales",
    flag: "🌌",
    status: "future",
    label: "",
    lat: 69.65,
    lng: 18.96,
  },
  { name: "Suiza", flag: "🏔️", status: "future", label: "", lat: 46.8, lng: 8.23 },
  {
    name: "Orlando · Disney & Universal",
    flag: "🎢",
    status: "future",
    label: "",
    lat: 28.53,
    lng: -81.38,
  },
];

export const PIN_COLORS: Record<DestStatus, string> = {
  done: "#e8899a",
  planned: "#2fbf71",
  future: "#6ea8ff",
};

export const STATUS_LABELS: Record<DestStatus, string> = {
  done: "✈️ Visitado",
  planned: "🚩 Planificado",
  future: "🌍 Futuro",
};

export type DestStatusAlias = DestStatus;
export const STATUS_LABELS_ALIAS = STATUS_LABELS;
