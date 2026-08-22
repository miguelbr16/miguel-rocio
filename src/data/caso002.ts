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

/**
 * Caso 002 — CAPÍTULO POST-PARÍS
 * El Caso 001 cubrió el origen (Instagram → París → 6 meses).
 * Este caso empieza cuando volvisteis de la Torre Eiffel: mayo–nov 2026.
 */
export const caso002Days: Caso002Day[] = [
  {
    id: "d1",
    unlockDate: d(2026, 10, 8),
    dia: "DÍA 1 · 8 NOV",
    icon: "📂",
    tipo: "NUEVO EXPEDIENTE",
    txt: "Agente Ro.\n\nEl Caso 001 quedó archivado: cruasán, multa, Altea, París, flores.\n\nEste es un expediente nuevo. Capítulo dos: **lo que pasó después**.\n\nPrimera pista post-París: ¿qué día volvisteis del viaje (vuelta desde Orly)?",
    mode: "q",
    keys: ["6", "6 abril", "abril", "06", "lun 6", "6 de abril"],
    unlock: "6 de abril de 2026. París se quedó en el archivo. La vida siguió — y mejor.",
    evidence: {
      stamp: "APERTURA · CAP. 2",
      title: "DESDE PARÍS HASTA HOY",
      lines: [
        "Caso 001: ORIGEN → CERRADO",
        "Caso 002: POST-PARÍS → ACTIVO",
        "Línea temporal: abril 2026 → noviembre 2026",
        "Sujeto M: movimientos sospechosos otra vez",
      ],
    },
  },
  {
    id: "d2",
    unlockDate: d(2026, 10, 9),
    dia: "DÍA 2 · 9 NOV",
    icon: "📸",
    tipo: "MISIÓN DE CAMPO",
    txt: "Agente Ro. Regla del Caso 002: solo evidencia **después de París**.\n\nEnvíale a M una foto vuestra de mayo en adelante — un recuerdo de esta segunda mitad del año.",
    mode: "reto",
    reto: "Mándale la foto post-París. Cuando M confirme → 3 toques en el sello 🛡️",
    unlock: "Esa es la historia que estamos escribiendo ahora. Me encanta.",
    evidence: {
      stamp: "PRUEBA 01",
      title: "VIDA DESPUÉS DEL VIAJE",
      lines: [
        "París: archivado ✓",
        "Nuevos recuerdos: en construcción",
        "Patrón detectado: más planes, más risas",
      ],
      photo: "/photos/portada.jpeg",
      photoLabel: "EVIDENCIA RECIENTE",
    },
  },
  {
    id: "d3",
    unlockDate: d(2026, 10, 10),
    dia: "DÍA 3 · 10 NOV",
    icon: "🔑",
    tipo: "MAYO 2026",
    txt: "Incidente documentado en mayo, semanas después de volver.\n\nM y su objetivo perdieron algo del coche. ¿Qué buscaron 30–60 minutos?",
    mode: "q",
    keys: ["llaves", "llave", "coche"],
    unlock: "Las llaves. Nuestro clásico post-París. Sin cambios.",
    evidence: {
      stamp: "PRUEBA 02",
      title: "INCIDENTE MAYO 2026",
      lines: [
        "Contexto: semanas después de París",
        "Duración: 30–60 min de búsqueda",
        "Resultado: aparecieron · Mood: risa",
      ],
    },
  },
  {
    id: "d4",
    unlockDate: d(2026, 10, 11),
    dia: "DÍA 4 · 11 NOV",
    icon: "🎯",
    tipo: "BINGO POST-PARÍS",
    txt: "Agente Ro. Tras París seguisteis tachando el bingo de planes.\n\n¿Qué desayuno dulce marcáisteis como hecho (emoji 🍩)?",
    mode: "q",
    keys: ["churros", "churro"],
    unlock: "Churros. Otro plan cumplido. Quedan muchos — para el año que viene.",
    evidence: {
      stamp: "PRUEBA 03",
      title: "BINGO 2026 — PROGRESO",
      lines: [
        "Completados post-París: churros · noches · fotos",
        "Pendientes: bolera · autocine · peli & manta",
        "Objetivo: seguir sumando",
      ],
    },
  },
  {
    id: "d5",
    unlockDate: d(2026, 10, 12),
    dia: "DÍA 5 · 12 NOV",
    icon: "👨‍🍳",
    tipo: "DÍA A DÍA",
    txt: "Archivo doméstico interceptado.\n\nDespués de París, M siguió cocinando. ¿Cuál es su plato estrella que ya conoces de memoria?",
    mode: "q",
    keys: ["pasta", "espagueti", "spaghetti", "macarrones"],
    unlock: "Pasta. Siempre pasta. Y contigo sabe mejor.",
    evidence: {
      stamp: "PRUEBA 04",
      title: "RUTINA M&R · POST-PARÍS",
      lines: [
        "Cocina compartida · Skincare team",
        "Domingos de guapos · Toallitas incluidas",
        "Nivel de hogar: oficial",
      ],
    },
  },
  {
    id: "d6",
    unlockDate: d(2026, 10, 13),
    dia: "DÍA 6 · 13 NOV",
    icon: "🎵",
    tipo: "MISIÓN DE CAMPO",
    txt: "Agente Ro. Canción del capítulo dos.\n\nEnvíale a M la canción que más os represente **desde que volvisteis de París**.",
    mode: "reto",
    reto: "Mándasela. Confirmación de M → 3 toques en el sello.",
    unlock: "La banda sonora del después. Guardada.",
    evidence: {
      stamp: "PRUEBA 05",
      title: "BANDA SONORA · CAP. 2",
      lines: [
        "Periodo: abril–noviembre 2026",
        "Género: lo nuestro",
        "Reproducciones en coche: ∞",
      ],
    },
  },
  {
    id: "d7",
    unlockDate: d(2026, 10, 14),
    dia: "DÍA 7 · 14 NOV",
    icon: "🗾",
    tipo: "FUTURO COMPARTIDO",
    txt: "Informe de destinos actualizado tras París.\n\n¿Cuál sigue siendo el gran viaje soñado en Asia que tenéis en el mapa?",
    mode: "q",
    keys: ["japon", "japón", "japan", "tokio", "tokyo"],
    unlock: "Japón. El siguiente capítulo geográfico. Contigo.",
    evidence: {
      stamp: "PRUEBA 06",
      title: "MAPa DE AVENTURAS — ACTUALIZADO",
      lines: [
        "Visitados: Valencia · Altea · París ✓",
        "Planificados: Oviedo · Roma · Núremberg",
        "Futuro: Japón · Auroras · Orlando",
      ],
    },
  },
  {
    id: "d8",
    unlockDate: d(2026, 10, 15),
    dia: "DÍA 8 · 15 NOV",
    icon: "💬",
    tipo: "MISIÓN DE CAMPO",
    txt: "Agente Ro. Misión íntima del capítulo dos.\n\nGrábale un audio de 15 segundos: tu mejor recuerdo **desde que volvisteis de París**.",
    mode: "reto",
    reto: "Envía el audio. Confirmación → 3 toques.",
    unlock: "Eso es lo que quiero recordar siempre. Te quiero.",
    evidence: {
      stamp: "PRUEBA 07",
      title: "TESTIMONIO AGENTE RO",
      lines: [
        "Periodo cubierto: post-París 2026",
        "Clasificación: emocional · alto impacto",
      ],
    },
  },
  {
    id: "d9",
    unlockDate: d(2026, 10, 16),
    dia: "DÍA 9 · 16 NOV",
    icon: "🌹",
    tipo: "INTERCEPTADO",
    txt: "ATENCIÓN. Tras meses de vida normal post-París, la agencia detecta un pedido.\n\nFlores. Entrega inminente.\n\nDile a M de qué color las quieres. (Respuesta libre.)",
    mode: "reto",
    reto: "Envíale tu color. Cuando M responda → 3 toques.",
    unlock: "Las prepararé como te gusten. Ya casi.",
    evidence: {
      stamp: "⚠️ INTERCEPTADO",
      title: "PEDIDO FLORAL — NOV 2026",
      lines: [
        "Contexto: preparativos aniversario 1 año",
        "Remitente: M · Destinatario: Agente Ro",
        "Estado: EN CAMINO",
      ],
    },
  },
  {
    id: "d10",
    unlockDate: d(2026, 10, 17),
    dia: "DÍA 10 · 17 NOV",
    icon: "🍽️",
    tipo: "VÍSPERA",
    txt: "Agente Ro. Mañana cumplís un año desde el primer beso.\n\nM ha reservado mesa. Dos personas. Noche especial.\n\nMisión: un emoji a M. Nada más. Estate lista mañana.",
    mode: "reto",
    reto: "Manda el emoji. Confirmación → 3 toques.",
    unlock: "Mañana cierra el capítulo dos. Y empieza todo lo demás.",
    evidence: {
      stamp: "URGENTE",
      title: "VÍSPERA DEL AÑO",
      lines: [
        "18 nov 2026 · 365 días",
        "Cena reservada · Flores en camino",
        "Capítulo 2 → gran final",
      ],
    },
  },
  {
    id: "d11",
    unlockDate: d(2026, 10, 18),
    dia: "DÍA 11 · 18 NOV — 1 AÑO",
    icon: "🥂",
    tipo: "CAPÍTULO CERRADO",
    txt: "Agente Ro.\n\nCaso 001: cómo empezó todo.\nCaso 002: lo que vino después de París.\n\nHoy, un año. El capítulo dos se cierra.\n\nM te espera esta noche. Con todo preparado.",
    mode: "final",
    unlock: "Feliz aniversario, mi amor. Gracias por este año — y por los que vienen.",
    evidence: {
      stamp: "🎊 1 AÑO",
      title: "CAPÍTULO 2 — COMPLETADO",
      lines: [
        "Origen: archivado en Caso 001",
        "Post-París: documentado en Caso 002",
        "Recompensa: cena · flores · carta · sorpresa",
        "Siguiente capítulo: juntos",
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
