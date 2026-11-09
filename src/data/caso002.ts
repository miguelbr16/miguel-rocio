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
    id: "brunch",
    title: "Abril · París",
    brief:
      "Agente Ro. El Caso 001 se cerró el 15 de mayo. Este expediente documenta **todo lo que vino después**, empezando por París.\n\nEl sujeto M juró que **jamás** haría una cosa… y en París la hizo por primera vez. Ahora es tradición en cada viaje.\n\n¿Qué es?",
    kind: "q",
    keys: ["brunch"],
    hint: "Se come a media mañana y a M le parecía una tontería.",
    solved: "Brunch. «Jamás haré brunch», decía.",
  },
  {
    id: "fotomaton",
    title: "La otra tradición",
    brief: "En París nos hicimos el primero. En Londres, otro en Camden Lock. Una cabina, cuatro fotos y dos caras de tontos.\n\n¿Qué es?",
    kind: "q",
    keys: ["fotomaton", "foto maton", "photobooth", "photo booth", "fotomatones"],
    hint: "Una máquina de fotos con cortinilla.",
    solved: "El fotomatón. Uno por ciudad, como mínimo.",
  },
  {
    id: "pravis",
    title: "Junio · El norte",
    brief: "Road trip en coche desde Valencia: Cantabria y Asturias. La segunda base fue un pueblo al que le cambiamos el nombre.\n\n¿Cómo lo **rebautizamos**?",
    kind: "q",
    keys: ["pravis"],
    hint: "Su nombre de verdad es Pravia.",
    solved: "«Pravis». Para siempre.",
  },
  {
    id: "vacas",
    title: "Los Picos de Europa",
    brief: "Primera base: Cangas de Onís. Covadonga, los Picos… y unas compañeras de carretera que andaban sueltas por todas partes.\n\n¿Qué **animales** eran?",
    kind: "q",
    keys: ["vacas", "vaca"],
    hint: "Mu.",
    solved: "Vacas sueltas. Y nosotros poniéndonos las botas a comer.",
  },
  {
    id: "catedrales",
    title: "La playa",
    brief: "En ese viaje pisamos una playa famosa por sus arcos de roca gigantes.\n\n¿Cómo se llama la **playa**?",
    kind: "q",
    keys: ["catedrales", "las catedrales", "playa de las catedrales"],
    hint: "Tiene nombre de iglesia… en plural.",
    solved: "La playa de las Catedrales.",
  },
  {
    id: "sobrinas",
    title: "Verano · Mallorca",
    brief: "Mallorca con tu familia. Cine en la habitación, palmitas y dos personitas que acabaron diciéndole «te quiero» a M.\n\nDime el nombre de **una** de tus sobrinas.",
    kind: "q",
    keys: ["ali", "lucia", "lucía"],
    hint: "Una empieza por A y la otra por L.",
    solved: "Ali y Lucía. Las mejores compañeras de cine.",
  },
  {
    id: "bici",
    title: "Octubre · Londres",
    brief: "Londres: anduvimos más que nunca, vimos ardillas en el parque y alguien rompió un miedo sobre dos ruedas.\n\n¿Qué **miedo** rompiste?",
    kind: "q",
    keys: ["bici", "bicicleta", "la bici"],
    hint: "Dos ruedas y pedales.",
    solved: "La bici. Lo hiciste, y lo hiciste genial.",
  },
  {
    id: "jokers",
    title: "31 de octubre",
    brief: "Última prueba antes del cierre. Halloween: la agencia tiene una foto de dos sospechosos con la cara pintada y una sonrisa que da miedo.\n\n¿De **qué** íbamos disfrazados?",
    kind: "q",
    keys: ["joker", "jokers", "guason", "el joker", "de joker", "de jokers"],
    hint: "El villano de Batman.",
    solved: "Dos Jokers. Why so serious?",
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
