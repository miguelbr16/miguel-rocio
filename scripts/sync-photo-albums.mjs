#!/usr/bin/env node
/**
 * Escanea public/photos/<album>/*.jpg|jpeg|webp|png y actualiza
 * el objeto photoAlbums en src/data/destinations.ts
 *
 * Uso: node scripts/sync-photo-albums.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const photosRoot = path.join(root, "public", "photos");
const destFile = path.join(root, "src", "data", "destinations.ts");

const ALBUMS = ["valencia", "altea", "paris", "asturias", "mallorca", "mestalla"];
const EXT = new Set([".jpg", ".jpeg", ".webp", ".png"]);

function listAlbum(name) {
  const dir = path.join(photosRoot, name);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => EXT.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
    .map((f) => `/photos/${name}/${f}`);
}

const albums = Object.fromEntries(ALBUMS.map((a) => [a, listAlbum(a)]));

const block = `export const photoAlbums: Record<string, string[]> = ${JSON.stringify(
  albums,
  null,
  2,
)};`;

let src = fs.readFileSync(destFile, "utf8");
const next = src.replace(
  /export const photoAlbums: Record<string, string\[]> = \{[\s\S]*?\};/,
  block,
);

if (next === src) {
  console.error("No pude localizar photoAlbums en destinations.ts");
  process.exit(1);
}

fs.writeFileSync(destFile, next);
for (const [k, v] of Object.entries(albums)) {
  console.log(`${k}: ${v.length} foto(s)`);
}
console.log("Actualizado src/data/destinations.ts");
