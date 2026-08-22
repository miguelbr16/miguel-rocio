import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function CasosSection() {
  return (
    <section id="casos" className="section-wrap">
      <SectionHeader
        label="Expediente M&R"
        title="Casos & Investigación"
        description="Dos detectives, dos casos. El primero llevó a flores y una carta. El segundo… a la gran noche."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/expediente" className="caso-card caso-open min-h-[140px]">
          <div className="text-[11px] uppercase tracking-widest text-text-light">Caso · 001</div>
          <div className="my-3 text-4xl">✅</div>
          <div className="font-serif text-xl">Los 6 meses</div>
          <div className="mt-2 text-xs text-text-mid">Multa · París · Llaves · Flores</div>
          <div className="mt-2 text-xs font-medium text-emerald-600">Completado — ver expediente</div>
        </Link>

        <Link
          href="/caso-002"
          className="caso-card caso-open min-h-[140px] ring-2 ring-rose-deep/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-text-light">Caso · 002</span>
            <span className="rounded-full bg-rose-deep px-2 py-0.5 text-[10px] font-medium text-white">
              ACTIVO
            </span>
          </div>
          <div className="my-3 text-4xl">🥂</div>
          <div className="font-serif text-xl">El primer año</div>
          <div className="mt-2 text-xs text-text-mid">
            Pistas diarias → cena · flores · sorpresa
          </div>
          <div className="mt-2 text-xs font-medium text-rose-deep">Continuar investigación →</div>
        </Link>
      </div>

      <p className="mt-6 rounded-xl border border-rose-deep/20 bg-rose-pale/50 p-4 text-center text-sm leading-relaxed text-text-mid">
        <strong className="text-rose-deep">Agente Ro:</strong> el Caso 002 se desbloquea día a día
        del 8 al 18 de noviembre. El 18 descubrirás todo lo que M ha preparado.
      </p>
    </section>
  );
}
