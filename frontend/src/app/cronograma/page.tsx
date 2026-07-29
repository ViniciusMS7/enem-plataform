"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, Sparkles } from "lucide-react";
import { api } from "@/services/api";
import { getUser, StoredUser } from "@/services/auth";
import { StudyPlan } from "@/types";
import { iconePorMateria } from "@/components/subjectIcons";
import { useToast } from "@/components/ToastProvider";

const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default function Cronograma() {
  const showToast = useToast();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u) api.getPlan().then(setPlan).catch(() => setPlan(null));
  }, []);

  async function gerar() {
    if (!user) return;
    setCarregando(true);
    try {
      const novo = await api.generatePlan();
      setPlan(novo);
      showToast("Cronograma gerado com base nas suas dificuldades.", "success");
    } catch {
      showToast("Não deu pra gerar o cronograma. Confere se marcou as dificuldades e tenta de novo.", "error");
    } finally {
      setCarregando(false);
    }
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

  const porDia: Record<number, StudyPlan["sessions"]> = {};
  plan?.sessions.forEach((s) => {
    const dia = new Date(s.scheduledFor).getDay();
    porDia[dia] = [...(porDia[dia] || []), s];
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4 fade-up">
        <div>
          <h1 className="font-display font-bold text-4xl tracking-tight mb-2">
            Cronograma da semana
          </h1>
          <p className="text-ink/70">Gerado com base no que você marcou como difícil.</p>
        </div>
        <button
          onClick={gerar}
          disabled={carregando}
          className="inline-flex items-center gap-2 font-mono text-sm bg-ink text-paper px-5 py-3 hover:bg-accent hover:text-ink transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw size={15} className={carregando ? "animate-spin" : ""} />
          {carregando ? "gerando..." : plan ? "gerar de novo" : "gerar cronograma"}
        </button>
      </div>

      {!plan && !carregando && (
        <div className="border-2 border-dashed border-ink/30 p-10 text-center fade-up">
          <Sparkles className="mx-auto mb-3 text-ink/40" size={28} />
          <p className="text-ink/60">
            Nenhum cronograma ainda.{" "}
            <Link href="/materias" className="border-b-2 border-accent text-ink">
              Marca suas dificuldades
            </Link>{" "}
            e clica em gerar.
          </p>
        </div>
      )}

      {plan && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DIAS_SEMANA.map((label, i) => (
            <div
              key={i}
              className="border-2 border-ink p-5 bg-white/40 min-h-[130px] card-lift fade-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <p className="font-mono text-xs uppercase tracking-widest mb-3 text-ink/60">
                {label}
              </p>
              {(porDia[i] || []).length === 0 ? (
                <p className="text-ink/30 text-sm">dia livre</p>
              ) : (
                <ul className="space-y-2.5">
                  {porDia[i].map((s) => {
                    const Icon = iconePorMateria(s.subject.name);
                    return (
                      <li key={s.id} className="flex items-center gap-2 text-sm">
                        <Icon size={15} className="shrink-0 text-ink/50" />
                        <span className="font-display font-bold">{s.subject.name}</span>
                        <span className="text-ink/50 font-mono text-xs">{s.durationMin}min</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
