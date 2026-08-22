/** Cápsula del 18 de noviembre — se abre el día del aniversario */
export const CAPSULE_OPENS_AT = new Date(2026, 10, 18, 0, 0, 0, 0);

export const capsuleContent = {
  title: "Cápsula del primer año",
  subtitle: "18 de noviembre de 2026",
  teaser:
    "Dentro hay un vídeo de todo lo que hemos vivido… y algo más. Se abre el día de nuestro aniversario.",
  lockedHint: "Quedan {days} días para abrirla",
  unlockedTitle: "Nuestro año en imágenes",
  unlockedBody:
    "Este es el vídeo de recopilación del primer año. Mira con calma. Al final, la carta del aniversario te espera en Cartas.",
  videoSrc: "/videos/capsula-primer-anyo.mp4",
  videoPoster: "/photos/portada.jpeg",
  cartaLinkLabel: "Abrir la carta del aniversario →",
} as const;

export function daysUntilCapsule(now = new Date()): number {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const target = new Date(CAPSULE_OPENS_AT);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - start.getTime()) / 86_400_000);
}

export function isCapsuleOpen(now = new Date(), force = false): boolean {
  if (force) return true;
  return now >= CAPSULE_OPENS_AT;
}
