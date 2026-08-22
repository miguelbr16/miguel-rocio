/** Fecha oficial: primer beso / inicio de la relación */
export const RELATIONSHIP_START = new Date(2025, 10, 18);

/** Contraseña de acceso — 18 · 11 · 25 */
export const LOCK_CODE = "181125";

export const COUPLE = {
  name1: "Miguel",
  name2: "Rocío",
  initials: "M & R",
} as const;

export type PlayerName = (typeof COUPLE)["name1"] | (typeof COUPLE)["name2"];

export const STORAGE_KEYS = {
  unlocked: "unlocked",
  bingo: "bingo-v2",
  fechas: "fechas-v2",
  destinations: "destinations-v2",
  timeline: "timelineData-v2",
  caso002Progress: "caso002-day",
  siteConfig: "site-config-v1",
  coupleSync: "couple-sync-v1",
} as const;

/** Caso 002 visible como activo en la UI (la ruta /caso-002 sigue abierta para pruebas) */
export const CASO002_UI_ACTIVE = false;

/** Fecha en la que el Caso 002 se muestra como activo (8 nov 2026) */
export const CASO002_OPENS = new Date(2026, 10, 8);

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

export const PLAYER_NAMES: PlayerName[] = [COUPLE.name1, COUPLE.name2];

export const PICT_COLORS = ["#080608", "#e8547a", "#7eb8ff", "#e8c872"] as const;
