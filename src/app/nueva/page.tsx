"use client";

import { useEffect } from "react";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { AppShell } from "@/components/AppShell";

/** Vista previa del diseño nuevo (beige + 3D, recorrido por capítulos) con toda la web. */
export default function NuevaPage() {
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
