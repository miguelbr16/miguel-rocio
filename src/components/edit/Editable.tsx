"use client";

import { createElement, type ElementType } from "react";
import { saveText, useEditMode, useText } from "@/lib/shared-store";

/**
 * Texto que Miguel puede cambiar tocándolo en la propia web (modo edición).
 * Para Rocío es un texto normal.
 */
export function Editable({
  k,
  children,
  as = "span",
  className,
}: {
  /** Clave única del texto, p. ej. "home.tagline" */
  k: string;
  /** Texto de serie */
  children: string;
  as?: ElementType;
  className?: string;
}) {
  const value = useText(k, children);
  const editing = useEditMode();

  if (!editing) return createElement(as, { className }, value);

  return createElement(
    as,
    {
    className: `${className ?? ""} editable`.trim(),
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: true,
    "data-edit-key": k,
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      const next = (e.currentTarget.innerText ?? "").replace(/\n{3,}/g, "\n\n").trim();
      if (next !== value) saveText(k, next || children);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape") {
        e.currentTarget.innerText = value;
        e.currentTarget.blur();
      }
    },
    },
    value,
  );
}
