import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Miguel & Rocío · Nuestro primer año",
  description:
    "Desde el 18 de noviembre de 2025. Historia, planes, cartas y recuerdos de Miguel y Rocío.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://miguel-rocio.vercel.app"),
  openGraph: {
    title: "Miguel & Rocío",
    description: "Camino a nuestro primer año ♥",
    images: ["/photos/portada.jpeg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
