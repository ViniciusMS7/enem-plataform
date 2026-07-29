"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Clock } from "lucide-react";
import { api } from "@/services/api";
import { Question } from "@/types";

export function formatarTempo(segundosTotais: number) {
  const h = Math.floor(segundosTotais / 3600);
  const m = Math.floor((segundosTotais % 3600) / 60);
  const s = segundosTotais % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

type Props = {
  questions: Question[];
  /** pra onde voltar depois de terminar (ex: escolher outra matéria) */
  voltarHref: string;
  voltarLabel: string;
};

export default function QuizRunner({ questions, voltarHref, voltarLabel }: Props) {
  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [resultado, setResultado] = useState<{
    isCorrect: boolean;
    correctLabel: string;
    aiExplanation: string | null;
  } | null>(null);
  const [respostas, setRespostas] = useState<boolean[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [tempoFinal, setTempoFinal] = useState<number | null>(null);

  const inicioQuestaoRef = useRef<number>(Date.now());
  const inicioSimuladoRef = useRef<number>(Date.now());

  const questao = questions[indice];
  const acabou = questions.length > 0 && !questao;

  useEffect(() => {
    inicioQuestaoRef.current = Date.now();
  }, [indice, questao?.id]);

  // Cronômetro total, subindo — para quando o simulado acaba
  useEffect(() => {
    if (!questao || acabou) return;
    const timer = setInterval(() => {
      setTempoDecorrido(Math.round((Date.now() - inicioSimuladoRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [questao, acabou]);

  // Congela o tempo total assim que a última questão é respondida
  useEffect(() => {
    if (acabou && tempoFinal === null) {
      setTempoFinal(Math.round((Date.now() - inicioSimuladoRef.current) / 1000));
    }
  }, [acabou, tempoFinal]);

  async function responder(label: string) {
    if (!questao || enviando || resultado) return;
    setEnviando(true);
    setEscolhida(label || null);

    if (questao.custom) {
      // Assunto pesquisado por IA: a resposta certa já veio junto com a
      // questão, corrige no navegador mesmo, sem bater no servidor.
      const correta = questao.alternatives.find((a) => a.isCorrect);
      const isCorrect = correta?.label === label;
      setResultado({
        isCorrect,
        correctLabel: correta?.label || "",
        aiExplanation: questao.explanation || null,
      });
      setRespostas((r) => [...r, isCorrect]);
      setEnviando(false);
      return;
    }

    const timeSpentSeconds = Math.round((Date.now() - inicioQuestaoRef.current) / 1000);
    const attempt = await api.submitAttempt({
      questionId: questao.id,
      chosenLabel: label,
      timeSpentSeconds,
    });
    setResultado({
      isCorrect: attempt.isCorrect,
      correctLabel: attempt.correctLabel,
      aiExplanation: attempt.aiExplanation,
    });
    setRespostas((r) => [...r, attempt.isCorrect]);
    setEnviando(false);
  }

  function proxima() {
    setResultado(null);
    setEscolhida(null);
    setIndice((i) => i + 1);
  }

  if (questions.length === 0) {
    return <p className="text-ink/60">Nenhuma questão cadastrada ainda.</p>;
  }

  if (acabou) {
    const acertos = respostas.filter(Boolean).length;
    const erros = respostas.length - acertos;
    const percentual = respostas.length > 0 ? Math.round((acertos / respostas.length) * 100) : 0;

    return (
      <div className="border-2 border-ink p-8 bg-white/40 text-center fade-up">
        <p className="font-display font-bold text-2xl mb-2">Simulado terminado 🎉</p>
        <p className="text-ink/60 mb-6">Você respondeu todas as questões desse simulado.</p>

        <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto">
          <div className="border-2 border-ink/30 p-4">
            <p className="font-mono text-xs text-ink/60 mb-1 flex items-center justify-center gap-1">
              <Clock size={12} /> tempo total
            </p>
            <p className="font-display font-bold text-xl">
              {tempoFinal !== null ? formatarTempo(tempoFinal) : "--:--"}
            </p>
          </div>
          <div className="border-2 border-correct p-4 bg-correct/10">
            <p className="font-mono text-xs text-ink/60 mb-1">acertos</p>
            <p className="font-display font-bold text-xl text-correct">{acertos}</p>
          </div>
          <div className="border-2 border-incorrect p-4 bg-incorrect/10">
            <p className="font-mono text-xs text-ink/60 mb-1">erros</p>
            <p className="font-display font-bold text-xl text-incorrect">{erros}</p>
          </div>
        </div>

        <p className="font-mono text-sm text-ink/60 mb-6">
          {percentual}% de aproveitamento em {respostas.length} questões
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href={voltarHref}
            className="inline-flex items-center gap-1 font-mono text-sm border-b-2 border-accent"
          >
            {voltarLabel} <ArrowRight size={14} />
          </Link>
          <Link
            href="/desempenho"
            className="inline-flex items-center gap-1 font-mono text-sm border-b-2 border-accent"
          >
            ver desempenho <ArrowRight size={14} />
          </Link>
        </div>
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

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="font-mono text-xs text-ink/60">
            questão {indice + 1} de {questions.length}
          </p>
          <div className="flex items-center gap-1 font-mono text-xs px-2 py-1 border-2 border-ink/30 text-ink/70">
            <Clock size={12} />
            {formatarTempo(tempoDecorrido)}
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
        {questao.source && (
          <p className="font-mono text-xs text-ink/50 mb-3">
            {questao.source}
            {questao.year ? ` — ${questao.year}` : ""}
          </p>
        )}

        <div className="mb-6 leading-relaxed space-y-3">
          {questao.statement.split("\n").filter(Boolean).map((paragrafo, i) => (
            <p key={i}>{paragrafo}</p>
          ))}
        </div>

        {questao.imageUrl && (
          <div className="border-2 border-ink/20 bg-white p-3 mb-6 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={questao.imageUrl}
              alt="Imagem de apoio à questão"
              className="max-h-80 object-contain"
            />
          </div>
        )}

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
                Errou — a certa era a "{resultado.correctLabel}"
              </>
            )}
          </p>

          {resultado.aiExplanation && resultado.aiExplanation !== "LIMITE_ATINGIDO" && (
            <p className="text-sm text-ink/80">{resultado.aiExplanation}</p>
          )}

          {resultado.aiExplanation === "LIMITE_ATINGIDO" && (
            <p className="text-sm text-ink/80">
              Você usou todas as suas explicações por IA disponíveis por enquanto.
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
