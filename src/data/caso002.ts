import { STORAGE_KEYS } from "@/lib/constants";
import { sorpresaConfig } from "./sorpresa-config";

export type Caso002Mode = "q" | "reto" | "final";

export interface Caso002Evidence {
  stamp: string;
  title: string;
  lines: string[];
  photo?: string;
  photoLabel?: string;
}

export interface Caso002Day {
  id: string;
  unlockDate: Date;
  dia: string;
  icon: string;
  tipo: string;
  txt: string;
  mode: Caso002Mode;
  keys?: string[];
  reto?: string;
  unlock: string;
  evidence: Caso002Evidence;
}

function d(y: number, m: number, day: number) {
  return new Date(y, m, day, 0, 0, 0, 0);
}

/** Fecha de cierre del Caso 001 (expediente legacy) */
export const CASO001_CIERRE = new Date(2026, 4, 15, 20, 0, 0);

/**
 * Caso 002 — CONTINUACIÓN
 * El Caso 001 (mayo 4–15) contó vuestra historia entera como investigación
 * y cerró el 15 mayo con flores + carta.
 * Este caso empieza AHÍ: lo que pasó desde el cierre hasta el 1 año.
 */
export const caso002Days: Caso002Day[] = [
  {
    id: "d1",
    unlockDate: d(2026, 10, 8),
    dia: "DÍA 1 · 8 NOV",
    icon: "📂",
    tipo: "NUEVO EXPEDIENTE",
    txt: "Agente Ro.\n\nEl Caso 001 quedó **cerrado** el 15 de mayo: objetivo identificado, flores, carta.\n\nLa agencia abre un archivo nuevo. No es París ni el origen — eso ya está en el Caso 001.\n\nEste caso documenta **lo que vino después del cierre**.\n\nPrimera pista: ¿qué día se cerró oficialmente el Caso 001?",
    mode: "q",
    keys: ["15", "15 mayo", "mayo", "15 de mayo", "15/5", "15-5"],
    unlock: "15 de mayo de 2026. Flores, carta, y el caso archivado. Empezamos otro.",
    evidence: {
      stamp: "APERTURA · CAS. 002",
      title: "DESDE EL CIERRE DEL CASO 001",
      lines: [
        "Caso 001: CERRADO · 15 mayo 2026 · 20:00h",
        "Cierre: flores + carta + «el objetivo eras tú»",
        "Caso 002: ACTIVO · capítulo siguiente",
        "Periodo: mayo → noviembre 2026",
      ],
    },
  },
  {
    id: "d2",
    unlockDate: d(2026, 10, 9),
    dia: "DÍA 2 · 9 NOV",
    icon: "💌",
    tipo: "ARCHIVO 001",
    txt: "Agente Ro. Noche del cierre del Caso 001.\n\nM apareció con flores y algo escrito. ¿Qué más llevaba aparte de las flores?",
    mode: "q",
    keys: ["carta", "letter", "sobre", "nota"],
    unlock: "Una carta. Como entonces. Como ahora.",
    evidence: {
      stamp: "REF. CASO 001",
      title: "NOCHE DEL 15 DE MAYO",
      lines: [
        "Entrega: flores + carta",
        "Mensaje: el objetivo siempre fuiste tú",
        "Estado del sujeto M: enamorado confirmado",
      ],
    },
  },
  {
    id: "d3",
    unlockDate: d(2026, 10, 10),
    dia: "DÍA 3 · 10 NOV",
    icon: "📸",
    tipo: "MISIÓN DE CAMPO",
    txt: "Agente Ro. Regla del Caso 002: solo recuerdos **después del 15 de mayo**.\n\nEnvíale a M una foto vuestra de este verano u otoño — algo del capítulo nuevo.",
    mode: "reto",
    reto: "Mándale la foto. Cuando M confirme → 3 toques en el sello 🛡️",
    unlock: "Así es como sigue la historia. Me encanta.",
    evidence: {
      stamp: "PRUEBA 01",
      title: "EVIDENCIA POST-CIERRE",
      lines: [
        "Periodo: junio–noviembre 2026",
        "Contexto: vida de pareja en marcha",
        "Patrón: más días juntos, más planes",
      ],
      photo: "/photos/portada.jpeg",
      photoLabel: "ARCHIVO RECIENTE",
    },
  },
  {
    id: "d4",
    unlockDate: d(2026, 10, 11),
    dia: "DÍA 4 · 11 NOV",
    icon: "🎯",
    tipo: "BINGO EN MARCHA",
    txt: "Tras cerrar el Caso 001 seguisteis tachando el bingo.\n\n¿Qué plan dulce marcasteis hecho (🍩)?",
    mode: "q",
    keys: ["churros", "churro"],
    unlock: "Churros. Otro recuerdo para el Caso 002.",
    evidence: {
      stamp: "PRUEBA 02",
      title: "BINGO · SEGUNDA MITAD 2026",
      lines: [
        "Hechos: churros · noches · fotos · cocina",
        "Pendientes: bolera · autocine · peli & manta",
        "Objetivo: seguir sumando juntos",
      ],
    },
  },
  {
    id: "d5",
    unlockDate: d(2026, 10, 12),
    dia: "DÍA 5 · 12 NOV",
    icon: "👨‍🍳",
    tipo: "DÍA A DÍA",
    txt: "Informe doméstico — periodo post-Caso 001.\n\nM sigue cocinando. ¿Su plato estrella?",
    mode: "q",
    keys: ["pasta", "espagueti", "spaghetti", "macarrones"],
    unlock: "Pasta. Siempre. Contigo sabe a casa.",
    evidence: {
      stamp: "PRUEBA 03",
      title: "RUTINA M&R · MAYO–NOV",
      lines: [
        "Cocina · Skincare · Domingos de guapos",
        "Toallitas · Risas · Llaves (a veces)",
        "Nivel de hogar: consolidado",
      ],
    },
  },
  {
    id: "d6",
    unlockDate: d(2026, 10, 13),
    dia: "DÍA 6 · 13 NOV",
    icon: "🎵",
    tipo: "MISIÓN DE CAMPO",
    txt: "Agente Ro. Banda sonora del Caso 002.\n\nEnvíale a M la canción que más os represente **desde que se cerró el Caso 001**.",
    mode: "reto",
    reto: "Mándasela. Confirmación de M → 3 toques en el sello.",
    unlock: "Guardada en el expediente. Nuestra.",
    evidence: {
      stamp: "PRUEBA 04",
      title: "AUDIOLOGÍA EMOCIONAL",
      lines: [
        "Desde: 15 mayo 2026",
        "Reproducciones en coche: demasiadas",
        "Clasificación: capítulo 2",
      ],
    },
  },
  {
    id: "d7",
    unlockDate: d(2026, 10, 14),
    dia: "DÍA 7 · 14 NOV",
    icon: "🗾",
    tipo: "FUTURO",
    txt: "Tras meses juntos post-investigación, el mapa de destinos sigue creciendo.\n\n¿Cuál es el gran viaje soñado en Asia?",
    mode: "q",
    keys: ["japon", "japón", "japan", "tokio", "tokyo"],
    unlock: "Japón. El siguiente caso geográfico.",
    evidence: {
      stamp: "PRUEBA 05",
      title: "MAPa ACTUALIZADO",
      lines: [
        "Caso 001 archivó: Valencia · Altea · París",
        "Caso 002 planifica: Japón · Auroras · Orlando",
        "Estado: soñando en equipo",
      ],
    },
  },
  {
    id: "d8",
    unlockDate: d(2026, 10, 15),
    dia: "DÍA 8 · 15 NOV",
    icon: "💬",
    tipo: "MISIÓN DE CAMPO",
    txt: "Agente Ro. Audio clasificado.\n\nGrábale 15 segundos: tu mejor recuerdo **desde el cierre del Caso 001**.",
    mode: "reto",
    reto: "Envía el audio. Confirmación → 3 toques.",
    unlock: "Lo guardo para siempre. Te quiero.",
    evidence: {
      stamp: "PRUEBA 06",
      title: "TESTIMONIO AGENTE RO",
      lines: [
        "Periodo: mayo–nov 2026",
        "Impacto en M: crítico ❤️",
      ],
    },
  },
  {
    id: "d9",
    unlockDate: d(2026, 10, 16),
    dia: "DÍA 9 · 16 NOV",
    icon: "🌹",
    tipo: "INTERCEPTADO",
    txt: "ATENCIÓN. Como en el cierre del Caso 001, la agencia detecta un pedido de flores.\n\nDile a M de qué color las quieres esta vez.",
    mode: "reto",
    reto: "Envíale tu color. Cuando M responda → 3 toques.",
    unlock: "Otra vez flores. Otra vez por ti.",
    evidence: {
      stamp: "⚠️ INTERCEPTADO",
      title: "PEDIDO FLORAL — ANIVERSARIO",
      lines: [
        "Referencia: cierre Caso 001 (flores + carta)",
        "Remitente: M · Destinatario: Agente Ro",
        "Motivo: 1 año juntos",
      ],
    },
  },
  {
    id: "d10",
    unlockDate: d(2026, 10, 17),
    dia: "DÍA 10 · 17 NOV",
    icon: "🍽️",
    tipo: "VÍSPERA",
    txt: "Agente Ro. Mañana hace un año del primer beso.\n\nM ha reservado mesa. Como aquella noche del Caso 001, pero más grande.\n\nUn emoji a M. Estate lista mañana.",
    mode: "reto",
    reto: "Manda el emoji. Confirmación → 3 toques.",
    unlock: "Mañana cierra el Caso 002. Confía.",
    evidence: {
      stamp: "URGENTE",
      title: "VÍSPERA · 1 AÑO",
      lines: [
        "18 nov 2026 · 365 días",
        "Cena + flores + carta + sorpresa",
        "Eco del cierre del Caso 001",
      ],
    },
  },
  {
    id: "d11",
    unlockDate: d(2026, 10, 18),
    dia: "DÍA 11 · 18 NOV — 1 AÑO",
    icon: "🥂",
    tipo: "CASO CERRADO",
    txt: "Agente Ro.\n\nCaso 001: cómo os conocisteis — cerrado en mayo con flores y carta.\nCaso 002: lo que vino después — cierra hoy.\n\nUn año desde el primer beso. M te espera esta noche.",
    mode: "final",
    unlock: "Feliz aniversario. Gracias por jugar conmigo otra vez, pequeñita.",
    evidence: {
      stamp: "🎊 1 AÑO",
      title: "CASO 002 — CERRADO",
      lines: [
        "Caso 001: origen → archivado 15 mayo",
        "Caso 002: continuación → cerrado 18 nov",
        "Recompensa: cena · flores · carta · sorpresa",
        "Próximo capítulo: juntos",
      ],
    },
  },
];

export function getCaso002Progress(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(STORAGE_KEYS.caso002Progress) ?? "-1");
}

export function setCaso002Progress(dayIndex: number) {
  localStorage.setItem(STORAGE_KEYS.caso002Progress, String(dayIndex));
}

export function getUnlockedDayIndex(now = new Date()): number {
  if (sorpresaConfig.devUnlockAll) return caso002Days.length - 1;

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let idx = -1;
  for (let i = 0; i < caso002Days.length; i++) {
    const unlock = new Date(caso002Days[i].unlockDate);
    unlock.setHours(0, 0, 0, 0);
    if (today >= unlock) idx = i;
  }
  return idx;
}

export function isFinaleRevealed(now = new Date()): boolean {
  if (sorpresaConfig.devUnlockAll) return true;
  return now >= sorpresaConfig.revealAt;
}
