"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cartas, type Carta } from "@/data/cartas";
import { useSiteConfig } from "@/context/SiteConfigContext";

function isCartaUnlocked(carta: Carta): boolean {
  if (carta.type !== "locked" || !carta.lockDateIso) return true;
  return new Date() >= new Date(`${carta.lockDateIso}T00:00:00`);
}

function renderCartaBody(carta: Carta, title?: string) {
  return (
    <>
      <h3 className="font-serif text-2xl">{title ?? carta.titulo}</h3>
      <p className="mb-4 text-xs font-medium tracking-wide text-rose-deep">{carta.fecha}</p>
      {carta.content?.split("\n\n").map((p, i) => (
        <p key={i} className="mb-3 text-sm leading-relaxed text-text-mid">
          {p}
        </p>
      ))}
      {carta.firma ? <p className="mt-4 font-serif italic text-rose-deep">{carta.firma}</p> : null}
    </>
  );
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
    content = renderCartaBody(carta);
  } else if (carta.type === "locked" && !unlocked) {
    content = (
      <div className="py-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream text-3xl">
          🔒
        </div>
        <h3 className="mt-5 font-serif text-2xl">{carta.titulo}</h3>
        <p className="mt-3 text-sm leading-relaxed text-text-mid">
          Guardada para <strong>{carta.lockDate}</strong>.
          <br />
          Cuando llegue ese momento, aquí estará esperándote.
        </p>
      </div>
    );
  } else if (carta.type === "locked" && unlocked) {
    content = renderCartaBody(carta);
  } else if (carta.type === "password" && !pwdOk) {
    content = (
      <div className="py-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream text-3xl">
          🔒
        </div>
        <h3 className="mt-5 font-serif text-2xl">Carta protegida</h3>
        <p className="mt-2 text-sm text-text-mid">Solo podrás leerla cuando llegue el momento.</p>
        <input
          type="password"
          value={pwd}
          maxLength={10}
          placeholder="Contraseña"
          onChange={(e) => setPwd(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && tryPwd()}
          className="form-input mx-auto mt-5 max-w-xs text-center"
        />
        <Button className="mt-4" onClick={tryPwd}>
          Abrir carta
        </Button>
        {error ? <p className="mt-2 text-sm text-rose-deep">Contraseña incorrecta</p> : null}
      </div>
    );
  } else {
    content = renderCartaBody(
      carta,
      carta.titulo === "????????????????" ? "Antes de la boda" : undefined,
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

export function CartasSection() {
  const [active, setActive] = useState<Carta | null>(null);
  const { config } = useSiteConfig();
  const { cartaIntro } = config;

  return (
    <section id="cartas" className="section-wrap">
      <SectionHeader
        label="El tiempo"
        title="Cartas para el futuro"
        description="Algunas cosas se dicen mejor cuando llegue el momento."
      />

      <Card variant="elevated" padding="lg" className="carta-featured mb-8">
        <p className="section-label">Para ti</p>
        <h3 className="font-serif text-3xl font-normal">Una carta</h3>
        <div className="mt-5 space-y-3 text-sm leading-relaxed text-text-mid">
          <p className="font-medium text-text">{cartaIntro.saludo}</p>
          {cartaIntro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="font-serif italic text-rose-deep">{cartaIntro.firma}</p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {cartas.map((carta) => (
          <button
            key={carta.titulo}
            type="button"
            onClick={() => setActive(carta)}
            className={`carta-card ${carta.blur ? "carta-blur" : ""}`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream text-3xl">
              {carta.icon}
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-text-light">
              {carta.fecha}
            </p>
            <h4 className="mt-1 font-serif text-xl">{carta.titulo}</h4>
            <p className="mt-2 text-xs leading-relaxed text-text-mid">{carta.hint}</p>
            <span className="carta-badge">{carta.type === "open" ? "💌" : "🔒"}</span>
          </button>
        ))}
      </div>

      {active ? (
        <CartaModalBody key={active.titulo} carta={active} onClose={() => setActive(null)} />
      ) : null}
    </section>
  );
}
