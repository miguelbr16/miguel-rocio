# Miguel & Rocío · Nuestro primer año

Web personal de aniversario — desde el **18 de noviembre de 2025**.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Código de acceso: `181125` (18 · 11 · 25).

## Estructura

```
src/
  app/           → Next.js App Router
  components/    → UI por secciones
  data/          → Historia, bingo, cartas, quiz…
public/
  photos/        → Imágenes (portada, bingo, historia)
  paris/         → Guía del viaje a París (legacy estático)
  expediente/    → Caso detective 001 (legacy estático)
legacy/          → HTML original de referencia
```

## Fotos

Coloca las imágenes en:

| Carpeta | Archivos |
|---------|----------|
| `public/photos/` | `portada.jpeg` ✓ |
| `public/photos/bingo/` | `bingo1.jpeg` … `bingo25.jpeg` |
| `public/photos/historia/` | `historia1.jpeg`, `historia2.jpeg`, `historia3.jpeg` |

Si falta una foto, la UI la oculta sin romper nada.

## Deploy (Vercel)

1. Conecta el repo en [vercel.com](https://vercel.com)
2. Framework: Next.js (auto-detectado)
3. Deploy — listo

## Caso 002 — La gran noche (18 nov 2026)

Pistas diarias del 8 al 18 noviembre. El final revela **cena, flores y sorpresa**.

**Edita antes del día D** → `src/data/sorpresa-config.ts`:

```typescript
cena: { restaurante: "...", hora: "21:00", direccion: "..." },
flores: { detalle: "Dónde estarán las flores" },
extra: { mensaje: "Tu sorpresa extra (anillo, viaje…)" },
```

Para probar todo sin esperar: `devUnlockAll: true` en ese mismo archivo.
