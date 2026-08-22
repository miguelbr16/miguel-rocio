"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { LockScreen } from "@/components/LockScreen";
import { HeroSection } from "@/components/sections/HeroSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { BingoSection } from "@/components/sections/BingoSection";
import { CartasSection } from "@/components/sections/CartasSection";
import { CasosSection } from "@/components/sections/CasosSection";
import { FechasSection } from "@/components/sections/FechasSection";
import { JuegosSection } from "@/components/sections/JuegosSection";
import { STORAGE_KEYS, type SectionId } from "@/lib/constants";

const SECTIONS: Record<SectionId, ComponentType> = {
  inicio: HeroSection,
  historia: TimelineSection,
  destinos: DestinationsSection,
  bingo: BingoSection,
  cartas: CartasSection,
  casos: CasosSection,
  fechas: FechasSection,
  juegos: JuegosSection,
};

function isSectionId(value: string): value is SectionId {
  return value in SECTIONS;
}

export function AppShell() {
  const [unlocked, setUnlocked] = useState(false);
  const [active, setActive] = useState<SectionId>("inicio");
  const [moreOpen, setMoreOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(STORAGE_KEYS.unlocked) === "1");
    setReady(true);
    const hash = window.location.hash.replace("#", "");
    if (isSectionId(hash)) setActive(hash);
  }, []);

  const switchTab = useCallback((id: SectionId) => {
    setMoreOpen(false);
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo(0, 0);
  }, []);

  if (!ready) return null;

  const ActiveSection = SECTIONS[active];

  return (
    <>
      <AnimatePresence>
        {!unlocked ? <LockScreen onUnlock={() => setUnlocked(true)} /> : null}
      </AnimatePresence>
      {unlocked ? (
        <div className="app-root">
          <AmbientBackground />
          <Navigation active={active} onNavigate={switchTab} />
          <MobileNav
            active={active}
            onNavigate={switchTab}
            moreOpen={moreOpen}
            onMoreToggle={() => setMoreOpen((o) => !o)}
            onMoreSelect={switchTab}
          />
          <main className="main-shell">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="tab-panel"
                role="tabpanel"
                id={`panel-${active}`}
                aria-labelledby={`tab-${active}`}
              >
                <ActiveSection />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      ) : null}
    </>
  );
}
