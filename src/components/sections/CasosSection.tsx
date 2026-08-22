import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CASO002_UI_ACTIVE, CASO002_OPENS } from "@/lib/constants";

export function CasosSection() {
  const opensLabel = CASO002_OPENS.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section id="casos" className="section-wrap">
      <SectionHeader
        label="Expediente M&R"
        title="Casos & Investigación"
        description="El Caso 001 contó vuestra historia y cerró el 15 mayo con flores y carta."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/expediente/" className="caso-card caso-open min-h-[140px]">
          <div className="text-[11px] uppercase tracking-widest text-text-light">Caso · 001</div>
          <div className="my-3 text-4xl">✅</div>
          <div className="font-serif text-xl">Los 6 meses</div>
          <div className="mt-2 text-xs text-text-mid">4–15 mayo · cerró con flores y carta</div>
          <div className="mt-2 text-xs font-medium text-sky-deep">Completado — ver expediente</div>
        </Link>

        {CASO002_UI_ACTIVE ? (
          <Link href="/caso-002" className="caso-card caso-open min-h-[140px] ring-2 ring-rose-deep/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-text-light">Caso · 002</span>
              <span className="rounded-full bg-rose-deep px-2 py-0.5 text-[10px] font-medium text-white">
                ACTIVO
              </span>
            </div>
            <div className="my-3 text-4xl">🥂</div>
            <div className="font-serif text-xl">Después del Caso 001</div>
            <div className="mt-2 text-xs font-medium text-rose-deep">Continuar investigación →</div>
          </Link>
        ) : (
          <div className="caso-card caso-locked min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-text-light">Caso · 002</span>
              <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-text-light">
                PRÓXIMAMENTE
              </span>
            </div>
            <div className="my-3 text-4xl opacity-60">🔒</div>
            <div className="font-serif text-xl">El primer año</div>
            <div className="mt-2 text-xs text-text-mid">Se abre el {opensLabel}</div>
            <Link href="/caso-002" className="mt-3 inline-block text-xs text-rose-deep underline">
              Probar modo test (solo M) →
            </Link>
          </div>
        )}
      </div>

      <p className="mt-6 rounded-xl border border-border bg-rose-pale/50 p-4 text-center text-sm leading-relaxed text-text-mid">
        <strong className="text-rose-deep">Agente Ro:</strong> el Caso 002 arranca el{" "}
        <strong>{opensLabel}</strong> con pistas hasta el aniversario.
      </p>

      <p className="mt-4 text-center">
        <Link href="/configurador" className="text-[11px] text-text-light underline hover:text-rose-deep">
          🔧 Actualizar expediente (privado)
        </Link>
      </p>
    </section>
  );
}
