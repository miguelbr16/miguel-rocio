import type { StampArt } from "@/data/journey";

const INKS = ["#b8322a", "#1f3a7a", "#2f6b3a", "#7a2f6b", "#c96b88", "#a0611c"];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function stampInk(key: string) {
  return INKS[hash(key) % INKS.length];
}

/** Dibujo del centro del sello, a trazo, en una caja de 60×60 centrada en 0,0. */
function Art({ art }: { art: StampArt }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (art) {
    case "tower":
      return (
        <g {...p}>
          <path d="M0 -26 L-6 -8 L-12 10 L-18 26 M0 -26 L6 -8 L12 10 L18 26" />
          <path d="M-7 -8 H7 M-13 10 H13 M-8 26 Q0 14 8 26" />
        </g>
      );
    case "clock":
      return (
        <g {...p}>
          <path d="M-9 26 V-12 L0 -26 L9 -12 V26 Z" />
          <circle cx="0" cy="-4" r="6" />
          <path d="M0 -4 V-8 M0 -4 L3 -2 M-9 10 H9" />
        </g>
      );
    case "mountain":
      return (
        <g {...p}>
          <path d="M-28 22 L-8 -16 L2 2 L10 -10 L28 22 Z" />
          <path d="M-13 -6 L-8 -16 L-3 -6 M6 -4 L10 -10 L14 -4" />
        </g>
      );
    case "snow":
      return (
        <g {...p}>
          <path d="M-28 22 L-10 -20 L0 -2 L12 -22 L28 22 Z" />
          <path d="M-16 -6 L-10 -20 L-4 -8 L-10 -4 Z M6 -10 L12 -22 L18 -10 L12 -6 Z" />
        </g>
      );
    case "beach":
      return (
        <g {...p}>
          <circle cx="12" cy="-14" r="8" />
          <path d="M-28 10 Q-18 4 -8 10 T12 10 T28 10 M-28 20 Q-18 14 -8 20 T12 20 T28 20" />
          <path d="M-14 6 L-10 -20 M-10 -20 Q-20 -22 -24 -14 M-10 -20 Q0 -24 4 -16" />
        </g>
      );
    case "island":
      return (
        <g {...p}>
          <path d="M-24 14 Q0 -2 24 14" />
          <path d="M-2 10 Q0 -6 6 -18 M6 -18 Q-6 -24 -14 -16 M6 -18 Q16 -24 22 -14 M6 -18 Q4 -28 12 -30" />
          <path d="M-28 22 Q-18 16 -8 22 T12 22 T28 22" />
        </g>
      );
    case "village":
      return (
        <g {...p}>
          <path d="M-24 24 V0 H24 V24 Z" />
          <path d="M-14 0 A14 14 0 0 1 14 0" />
          <path d="M0 -14 V-24 M-4 -20 H4" />
          <path d="M-14 24 V12 A3 3 0 0 1 -8 12 V24 M8 24 V12 A3 3 0 0 1 14 12 V24" />
        </g>
      );
    case "castle":
      return (
        <g {...p}>
          <path d="M-22 24 V-8 H-14 V-14 H-6 V-8 H6 V-14 H14 V-8 H22 V24 Z" />
          <path d="M-5 24 V12 A5 5 0 0 1 5 12 V24" />
        </g>
      );
    case "stadium":
      return (
        <g {...p}>
          <ellipse cx="0" cy="4" rx="26" ry="14" />
          <ellipse cx="0" cy="4" rx="14" ry="6" />
          <path d="M-20 -14 V-24 M20 -14 V-24 M-24 -24 H-16 M16 -24 H24" />
        </g>
      );
    case "music":
      return (
        <g {...p}>
          <path d="M-8 18 V-18 L18 -24 V10" />
          <circle cx="-14" cy="18" r="6" />
          <circle cx="12" cy="10" r="6" />
        </g>
      );
    case "lake":
      return (
        <g {...p}>
          <path d="M-26 0 L-10 -22 L2 -6 L12 -18 L26 0" />
          <path d="M-26 10 Q-14 4 -2 10 T26 10 M-20 20 Q-10 14 0 20 T20 20" />
        </g>
      );
    case "heart":
      return (
        <g {...p}>
          <path d="M0 22 S-26 6 -26 -8 C-26 -18 -18 -24 -10 -24 C-4 -24 0 -20 0 -16 C0 -20 4 -24 10 -24 C18 -24 26 -18 26 -8 C26 6 0 22 0 22 Z" />
        </g>
      );
    case "city":
    default:
      return (
        <g {...p}>
          <path d="M-26 24 V2 H-14 V-10 H-2 V24 M-2 -2 H10 V-20 H20 V24 M-28 24 H28" />
          <path d="M-20 10 H-18 M-9 0 H-7 M-9 10 H-7 M14 -10 H16 M14 0 H16 M14 10 H16" />
        </g>
      );
  }
}

/**
 * Sello de pasaporte dibujado: forma, tinta y giro salen del nombre del sitio,
 * así cada sitio tiene siempre el mismo sello.
 */
export function Stamp({
  place,
  country,
  date,
  art,
  size = 220,
  className,
}: {
  place: string;
  country: string;
  date: string;
  art: StampArt;
  size?: number;
  className?: string;
}) {
  const h = hash(place);
  const ink = INKS[h % INKS.length];
  const round = h % 3 !== 0;
  const id = `arc-${h}`;
  const top = place.toUpperCase();
  const fontTop = top.length > 14 ? 15 : top.length > 10 ? 18 : 22;

  return (
    <svg
      viewBox="-110 -110 220 220"
      width={size}
      height={size}
      className={className}
      style={{ color: ink }}
      role="img"
      aria-label={`Sello de ${place}, ${country}, ${date}`}
    >
      <defs>
        <filter id={`rough-${h}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={h % 50} />
          <feDisplacementMap in="SourceGraphic" scale="2.2" />
        </filter>
        <path id={id} d="M -72 0 A 72 72 0 0 1 72 0" />
        <path id={`${id}-b`} d="M -76 0 A 76 76 0 0 0 76 0" />
      </defs>
      <g filter={`url(#rough-${h})`} opacity="0.9">
        {round ? (
          <>
            <circle r="100" fill="none" stroke="currentColor" strokeWidth="5" />
            <circle r="90" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle r="48" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 5" />
            <text fontSize={fontTop} fontWeight="700" letterSpacing="2" fill="currentColor" textAnchor="middle">
              <textPath href={`#${id}`} startOffset="50%">
                {top}
              </textPath>
            </text>
            <text fontSize="15" fontWeight="600" letterSpacing="2" fill="currentColor" textAnchor="middle">
              <textPath href={`#${id}-b`} startOffset="50%">
                {`${country.toUpperCase()} · ${date.toUpperCase()}`}
              </textPath>
            </text>
            <Art art={art} />
          </>
        ) : (
          <>
            <rect x="-100" y="-80" width="200" height="160" rx="14" fill="none" stroke="currentColor" strokeWidth="5" />
            <rect x="-90" y="-70" width="180" height="140" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
            <text y="-42" fontSize={fontTop} fontWeight="700" letterSpacing="2" fill="currentColor" textAnchor="middle">
              {top}
            </text>
            <g transform="translate(0 6) scale(0.8)">
              <Art art={art} />
            </g>
            <text y="58" fontSize="14" fontWeight="600" letterSpacing="2" fill="currentColor" textAnchor="middle">
              {`${country.toUpperCase()} · ${date.toUpperCase()}`}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
