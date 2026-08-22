import { fechasEspeciales } from "@/data/fechas";
import { sorpresaConfig } from "@/data/sorpresa-config";
import { LOCK_CODE, RELATIONSHIP_START } from "@/lib/constants";
import {
  SITE_CONFIG_VERSION,
  type SiteConfig,
  type SorpresaConfigData,
  type SorpresaConfigResolved,
} from "@/types/site-config";

function toDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toDateTimeLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

function defaultSorpresaData(): SorpresaConfigData {
  return {
    devUnlockAll: sorpresaConfig.devUnlockAll,
    revealAt: toDateTimeLocal(sorpresaConfig.revealAt),
    cena: { ...sorpresaConfig.cena },
    flores: { ...sorpresaConfig.flores },
    extra: { ...sorpresaConfig.extra },
    cartaFisica: { ...sorpresaConfig.cartaFisica },
  };
}

export function createDefaultSiteConfig(): SiteConfig {
  return {
    version: SITE_CONFIG_VERSION,
    updatedAt: new Date().toISOString(),
    couple: { name1: "Miguel", name2: "Rocío" },
    relationshipStart: toDateInput(RELATIONSHIP_START),
    lockCode: LOCK_CODE,
    hero: { tagline: "Nuestro primer año" },
    cartaIntro: {
      saludo: "Rocío,",
      paragraphs: [
        "El 18 de noviembre de 2025 empezó todo. Antes de eso, sobreviviste a un rechazo ignorado, un cruasán con servilleta, un segundo rechazo y una tableta de chocolate.",
        "Cada día contigo suma. Por las risas, los viajes, las llaves perdidas y las cobras que al final hicieron la historia mejor.",
      ],
      firma: "Con todo, Miguel ♥",
    },
    sorpresa: defaultSorpresaData(),
    fechas: fechasEspeciales.map((f) => ({ ...f })),
    timelineExtra: [],
  };
}

export function coupleInitials(name1: string, name2: string): string {
  const a = name1.trim().charAt(0).toUpperCase();
  const b = name2.trim().charAt(0).toUpperCase();
  return `${a} & ${b}`;
}

export function parseRelationshipStart(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function resolveSorpresaConfig(data: SorpresaConfigData): SorpresaConfigResolved {
  return {
    devUnlockAll: data.devUnlockAll,
    revealAt: new Date(data.revealAt),
    cena: data.cena,
    flores: data.flores,
    extra: data.extra,
    cartaFisica: data.cartaFisica,
  };
}

export function mergeSiteConfig(partial: Partial<SiteConfig> | null): SiteConfig {
  const base = createDefaultSiteConfig();
  if (!partial) return base;

  return {
    ...base,
    ...partial,
    couple: { ...base.couple, ...partial.couple },
    hero: { ...base.hero, ...partial.hero },
    cartaIntro: {
      ...base.cartaIntro,
      ...partial.cartaIntro,
      paragraphs: partial.cartaIntro?.paragraphs ?? base.cartaIntro.paragraphs,
    },
    sorpresa: {
      ...base.sorpresa,
      ...partial.sorpresa,
      cena: { ...base.sorpresa.cena, ...partial.sorpresa?.cena },
      flores: { ...base.sorpresa.flores, ...partial.sorpresa?.flores },
      extra: { ...base.sorpresa.extra, ...partial.sorpresa?.extra },
      cartaFisica: { ...base.sorpresa.cartaFisica, ...partial.sorpresa?.cartaFisica },
    },
    fechas: partial.fechas ?? base.fechas,
    timelineExtra: partial.timelineExtra ?? base.timelineExtra,
  };
}
