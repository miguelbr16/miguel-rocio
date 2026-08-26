"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { coupleSongs } from "@/data/songs";

export function SoundtrackSection() {
  return (
    <section id="musica" className="section-wrap">
      <SectionHeader
        label="Banda sonora"
        title="Canciones que nos flipan"
        description="Tres temas que son vuestros. Dadle al play cuando haga falta recordar por qué."
      />

      <ol className="soundtrack-list">
        {coupleSongs.map((song, i) => (
          <motion.li
            key={song.id}
            className="soundtrack-track"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="soundtrack-num" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="soundtrack-meta">
              <h3 className="soundtrack-title">{song.title}</h3>
              <p className="soundtrack-artist">{song.artist}</p>
              {song.note ? <p className="soundtrack-note">{song.note}</p> : null}
            </div>
            {song.url ? (
              <a
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="soundtrack-play"
              >
                Escuchar
              </a>
            ) : null}
          </motion.li>
        ))}
      </ol>

      <p className="soundtrack-foot">
        Reto oficial: cantad juntas 10 segundos de cualquiera. Sin vergüenza.
      </p>
    </section>
  );
}
