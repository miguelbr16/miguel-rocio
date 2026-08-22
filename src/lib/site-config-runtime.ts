import { loadSiteConfig } from "@/lib/site-config-storage";
import { resolveSorpresaConfig } from "@/lib/site-config";
import type { SorpresaConfigResolved } from "@/types/site-config";
import { sorpresaConfig } from "@/data/sorpresa-config";

/** Sorpresa activa: config guardada o defaults del código */
export function getRuntimeSorpresa(): SorpresaConfigResolved {
  if (typeof window === "undefined") {
    return {
      devUnlockAll: sorpresaConfig.devUnlockAll,
      revealAt: sorpresaConfig.revealAt,
      cena: { ...sorpresaConfig.cena },
      flores: { ...sorpresaConfig.flores },
      extra: { ...sorpresaConfig.extra },
      cartaFisica: { ...sorpresaConfig.cartaFisica },
    };
  }
  return resolveSorpresaConfig(loadSiteConfig().sorpresa);
}
