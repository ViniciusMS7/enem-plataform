"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Timer, ArrowRight } from "lucide-react";
import { api } from "@/services/api";
import { getUser, StoredUser } from "@/services/auth";
import Loading from "@/components/Loading";

type ProgressoMateria = {
  subjectId: string;
  subjectName: string;
  correctCount: number;
  totalCount: number;
  accuracy: number;
  avgTimeSeconds: number | null;
  lastReviewed: string;
};

function corPorAcerto(accuracy: number) {
  if (accuracy >= 70) return "bg-correct";
  if (accuracy >= 40) return "bg-accent";
  return "bg-incorrect";
}

export default function Desempenho() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [dados, setDados] = useState<ProgressoMateria[] | null>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u) api.getProgress().then(setDados);
  }, []);

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
      <h1 className="font-display font-bold text-3xl mb-1">Seu desempenho</h1>
      <p className="text-ink/70 mb-8">Taxa de acerto e tempo médio por matéria.</p>

      {dados === null && <Loading label="Carregando..." />}

      {dados && dados.length === 0 && (
        <div className="border-2 border-ink p-6 bg-white/40">
          <p className="mb-4">Você ainda não respondeu nenhuma questão.</p>
          <Link
            href="/simulado"
            className="inline-flex items-center gap-1 font-mono text-sm border-b-2 border-accent"
          >
            fazer um simulado <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {dados && dados.length > 0 && (
        <div className="space-y-4">
          {dados.map((d) => (
            <div key={d.subjectId} className="border-2 border-ink p-4 bg-white/40">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <p className="font-display font-bold">{d.subjectName}</p>
                <div className="flex items-center gap-4 font-mono text-xs text-ink/60">
                  <span>
                    {d.correctCount}/{d.totalCount} certas
                  </span>
                  {d.avgTimeSeconds !== null && (
                    <span className="flex items-center gap-1">
                      <Timer size={12} /> {d.avgTimeSeconds}s/questão
                    </span>
                  )}
                </div>
              </div>
              <div className="h-3 bg-white border border-ink/20 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${corPorAcerto(d.accuracy)}`}
                  style={{ width: `${d.accuracy}%` }}
                />
              </div>
              <p className="font-mono text-xs text-ink/50 mt-1">{d.accuracy}% de acerto</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
