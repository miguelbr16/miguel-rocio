export interface BingoItem {
  label: string;
  icon: string;
  pending: boolean;
  photoFile?: string;
}

export const bingoItems: BingoItem[] = [
  { label: "Peli & Manta", icon: "🎬", pending: true },
  { label: "Juntos", icon: "📸", pending: false, photoFile: "selfie.jpg" },
  { label: "Cata de quesos", icon: "🧀", pending: true },
  { label: "Rutita", icon: "🥾", pending: true },
  { label: "Juntos", icon: "📸", pending: false, photoFile: "selfie-lengua.jpg" },
  { label: "Juntos", icon: "📸", pending: false },
  { label: "Cocinando", icon: "👨‍🍳", pending: false },
  { label: "Día de museo", icon: "🏛️", pending: true },
  { label: "Bolera", icon: "🎳", pending: true },
  { label: "Beso", icon: "💋", pending: false, photoFile: "beso.jpg" },
  { label: "Autocine", icon: "🚗🎬", pending: true },
  { label: "Con Sofía", icon: "👭", pending: false },
  { label: "Juntos", icon: "📸", pending: false },
  { label: "Espejo", icon: "🪞", pending: false },
  { label: "Calitas & Paddle", icon: "🏓", pending: true },
  { label: "Partido VCF", icon: "⚽", pending: true },
  { label: "Playlist 2026", icon: "🎵", pending: true },
  { label: "Miguel", icon: "📸", pending: false },
  { label: "Resolver crimen", icon: "🔍", pending: true },
  { label: "Juntos", icon: "📸", pending: false },
  { label: "Noche", icon: "🌙", pending: false, photoFile: "noche.jpg" },
  { label: "Churros", icon: "🍩", pending: false },
  { label: "París", icon: "🗼", pending: false, photoFile: "../paris/paris-torre.jpg" },
  { label: "Juntos", icon: "📸", pending: false },
  { label: "Tarde de pintar", icon: "🎨", pending: true },
];

export function bingoPhotoPath(file?: string) {
  return file ? `/photos/historia/${file}` : undefined;
}
