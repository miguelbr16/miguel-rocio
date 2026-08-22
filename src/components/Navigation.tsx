"use client";

import { COUPLE, LOCK_CODE, NAV_ITEMS, type SectionId } from "@/lib/constants";

interface NavigationProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

export function Navigation({ active, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-0 overflow-x-auto border-b border-border bg-cream/92 px-4 backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="mr-4 shrink-0 font-serif text-lg font-semibold text-rose-deep">
        {COUPLE.initials}
      </span>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onNavigate(item.id)}
          className={`flex h-14 shrink-0 items-center border-b-2 px-3 text-xs transition-colors ${
            active === item.id
              ? "border-rose-deep text-rose-deep"
              : "border-transparent text-text-mid hover:text-rose-deep"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export { LOCK_CODE };
