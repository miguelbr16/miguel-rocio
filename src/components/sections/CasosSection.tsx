import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function CasosSection() {
  return (
    <section id="casos" className="section-wrap">
      <SectionHeader
        label="Expediente M&R"
        title="Casos & Investigación"
        description="El Caso 001 contó vuestra historia y cerró el 15 mayo con flores y carta. El Caso 002 sigue desde ahí hasta la gran noche del año."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/expediente/" className="caso-card caso-open min-h-[140px]">
          <div className="text-[11px] uppercase tracking-widest text-text-light">Caso · 001</div>
          <div className="my-3 text-4xl">✅</div>
          <div className="font-serif text-xl">Los 6 meses</div>
          <div className="mt-2 text-xs text-text-mid">4–15 mayo · cerró con flores y carta</div>
          <div className="mt-2 text-xs font-medium text-sky">Completado — ver expediente</div>
        </Link>

        <Link
          href="/caso-002"
          className="caso-card caso-open min-h-[140px] ring-2 ring-rose-deep/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-text-light">Caso · 002</span>
            <span className="rounded-full bg-gradient-to-r from-rose-deep to-rose px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-[0_0_16px_rgba(232,84,122,0.4)]">
              ACTIVO
            </span>
          </div>
          <div className="my-3 text-4xl">🥂</div>
          <div className="font-serif text-xl">Después del Caso 001</div>
          <div className="mt-2 text-xs text-text-mid">
            Desde el cierre (15 mayo) → cena · flores · sorpresa
          </div>
          <div className="mt-2 text-xs font-medium text-rose">Continuar investigación →</div>
        </Link>
      </div>

      <p className="glass-card-gold mt-6 p-5 text-center text-sm leading-relaxed text-text-mid">
        <strong className="text-gold">Agente Ro:</strong> el Caso 001 (mayo) contó toda
        vuestra historia como investigación y cerró el <strong className="text-gold">15 de mayo</strong> con flores y
        carta. El Caso 002 empieza ahí — pistas del 8 al 18 nov.
      </p>
    </section>
  );
}
