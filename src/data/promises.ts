export interface PromiseItem {
  id: string;
  text: string;
  author: "Miguel" | "Rocío" | "Ambos";
  done?: boolean;
}

export const defaultPromises: PromiseItem[] = [
  { id: "p1", text: "Hacer al menos un viaje nuevo juntos", author: "Ambos" },
  { id: "p2", text: "Repetir la foto del mismo sitio cada aniversario", author: "Ambos" },
  { id: "p3", text: "Escribirte una carta sin esperar una fecha especial", author: "Miguel" },
  { id: "p4", text: "Cocinar juntos una cena completa (sin pedir fuera)", author: "Ambos" },
  { id: "p5", text: "Ver una aurora boreal… o intentarlo", author: "Ambos" },
];

export interface AnnualPhotoSpot {
  id: string;
  name: string;
  place: string;
  blurb: string;
  years: { year: number; photo?: string; note?: string }[];
}

export const annualPhotoSpots: AnnualPhotoSpot[] = [
  {
    id: "paris-tower",
    name: "La Torre",
    place: "Torre Eiffel · París",
    blurb:
      "Cada aniversario (o cada visita) volvemos a esta foto. Misma pose, mismo sitio — versión actualizada.",
    years: [
      { year: 2026, photo: "/photos/portada.jpeg", note: "Abril 2026 · Nuestro primer París" },
      { year: 2027, note: "Pendiente · Año 2" },
      { year: 2028, note: "Pendiente · Año 3" },
    ],
  },
];
