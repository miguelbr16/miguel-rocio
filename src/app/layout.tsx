import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
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
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
