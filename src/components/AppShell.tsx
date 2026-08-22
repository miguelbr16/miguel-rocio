"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { LockScreen } from "@/components/LockScreen";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { BingoSection } from "@/components/sections/BingoSection";
import { CartasSection } from "@/components/sections/CartasSection";
import { CasosSection } from "@/components/sections/CasosSection";
import { FechasSection } from "@/components/sections/FechasSection";
import { JuegosSection } from "@/components/sections/JuegosSection";
import type { SectionId } from "@/lib/constants";

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

  const scrollToSection = useCallback((id: SectionId) => {
    setMoreOpen(false);
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (id === "inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  if (!ready) return null;

  return (
    <>
      <AnimatePresence>
        {!unlocked ? <LockScreen onUnlock={() => setUnlocked(true)} /> : null}
      </AnimatePresence>
      {unlocked ? (
        <>
          <Navigation active={active} onNavigate={scrollToSection} />
          <MobileNav
            active={active}
            onNavigate={scrollToSection}
            moreOpen={moreOpen}
            onMoreToggle={() => setMoreOpen((o) => !o)}
            onMoreSelect={scrollToSection}
          />
          <main className="main-shell pt-0 md:pt-14">
            <HeroSection />
            <StatsSection />
            <TimelineSection />
            <DestinationsSection />
            <BingoSection />
            <CartasSection />
            <CasosSection />
            <FechasSection />
            <JuegosSection />
            <footer className="border-t border-border px-6 py-12 pb-28 text-center md:pb-12">
              <p className="font-serif text-2xl font-light text-rose-deep">Miguel & Rocío</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-light">
                Desde el 18 · 11 · 2025
              </p>
            </footer>
          </main>
        </>
      ) : null}
    </>
  );
}
