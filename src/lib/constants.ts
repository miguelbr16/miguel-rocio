/** Fecha oficial: primer beso / inicio de la relación */
export const RELATIONSHIP_START = new Date(2025, 10, 18);

/** Contraseña de acceso — 18 · 11 · 25 */
export const LOCK_CODE = "181125";

export const COUPLE = {
  name1: "Miguel",
  name2: "Rocío",
  initials: "M & R",
} as const;

export const NAV_ITEMS = [
  { id: "inicio", label: "Inicio" },
  { id: "historia", label: "Historia" },
  { id: "destinos", label: "Destinos" },
  { id: "bingo", label: "Bingo" },
  { id: "cartas", label: "Cartas" },
  { id: "casos", label: "Casos" },
  { id: "fechas", label: "Fechas" },
  { id: "juegos", label: "Juegos" },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"];
