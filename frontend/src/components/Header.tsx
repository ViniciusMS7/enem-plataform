"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import AuthNav from "./AuthNav";

const LINKS = [
  { href: "/materias", label: "matérias" },
  { href: "/simulado", label: "simulado" },
  { href: "/cronograma", label: "cronograma" },
  { href: "/desempenho", label: "desempenho" },
  { href: "/pesquisar", label: "pesquisar" },
  { href: "/sobre", label: "sobre" },
];

export default function Header() {
  const [aberto, setAberto] = useState(false);

  return (
    <header className="border-b-2 border-ink bg-paper/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setAberto(false)}
          className="font-display font-bold text-xl tracking-tight flex items-center gap-2"
        >
          <span className="inline-block w-2.5 h-2.5 bg-accent border border-ink rotate-45" />
          Reta Final
        </Link>

        <nav className="hidden md:flex gap-7 font-mono text-sm items-center">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="relative group py-1">
              {l.label}
              <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
          ))}
          <AuthNav />
        </nav>

        <button
          onClick={() => setAberto((a) => !a)}
          className="md:hidden p-1.5 border-2 border-ink hover:bg-accent transition-colors"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
        >
          {aberto ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {aberto && (
        <nav className="md:hidden border-t-2 border-ink flex flex-col font-mono text-sm bg-paper fade-up">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className="px-6 py-3.5 border-b border-ink/10 hover:bg-accent/20 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="px-6 py-3.5" onClick={() => setAberto(false)}>
            <AuthNav />
          </div>
        </nav>
      )}
    </header>
  );
}
