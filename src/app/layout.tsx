import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const grotesk = localFont({
  src: "../../public/fonts/SpaceGrotesk.ttf",
  variable: "--font-grotesk",
  weight: "300 700",
  display: "swap",
});

const jetbrains = localFont({
  src: "../../public/fonts/JetBrainsMono.ttf",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DailyForge — Docs portal for daily developer challenges",
    template: "%s · DailyForge",
  },
  description:
    "Author, test, schedule, and ship one developer challenge every day. Docs, a challenge studio, and a REST API — all in one portal.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable}`}>
      <body className="bg-ink font-sans text-[#e9edf1] antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-grid bg-grid-fade" />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1000px_500px_at_75%_-10%,rgba(200,255,61,0.06),transparent_60%),radial-gradient(800px_500px_at_10%_110%,rgba(180,154,255,0.05),transparent_60%)]" />
        <Nav />
        <div className="relative min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
