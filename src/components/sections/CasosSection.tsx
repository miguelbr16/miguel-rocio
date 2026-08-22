import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
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
        title="Casos & investigación"
        description="El Caso 001 contó vuestra historia y cerró el 15 mayo con flores y carta."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/expediente/" className="caso-card caso-open min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-text-light">
              Caso · 001
            </span>
            <Badge tone="success">Completado</Badge>
          </div>
          <div className="my-4 text-4xl">✅</div>
          <div className="font-serif text-xl">Los 6 meses</div>
          <div className="mt-2 text-xs text-text-mid">4–15 mayo · cerró con flores y carta</div>
          <div className="mt-4 text-xs font-semibold text-sky-deep">Ver expediente →</div>
        </Link>

        {CASO002_UI_ACTIVE ? (
          <Link
            href="/caso-002"
            className="caso-card caso-open min-h-[160px] ring-2 ring-rose-deep/25"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-text-light">
                Caso · 002
              </span>
              <span className="caso-status bg-rose-deep text-white">Activo</span>
            </div>
            <div className="my-4 text-4xl">🥂</div>
            <div className="font-serif text-xl">Después del Caso 001</div>
            <div className="mt-4 text-xs font-semibold text-rose-deep">Continuar investigación →</div>
          </Link>
        ) : (
          <div className="caso-card caso-locked min-h-[160px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-text-light">
                Caso · 002
              </span>
              <span className="caso-status bg-cream text-text-light">Próximamente</span>
            </div>
            <div className="my-4 text-4xl opacity-60">🔒</div>
            <div className="font-serif text-xl">El primer año</div>
            <div className="mt-2 text-xs text-text-mid">Se abre el {opensLabel}</div>
            <Link href="/caso-002" className="mt-4 inline-block text-xs font-semibold text-rose-deep">
              Probar modo test →
            </Link>
          </div>
        )}
      </div>

      <Card variant="soft" padding="md" className="mt-8 text-center">
        <p className="text-sm leading-relaxed text-text-mid">
          <strong className="text-rose-deep">Agente Ro:</strong> el Caso 002 arranca el{" "}
          <strong>{opensLabel}</strong> con pistas hasta el aniversario.
        </p>
      </Card>

      <p className="mt-5 text-center">
        <Link
          href="/configurador"
          className="text-[11px] font-medium text-text-light underline decoration-dotted underline-offset-4 hover:text-rose-deep"
        >
          Actualizar expediente (privado)
        </Link>
      </p>
    </section>
  );
}
