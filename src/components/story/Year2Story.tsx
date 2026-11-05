"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { StoryPage } from "@/components/story/StoryPage";
import { annualPhotoSpots, defaultPromises, type PromiseItem } from "@/data/promises";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Año dos: promesas que se tachan y la foto que repetiremos cada año. */
export function Year2Story() {
  const reduced = useReducedMotion();
  const { value: promises, save } = useLocalStorage<PromiseItem[]>(STORAGE_KEYS.promises, defaultPromises);
  const [text, setText] = useState("");
  const spot = annualPhotoSpots[0];
  const done = promises.filter((p) => p.done).length;

  return (
    <StoryPage id="promesas" kicker="Año dos" title={<>Lo que nos <em>prometemos</em></>} lead={`${done} de ${promises.length} cumplidas. Tócalas para tacharlas cuando las hagamos.`}>
      <div className="y2-layout">
        <div>
          <ol className="y2-list">
            {promises.map((p, i) => (
              <motion.li
                key={p.id}
                initial={reduced ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button type="button" className={`y2-item ${p.done ? "is-done" : ""}`} onClick={() => save(promises.map((x) => (x.id === p.id ? { ...x, done: !x.done } : x)))}>
                  <span className="y2-n">{i + 1}</span>
                  <span className="y2-text">{p.text}</span>
                  <span className="y2-who">{p.author}</span>
                </button>
              </motion.li>
            ))}
          </ol>
          <form
            className="y2-add"
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              save([...promises, { id: `p-${Date.now()}`, text: text.trim(), author: "Ambos" }]);
              setText("");
            }}
          >
            <input className="field-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Añadir una promesa…" />
            <button type="submit" className="btn btn-primary">
              Prometer
            </button>
          </form>
        </div>
        {spot ? (
          <aside className="y2-spot">
            <p className="y2-spot-k">Tradición</p>
            <h2>{spot.name}</h2>
            <p className="y2-spot-p">{spot.blurb}</p>
            <div className="y2-years">
              {spot.years.map((y) => (
                <figure key={y.year} className={y.photo ? "" : "is-empty"}>
                  <div className="y2-ph">
                    {y.photo ? <Image src={y.photo} alt={`${spot.name} ${y.year}`} fill sizes="200px" className="object-cover object-[center_75%]" /> : <span>{y.year}</span>}
                  </div>
                  <figcaption>{y.note ?? y.year}</figcaption>
                </figure>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </StoryPage>
  );
}
