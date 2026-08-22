import { timelineEvents } from "@/data/timeline";
import { STORAGE_KEYS } from "@/lib/constants";
import { createDefaultSiteConfig, mergeSiteConfig } from "@/lib/site-config";
import type { SiteConfig } from "@/types/site-config";

export function loadSiteConfig(): SiteConfig {
  if (typeof window === "undefined") return createDefaultSiteConfig();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.siteConfig);
    if (!raw) return createDefaultSiteConfig();
    return mergeSiteConfig(JSON.parse(raw) as Partial<SiteConfig>);
  } catch {
    return createDefaultSiteConfig();
  }
}

export function saveSiteConfig(config: SiteConfig): void {
  const payload: SiteConfig = {
    ...config,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.siteConfig, JSON.stringify(payload));
}

export function applySiteConfig(config: SiteConfig): void {
  if (config.timelineExtra.length > 0) {
    let current = timelineEvents;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.timeline);
      if (raw) current = JSON.parse(raw) as typeof timelineEvents;
    } catch {
      /* use defaults */
    }
    const titles = new Set(current.map((e) => e.title));
    const toAdd = config.timelineExtra.filter((e) => e.title.trim() && !titles.has(e.title));
    if (toAdd.length > 0) {
      localStorage.setItem(STORAGE_KEYS.timeline, JSON.stringify([...current, ...toAdd]));
    }
  }

  const toSave: SiteConfig = {
    ...config,
    timelineExtra: [],
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.siteConfig, JSON.stringify(toSave));
  localStorage.setItem(STORAGE_KEYS.fechas, JSON.stringify(config.fechas));
}

export function exportSiteConfigJson(config: SiteConfig): string {
  return JSON.stringify(config, null, 2);
}

export function importSiteConfigJson(raw: string): SiteConfig {
  const parsed = JSON.parse(raw) as Partial<SiteConfig>;
  return mergeSiteConfig(parsed);
}

export function clearSiteConfig(): void {
  localStorage.removeItem(STORAGE_KEYS.siteConfig);
}
