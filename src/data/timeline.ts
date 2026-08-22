export type TimelineDot = "normal" | "funny" | "big";
export type TimelineTagColor = "rosa" | "azul";

export interface TimelineEvent {
  date: string;
  tag?: string;
  tagColor?: TimelineTagColor;
  dot: TimelineDot;
  title: string;
  text: string;
  photo?: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    date: "Agosto 2025",
    tag: "El principio",
    tagColor: "rosa",
    dot: "normal",
    title: "El primer mensaje",
    text: "Miguel te escribe por Instagram. Empieza todo... aunque tú no lo sabes todavía.",
  },
  {
    date: "Primer rechazo",
    tag: "Obstáculo 1",
    tagColor: "azul",
    dot: "funny",
    title: "El cruasán con servilleta",
    text: "Miguel no se rinde. Te pide el número con una servilleta dentro de un cruasán. Original 10/10.",
  },
  {
    date: "Segundo rechazo",
    tag: "Obstáculo 2",
    tagColor: "azul",
    dot: "funny",
    title: "La tableta de chocolate",
    text: "Tampoco. Pero llegó una tableta de chocolate con una notita. Difícil resistirse a eso.",
  },
  {
    date: "Otoño 2025",
    tag: "El plan",
    tagColor: "rosa",
    dot: "normal",
    title: "El Siglo 21 con Sofía",
    text: "Quedadas en Campolivar con Sofía de por medio. Poco a poco, con cuidado. Pero ya se veía venir.",
  },
  {
    date: "Noviembre 2025",
    tag: "La jugada maestra",
    tagColor: "rosa",
    dot: "normal",
    title: "La multa personalizada",
    text: "Para pedirte salir: una multa personalizada. Sancionada por no ser su novia todavía.",
  },
  {
    date: "Primera cita a solas",
    tag: "Cobra 1",
    tagColor: "azul",
    dot: "funny",
    title: "La primera cobra",
    text: "El Siglo 21. Primer intento de beso: cobra. Pero con estilo.",
  },
  {
    date: "18 noviembre 2025",
    tag: "Cobra 2 → Beso",
    tagColor: "azul",
    dot: "big",
    title: "La cobra que no pudo ser... y el primer beso",
    text: "McDonalds. Segundo intento de beso: otra cobra. Pero ese mismo día, antes de despedirse, llegó el primer beso.",
  },
  {
    date: "17 noviembre 2025",
    tag: "Hito",
    tagColor: "rosa",
    dot: "big",
    title: "Primera foto juntos",
    text: "Ya oficial en las fotos aunque no todavía en el nombre.",
  },
  {
    date: "18 noviembre 2025 ♥",
    tag: "El momento",
    tagColor: "rosa",
    dot: "big",
    title: "El primer beso",
    text: "Desde aquí empieza a contar. Todo.",
    photo: "/photos/historia/historia3.jpeg",
  },
  {
    date: "9 diciembre 2025",
    tagColor: "rosa",
    dot: "normal",
    title: "Te presenté a mi mamá",
    text: "Importante de verdad.",
  },
  {
    date: "27 diciembre 2025",
    tag: "Oficial",
    tagColor: "rosa",
    dot: "big",
    title: "Mi novia",
    text: "Cena para dos en casa, menú preparado, regalos de Navidad y la pregunta. Dijiste que sí.",
  },
  {
    date: "16 enero 2026",
    tag: "Primera escapada",
    tagColor: "azul",
    dot: "funny",
    title: "Altea y el apartamento equivocado",
    text: "Primera escapada juntos. 30 minutos poniendo el código en la puerta de otra persona. Un clásico ya.",
    photo: "/photos/historia/historia2.jpeg",
  },
  {
    date: "23 enero 2026",
    tag: "Tu cumpleaños",
    tagColor: "rosa",
    dot: "big",
    title: "Tu cumpleaños",
    text: "Te regalé el viaje a Disneyland París. El regalo que más ilusión me hizo hacer.",
    photo: "/photos/historia/historia2.jpeg",
  },
  {
    date: "2–6 abril 2026",
    tag: "Gran viaje",
    tagColor: "rosa",
    dot: "big",
    title: "París + Disneyland",
    text: "El regalo hecho realidad. Torre Eiffel, Disneyland, y los mejores días. 🗼",
    photo: "/photos/historia/historia1.jpeg",
  },
  {
    date: "Mayo 2026",
    tag: "Clásico nuestro",
    tagColor: "azul",
    dot: "funny",
    title: "Las llaves del coche",
    text: "30–60 minutos buscándolas. Spoiler: aparecieron.",
  },
];
