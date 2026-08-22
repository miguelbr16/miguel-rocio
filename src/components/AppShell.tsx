"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Header } from "@/components/Header";
import { LockScreen } from "@/components/LockScreen";
import { HeroSection } from "@/components/sections/HeroSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { BingoSection } from "@/components/sections/BingoSection";
import { CartasSection } from "@/components/sections/CartasSection";
import { CasosSection } from "@/components/sections/CasosSection";
import { FechasSection } from "@/components/sections/FechasSection";
import { JuegosSection } from "@/components/sections/JuegosSection";
import { CoupleSyncProvider } from "@/context/CoupleSyncContext";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(STORAGE_KEYS.unlocked) === "1");
    setReady(true);
    const hash = window.location.hash.replace("#", "");
    if (isSectionId(hash)) setActive(hash);
  }, []);

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

  const ActiveSection = SECTIONS[active];

  return (
    <>
      <AnimatePresence>
        {!unlocked ? <LockScreen onUnlock={() => setUnlocked(true)} /> : null}
      </AnimatePresence>
      {unlocked ? (
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
          </div>
        </CoupleSyncProvider>
      ) : null}
    </>
  );
}
