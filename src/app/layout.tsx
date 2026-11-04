import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";
import "./home.css";

const albert = Albert_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-albert",
});

export const metadata: Metadata = {
  title: "Miguel & Rocío · Nuestro primer año",
  description:
    "Desde el 18 de noviembre de 2025. Historia, planes, cartas y recuerdos de Miguel y Rocío.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://miguel-rocio.vercel.app"),
  openGraph: {
    title: "Miguel & Rocío",
    description: "Un año contigo",
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
    <html lang="es" className={albert.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
