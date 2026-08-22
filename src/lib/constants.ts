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
  { id: "inicio", label: "Inicio", icon: "🏠" },
  { id: "historia", label: "Historia", icon: "📖" },
  { id: "destinos", label: "Destinos", icon: "🌍" },
  { id: "bingo", label: "Bingo", icon: "🎯" },
  { id: "cartas", label: "Cartas", icon: "💌" },
  { id: "casos", label: "Casos", icon: "🔍" },
  { id: "fechas", label: "Fechas", icon: "📅" },
  { id: "juegos", label: "Juegos", icon: "🎮" },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"];

/** Barra inferior móvil — 5 accesos rápidos */
export const MOBILE_TAB_ITEMS = [
  { id: "inicio" as const, label: "Inicio", icon: "🏠" },
  { id: "casos" as const, label: "Casos", icon: "🔍" },
  { id: "bingo" as const, label: "Bingo", icon: "🎯" },
  { id: "cartas" as const, label: "Cartas", icon: "💌" },
  { id: "more" as const, label: "Más", icon: "✨" },
];

export const MORE_SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: "historia", label: "Historia", icon: "📖" },
  { id: "destinos", label: "Destinos", icon: "🌍" },
  { id: "fechas", label: "Fechas", icon: "📅" },
  { id: "juegos", label: "Juegos", icon: "🎮" },
];
