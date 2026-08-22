import { RELATIONSHIP_START } from "./constants";

export function daysTogether(from: Date = new Date(), relationshipStart: Date = RELATIONSHIP_START): number {
  const start = new Date(relationshipStart);
  start.setHours(0, 0, 0, 0);
  const today = new Date(from);
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - start.getTime()) / 86_400_000);
}

export function nextAnniversary(from: Date = new Date(), start: Date = RELATIONSHIP_START): Date {
  const target = new Date(from.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
  if (target <= from) {
    target.setFullYear(from.getFullYear() + 1);
  }
  return target;
}

export function countdownParts(to: Date, from: Date = new Date()) {
  const diff = Math.max(0, to.getTime() - from.getTime());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

export function daysUntilDate(dateStr: string, from: Date = new Date()): number {
  const today = new Date(from);
  today.setHours(0, 0, 0, 0);
  const d = new Date(`${dateStr}T00:00:00`);
  const next = new Date(d);
  next.setFullYear(today.getFullYear());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / 86_400_000);
}

export function formatSpanishDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });
}

export function formatRelationshipStartDisplay(date: Date = RELATIONSHIP_START): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day} · ${month} · ${date.getFullYear()}`;
}
