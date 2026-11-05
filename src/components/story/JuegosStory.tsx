"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StoryPage } from "@/components/story/StoryPage";
import { PictionaryPanel, QuizPanel } from "@/components/sections/JuegosSection";
import { quizItems } from "@/data/quiz";

/** Dos cajas de juego para elegir; el juego se abre debajo. */
export function JuegosStory() {
  const [game, setGame] = useState<"quiz" | "pict" | null>(null);
  const boxes = [
    {
      id: "quiz" as const,
      name: "¿Cuánto sabes de nosotros?",
      line: `${quizItems.length} preguntas, retos y verdades sobre nuestro año.`,
      players: "Para Rocío",
      tone: "is-rose",
    },
    {
      id: "pict" as const,
      name: "Pictionary de pareja",
      line: "Uno dibuja, el otro adivina. Palabras solo nuestras.",
      players: "Para los dos",
      tone: "is-ink",
    },
  ];
  return (
    <StoryPage id="juegos" kicker="Juegos" title={<>Para jugar <em>juntos</em></>} lead="Elige una caja.">
      <div className="jg-boxes">
        {boxes.map((b) => (
          <motion.button
            key={b.id}
            type="button"
            className={`jg-box ${b.tone} ${game === b.id ? "is-on" : ""}`}
            onClick={() => setGame(game === b.id ? null : b.id)}
            whileHover={{ y: -8, rotate: b.id === "quiz" ? -1.2 : 1.2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="jg-lid" aria-hidden />
            <span className="jg-players">{b.players}</span>
            <span className="jg-name">{b.name}</span>
            <span className="jg-line">{b.line}</span>
            <span className="jg-cta">{game === b.id ? "Cerrar" : "Jugar"}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {game ? (
          <motion.div
            key={game}
            className="jg-table"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {game === "quiz" ? <QuizPanel /> : <PictionaryPanel />}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </StoryPage>
  );
}
