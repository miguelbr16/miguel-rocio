import type { ReactNode } from "react";

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  description?: string;
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <header className="mb-8">
      <p className="section-label">{label}</p>
      <h2 className="section-title">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-text-mid">{description}</p>
      ) : null}
    </header>
  );
}
