export type CartaType = "open" | "locked" | "password";

export interface Carta {
  icon: string;
  fecha: string;
  titulo: string;
  hint: string;
  type: CartaType;
  content?: string;
  firma?: string;
  lockDate?: string;
  lockDateIso?: string;
  pwd?: string;
  blur?: boolean;
}

export const cartas: Carta[] = [
  {
    icon: "💌",
    fecha: "Para cuando lo necesites",
    titulo: "Para un mal día",
    hint: "Ábrela cuando todo se ponga cuesta arriba",
    type: "open",
    content:
      "Rocío,\n\nSi estás leyendo esto es porque hoy no es tu mejor día. Y está bien. No tienes que estar bien todo el tiempo.\n\nPero quiero que sepas que tienes a alguien que te ve, que te admira, y que va a estar aquí cuando se te pase. No importa qué. Aquí estaré.\n\nMira todo lo que eres. Y mira todo lo que tenemos. Eso no cambia con un mal día.\n\nTe quiero mucho.",
    firma: "Miguel ♥",
  },
  {
    icon: "🥂",
    fecha: "18 noviembre 2026",
    titulo: "Un año juntos",
    hint: "Se abre con la cápsula del aniversario · 18 nov",
    type: "locked",
    lockDate: "18 noviembre 2026",
    lockDateIso: "2026-11-18",
    content:
      "Rocío,\n\nUn año. 365 días desde el primer beso. Desde el cruasán, el chocolate, las cobras y las multas.\n\nSi estás leyendo esto, ya has abierto la cápsula. Has visto el vídeo. Has revivido Altea, París, las risas tontas y todo lo que no cabe en un montaje.\n\nGracias por cada día. Por elegirme. Por construir esto conmigo.\n\nEste es solo el primer capítulo del libro. El Año Dos empieza ahora — y quiero escribirlo contigo.\n\nTe quiero. Más que el año pasado. Más que mañana.",
    firma: "Miguel ♥",
  },
  {
    icon: "🤫",
    fecha: "Cuando llegue ese día",
    titulo: "????????????????",
    hint: "🔒 Protegida con contraseña",
    type: "password",
    pwd: "2316",
    content:
      "Rocío,\n\nHoy es el día más importante de mi vida. Y tú eres la razón.\n\nCada momento que hemos vivido juntos me ha traído hasta aquí. Y hoy, delante de todos, quiero que sepas que elegirte es lo mejor que he hecho.\n\nSiempre.",
    firma: "Tu marido ♥",
    blur: true,
  },
  {
    icon: "🌍",
    fecha: "18 noviembre 2030",
    titulo: "Cinco años",
    hint: "Dónde estaremos, qué habremos vivido",
    type: "locked",
    lockDate: "18 noviembre 2030",
    lockDateIso: "2030-11-18",
    content: "",
    firma: "",
  },
];
