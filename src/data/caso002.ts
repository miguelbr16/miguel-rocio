import { getRuntimeSorpresa } from "@/lib/site-config-runtime";
import { CASE_STEPS_KEY, isMiguel } from "@/lib/miguel";

/**
 * CASO 002 — se juega entero el 18 de noviembre de 2026.
 *
 * Desde CASE_DAY (00:00) la web queda cerrada detrás del caso: al entrar con
 * el código, Rocío ve el expediente en vez del inicio. Cada paso desbloquea
 * el siguiente; al resolver el último se abre la web con el momento final.
 *
 * ✏️ Miguel: los textos y respuestas se editan desde /configurador.
 *
 * Tipos de paso:
 *  - "q":    pregunta con respuesta escrita (vale cualquiera de las keys)
 *  - "code": pista física; la respuesta es lo que pone el papel escondido
 *  - "wait": no se abre hasta la hora `at` del día 18 (p. ej. la cena)
 */
export type StepKind = "q" | "code" | "wait";

export interface CaseStep {
  id: string;
  title: string;
  /** Texto del paso. **negrita** permitida. */
  brief: string;
  kind: StepKind;
  keys?: string[];
  /** Hora del 18 a la que se abre (solo "wait"), formato "HH:MM" */
  at?: string;
  /** Pista si falla dos veces */
  hint?: string;
  /** Lo que se le dice al acertar */
  solved: string;
}

/** Día del caso (00:00). Antes de esta fecha la web funciona como siempre. */
export const CASE_DAY = new Date(2026, 10, 18, 0, 0, 0, 0);

/**
 * Preguntas del año (lo vivido desde que cerró el Caso 001, el 15 de mayo).
 * ✏️ Miguel: se editan desde /configurador (modo Miguel) sin tocar código.
 */
export const defaultCaseSteps: CaseStep[] = [
  {
    id: "norte",
    title: "Junio",
    brief:
      "Agente Ro. El Caso 001 se cerró el 15 de mayo. Este expediente documenta **todo lo que vino después**.\n\nPrimera prueba: en junio, el sujeto M y su objetivo se fueron al norte. ¿A qué **comunidad**?",
    kind: "q",
    keys: ["asturias", "oviedo"],
    hint: "Verde, mar, sidra.",
    solved: "Asturias. El norte nos salió redondo.",
  },
  {
    id: "isla",
    title: "Agosto",
    brief: "Se interceptan billetes de avión a una isla. Calma, agua transparente y mucho calor.\n\n¿Qué **isla**?",
    kind: "q",
    keys: ["mallorca", "palma"],
    hint: "La más grande de las Baleares.",
    solved: "Mallorca. Prueba archivada.",
  },
  {
    id: "londres",
    title: "Octubre",
    brief: "Cinco días fuera del país, del 9 al 14 de octubre. En la foto de vigilancia sale un reloj enorme.\n\n¿Cómo se llama **el reloj**?",
    kind: "q",
    keys: ["big ben", "bigben", "elizabeth"],
    hint: "Londres. Dos palabras.",
    solved: "El Big Ben. Londres, contigo.",
  },
  {
    id: "mestalla",
    title: "En casa",
    brief: "Noche de partido. Los dos en la grada, en Valencia.\n\n¿En qué **estadio**?",
    kind: "q",
    keys: ["mestalla"],
    hint: "El de siempre del Valencia.",
    solved: "Mestalla. Amunt.",
  },
  {
    id: "concierto",
    title: "Sin voz",
    brief: "La agencia tiene constancia de un concierto en el que alguien acabó afónico.\n\n¿De **quién** era el concierto?",
    kind: "q",
    keys: ["shakira"],
    hint: "Las caderas no mienten.",
    solved: "Shakira. Y las dos voces, perdidas.",
  },
  {
    id: "cancion",
    title: "Banda sonora",
    brief: "En el expediente consta una canción de **Dani Fernández** que ya es nuestra.\n\n¿Cómo se llama?",
    kind: "q",
    keys: ["me has invitado a bailar", "invitado a bailar", "bailar"],
    hint: "Va de una invitación.",
    solved: "Me has invitado a bailar. Y sigo bailando.",
  },
  {
    id: "suenio",
    title: "Año dos",
    brief: "Última pista antes del cierre. Hay un viaje soñado que todavía no tiene sello en el pasaporte.\n\n¿Cuál es el gran viaje soñado en **Asia**?",
    kind: "q",
    keys: ["japon", "japan", "tokio", "tokyo"],
    hint: "Sushi, templos y cerezos.",
    solved: "Japón. Página reservada.",
  },
  {
    id: "cierre",
    title: "Cierre del caso",
    brief: "Última pregunta, la más fácil y la más importante.\n\n¿Qué **día** empezó todo? (día, mes y año)",
    kind: "q",
    keys: ["18 11 25", "18 11 2025", "181125", "18 de noviembre de 2025", "18 noviembre 2025", "18112025"],
    hint: "Es la clave de esta web.",
    solved: "Caso cerrado.",
  },
];

/** Pasos del caso: los editados por Miguel (si los hay) o los de serie. */
export function getCaseSteps(): CaseStep[] {
  try {
    const raw = localStorage.getItem(CASE_STEPS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CaseStep[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* de serie */
  }
  return defaultCaseSteps;
}

const PROGRESS_KEY = "caso002-step-v2";
const SOLVED_KEY = "caso002-solved-v2";

export function normalizeAnswer(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function checkStep(step: CaseStep, input: string) {
  const n = normalizeAnswer(input);
  if (!n) return false;
  const compact = n.replace(/ /g, "");
  return (step.keys ?? []).some((k) => {
    const nk = normalizeAnswer(k);
    return n === nk || n.includes(nk) || compact === nk.replace(/ /g, "");
  });
}

/** Momento del día 18 a la hora "HH:MM". */
export function stepOpensAt(step: CaseStep): Date | null {
  if (step.kind !== "wait" || !step.at) return null;
  const [h, m] = step.at.split(":").map(Number);
  return new Date(CASE_DAY.getFullYear(), CASE_DAY.getMonth(), CASE_DAY.getDate(), h, m, 0, 0);
}

function testing() {
  try {
    return (
      isMiguel() || getRuntimeSorpresa().devUnlockAll || new URLSearchParams(window.location.search).has("pruebas")
    );
  } catch {
    return false;
  }
}

/** ¿Está la web cerrada detrás del caso ahora mismo? */
export function caseGateActive(now = new Date()) {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).has("caso")) return true;
  if (isCaseSolved() || isMiguel()) return false;
  return now >= CASE_DAY;
}

export function isCaseOpenToday(now = new Date()) {
  return testing() || now >= CASE_DAY;
}

export function getStepProgress(): number {
  try {
    return Math.max(0, Number(localStorage.getItem(PROGRESS_KEY) ?? "0") || 0);
  } catch {
    return 0;
  }
}

export function setStepProgress(i: number) {
  try {
    localStorage.setItem(PROGRESS_KEY, String(i));
  } catch {
    /* sin almacenamiento */
  }
}

export function isCaseSolved() {
  try {
    return localStorage.getItem(SOLVED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markCaseSolved() {
  try {
    localStorage.setItem(SOLVED_KEY, "1");
  } catch {
    /* sin almacenamiento */
  }
}

export function resetCase() {
  try {
    localStorage.removeItem(SOLVED_KEY);
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    /* sin almacenamiento */
  }
}

export { testing as caseTesting };
