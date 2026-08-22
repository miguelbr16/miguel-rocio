import type { FechaEspecial } from "@/data/fechas";
import type { TimelineEvent } from "@/data/timeline";

export const SITE_CONFIG_VERSION = 1 as const;

export interface SorpresaConfigData {
  devUnlockAll: boolean;
  revealAt: string;
  cena: {
    titulo: string;
    restaurante: string;
    hora: string;
    direccion: string;
    nota: string;
  };
  flores: {
    titulo: string;
    mensaje: string;
    detalle: string;
  };
  extra: {
    titulo: string;
    emoji: string;
    mensaje: string;
    hint: string;
  };
  cartaFisica: {
    titulo: string;
    mensaje: string;
  };
}

export interface SiteConfig {
  version: typeof SITE_CONFIG_VERSION;
  updatedAt: string;
  couple: {
    name1: string;
    name2: string;
  };
  relationshipStart: string;
  lockCode: string;
  hero: {
    tagline: string;
  };
  cartaIntro: {
    saludo: string;
    paragraphs: string[];
    firma: string;
  };
  sorpresa: SorpresaConfigData;
  fechas: FechaEspecial[];
  /** Hitos nuevos que se añaden al guardar */
  timelineExtra: TimelineEvent[];
}

export interface SorpresaConfigResolved {
  devUnlockAll: boolean;
  revealAt: Date;
  cena: SorpresaConfigData["cena"];
  flores: SorpresaConfigData["flores"];
  extra: SorpresaConfigData["extra"];
  cartaFisica: SorpresaConfigData["cartaFisica"];
}
