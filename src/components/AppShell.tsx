"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Header } from "@/components/Header";
import { LockScreen } from "@/components/LockScreen";
import { StoryLock } from "@/components/StoryLock";
import { HeroSection } from "@/components/sections/HeroSection";
import { StoryHome } from "@/components/home/StoryHome";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { BookSection } from "@/components/sections/BookSection";
import { BingoSection } from "@/components/sections/BingoSection";
import { CartasSection } from "@/components/sections/CartasSection";
import { CasosSection } from "@/components/sections/CasosSection";
import { PromisesSection } from "@/components/sections/PromisesSection";
import { SoundtrackSection } from "@/components/sections/SoundtrackSection";
import { FechasSection } from "@/components/sections/FechasSection";
import { JuegosSection } from "@/components/sections/JuegosSection";
import { PasaporteSection } from "@/components/sections/PasaporteSection";
import { CoupleSyncProvider } from "@/context/CoupleSyncContext";
import { CaseGate } from "@/components/expediente/CaseGate";
import { caseGateActive } from "@/data/caso002";
import { MiguelBar } from "@/components/MiguelBar";
import { isMiguel, pullShared } from "@/lib/miguel";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { STORAGE_KEYS, type SectionId } from "@/lib/constants";

const SECTIONS: Record<SectionId, ComponentType> = {
  inicio: HeroSection,
  historia: TimelineSection,
  pasaporte: PasaporteSection,
  libro: BookSection,
  bingo: BingoSection,
  cartas: CartasSection,
  casos: CasosSection,
  promesas: PromisesSection,
  musica: SoundtrackSection,
  fechas: FechasSection,
  juegos: JuegosSection,
};

function isSectionId(value: string): value is SectionId {
  return value in SECTIONS;
}

export function AppShell({ variant = "classic" }: { variant?: "classic" | "story" } = {}) {
  const [unlocked, setUnlocked] = useState(false);
  const [active, setActive] = useState<SectionId>("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [gate, setGate] = useState(false);
  const [miguel, setMiguelMode] = useState(false);
  const { reload } = useSiteConfig();

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(STORAGE_KEYS.unlocked) === "1");
    setGate(caseGateActive());
    setMiguelMode(isMiguel());
    void pullShared().then((changed) => changed && reload());
    setReady(true);
    const hash = window.location.hash.replace("#", "");
    if (isSectionId(hash)) setActive(hash);

    function onHashChange() {
      const next = window.location.hash.replace("#", "");
      if (isSectionId(next)) {
        setMenuOpen(false);
        setActive(next);
        window.scrollTo(0, 0);
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [reload]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const switchTab = useCallback((id: SectionId) => {
    setMenuOpen(false);
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo(0, 0);
  }, []);

  if (!ready) return null;

  const Lock = variant === "story" ? StoryLock : LockScreen;
  const ActiveSection = variant === "story" && active === "inicio" ? StoryHome : SECTIONS[active];

  return (
    <>
      <AnimatePresence>
        {!unlocked ? <Lock
            onUnlock={() => {
              setUnlocked(true);
              setMiguelMode(isMiguel());
              setGate(caseGateActive());
            }}
          /> : null}
      </AnimatePresence>
      {unlocked && gate ? (
        <CaseGate
          onDone={() => {
            setGate(false);
            setActive("inicio");
            window.history.replaceState(null, "", "/");
            window.scrollTo(0, 0);
          }}
        />
      ) : null}
      {unlocked && !gate ? (
        <CoupleSyncProvider>
          <div className="app-root">
            <AmbientBackground />
            <Header
              active={active}
              menuOpen={menuOpen}
              onNavigate={switchTab}
              onMenuToggle={() => setMenuOpen((o) => !o)}
            />
            <main className="main-shell">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="tab-panel"
                  role="tabpanel"
                  id={`panel-${active}`}
                  aria-labelledby={`tab-${active}`}
                >
                  <ActiveSection />
                </motion.div>
              </AnimatePresence>
            </main>
            {miguel ? <MiguelBar /> : null}
          </div>
        </CoupleSyncProvider>
      ) : null}
    </>
  );
}
