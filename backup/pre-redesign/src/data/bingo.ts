export interface BingoItem {
  label: string;
  icon: string;
  pending: boolean;
  photoFile?: string;
}

export const bingoItems: BingoItem[] = [
  { label: "Peli & Manta", icon: "🎬", pending: true, photoFile: "bingo1.jpeg" },
  { label: "Juntos", icon: "📸", pending: false, photoFile: "bingo2.jpeg" },
  { label: "Cata de quesos", icon: "🧀", pending: true, photoFile: "bingo3.jpeg" },
  { label: "Rutita", icon: "🥾", pending: true, photoFile: "bingo4.jpeg" },
  { label: "Juntos", icon: "📸", pending: false, photoFile: "bingo5.jpeg" },
  { label: "Juntos", icon: "📸", pending: false, photoFile: "bingo6.jpeg" },
  { label: "Cocinando", icon: "👨‍🍳", pending: false, photoFile: "bingo7.jpeg" },
  { label: "Día de museo", icon: "🏛️", pending: true, photoFile: "bingo8.jpeg" },
  { label: "Bolera", icon: "🎳", pending: true, photoFile: "bingo9.jpeg" },
  { label: "Beso", icon: "💋", pending: false, photoFile: "bingo10.jpeg" },
  { label: "Autocine", icon: "🚗🎬", pending: true, photoFile: "bingo11.jpeg" },
  { label: "Con Sofía", icon: "👭", pending: false, photoFile: "bingo12.jpeg" },
  { label: "Juntos", icon: "📸", pending: false, photoFile: "bingo13.jpeg" },
  { label: "Espejo", icon: "🪞", pending: false, photoFile: "bingo14.jpeg" },
  { label: "Calitas & Paddle", icon: "🏓", pending: true, photoFile: "bingo15.jpeg" },
  { label: "Partido VCF", icon: "⚽", pending: true, photoFile: "bingo16.jpeg" },
  { label: "Playlist 2026", icon: "🎵", pending: true, photoFile: "bingo17.jpeg" },
  { label: "Miguel", icon: "📸", pending: false, photoFile: "bingo18.jpeg" },
  { label: "Resolver crimen", icon: "🔍", pending: true, photoFile: "bingo19.jpeg" },
  { label: "Juntos", icon: "📸", pending: false, photoFile: "bingo20.jpeg" },
  { label: "Noche", icon: "🌙", pending: false, photoFile: "bingo21.jpeg" },
  { label: "Churros", icon: "🍩", pending: false, photoFile: "bingo22.jpeg" },
  { label: "París", icon: "🗼", pending: false, photoFile: "bingo23.jpeg" },
  { label: "Juntos", icon: "📸", pending: false, photoFile: "bingo24.jpeg" },
  { label: "Tarde de pintar", icon: "🎨", pending: true, photoFile: "bingo25.jpeg" },
];

export function bingoPhotoPath(file?: string) {
  return file ? `/photos/bingo/${file}` : undefined;
}
