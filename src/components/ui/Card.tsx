import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "soft" | "outline";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantClass: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "card",
  elevated: "card card-elevated",
  soft: "card card-soft",
  outline: "card card-outline",
};

const paddingClass: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  variant = "default",
  padding = "md",
}: CardProps) {
  return (
    <div className={`${variantClass[variant]} ${paddingClass[padding]} ${className}`.trim()}>
      {children}
    </div>
  );
}
