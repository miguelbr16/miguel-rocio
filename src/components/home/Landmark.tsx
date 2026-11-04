import type { Landmark as LandmarkId } from "@/data/journey";

/**
 * Dibujos planos de cada sitio, para cuando aún no hay foto (y para los sellos).
 * Un solo lenguaje: formas llenas, dos tintas, viewBox 200×200.
 */
export function Landmark({
  id,
  ink,
  accent,
  paper = "#fff",
  className,
}: {
  id: LandmarkId;
  ink: string;
  accent: string;
  paper?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {DRAW[id](ink, accent, paper)}
    </svg>
  );
}

const DRAW: Record<LandmarkId, (ink: string, accent: string, paper: string) => React.ReactNode> = {
  orange: (ink, accent) => (
    <>
      <circle cx="100" cy="112" r="62" fill={accent} />
      <path d="M100 52c-4-18 6-30 22-34-2 18-10 28-22 34Z" fill={ink} />
      <path d="M100 52c10-14 30-18 46-10-12 12-28 14-46 10Z" fill={ink} opacity=".8" />
      <circle cx="78" cy="96" r="5" fill="#fff" opacity=".5" />
      <circle cx="122" cy="140" r="3" fill={ink} opacity=".25" />
      <circle cx="132" cy="124" r="3" fill={ink} opacity=".25" />
    </>
  ),
  altea: (ink, accent, paper) => (
    <>
      <rect x="40" y="110" width="120" height="70" fill={paper} />
      <rect x="40" y="110" width="120" height="70" fill={ink} opacity=".08" />
      <path d="M58 110a42 42 0 0 1 84 0Z" fill={accent} />
      <rect x="96" y="52" width="8" height="18" fill={ink} />
      <path d="M100 40l7 14h-14Z" fill={ink} />
      <rect x="62" y="130" width="14" height="22" rx="7" fill={ink} />
      <rect x="93" y="130" width="14" height="50" rx="7" fill={ink} />
      <rect x="124" y="130" width="14" height="22" rx="7" fill={ink} />
      <path d="M0 184c25-10 50 10 75 0s50 10 75 0 50 10 50 0v16H0Z" fill={accent} />
    </>
  ),
  eiffel: (ink, accent) => (
    <>
      <path d="M100 18l8 50h-16Z" fill={ink} />
      <path d="M90 68h20l12 52H78Z" fill={ink} />
      <path d="M72 120h56l26 62h-28c-6-24-14-34-26-34s-20 10-26 34H46Z" fill={ink} />
      <rect x="84" y="64" width="32" height="7" fill={accent} />
      <rect x="70" y="116" width="60" height="8" fill={accent} />
      <path d="M160 40c8-8 20-2 16 8-3 7-16 14-16 14s-13-7-16-14c-4-10 8-16 16-8Z" fill={accent} />
    </>
  ),
  mountains: (ink, accent) => (
    <>
      <path d="M0 170 62 70l36 56 26-36 76 80Z" fill={ink} />
      <path d="M62 70 50 90l12-6 10 8Z" fill="#fff" />
      <path d="M124 90l-9 12 9-4 8 6Z" fill="#fff" />
      <path d="M0 170c30-14 60 6 100 0s70-16 100 0v30H0Z" fill={accent} />
      <circle cx="158" cy="44" r="16" fill={accent} opacity=".7" />
    </>
  ),
  island: (ink, accent) => (
    <>
      <circle cx="140" cy="62" r="26" fill={accent} />
      <path d="M40 150c20-30 100-30 120 0Z" fill={ink} opacity=".85" />
      <path d="M92 150c2-30 6-52 16-70" stroke={ink} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M108 80c-20-6-38 2-46 14 16-4 30-4 46-14ZM108 80c18-10 38-6 48 6-18-2-30 0-48-6ZM108 80c-6-16-2-30 10-38 0 14-2 26-10 38Z" fill={ink} />
      <path d="M0 160c25-10 50 10 75 0s50 10 75 0 50 10 50 0v40H0Z" fill={accent} opacity=".9" />
      <path d="M0 176c25-10 50 10 75 0s50 10 75 0 50 10 50 0v24H0Z" fill={ink} opacity=".25" />
    </>
  ),
  bigben: (ink, accent) => (
    <>
      <rect x="78" y="70" width="44" height="116" fill={ink} />
      <path d="M78 70l22-48 22 48Z" fill={ink} />
      <circle cx="100" cy="92" r="15" fill="#fff" />
      <path d="M100 92V82M100 92l7 4" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      <rect x="86" y="120" width="8" height="16" fill={accent} />
      <rect x="106" y="120" width="8" height="16" fill={accent} />
      <rect x="86" y="146" width="8" height="16" fill={accent} />
      <rect x="106" y="146" width="8" height="16" fill={accent} />
      <rect x="20" y="150" width="44" height="30" rx="6" fill={accent} />
      <circle cx="30" cy="182" r="6" fill={ink} />
      <circle cx="54" cy="182" r="6" fill={ink} />
    </>
  ),
  bat: (ink, accent) => (
    <>
      <path d="M100 70c-10 0-14 8-14 8l-6-12-4 16c-20-14-50-10-66 10 18-2 30 6 34 18 10-10 22-8 30 2 6-8 12-12 26-12s20 4 26 12c8-10 20-12 30-2 4-12 16-20 34-18-16-20-46-24-66-10l-4-16-6 12s-4-8-14-8Z" fill={accent} />
      <circle cx="94" cy="88" r="2.5" fill={ink} />
      <circle cx="106" cy="88" r="2.5" fill={ink} />
      <rect x="40" y="150" width="120" height="8" fill={accent} opacity=".5" />
      <rect x="40" y="166" width="120" height="8" fill={accent} opacity=".3" />
    </>
  ),
  castle: (ink, accent) => (
    <>
      <path d="M0 150c40-60 70-80 110-80s60 30 90 80Z" fill={accent} opacity=".55" />
      <path d="M50 150v-46h12v-10h10v10h12V94h10v10h12v46Z" fill={ink} />
      <rect x="70" y="124" width="12" height="26" rx="6" fill="#fff" />
      <path d="M0 160c25-10 50 10 75 0s50 10 75 0 50 10 50 0v40H0Z" fill={accent} />
    </>
  ),
  mic: (ink, accent) => (
    <>
      <rect x="82" y="40" width="36" height="66" rx="18" fill={ink} />
      <path d="M68 92c0 20 14 34 32 34s32-14 32-34" stroke={ink} strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="96" y="126" width="8" height="34" fill={ink} />
      <rect x="74" y="160" width="52" height="8" rx="4" fill={ink} />
      <path d="M150 50l5 11 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2Z" fill={accent} />
      <path d="M44 120l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill={accent} />
    </>
  ),
};

/** Avión y coche que recorren la ruta (mirando a la derecha, centrados en 0,0). */
export function PlaneGlyph({ color }: { color: string }) {
  return (
    <g>
      <path d="M-22 -3h30l14-14h6l-7 14h11l6-6h4l-3 9 3 9h-4l-6-6H21l7 14h-6L8 9h-30c-4 0-6-2-6-6s2-6 6-6Z" fill={color} />
    </g>
  );
}

export function CarGlyph({ color, wheel }: { color: string; wheel: string }) {
  return (
    <g>
      <path d="M-24 4v-8c0-3 2-5 5-5h6l8-9h16l10 9h6c3 0 5 2 5 5v8Z" fill={color} />
      <path d="M-3 -16h10l7 7H-9Z" fill="#fff" opacity=".85" />
      <circle cx="-13" cy="5" r="6" fill={wheel} />
      <circle cx="13" cy="5" r="6" fill={wheel} />
      <circle cx="-13" cy="5" r="2.2" fill="#fff" />
      <circle cx="13" cy="5" r="2.2" fill="#fff" />
    </g>
  );
}
