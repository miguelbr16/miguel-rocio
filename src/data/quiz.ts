export type QuizItemType = "quiz" | "reto" | "verdad";

interface QuizBase {
  type: QuizItemType;
  q: string;
}

export interface QuizQuestion extends QuizBase {
  type: "quiz";
  opts: string[];
  ans: number;
  ok: string;
  fail: string;
}

export interface QuizChallenge extends QuizBase {
  type: "reto" | "verdad";
  icon: string;
  tag: string;
}

export type QuizItem = QuizQuestion | QuizChallenge;

export const quizItems: QuizItem[] = [
  {
    type: "quiz",
    q: "¿Cómo consiguió Miguel tu número de teléfono?",
    opts: [
      "Por Instagram directamente",
      "Con una servilleta dentro de un cruasán",
      "A través de Sofía",
      "Llamando al trabajo",
    ],
    ans: 1,
    ok: "¡Exacto! Cruasán con servilleta. Nivel de creatividad máximo.",
    fail: "¡El cruasán! Con la servilleta con su número dentro.",
  },
  {
    type: "quiz",
    q: "¿Cuántas veces le rechazaste antes del primer beso?",
    opts: ["Ninguna", "Una vez", "Dos veces", "Tres veces"],
    ans: 2,
    ok: "Sí, dos veces. Y aquí seguimos. El chocolate ayudó.",
    fail: "¡Dos veces! Pero ninguna fue definitiva, gracias al chocolate.",
  },
  {
    type: "quiz",
    q: "¿Cuál es la comida favorita de Miguel?",
    opts: ["Pizza", "Sushi", "Pasta", "Paella"],
    ans: 2,
    ok: "¡Correcto! La pasta, siempre la pasta.",
    fail: "La pasta. Hay que comer más pasta juntos.",
  },
  {
    type: "quiz",
    q: "¿A qué le tiene miedo Miguel?",
    opts: ["A las arañas", "A los payasos", "A la oscuridad", "A las alturas"],
    ans: 1,
    ok: "¡Exacto! Los payasos. Terroríficos.",
    fail: "Los payasos. No hay más que hablar.",
  },
  {
    type: "reto",
    q: "RETO: Dile a Miguel una cosa que él no sabe que tú sabes de él.",
    icon: "👀",
    tag: "RETO",
  },
  {
    type: "quiz",
    q: "¿Cuánto tiempo estuvieron intentando abrir el apartamento equivocado en Altea?",
    opts: ["5 minutos", "15 minutos", "30 minutos", "1 hora"],
    ans: 2,
    ok: "¡30 minutos! Un clásico ya de vuestra historia.",
    fail: "30 minutos poniendo el código en la puerta que no era.",
  },
  {
    type: "verdad",
    q: "VERDAD: ¿Cuál fue el momento exacto en que supiste que te gustaba de verdad?",
    icon: "💗",
    tag: "VERDAD",
  },
  {
    type: "quiz",
    q: "¿Cuál es el gran sueño de Miguel relacionado con el motor?",
    opts: [
      "Ver un Gran Premio",
      "Conocer a un piloto",
      "Tener algo relacionado con la F1",
      "Correr una carrera de karts",
    ],
    ans: 2,
    ok: "¡Sí! La F1, su sueño de siempre.",
    fail: "Tener algo relacionado con la F1. Su sueño de siempre.",
  },
  {
    type: "quiz",
    q: "¿Cómo le pidió Miguel a Rocío que fuera su novia?",
    opts: [
      "Por WhatsApp",
      "Con una multa personalizada",
      "Con una cena en casa el 27 de diciembre",
      "En Disneyland París",
    ],
    ans: 2,
    ok: "¡Exacto! Cena en casa, menú, regalos de Navidad y la pregunta.",
    fail: "Una cena en casa el 27 de diciembre. Con menú, regalos y la pregunta.",
  },
  {
    type: "reto",
    q: "RETO FINAL: Cuéntale a Miguel el momento más gracioso que recuerdas juntos.",
    icon: "😂",
    tag: "RETO FINAL",
  },
  {
    type: "quiz",
    q: "¿Qué regalo le hizo Miguel a Rocío en Navidad?",
    opts: ["Un bolso", "Un viaje a París", "Unos pendientes", "Una cena romántica"],
    ans: 1,
    ok: "¡Exacto! París. El mejor regalo.",
    fail: "Un viaje a París. Su regalo de Navidad.",
  },
  {
    type: "quiz",
    q: "¿Dónde fue su primera cita a solas?",
    opts: ["Restaurante Siglo 21", "McDonalds", "Una cafetería", "El cine"],
    ans: 1,
    ok: "¡Correcto! McDonalds. Las mejores historias empiezan así.",
    fail: "McDonalds. Simple y perfecto.",
  },
  {
    type: "quiz",
    q: "¿Cuándo se hicieron novios oficialmente?",
    opts: ["18 noviembre 2025", "27 diciembre 2025", "1 enero 2026", "9 diciembre 2025"],
    ans: 1,
    ok: "¡Exacto! 27 de diciembre. Cena en casa y la pregunta.",
    fail: "El 27 de diciembre. Cena en casa con menú preparado.",
  },
  {
    type: "verdad",
    q: "VERDAD: Describe a Miguel en 3 palabras, pero tiene que estar de acuerdo con las tres.",
    icon: "🎯",
    tag: "VERDAD",
  },
  {
    type: "quiz",
    q: "¿Quién es Sofía en la historia de Miguel y Rocío?",
    opts: [
      "La hermana de Rocío",
      "Una prima de Miguel",
      "La amiga en común que los juntó",
      "La vecina",
    ],
    ans: 2,
    ok: "¡La amiga en común! Sin Sofía esto no existiría.",
    fail: "La amiga en común. La culpable de todo, en el buen sentido.",
  },
  {
    type: "quiz",
    q: "¿Qué le regaló Miguel a Rocío para convencerla la segunda vez?",
    opts: [
      "Un ramo de flores",
      "Una tableta de chocolate con nota",
      "Un peluche",
      "Un collar",
    ],
    ans: 1,
    ok: "¡La tableta de chocolate! Irresistible.",
    fail: "Una tableta de chocolate con una notita. Efectivo.",
  },
  {
    type: "reto",
    q: "RETO: Cantad juntos 10 segundos de la canción que más os identifica. Sin vergüenza.",
    icon: "🎤",
    tag: "RETO",
  },
  {
    type: "quiz",
    q: "¿Cuándo fue la primera foto juntos?",
    opts: ["18 noviembre 2025", "17 noviembre 2025", "27 diciembre 2025", "9 diciembre 2025"],
    ans: 1,
    ok: "¡17 de noviembre! Un día antes del primer beso.",
    fail: "El 17 de noviembre de 2025. Un día antes del primer beso.",
  },
  {
    type: "quiz",
    q: "¿Cuál es el destino soñado de los dos en Asia?",
    opts: ["China", "Tailandia", "Japón", "Corea"],
    ans: 2,
    ok: "¡Japón! El gran viaje pendiente.",
    fail: "Japón. Será el próximo gran viaje.",
  },
];
