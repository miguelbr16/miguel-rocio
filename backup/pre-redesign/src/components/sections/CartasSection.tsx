"use client";

import { useState, type ReactNode } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cartas, type Carta } from "@/data/cartas";

function isCartaUnlocked(carta: Carta): boolean {
  if (carta.type !== "locked" || !carta.lockDateIso) return true;
  return new Date() >= new Date(`${carta.lockDateIso}T00:00:00`);
}

function CartaModalBody({
  carta,
  onClose,
}: {
  carta: Carta;
  onClose: () => void;
}) {
  const [pwd, setPwd] = useState("");
  const [pwdOk, setPwdOk] = useState(false);
  const [error, setError] = useState(false);

  const unlocked = carta.type === "locked" ? isCartaUnlocked(carta) : true;

  function tryPwd() {
    if (pwd === carta.pwd) setPwdOk(true);
    else {
      setError(true);
      setPwd("");
      setTimeout(() => setError(false), 2000);
    }
  }

  let content: ReactNode;

  if (carta.type === "open") {
    content = (
      <>
        <h3 className="font-serif text-2xl">{carta.titulo}</h3>
        <p className="mb-4 text-xs tracking-wide text-rose-deep">{carta.fecha}</p>
        {carta.content?.split("\n\n").map((p, i) => (
          <p key={i} className="mb-3 text-sm leading-relaxed text-text-mid">
            {p}
          </p>
        ))}
        {carta.firma ? <p className="mt-4 font-serif italic text-rose-deep">{carta.firma}</p> : null}
      </>
    );
  } else if (carta.type === "locked" && !unlocked) {
    content = (
      <div className="py-6 text-center">
        <div className="text-4xl">🔒</div>
        <h3 className="mt-4 font-serif text-2xl">{carta.titulo}</h3>
        <p className="mt-3 text-sm text-text-mid">
          Guardada para <strong>{carta.lockDate}</strong>.
          <br />
          Cuando llegue ese momento, aquí estará esperándote.
        </p>
      </div>
    );
  } else if (carta.type === "locked" && unlocked) {
    content = (
      <>
        <h3 className="font-serif text-2xl">{carta.titulo}</h3>
        <p className="mb-4 text-xs tracking-wide text-rose-deep">{carta.fecha}</p>
        {carta.content?.split("\n\n").map((p, i) => (
          <p key={i} className="mb-3 text-sm leading-relaxed text-text-mid">
            {p}
          </p>
        ))}
        {carta.firma ? <p className="mt-4 font-serif italic text-rose-deep">{carta.firma}</p> : null}
      </>
    );
  } else if (carta.type === "password" && !pwdOk) {
    content = (
      <div className="py-4 text-center">
        <div className="text-4xl">🔒</div>
        <h3 className="mt-4 font-serif text-2xl">Carta protegida</h3>
        <p className="mt-2 text-sm text-text-mid">Solo podrás leerla cuando llegue el momento.</p>
        <input
          type="password"
          value={pwd}
          maxLength={10}
          placeholder="Contraseña"
          onChange={(e) => setPwd(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && tryPwd()}
          className="mt-4 w-full max-w-xs rounded-lg border border-border px-4 py-2 text-center outline-none focus:border-rose-deep"
        />
        <button type="button" onClick={tryPwd} className="mt-3 rounded-lg bg-rose-deep px-6 py-2 text-sm text-white">
          Abrir carta 💌
        </button>
        {error ? <p className="mt-2 text-sm text-red-500">Contraseña incorrecta</p> : null}
      </div>
    );
  } else {
    content = (
      <>
        <h3 className="font-serif text-2xl">
          {carta.titulo === "????????????????" ? "Antes de la boda" : carta.titulo}
        </h3>
        <p className="mb-4 text-xs tracking-wide text-rose-deep">{carta.fecha}</p>
        {carta.content?.split("\n\n").map((p, i) => (
          <p key={i} className="mb-3 text-sm leading-relaxed text-text-mid">
            {p}
          </p>
        ))}
        {carta.firma ? <p className="mt-4 font-serif italic text-rose-deep">{carta.firma}</p> : null}
      </>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        {content}
      </div>
    </div>
  );
}

function CartaModal({
  carta,
  onClose,
}: {
  carta: Carta | null;
  onClose: () => void;
}) {
  if (!carta) return null;
  return <CartaModalBody key={carta.titulo} carta={carta} onClose={onClose} />;
}

export function CartasSection() {
  const [active, setActive] = useState<Carta | null>(null);

  return (
    <section id="cartas" className="section-wrap">
      <SectionHeader
        label="El tiempo"
        title="Cartas para el futuro"
        description="Algunas cosas se dicen mejor cuando llegue el momento."
      />

      <article className="mb-8 rounded-2xl border border-border bg-white p-6">
        <p className="section-label">Para ti</p>
        <h3 className="font-serif text-3xl font-normal">Una carta</h3>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-mid">
          <p>Rocío,</p>
          <p>
            El 18 de noviembre de 2025 empezó todo. Antes de eso, sobreviviste a un rechazo
            ignorado, un cruasán con servilleta, un segundo rechazo y una tableta de chocolate.
          </p>
          <p>
            Cada día contigo suma. Por las risas, los viajes, las llaves perdidas y las cobras
            que al final hicieron la historia mejor.
          </p>
          <p className="font-serif italic text-rose-deep">Con todo, Miguel ♥</p>
        </div>
      </article>

      <div className="grid gap-4 sm:grid-cols-2">
        {cartas.map((carta) => (
          <button
            key={carta.titulo}
            type="button"
            onClick={() => setActive(carta)}
            className={`carta-card text-left ${carta.blur ? "carta-blur" : ""}`}
          >
            <div className="text-3xl">{carta.icon}</div>
            <p className="mt-3 text-[11px] uppercase tracking-wide text-text-light">{carta.fecha}</p>
            <h4 className="mt-1 font-serif text-xl">{carta.titulo}</h4>
            <p className="mt-2 text-xs text-text-mid">{carta.hint}</p>
            <span className="carta-badge">
              {carta.type === "open" ? "💌" : "🔒"}
            </span>
          </button>
        ))}
      </div>

      <CartaModal carta={active} onClose={() => setActive(null)} />
    </section>
  );
}
