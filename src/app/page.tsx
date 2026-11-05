"use client";

import { useEffect } from "react";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { AppShell } from "@/components/AppShell";

/** Web principal: diseño «Nuestra historia» (beige + 3D, recorrido por capítulos). */
export default function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add("story");
    return () => document.documentElement.classList.remove("story");
  }, []);
  return (
    <SiteConfigProvider>
      <AppShell variant="story" />
    </SiteConfigProvider>
  );
}
