export interface BookPage {
  id: string;
  chapter: string;
  title: string;
  date?: string;
  body: string;
  emoji: string;
  photo?: string;
}

export const bookPages: BookPage[] = [
  {
    id: "cover",
    chapter: "Portada",
    title: "Miguel & Rocío",
    date: "18 · 11 · 2025 → 18 · 11 · 2026",
    body: "Un año. Un libro. Todas las páginas que aún estamos escribiendo.",
    emoji: "📔",
    photo: "/photos/portada.jpeg",
  },
  {
    id: "start",
    chapter: "Capítulo 1",
    title: "El primer día",
    date: "18 noviembre 2025",
    body: "Empezó como empiezan las mejores historias: sin saber que lo era. Un día cualquiera que se convirtió en el día uno.",
    emoji: "✨",
  },
  {
    id: "fall",
    chapter: "Capítulo 2",
    title: "Cómo costó lo suyo",
    body: "No fue de golpe. Fue de a poco: miradas, mensajes, planes. Hasta que un día ya no había vuelta atrás.",
    emoji: "💫",
  },
  {
    id: "altea",
    chapter: "Capítulo 3",
    title: "Altea · Mar de invierno",
    date: "Enero 2026",
    body: "El frío del mar, las calles blancas, y la certeza de que viajar juntos era lo nuestro.",
    emoji: "🌊",
  },
  {
    id: "paris",
    chapter: "Capítulo 4",
    title: "París · La torre y nosotros",
    date: "Abril 2026",
    body: "Disneyland, la Torre Eiffel, y esa foto que ahora abre nuestra web. París no fue un viaje: fue una declaración.",
    emoji: "🗼",
    photo: "/photos/portada.jpeg",
  },
  {
    id: "daily",
    chapter: "Capítulo 5",
    title: "Lo de cada día",
    body: "No solo los viajes. También el café, las risas tontas, las llaves perdidas y las cobras. El amor también es lo pequeño.",
    emoji: "☕",
  },
  {
    id: "bingo",
    chapter: "Capítulo 6",
    title: "Planes cumplidos",
    body: "El bingo no era un juego: era una lista de promesas. Cada casilla, un recuerdo. Cada foto, una prueba.",
    emoji: "🎯",
  },
  {
    id: "epilogue",
    chapter: "Epílogo",
    title: "Hacia el año dos",
    date: "18 noviembre 2026",
    body: "Este libro no se cierra. Solo pasa de página. El próximo capítulo se llama Año Dos — y lo escribimos juntos.",
    emoji: "🤍",
  },
];
