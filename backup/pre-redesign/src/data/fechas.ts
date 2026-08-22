export interface FechaEspecial {
  emoji: string;
  nombre: string;
  dateStr: string;
  anual: boolean;
}

export const fechasEspeciales: FechaEspecial[] = [
  { emoji: "💋", nombre: "Primer beso — empezamos", dateStr: "2025-11-18", anual: true },
  { emoji: "💑", nombre: "Nos hicimos novios", dateStr: "2025-12-27", anual: true },
  { emoji: "🎂", nombre: "Cumpleaños de Rocío", dateStr: "2000-01-23", anual: true },
  { emoji: "🎂", nombre: "Cumpleaños de Miguel", dateStr: "2003-02-16", anual: true },
  { emoji: "🗼", nombre: "Viaje a París", dateStr: "2026-04-02", anual: false },
  { emoji: "🌊", nombre: "Escapada a Altea", dateStr: "2026-01-16", anual: false },
  { emoji: "🥂", nombre: "1 año juntos", dateStr: "2026-11-18", anual: true },
];
