"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { getUser, StoredUser } from "@/services/auth";
import { Question } from "@/types";
import QuizRunner from "@/components/QuizRunner";
import Loading from "@/components/Loading";

type CustomAlternativeApi = { id: string; label: string; text: string; isCorrect: boolean };
type CustomQuestionApi = {
  id: string;
  statement: string;
  explanation: string;
  alternatives: CustomAlternativeApi[];
};
type CustomTopicApi = { id: string; query: string; questions: CustomQuestionApi[] };

export default function SimuladoAssuntoPesquisado() {
  const { customTopicId } = useParams<{ customTopicId: string }>();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [topic, setTopic] = useState<CustomTopicApi | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setUser(getUser());
    api
      .getCustomTopic(customTopicId)
      .then(setTopic)
      .finally(() => setCarregando(false));
  }, [customTopicId]);

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

  if (carregando) return <Loading label="Carregando..." />;

  if (!topic) {
    return (
      <div>
        <p className="mb-4">Não achei esse assunto. Ele pode ter sido removido.</p>
        <Link href="/materias" className="font-mono text-sm border-b-2 border-accent">
          → voltar pras suas matérias
        </Link>
      </div>
    );
  }

  const questions: Question[] = topic.questions.map((q) => ({
    id: q.id,
    statement: q.statement,
    imageUrl: null,
    year: null,
    source: `Pesquisa: ${topic.query}`,
    custom: true,
    explanation: q.explanation,
    alternatives: q.alternatives,
  }));

  return (
    <div>
      <h1 className="font-display font-bold text-3xl tracking-tight mb-6 fade-up">{topic.query}</h1>
      <QuizRunner
        questions={questions}
        voltarHref="/materias"
        voltarLabel="voltar pras suas matérias"
      />
    </div>
  );
}
