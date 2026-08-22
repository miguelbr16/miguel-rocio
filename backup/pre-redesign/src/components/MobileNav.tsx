"use client";

import { MOBILE_TAB_ITEMS, MORE_SECTIONS, type SectionId } from "@/lib/constants";

interface MobileNavProps {
  active: SectionId | "more";
  onNavigate: (id: SectionId) => void;
  moreOpen: boolean;
  onMoreToggle: () => void;
  onMoreSelect: (id: SectionId) => void;
}

export function MobileNav({
  active,
  onNavigate,
  moreOpen,
  onMoreToggle,
  onMoreSelect,
}: MobileNavProps) {
  const moreActive = MORE_SECTIONS.some((s) => s.id === active);

  return (
    <>
      {moreOpen ? (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onMoreToggle}
          role="presentation"
        />
      ) : null}

      {moreOpen ? (
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-4 right-4 z-[70] rounded-2xl border border-border bg-white p-3 shadow-xl md:hidden">
          <p className="mb-2 px-2 text-[11px] uppercase tracking-wider text-text-light">Explorar</p>
          <div className="grid grid-cols-2 gap-2">
            {MORE_SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onMoreSelect(item.id)}
                className={`flex min-h-[48px] items-center gap-2 rounded-xl px-3 py-3 text-left text-sm ${
                  active === item.id ? "bg-rose-pale text-rose-deep" : "bg-cream text-text"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <nav
        className="fixed bottom-0 left-0 right-0 z-[65] border-t border-border bg-cream/95 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Navegación principal"
      >
        <div className="flex h-16 items-stretch justify-around px-1">
          {MOBILE_TAB_ITEMS.map((item) => {
            const isMore = item.id === "more";
            const isActive = isMore ? moreActive || moreOpen : active === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => (isMore ? onMoreToggle() : onNavigate(item.id))}
                className={`flex min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[10px] transition-colors ${
                  isActive ? "text-rose-deep" : "text-text-mid"
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
