import type { ReactNode } from "react";

type BadgeTone = "rose" | "sky" | "neutral" | "gold" | "success";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  title?: string;
}

const toneClass: Record<BadgeTone, string> = {
  rose: "badge badge-rose",
  sky: "badge badge-sky",
  neutral: "badge badge-neutral",
  gold: "badge badge-gold",
  success: "badge badge-success",
};

export function Badge({ children, tone = "neutral", className = "", title }: BadgeProps) {
  return (
    <span className={`${toneClass[tone]} ${className}`.trim()} title={title}>
      {children}
    </span>
  );
}
