import type { StampArt } from "@/data/journey";

/** Adivina el dibujo del sello por el nombre (sirve sin conexión). */
export function guessArt(name: string): StampArt {
  const n = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const has = (...w: string[]) => w.some((x) => n.includes(x));
  if (has("dolomit", "alpes", "alps", "glaciar", "nieve", "esqui", "sierra nevada", "andorra", "suiza", "laponia", "aurora")) return "snow";
  if (has("monte", "pico", "montan", "picos", "pirineo", "volcan", "teide", "sierra", "valle")) return "mountain";
  if (has("playa", "cala", "costa", "beach", "bahia")) return "beach";
  if (has("isla", "island", "mallorca", "ibiza", "menorca", "canarias", "tenerife", "cerdena", "sicilia", "creta", "bali", "maldivas", "hawai")) return "island";
  if (has("lago", "lake", "rio ", "fiordo", "como")) return "lake";
  if (has("castillo", "castell", "alcazar", "palacio", "fortaleza")) return "castle";
  if (has("estadio", "stadium", "mestalla", "bernabeu", "camp nou", "partido")) return "stadium";
  if (has("concierto", "festival", "musica", "show")) return "music";
  if (has("paris", "eiffel")) return "tower";
  if (has("londres", "london", "big ben")) return "clock";
  if (has("pueblo", "villa", "aldea")) return "village";
  return "city";
}

type Nominatim = {
  name?: string;
  display_name: string;
  category?: string;
  type?: string;
  addresstype?: string;
  lat: string;
  lon: string;
  address?: { country?: string };
};

function artFromOsm(r: Nominatim): StampArt | null {
  const t = `${r.category}:${r.type}:${r.addresstype}`;
  if (/glacier/.test(t)) return "snow";
  if (/peak|mountain_range|volcano|ridge|valley/.test(t)) return "mountain";
  if (/beach|bay|coastline/.test(t)) return "beach";
  if (/island|archipelago|islet/.test(t)) return "island";
  if (/water|lake|reservoir/.test(t)) return "lake";
  if (/castle|fort|palace/.test(t)) return "castle";
  if (/stadium/.test(t)) return "stadium";
  if (/village|hamlet/.test(t)) return "village";
  if (/city|town|municipality|administrative/.test(t)) return "city";
  return null;
}

export type FoundPlace = { name: string; country: string; art: StampArt; lat: number; lng: number };

/** Busca el sitio en OpenStreetMap para saber país, coordenadas y tipo. */
export async function findPlace(query: string, signal?: AbortSignal): Promise<FoundPlace | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&accept-language=es&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) return null;
  const list = (await res.json()) as Nominatim[];
  const r = list[0];
  if (!r) return null;
  const keyword = guessArt(query);
  return {
    name: r.name || query,
    country: r.address?.country ?? "",
    art: keyword !== "city" ? keyword : artFromOsm(r) ?? "city",
    lat: Number(r.lat),
    lng: Number(r.lon),
  };
}

/** Reduce la foto para que quepa en la sincronización (≈80 KB). Sirve con fotos del iPhone. */
export async function compressImage(file: File, max = 900, quality = 0.72): Promise<string> {
  let source: CanvasImageSource | null = null;
  let w = 0;
  let h = 0;
  // 1) createImageBitmap respeta la orientación y lee más formatos
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
    source = bmp;
    w = bmp.width;
    h = bmp.height;
  } catch {
    // 2) plan B: etiqueta <img>
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej(new Error("img"));
        i.src = url;
      });
      source = img;
      w = img.naturalWidth;
      h = img.naturalHeight;
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }
  if (!source || !w || !h) throw new Error("No se pudo leer la foto");
  const scale = Math.min(1, max / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

export const PHOTO_ERROR =
  "No he podido leer esa foto. Si es del iPhone, prueba a compartirla como JPG o a hacerle una captura de pantalla y subir la captura.";

export const ART_LABELS: Record<StampArt, string> = {
  city: "Ciudad",
  tower: "Torre",
  clock: "Reloj",
  mountain: "Montaña",
  snow: "Nieve",
  beach: "Playa",
  island: "Isla",
  village: "Pueblo",
  castle: "Castillo",
  stadium: "Estadio",
  music: "Concierto",
  lake: "Lago",
  heart: "Corazón",
};
