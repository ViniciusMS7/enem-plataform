import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Reta Final — Estudos para o ENEM",
  description: "Cronograma inteligente e simulados para o ENEM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
        <header className="border-b-2 border-ink px-6 py-4 flex items-center justify-between bg-paper/80 backdrop-blur-sm sticky top-0 z-20">
          <Link href="/" className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-accent border border-ink rotate-45" />
            Reta Final
          </Link>
          <nav className="flex gap-7 font-mono text-sm">
            <Link href="/materias" className="relative group py-1">
              matérias
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link href="/simulado" className="relative group py-1">
              simulado
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link href="/cronograma" className="relative group py-1">
              cronograma
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
          </nav>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
