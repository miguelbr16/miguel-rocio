export interface BookPage {
  id: string;
  kind: "cover" | "spread";
  chapter?: string;
  title: string;
  date?: string;
  /** Frase / texto principal */
  body: string;
  /** Frase corta tipo cita */
  quote?: string;
  emoji?: string;
  photo?: string;
  photoCaption?: string;
}

export const bookPages: BookPage[] = [
  {
    id: "cover",
    kind: "cover",
    title: "Miguel & Rocío",
    date: "18 · 11 · 2025 → 18 · 11 · 2026",
    body: "El libro de nuestro primer año",
    quote: "Todas las páginas que aún estamos escribiendo.",
    photo: "/photos/portada.jpeg",
  },
  {
    id: "start",
    kind: "spread",
    chapter: "Capítulo I",
    title: "El día uno",
    date: "18 noviembre 2025",
    body: "Empezó sin avisar. Un día cualquiera que, mirado atrás, era imposible no llamarlo el primero.",
    quote: "Sin saber que era el principio de todo.",
    emoji: "✨",
    photo: "/photos/portada.jpeg",
    photoCaption: "Donde empezó a escribirse",
  },
  {
    id: "fall",
    kind: "spread",
    chapter: "Capítulo II",
    title: "De a poco",
    body: "No fue un golpe. Fueron miradas, mensajes, planes a medias… hasta que ya no había vuelta atrás.",
    quote: "El amor también se construye despacio.",
    emoji: "💫",
  },
  {
    id: "altea",
    kind: "spread",
    chapter: "Capítulo III",
    title: "Altea · Mar de invierno",
    date: "Enero 2026",
    body: "Calles blancas, frío en la cara y la certeza de que viajar juntos era lo nuestro.",
    quote: "El mar de enero todavía nos recuerda.",
    emoji: "🌊",
    photo: "/photos/portada.jpeg",
    photoCaption: "Invierno juntos",
  },
  {
    id: "paris",
    kind: "spread",
    chapter: "Capítulo IV",
    title: "París · La torre y nosotros",
    date: "Abril 2026",
    body: "Disneyland, la Torre, y esa foto que ahora abre nuestra web. París no fue un viaje: fue una declaración.",
    quote: "Misma pose. Misma torre. Para siempre.",
    emoji: "🗼",
    photo: "/photos/portada.jpeg",
    photoCaption: "Nuestra portada",
  },
  {
    id: "daily",
    kind: "spread",
    chapter: "Capítulo V",
    title: "Lo de cada día",
    body: "El café, las risas tontas, las llaves perdidas, las cobras. El amor también vive en lo pequeño.",
    quote: "Los días normales también cuentan.",
    emoji: "☕",
  },
  {
    id: "bingo",
    kind: "spread",
    chapter: "Capítulo VI",
    title: "Planes cumplidos",
    body: "El bingo no era un juego: era una lista de promesas. Cada casilla, un recuerdo. Cada foto, una prueba.",
    quote: "Tachamos casillas. Sumamos vida.",
    emoji: "🎯",
  },
  {
    id: "epilogue",
    kind: "spread",
    chapter: "Epílogo",
    title: "Hacia el año dos",
    date: "18 noviembre 2026",
    body: "Este libro no se cierra. Solo pasa de página. El próximo capítulo se llama Año Dos — y lo escribimos juntos.",
    quote: "La siguiente página empieza contigo.",
    emoji: "🤍",
    photo: "/photos/portada.jpeg",
    photoCaption: "Seguimos",
  },
];
