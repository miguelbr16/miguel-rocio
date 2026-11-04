import { getRuntimeSorpresa } from "@/lib/site-config-runtime";

/**
 * CASO 002 — se juega entero el 18 de noviembre de 2026.
 *
 * Desde CASE_DAY (00:00) la web queda cerrada detrás del caso: al entrar con
 * el código, Rocío ve el expediente en vez del inicio. Cada paso desbloquea
 * el siguiente; al resolver el último se abre la web con el momento final.
 *
 * ✏️ Miguel: revisa las respuestas (keys) y, sobre todo, los pasos marcados
 * con «PISTA FÍSICA»: la palabra la escribes tú en un papel y lo escondes.
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

export const caseSteps: CaseStep[] = [
  {
    id: "apertura",
    title: "Apertura",
    brief:
      "Agente Ro. Hoy hace un año de algo que la agencia quiere aclarar.\n\nAntes del primer beso hubo dos intentos fallidos. Para abrir el expediente: ¿dónde fue **la primera cobra**?",
    kind: "q",
    keys: ["siglo 21", "siglo xxi", "siglo21", "el siglo"],
    hint: "Campolivar. Sofía estaba por ahí.",
    solved: "El Siglo 21. Primer intento, primera cobra. Con estilo.",
  },
  {
    id: "segunda",
    title: "La segunda cobra",
    brief: "El sujeto M no se rindió. Segundo intento, mismo resultado.\n\n¿Dónde fue **la segunda cobra**?",
    kind: "q",
    keys: ["mcdonalds", "mc donalds", "macdonalds", "mcdonald", "burger", "mac"],
    hint: "Patatas, un menú y una cobra.",
    solved: "En el McDonald's. Y ese mismo día, antes de despediros, llegó el beso.",
  },
  {
    id: "origen",
    title: "Antes de todo",
    brief:
      "La agencia tiene constancia de un primer rechazo y de un método poco habitual para pedir un número de teléfono.\n\n¿Qué iba **dentro del cruasán**?",
    kind: "q",
    keys: ["servilleta", "una servilleta", "el numero", "numero"],
    hint: "Se usa para limpiarse las manos.",
    solved: "Una servilleta con un número. Original, diez de diez.",
  },
  {
    id: "puerta",
    title: "La puerta equivocada",
    brief:
      "Primera escapada. Media hora intentando abrir un apartamento que no era el vuestro.\n\n¿En qué **pueblo** pasó?",
    kind: "q",
    keys: ["altea"],
    hint: "Casas blancas, cúpula azul.",
    solved: "Altea. El código era bueno; la puerta, no.",
  },
  {
    id: "llaves",
    title: "Pista física",
    brief:
      "Ahora toca moverse. Ve a donde siempre acabamos buscando **las llaves del coche** (sí, esas). Hay un sobre con tu nombre.\n\nEscribe la palabra que hay dentro.",
    kind: "code",
    // ✏️ Cambia esta palabra por la que escribas en el papel
    keys: ["pequeñita", "pequenita"],
    hint: "Si no lo encuentras, pregúntale a M. Pero solo un poco.",
    solved: "Encontrado. Esta vez sin perder media hora.",
  },
  {
    id: "noche",
    title: "Hasta esta noche",
    brief: "El último paso no se puede adelantar. Ponte guapa: la agencia te espera esta noche.",
    kind: "wait",
    at: "20:00",
    solved: "Ya es la hora.",
  },
  {
    id: "cierre",
    title: "La última pregunta",
    brief:
      "Última pregunta, la más fácil y la más importante.\n\n¿Qué **día** empezó todo? (día, mes y año)",
    kind: "q",
    keys: ["18 11 25", "18 11 2025", "181125", "18 de noviembre de 2025", "18 noviembre 2025", "18112025"],
    hint: "Es la clave de esta web.",
    solved: "Caso cerrado.",
  },
];

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
    return getRuntimeSorpresa().devUnlockAll || new URLSearchParams(window.location.search).has("pruebas");
  } catch {
    return false;
  }
}

/** ¿Está la web cerrada detrás del caso ahora mismo? */
export function caseGateActive(now = new Date()) {
  if (typeof window === "undefined") return false;
  if (isCaseSolved()) return false;
  if (new URLSearchParams(window.location.search).has("caso")) return true;
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
