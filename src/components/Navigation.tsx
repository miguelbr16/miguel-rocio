"use client";

import Link from "next/link";
import { NAV_ITEMS, type SectionId } from "@/lib/constants";
import { useSiteConfig } from "@/context/SiteConfigContext";

interface NavigationProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

export function Navigation({ active, onNavigate }: NavigationProps) {
  const { initials } = useSiteConfig();

  return (
    <nav className="nav-desktop" aria-label="Navegación escritorio" role="tablist">
      <span className="nav-desktop-brand">{initials}</span>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          id={`tab-${item.id}`}
          role="tab"
          aria-selected={active === item.id}
          aria-controls={`panel-${item.id}`}
          onClick={() => onNavigate(item.id)}
          className={`nav-tab ${active === item.id ? "nav-tab-active" : ""}`}
        >
          {item.label}
        </button>
      ))}
      <Link href="/caso-002" className="nav-caso-btn">
        Caso 002
      </Link>
    </nav>
  );
}
