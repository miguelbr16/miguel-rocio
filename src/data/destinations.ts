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
  memory?: DestinationMemory;
}

export const destinations: Destination[] = [
  {
    name: "Valencia",
    flag: "🏠",
    status: "done",
    label: "Casa",
    lat: 39.47,
    lng: -0.37,
    memory: {
      photos: ["/photos/portada.jpeg"],
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
    memory: {
      photos: ["/photos/portada.jpeg"],
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
    memory: {
      photos: ["/photos/portada.jpeg"],
      blurb: "La Torre, Disneyland, y esa foto que ya es nuestra portada. París nos queda para siempre.",
      year: "Abril 2026",
    },
  },
  {
    name: "Oviedo · Museo F. Alonso",
    flag: "🏎️",
    status: "planned",
    label: "Próximamente",
    lat: 43.36,
    lng: -5.85,
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

/** Aliases for older imports */
export type DestStatusAlias = DestStatus;
export const STATUS_LABELS_ALIAS = STATUS_LABELS;
