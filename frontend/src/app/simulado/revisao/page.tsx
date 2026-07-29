"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Clock, RotateCcw } from "lucide-react";
import { api } from "@/services/api";
import { getUser, StoredUser } from "@/services/auth";
import { Question } from "@/types";
import Loading from "@/components/Loading";

const TEMPO_POR_QUESTAO = 90;

export default function RevisaoDeErros() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [tempoRestante, setTempoRestante] = useState(TEMPO_POR_QUESTAO);
  const [resultado, setResultado] = useState<{
    isCorrect: boolean;
    correctLabel: string;
    aiExplanation: string | null;
    explicacoesRestantes: number;
  } | null>(null);
  const [enviando, setEnviando] = useState(false);

  const inicioRef = useRef<number>(Date.now());

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u) api.getReviewQuestions().then(setQuestions);
  }, []);

  const questao = questions?.[indice];

  useEffect(() => {
    setTempoRestante(TEMPO_POR_QUESTAO);
    inicioRef.current = Date.now();
  }, [indice, questao?.id]);

  useEffect(() => {
    if (!questao || resultado) return;
    if (tempoRestante <= 0) {
      responder("");
      return;
    }
    const timer = setTimeout(() => setTempoRestante((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [tempoRestante, questao, resultado]);

  async function responder(label: string) {
    if (!user || !questao || enviando || resultado) return;
    setEnviando(true);
    setEscolhida(label || null);
    const timeSpentSeconds = Math.round((Date.now() - inicioRef.current) / 1000);
    const attempt = await api.submitAttempt({
      questionId: questao.id,
      chosenLabel: label,
      timeSpentSeconds,
    });
    setResultado({
      isCorrect: attempt.isCorrect,
      correctLabel: attempt.correctLabel,
      aiExplanation: attempt.aiExplanation,
      explicacoesRestantes: attempt.explicacoesRestantes,
    });
    setEnviando(false);
  }

  function proxima() {
    setResultado(null);
    setEscolhida(null);
    setIndice((i) => i + 1);
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

  if (questions === null) {
    return <Loading label="Carregando suas questões erradas..." />;
  }

  if (questions.length === 0) {
    return (
      <div className="border-2 border-ink p-8 bg-white/40 text-center fade-up">
        <p className="font-display font-bold text-2xl mb-2">Nada pra revisar 🎉</p>
        <p className="text-ink/60 mb-5">
          Ou você ainda não fez nenhum simulado, ou já acertou tudo na última tentativa.
        </p>
        <Link
          href="/simulado"
          className="inline-flex items-center gap-1 font-mono text-sm border-b-2 border-accent"
        >
          fazer um simulado <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  if (!questao) {
    return (
      <div className="border-2 border-ink p-8 bg-white/40 text-center fade-up">
        <p className="font-display font-bold text-2xl mb-2">Revisão terminada 🎉</p>
        <p className="text-ink/60 mb-5">
          Se você errou de novo alguma, ela volta a aparecer aqui na próxima revisão.
        </p>
        <Link
          href="/desempenho"
          className="inline-flex items-center gap-1 font-mono text-sm border-b-2 border-accent"
        >
          ver desempenho <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  function corDaAlternativa(label: string) {
    if (!resultado) return "border-ink hover:bg-accent hover:-translate-y-0.5";
    if (label === resultado.correctLabel) return "border-correct bg-correct/20";
    if (label === escolhida) return "border-incorrect bg-incorrect/20";
    return "border-ink/30 opacity-50";
  }

  const progresso = (indice / questions.length) * 100;
  const tempoUrgente = tempoRestante <= 15 && !resultado;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 font-mono text-xs text-ink/60">
        <RotateCcw size={14} /> modo revisão — só suas questões erradas
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="font-mono text-xs text-ink/60">
            questão {indice + 1} de {questions.length}
          </p>
          <div
            className={`flex items-center gap-1 font-mono text-xs px-2 py-1 border-2 ${
              tempoUrgente ? "border-incorrect text-incorrect animate-pulse" : "border-ink/30"
            }`}
          >
            <Clock size={12} />
            {String(Math.floor(Math.max(tempoRestante, 0) / 60)).padStart(2, "0")}:
            {String(Math.max(tempoRestante, 0) % 60).padStart(2, "0")}
          </div>
        </div>
        <div className="h-1.5 bg-white border border-ink/20 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      <div className="border-2 border-ink p-6 bg-white/40 mb-6 fade-up" key={questao.id}>
        <p className="mb-6 leading-relaxed">{questao.statement}</p>

        <div className="space-y-2">
          {questao.alternatives.map((alt) => (
            <button
              key={alt.id}
              disabled={!!resultado}
              onClick={() => responder(alt.label)}
              className={`w-full text-left border-2 px-4 py-3 transition-all ${corDaAlternativa(alt.label)}`}
            >
              <span className="font-mono font-bold mr-2">{alt.label}</span>
              {alt.text}
            </button>
          ))}
        </div>
      </div>

      {resultado && (
        <div
          className={`border-2 p-5 mb-6 fade-up ${
            resultado.isCorrect ? "border-correct bg-correct/10" : "border-incorrect bg-incorrect/10"
          }`}
        >
          <p className="font-display font-bold mb-2 flex items-center gap-2">
            {resultado.isCorrect ? (
              <>
                <CheckCircle2 className="text-correct" size={20} /> Acertou dessa vez!
              </>
            ) : (
              <>
                <XCircle className="text-incorrect" size={20} />
                {escolhida
                  ? `Errou de novo — a certa era a "${resultado.correctLabel}"`
                  : `Tempo esgotado — a certa era a "${resultado.correctLabel}"`}
              </>
            )}
          </p>

          {resultado.aiExplanation === "LIMITE_ATINGIDO" ? (
            <p className="text-sm text-ink/80">
              Você usou todas as suas explicações por IA disponíveis por enquanto.
            </p>
          ) : (
            resultado.aiExplanation && (
              <p className="text-sm text-ink/80">{resultado.aiExplanation}</p>
            )
          )}

          <button
            onClick={proxima}
            className="inline-flex items-center gap-2 mt-4 font-mono text-sm bg-ink text-paper px-4 py-2 hover:bg-accent hover:text-ink transition-colors"
          >
            próxima questão <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
