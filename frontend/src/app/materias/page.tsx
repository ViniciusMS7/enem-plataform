"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { api } from "@/services/api";
import { getUser, StoredUser } from "@/services/auth";
import { Subject } from "@/types";
import { iconePorMateria } from "@/components/subjectIcons";

const NIVEIS = [1, 2, 3, 4, 5];

export default function Materias() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selecionado, setSelecionado] = useState<Record<string, number>>({});
  const [salvo, setSalvo] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setUser(getUser());
    api.getSubjects().then(setSubjects);
  }, []);

  async function marcar(subjectId: string, difficulty: number) {
    if (!user) return;
    setSelecionado((s) => ({ ...s, [subjectId]: difficulty }));
    await api.setSubjectDifficulty(subjectId, user.id, difficulty);
    setSalvo((s) => ({ ...s, [subjectId]: true }));
  }

  if (!user) {
    return (
      <div>
        <p className="mb-4">Você precisa criar uma conta primeiro.</p>
        <Link href="/cadastro" className="font-mono text-sm border-b-2 border-accent">
          → criar conta
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display font-bold text-4xl tracking-tight mb-2 fade-up">
        Suas matérias
      </h1>
      <p className="text-ink/70 mb-10 fade-up" style={{ animationDelay: "0.05s" }}>
        Marca de 1 (tranquilo) a 5 (muito difícil). Isso decide quanto tempo cada
        matéria ocupa no seu cronograma.
      </p>

      <div className="space-y-4">
        {subjects.map((s, i) => {
          const Icon = iconePorMateria(s.name);
          const nivel = selecionado[s.id];
          return (
            <div
              key={s.id}
              className="border-2 border-ink p-5 bg-white/40 card-lift fade-up"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-ink flex items-center justify-center shrink-0">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-display font-bold">{s.name}</p>
                    <p className="font-mono text-xs text-ink/50">{s.area}</p>
                  </div>
                </div>
                {salvo[s.id] && (
                  <span className="flex items-center gap-1 font-mono text-xs text-correct">
                    <Check size={14} /> salvo
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {NIVEIS.map((n) => (
                  <button
                    key={n}
                    onClick={() => marcar(s.id, n)}
                    className={`w-10 h-10 border-2 border-ink font-mono text-sm transition-all ${
                      nivel === n
                        ? "bg-ink text-paper scale-105"
                        : "hover:bg-accent hover:-translate-y-0.5"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/cronograma"
        className="inline-flex items-center gap-2 mt-10 font-mono text-sm bg-ink text-paper px-5 py-3 hover:bg-accent hover:text-ink transition-colors"
      >
        gerar cronograma da semana <ArrowRight size={16} />
      </Link>
    </div>
  );
}
