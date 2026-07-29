"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, CalendarDays, PencilLine, ArrowRight } from "lucide-react";
import CountdownStamp from "@/components/CountdownStamp";
import MarkerUnderline from "@/components/MarkerUnderline";
import StreakBadge from "@/components/StreakBadge";
import { getUser, StoredUser } from "@/services/auth";

const PASSOS = [
  {
    numero: "01",
    icon: ClipboardList,
    titulo: "Marca o que pesa",
    texto: "Diz pra gente quais matérias te dão mais trabalho, de 1 a 5.",
  },
  {
    numero: "02",
    icon: CalendarDays,
    titulo: "Recebe a semana pronta",
    texto: "A gente distribui o tempo de estudo com mais peso pro que você mais erra.",
  },
  {
    numero: "03",
    icon: PencilLine,
    titulo: "Treina de verdade",
    texto: "Responde simulados e recebe explicação na hora que erra uma questão.",
  },
];

export default function Home() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className="space-y-16">
      <div className="flex items-start justify-between flex-wrap gap-8 fade-up">
        <div className="max-w-md">
          <h1 className="font-display font-bold text-5xl leading-[1.05] tracking-tight">
            Estuda todo dia.
            <br />
            <span className="relative inline-block">
              Sem perder o fio.
              <MarkerUnderline />
            </span>
          </h1>
          <p className="mt-5 text-ink/70 leading-relaxed">
            Marca o que você tem mais dificuldade, a gente monta seu cronograma
            da semana e cobra de você com simulados de verdade.
          </p>
        </div>
        <CountdownStamp />
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        {PASSOS.map((p) => (
          <div key={p.numero} className="border-2 border-ink bg-white/40 p-5 card-lift">
            <div className="flex items-center justify-between mb-4">
              <p.icon size={22} strokeWidth={2} />
              <span className="font-mono text-xs text-ink/40">{p.numero}</span>
            </div>
            <p className="font-display font-bold mb-1">{p.titulo}</p>
            <p className="text-sm text-ink/70 leading-snug">{p.texto}</p>
          </div>
        ))}
      </div>

      {user ? (
        <div
          className="border-2 border-ink p-6 bg-white/40 fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-ink/50">logado como</p>
          <div className="flex items-center justify-between flex-wrap gap-4 mt-1">
            <p className="font-display font-bold text-xl">{user.name}</p>
            <StreakBadge />
          </div>
          <div className="flex gap-6 mt-5 flex-wrap">
            <Link
              href="/materias"
              className="inline-flex items-center gap-1 font-mono text-sm border-b-2 border-accent hover:gap-2 transition-all"
            >
              marcar dificuldades <ArrowRight size={14} />
            </Link>
            <Link
              href="/cronograma"
              className="inline-flex items-center gap-1 font-mono text-sm border-b-2 border-accent hover:gap-2 transition-all"
            >
              ver cronograma <ArrowRight size={14} />
            </Link>
            <Link
              href="/simulado/revisao"
              className="inline-flex items-center gap-1 font-mono text-sm border-b-2 border-accent hover:gap-2 transition-all"
            >
              revisar meus erros <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-ink p-6 bg-white/40 fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="mb-4">Ainda não tem conta por aqui.</p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 font-mono text-sm bg-ink text-paper px-5 py-3 hover:bg-accent hover:text-ink transition-colors"
          >
            criar conta <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
