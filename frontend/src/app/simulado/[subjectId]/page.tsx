"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { api } from "@/services/api";
import { getUser, StoredUser } from "@/services/auth";
import { Question } from "@/types";

export default function Simulado() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    isCorrect: boolean;
    correctLabel: string;
    aiExplanation: string | null;
    explicacoesRestantes: number;
  } | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setUser(getUser());
    api.getQuestionsBySubject(subjectId).then(setQuestions);
  }, [subjectId]);

  const questao = questions[indice];

  async function responder(label: string) {
    if (!user || !questao || enviando) return;
    setEnviando(true);
    setEscolhida(label);
    const attempt = await api.submitAttempt({
      userId: user.id,
      questionId: questao.id,
      chosenLabel: label,
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

  if (questions.length === 0) {
    return <p className="text-ink/60">Nenhuma questão cadastrada pra essa matéria ainda.</p>;
  }

  if (!questao) {
    return (
      <div className="border-2 border-ink p-8 bg-white/40 text-center fade-up">
        <p className="font-display font-bold text-2xl mb-2">Simulado terminado 🎉</p>
        <p className="text-ink/60 mb-5">Você respondeu todas as questões dessa matéria.</p>
        <Link
          href="/simulado"
          className="inline-flex items-center gap-1 font-mono text-sm border-b-2 border-accent"
        >
          escolher outra matéria <ArrowRight size={14} />
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

  const progresso = ((indice) / questions.length) * 100;

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="font-mono text-xs text-ink/60">
            questão {indice + 1} de {questions.length}
          </p>
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
                <CheckCircle2 className="text-correct" size={20} /> Acertou!
              </>
            ) : (
              <>
                <XCircle className="text-incorrect" size={20} />
                Errou — a certa era a &quot;{resultado.correctLabel}&quot;
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

          {!resultado.isCorrect && resultado.aiExplanation !== "LIMITE_ATINGIDO" && (
            <p className="font-mono text-xs text-ink/50 mt-3">
              explicações restantes: {resultado.explicacoesRestantes}
            </p>
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
