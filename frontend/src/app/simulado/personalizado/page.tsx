"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Shuffle, Sparkles } from "lucide-react";
import { api } from "@/services/api";
import { getUser, StoredUser } from "@/services/auth";
import { Subject, Question, CustomTopic } from "@/types";
import { iconePorMateria } from "@/components/subjectIcons";
import QuizRunner from "@/components/QuizRunner";

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

type CustomTopicCompleta = {
  id: string;
  query: string;
  questions: { id: string; statement: string; explanation: string; alternatives: { id: string; label: string; text: string; isCorrect: boolean }[] }[];
};

export default function SimuladoPersonalizado() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [meusAssuntos, setMeusAssuntos] = useState<CustomTopic[]>([]);
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());
  const [assuntosSelecionados, setAssuntosSelecionados] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);

  useEffect(() => {
    setUser(getUser());
    api.getSubjects().then(setSubjects);
  }, []);

  useEffect(() => {
    if (!user) return;
    api.getMyCustomTopics().then(setMeusAssuntos);
  }, [user]);

  function alternar(id: string) {
    setSelecionadas((atual) => {
      const nova = new Set(atual);
      if (nova.has(id)) nova.delete(id);
      else nova.add(id);
      return nova;
    });
  }

  function alternarAssunto(id: string) {
    setAssuntosSelecionados((atual) => {
      const nova = new Set(atual);
      if (nova.has(id)) nova.delete(id);
      else nova.add(id);
      return nova;
    });
  }

  async function criarSimulado() {
    if (selecionadas.size === 0 && assuntosSelecionados.size === 0) return;
    setCarregando(true);

    const [listasOficiais, topicosCustom] = await Promise.all([
      Promise.all(Array.from(selecionadas).map((id) => api.getQuestionsBySubject(id))),
      Promise.all(
        Array.from(assuntosSelecionados).map((id) => api.getCustomTopic(id) as Promise<CustomTopicCompleta>)
      ),
    ]);

    const questoesCustom: Question[] = topicosCustom.flatMap((t) =>
      t.questions.map((q) => ({
        id: q.id,
        statement: q.statement,
        imageUrl: null,
        year: null,
        source: `Pesquisa: ${t.query}`,
        custom: true,
        explanation: q.explanation,
        alternatives: q.alternatives,
      }))
    );

    setQuestions(embaralhar([...listasOficiais.flat(), ...questoesCustom]));
    setCarregando(false);
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

  // Etapa 2: simulado já montado — mostra o quiz
  if (questions) {
    return (
      <QuizRunner
        questions={questions}
        voltarHref="/simulado/personalizado"
        voltarLabel="montar outro simulado"
      />
    );
  }

  const totalSelecionado = selecionadas.size + assuntosSelecionados.size;

  // Etapa 1: escolher as matérias
  return (
    <div>
      <h1 className="font-display font-bold text-4xl tracking-tight mb-2 fade-up">
        Simulado personalizado
      </h1>
      <p className="text-ink/70 mb-10 fade-up" style={{ animationDelay: "0.05s" }}>
        Escolhe as matérias que quer misturar no simulado.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {subjects.map((s, i) => {
          const Icon = iconePorMateria(s.name);
          const ativa = selecionadas.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => alternar(s.id)}
              className={`group border-2 p-5 text-left card-lift fade-up flex items-center justify-between transition-colors ${
                ativa ? "border-accent bg-accent/20" : "border-ink bg-white/40"
              }`}
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 border-2 border-ink flex items-center justify-center shrink-0 transition-colors ${
                    ativa ? "bg-accent" : "group-hover:bg-accent"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="font-display font-bold">{s.name}</p>
                  <p className="font-mono text-xs text-ink/50">{s.area}</p>
                </div>
              </div>
              <div
                className={`w-6 h-6 border-2 border-ink flex items-center justify-center shrink-0 ${
                  ativa ? "bg-ink text-paper" : "bg-white/60"
                }`}
              >
                {ativa && <Check size={14} strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      {meusAssuntos.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} />
            <p className="font-mono text-xs text-ink/60 uppercase tracking-wide">
              seus assuntos pesquisados
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {meusAssuntos.map((t, i) => {
              const ativa = assuntosSelecionados.has(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => alternarAssunto(t.id)}
                  className={`group border-2 p-5 text-left card-lift fade-up flex items-center justify-between transition-colors ${
                    ativa ? "border-accent bg-accent/20" : "border-ink border-dashed bg-white/40"
                  }`}
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 border-2 border-ink flex items-center justify-center shrink-0 transition-colors ${
                        ativa ? "bg-accent" : "group-hover:bg-accent"
                      }`}
                    >
                      <Sparkles size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-display font-bold">{t.query}</p>
                      <p className="font-mono text-xs text-ink/50">{t.questions.length} questões</p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 border-2 border-ink flex items-center justify-center shrink-0 ${
                      ativa ? "bg-ink text-paper" : "bg-white/60"
                    }`}
                  >
                    {ativa && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={criarSimulado}
        disabled={totalSelecionado === 0 || carregando}
        className="inline-flex items-center gap-2 font-mono text-sm bg-ink text-paper px-5 py-3 hover:bg-accent hover:text-ink transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <Shuffle size={16} />
        {carregando
          ? "montando simulado..."
          : `criar simulado com ${totalSelecionado} matéria${totalSelecionado === 1 ? "" : "s"}`}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
