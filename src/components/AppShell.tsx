"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import type { SectionId } from "@/lib/constants";

function TabPanel({ id, active, children }: { id: SectionId; active: SectionId; children: ReactNode }) {
  if (id !== active) return null;
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="tab-panel"
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
    >
      {children}
    </motion.div>
  );
}

export function AppShell() {
  const [unlocked, setUnlocked] = useState(false);
  const [active, setActive] = useState<SectionId>("inicio");
  const [moreOpen, setMoreOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem("unlocked") === "1");
    setReady(true);
    const hash = window.location.hash.replace("#", "") as SectionId;
    if (hash) setActive(hash);
  }, []);

  const switchTab = useCallback((id: SectionId) => {
    setMoreOpen(false);
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo(0, 0);
  }, []);

  if (!ready) return null;

  return (
    <>
      <AnimatePresence>
        {!unlocked ? <LockScreen onUnlock={() => setUnlocked(true)} /> : null}
      </AnimatePresence>
      {unlocked ? (
        <>
          <Navigation active={active} onNavigate={switchTab} />
          <MobileNav
            active={active}
            onNavigate={switchTab}
            moreOpen={moreOpen}
            onMoreToggle={() => setMoreOpen((o) => !o)}
            onMoreSelect={switchTab}
          />
          <main className="main-shell md:pt-14">
            <TabPanel id="inicio" active={active}>
              <HeroSection />
            </TabPanel>
            <TabPanel id="historia" active={active}>
              <TimelineSection />
            </TabPanel>
            <TabPanel id="destinos" active={active}>
              <DestinationsSection />
            </TabPanel>
            <TabPanel id="bingo" active={active}>
              <BingoSection />
            </TabPanel>
            <TabPanel id="cartas" active={active}>
              <CartasSection />
            </TabPanel>
            <TabPanel id="casos" active={active}>
              <CasosSection />
            </TabPanel>
            <TabPanel id="fechas" active={active}>
              <FechasSection />
            </TabPanel>
            <TabPanel id="juegos" active={active}>
              <JuegosSection />
            </TabPanel>
          </main>
        </>
      ) : null}
    </>
  );
}
