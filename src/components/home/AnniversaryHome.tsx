"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CapsuleCard } from "@/components/CapsuleCard";
import { Journey } from "@/components/home/Journey";
import { Passport } from "@/components/home/Passport";
import { kmTogether, nextStops, stops } from "@/data/journey";
import { countdownParts, daysTogether } from "@/lib/dates";
import { ANNIVERSARY_DATE, RELATIONSHIP_START } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ease = [0.22, 1, 0.36, 1] as const;

const OURS: { id: string; title: string; line: string }[] = [
  { id: "historia", title: "Cómo empezó", line: "Del cruasán con servilleta a la multa personalizada." },
  { id: "cartas", title: "Cartas", line: "Las que se abren cuando toca, y la del aniversario." },
  { id: "libro", title: "El libro", line: "Nuestro año contado por capítulos." },
  { id: "juegos", title: "Juegos", line: "Quiz, dibujos y piques para los dos." },
  { id: "bingo", title: "Bingo", line: "Las cosas que siempre nos pasan." },
  { id: "musica", title: "Banda sonora", line: "Las canciones que ya son nuestras." },
  { id: "fechas", title: "Fechas", line: "Lo que no se nos puede olvidar." },
  { id: "promesas", title: "Año 2", line: "Lo que nos prometemos para el siguiente." },
];

function go(section: string) {
  window.location.hash = section;
}

export function AnniversaryHome() {
  const reduced = useReducedMotion();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const days = now ? daysTogether(now, RELATIONSHIP_START) : null;
  const cd = now ? countdownParts(ANNIVERSARY_DATE, now) : null;
  const isDay =
    now != null &&
    now.getFullYear() === ANNIVERSARY_DATE.getFullYear() &&
    now.getMonth() === ANNIVERSARY_DATE.getMonth() &&
    now.getDate() === ANNIVERSARY_DATE.getDate();
  const after = now != null && now >= ANNIVERSARY_DATE;

  return (
    <div className="home">
      {/* Portada: dos campos y el titular cortado por la costura */}
      <section className="hero-seam" aria-labelledby="hero-h">
        <div className="hero-seam-top" aria-hidden />
        <div className="hero-seam-bottom" aria-hidden />
        <h1 id="hero-h" className="hero-seam-title">
          <span className="sr-only">Un año contigo</span>
          <span className="hero-seam-copy hero-seam-copy-a" aria-hidden>
            Un año
            <br />
            contigo
          </span>
          <span className="hero-seam-copy hero-seam-copy-b" aria-hidden>
            Un año
            <br />
            contigo
          </span>
        </h1>
        <motion.div
          className="hero-print"
          initial={reduced ? false : { opacity: 0, y: 60, rotate: 14 }}
          animate={{ opacity: 1, y: 0, rotate: 6 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          whileHover={reduced ? undefined : { rotate: 0, scale: 1.03 }}
        >
          <Image src="/photos/portada.jpeg" alt="Miguel y Rocío en París" fill priority sizes="(max-width: 700px) 46vw, 22vw" className="object-cover object-[center_75%]" />
        </motion.div>
        <div className="hero-seam-foot">
          <p className="hero-seam-sub">
            Del 18 de noviembre de 2025 al de 2026: nueve sitios, dos cobras y un beso que lo empezó todo.
          </p>
          <button
            type="button"
            className="btn-solid"
            onClick={() => document.getElementById("viaje")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })}
          >
            Empezar el viaje
          </button>
        </div>
      </section>

      {/* La cuenta: lo único que cambia cada segundo */}
      <section className="count-field" aria-label="Nuestra cuenta">
        <div className="count-main">
          {after ? (
            <p className="count-big">{isDay ? "Hoy hace un año." : "Ya llevamos más de un año."}</p>
          ) : (
            <p className="count-big">
              {cd ? (
                <>
                  {cd.days} días, {String(cd.hours).padStart(2, "0")}:{String(cd.minutes).padStart(2, "0")}:
                  {String(cd.seconds).padStart(2, "0")}
                </>
              ) : (
                " "
              )}
            </p>
          )}
          <p className="count-caption">{after ? "Desde el 18 de noviembre de 2025." : "para el 18 de noviembre. Ese día se abre todo."}</p>
        </div>
        <dl className="count-facts">
          <div>
            <dt>días juntos</dt>
            <dd>{days ?? " "}</dd>
          </div>
          <div>
            <dt>sellos en el pasaporte</dt>
            <dd>{stops.length}</dd>
          </div>
          <div>
            <dt>km de ida y vuelta, como poco</dt>
            <dd>{kmTogether().toLocaleString("es-ES")}</dd>
          </div>
        </dl>
      </section>

      <Journey />

      <Passport />

      <section className="capsule-field" id="capsula-home" aria-labelledby="capsula-h">
        <div className="capsule-copy">
          <h2 id="capsula-h" className="field-head">
            La cápsula
          </h2>
          <p className="field-lead">
            Un vídeo con todo el año dentro y una carta. Está sellada hasta el 18 de noviembre a las 00:00.
          </p>
        </div>
        <div className="capsule-slot">
          <CapsuleCard />
        </div>
      </section>

      <section className="caso-field" aria-labelledby="caso-h">
        <h2 id="caso-h" className="field-head">
          Caso 002
        </h2>
        <p className="field-lead">
          El día 18 hay un caso abierto. Pistas, pasos y una última pregunta. Cuando lo resuelvas, se abre todo.
        </p>
        <a className="btn-solid" href="/caso-002">
          Ver el expediente
        </a>
      </section>

      <section className="ours-field" aria-labelledby="ours-h">
        <h2 id="ours-h" className="field-head">
          Lo nuestro
        </h2>
        <ul className="ours-list">
          {OURS.map((o, i) => (
            <motion.li
              key={o.id}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.05, ease }}
            >
              <button type="button" onClick={() => go(o.id)}>
                <span className="ours-title">{o.title}</span>
                <span className="ours-line">{o.line}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="close-field" aria-labelledby="close-h">
        <h2 id="close-h" className="close-head">
          Lo que nos
          <br />
          queda por ver
        </h2>
        <p className="close-places">{nextStops.join(" · ")}</p>
        <p className="close-sign">Te quiero, Rocío. Miguel.</p>
      </section>
    </div>
  );
}
