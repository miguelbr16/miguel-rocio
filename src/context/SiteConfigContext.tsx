"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applySiteConfig,
  loadSiteConfig,
  saveSiteConfig,
} from "@/lib/site-config-storage";
import {
  createDefaultSiteConfig,
  coupleInitials,
  mergeSiteConfig,
  parseRelationshipStart,
  resolveSorpresaConfig,
} from "@/lib/site-config";
import type { SiteConfig, SorpresaConfigResolved } from "@/types/site-config";

interface SiteConfigContextValue {
  config: SiteConfig;
  ready: boolean;
  initials: string;
  relationshipStart: Date;
  sorpresa: SorpresaConfigResolved;
  updateConfig: (next: SiteConfig) => void;
  applyAndSave: (next: SiteConfig) => void;
  resetConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => createDefaultSiteConfig());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConfig(loadSiteConfig());
    setReady(true);
  }, []);

  const updateConfig = useCallback((next: SiteConfig) => {
    setConfig(next);
    saveSiteConfig(next);
  }, []);

  const applyAndSave = useCallback((next: SiteConfig) => {
    applySiteConfig(next);
    setConfig(loadSiteConfig());
  }, []);

  const resetConfig = useCallback(() => {
    const defaults = mergeSiteConfig(null);
    applySiteConfig({ ...defaults, timelineExtra: [] });
    setConfig(loadSiteConfig());
  }, []);

  const value = useMemo<SiteConfigContextValue>(
    () => ({
      config,
      ready,
      initials: coupleInitials(config.couple.name1, config.couple.name2),
      relationshipStart: parseRelationshipStart(config.relationshipStart),
      sorpresa: resolveSorpresaConfig(config.sorpresa),
      updateConfig,
      applyAndSave,
      resetConfig,
    }),
    [config, ready, updateConfig, applyAndSave, resetConfig],
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig(): SiteConfigContextValue {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error("useSiteConfig must be used within SiteConfigProvider");
  }
  return ctx;
}
