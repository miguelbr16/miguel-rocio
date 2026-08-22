#!/usr/bin/env bash
# Convierte .HEIC/.HEIF de public/photos/inbox (o carpetas) a .jpg web-ready.
# Uso:
#   ./scripts/convert-heic.sh
#   ./scripts/convert-heic.sh public/photos/asturias
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-$ROOT/public/photos/inbox}"

if ! command -v heif-convert >/dev/null 2>&1 && ! command -v magick >/dev/null 2>&1; then
  echo "Falta heif-convert o ImageMagick. Instala: sudo apt-get install -y libheif-examples imagemagick"
  exit 1
fi

shopt -s nullglob nocaseglob
count=0
for src in "$TARGET"/*.{heic,heif,HEIC,HEIF}; do
  [ -f "$src" ] || continue
  base="${src%.*}"
  out="${base}.jpg"
  echo "→ $(basename "$src") → $(basename "$out")"
  if command -v heif-convert >/dev/null 2>&1; then
    heif-convert -q 88 "$src" "$out" >/dev/null
  else
    magick "$src" -auto-orient -quality 88 -resize "2400x2400>" "$out"
  fi
  # Recomprimir / orientar si heif-convert no redimensiona
  if command -v magick >/dev/null 2>&1; then
    magick "$out" -auto-orient -quality 88 -resize "2400x2400>" "$out"
  fi
  count=$((count + 1))
done

if [ "$count" -eq 0 ]; then
  echo "No hay HEIC en: $TARGET"
  echo "Suelta fotos en public/photos/inbox/ o pásame la carpeta como argumento."
else
  echo "Listo: $count convertida(s)."
fi
