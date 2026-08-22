import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function CasosSection() {
  return (
    <section id="casos" className="section-wrap">
      <SectionHeader
        label="Expediente M&R"
        title="Casos & Investigación"
        description="Dos detectives, dos casos. Cada investigación es un misterio nuevo que resolver juntos."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/expediente" className="caso-card caso-open">
          <div className="text-[11px] uppercase tracking-widest text-text-light">Caso · 001</div>
          <div className="my-3 text-4xl">🔍</div>
          <div className="font-serif text-xl">Investigación 1</div>
          <div className="mt-2 text-xs font-medium text-rose-deep">Expediente abierto</div>
        </Link>
        <div className="caso-card caso-locked">
          <div className="text-[11px] uppercase tracking-widest text-text-light">Caso · 002</div>
          <div className="my-3 text-4xl">🔒</div>
          <div className="font-serif text-xl">El primer año</div>
          <div className="mt-2 text-xs text-text-light">Se abre el 18 nov 2026</div>
        </div>
      </div>
    </section>
  );
}
