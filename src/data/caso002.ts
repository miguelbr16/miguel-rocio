import { sorpresaConfig } from "./sorpresa-config";

export type Caso002Mode = "q" | "reto" | "final" | "intro";

export interface Caso002Evidence {
  stamp: string;
  title: string;
  lines: string[];
  photo?: string;
  photoLabel?: string;
}

export interface Caso002Day {
  id: string;
  /** Fecha en la que se desbloquea (medianoche local) */
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

/** Caso 002 — del 8 al 18 nov 2026 → gran noche (cena + flores + sorpresa) */
export const caso002Days: Caso002Day[] = [
  {
    id: "d1",
    unlockDate: d(2026, 10, 8),
    dia: "DÍA 1 · 8 NOV",
    icon: "📂",
    tipo: "EXPEDIENTE REABIERTO",
    txt: "Agente Ro.\n\nEl Caso 001 quedó cerrado. Pero la agencia ha detectado actividad nueva.\n\nUn año después del primer beso, el sujeto M prepara algo. Tu misión: descubrir qué.\n\nPrimera pista: ¿en qué red social empezó todo?",
    mode: "q",
    keys: ["instagram", "insta", "ig"],
    unlock: "Correcto. Desde un mensaje hasta esto. Bienvenida de vuelta, Agente Ro.",
    evidence: {
      stamp: "ARCHIVO 001",
      title: "CONEXIÓN CON CASO ANTERIOR",
      lines: [
        "Caso 001: CERRADO · Objetivo identificado: Usted",
        "Caso 002: ACTIVO · Código: EL PRIMER AÑO",
        "Sujeto M: comportamiento sospechoso de preparativos",
        "Indicios: reservas · flores · silencio selectivo",
      ],
    },
  },
  {
    id: "d2",
    unlockDate: d(2026, 10, 9),
    dia: "DÍA 2 · 9 NOV",
    icon: "📸",
    tipo: "MISIÓN DE CAMPO",
    txt: "Agente Ro. Documentación requerida.\n\nEnvíale a M la foto vuestra favorita de este año — la que más os represente.",
    mode: "reto",
    reto: "Mándale la foto. Cuando te confirme, pulsa 3 veces el sello de la agencia abajo.",
    unlock: "Esa foto vale más que mil palabras. Gracias por jugar, pequeñita.",
    evidence: {
      stamp: "PRUEBA A",
      title: "EVIDENCIA VISUAL — AÑO 1",
      lines: [
        "Altea · París · McDonalds · Casa",
        "Patrón: felicidad recurrente",
        "Agente Ro aparece en el 94% de las pruebas",
      ],
      photo: "/photos/portada.jpeg",
      photoLabel: "REFERENCIA — FOTO DEL EXPEDIENTE",
    },
  },
  {
    id: "d3",
    unlockDate: d(2026, 10, 10),
    dia: "DÍA 3 · 10 NOV",
    icon: "💋",
    tipo: "DATO CLAVE",
    txt: "Agente Ro. Fecha crítica del expediente.\n\n¿Qué día fue el primer beso — el día desde el que todo cuenta?",
    mode: "q",
    keys: ["18", "noviembre", "18 noviembre", "18/11", "18-11", "1811", "181125"],
    unlock: "18 de noviembre de 2025. El día que lo cambió todo.",
    evidence: {
      stamp: "PRUEBA B",
      title: "LÍNEA TEMPORAL OFICIAL",
      lines: [
        "Inicio operativo: 18 nov 2025",
        "Vector inicial: McDonalds + 2 cobras",
        "Estado actual: 1 año en camino",
      ],
    },
  },
  {
    id: "d4",
    unlockDate: d(2026, 10, 11),
    dia: "DÍA 4 · 11 NOV",
    icon: "💑",
    tipo: "INTERCEPTADO",
    txt: "Transmisión del 27 de diciembre de 2025 interceptada.\n\n¿Qué pregunta le hizo M a su objetivo esa noche?",
    mode: "q",
    keys: ["novia", "novios", "ser mi novia", "quieres ser"],
    unlock: "Dijiste que sí. Best decision ever.",
    evidence: {
      stamp: "PRUEBA C",
      title: "OPERACIÓN NAVIDAD",
      lines: [
        "Menú casero · Regalos · Pregunta oficial",
        "Respuesta: AFIRMATIVA",
        "Estado: NOVIOS OFICIALES",
      ],
    },
  },
  {
    id: "d5",
    unlockDate: d(2026, 10, 12),
    dia: "DÍA 5 · 12 NOV",
    icon: "🎵",
    tipo: "MISIÓN DE CAMPO",
    txt: "Agente Ro. El sujeto M necesita una pista emocional.\n\nEnvíale la canción que más os ha marcado este año (Spotify, nota de voz, lo que sea).",
    mode: "reto",
    reto: "Mándasela. Confirmación recibida → 3 toques en el sello.",
    unlock: "Nuestra banda sonora. La guardo contigo.",
    evidence: {
      stamp: "PRUEBA D",
      title: "FRECUENCIA EMOCIONAL",
      lines: [
        "Música compartida · Coches · Risas",
        "Nivel de complicidad: MÁXIMO",
      ],
    },
  },
  {
    id: "d6",
    unlockDate: d(2026, 10, 13),
    dia: "DÍA 6 · 13 NOV",
    icon: "🗼",
    tipo: "OPERACIÓN PARÍS",
    txt: "Agente Ro. Abril 2026. Ciudad de la luz.\n\n¿Qué monumento visitaron juntos que brilla de noche?",
    mode: "q",
    keys: ["eiffel", "torre", "torre eiffel"],
    unlock: "París fue magia. Y tú fuiste la magia de París.",
    evidence: {
      stamp: "PRUEBA E",
      title: "GRAN VIAJE — ABRIL 2026",
      lines: [
        "Disneyland · Torre Eiffel · Hotel Opéra",
        "Regalo de cumpleaños cumplido",
        "Calificación Agente Ro: ★★★★★",
      ],
    },
  },
  {
    id: "d7",
    unlockDate: d(2026, 10, 14),
    dia: "DÍA 7 · 14 NOV",
    icon: "🔑",
    tipo: "CLÁSICO M&R",
    txt: "Incidente recurrente documentado.\n\n¿Qué estuvieron buscando 30–60 minutos sin encontrar?",
    mode: "q",
    keys: ["llaves", "llave", "coche"],
    unlock: "Las llaves del coche. Nuestro thriller favorito.",
    evidence: {
      stamp: "PRUEBA F",
      title: "INCIDENTE LLAVES",
      lines: [
        "Duración: 30–60 min",
        "Resultado: aparecieron (spoiler)",
        "Mood: risa + paciencia infinita",
      ],
    },
  },
  {
    id: "d8",
    unlockDate: d(2026, 10, 15),
    dia: "DÍA 8 · 15 NOV",
    icon: "💬",
    tipo: "MISIÓN DE CAMPO",
    txt: "Agente Ro. Misión íntima.\n\nGrábale un audio de 15 segundos diciendo por qué este año ha valido la pena.",
    mode: "reto",
    reto: "Envía el audio. Confirmación → 3 toques en el sello.",
    unlock: "Lo guardaré para siempre. Te quiero.",
    evidence: {
      stamp: "PRUEBA G",
      title: "DECLARACIÓN AGENTE RO",
      lines: [
        "Archivo de voz: CLASIFICADO",
        "Impacto en sujeto M: CRÍTICO ❤️",
      ],
    },
  },
  {
    id: "d9",
    unlockDate: d(2026, 10, 16),
    dia: "DÍA 9 · 16 NOV",
    icon: "🌹",
    tipo: "DESCLASIFICACIÓN PARCIAL",
    txt: "ATENCIÓN AGENTE RO.\n\nInterceptamos un pedido. Flores. Fecha de entrega: próximos días.\n\n¿De qué color crees que serán? (Respuesta libre — escríbelo y envíaselo a M.)",
    mode: "reto",
    reto: "Dile tu color. Cuando M responda, 3 toques en el sello.",
    unlock: "Prepararé las que más te gusten. Ya verás.",
    evidence: {
      stamp: "⚠️ INTERCEPTADO",
      title: "PEDIDO FLORAL DETECTADO",
      lines: [
        "Remitente: Sujeto M",
        "Destinatario: Agente Ro",
        "Estado: EN PREPARACIÓN",
      ],
    },
  },
  {
    id: "d10",
    unlockDate: d(2026, 10, 17),
    dia: "DÍA 10 · 17 NOV",
    icon: "🍽️",
    tipo: "TRANSMISIÓN URGENTE",
    txt: "Agente Ro. Mañana es el día.\n\nEl sujeto M ha hecho una reserva. Dos personas. Hora nocturna.\n\nMisión: no hagas preguntas. Solo estate lista mañana por la tarde.",
    mode: "reto",
    reto: "Responde a M con un emoji. Confirmación → 3 toques.",
    unlock: "Mañana lo entenderás todo. Confía en mí.",
    evidence: {
      stamp: "URGENTE",
      title: "RESERVA CONFIRMADA",
      lines: [
        "Fecha: 18 noviembre 2026",
        "Invitados: 2 · Vibe: especial",
        "Dress code: guapa (como siempre)",
      ],
    },
  },
  {
    id: "d11",
    unlockDate: d(2026, 10, 18),
    dia: "DÍA 11 · 18 NOV — 1 AÑO",
    icon: "🥂",
    tipo: "CASO CERRADO · GRAN NOCHE",
    txt: "Agente Ro.\n\nUn año. 365 días desde el primer beso.\n\nEl Caso 002 queda cerrado.\n\nEl sujeto M no es un misterio: es tuyo. Y esta noche, te lo demuestra.",
    mode: "final",
    unlock: "Feliz aniversario, mi amor. Te quiero.",
    evidence: {
      stamp: "🎊 FELIZ 1 AÑO",
      title: "MISIÓN COMPLETADA",
      lines: [
        "Objetivo: Agente Ro — identificado como EL AMOR DE M",
        "Recompensa: cena · flores · carta · algo más",
        "Estado: PARA SIEMPRE",
      ],
    },
  },
];

export function getCaso002Progress(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem("caso002-day") ?? "-1");
}

export function setCaso002Progress(dayIndex: number) {
  localStorage.setItem("caso002-day", String(dayIndex));
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
