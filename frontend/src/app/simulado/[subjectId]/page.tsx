"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { getUser, StoredUser } from "@/services/auth";
import { Question } from "@/types";
import QuizRunner from "@/components/QuizRunner";
import Loading from "@/components/Loading";

export default function Simulado() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);

  useEffect(() => {
    setUser(getUser());
    api.getQuestionsBySubject(subjectId).then(setQuestions);
  }, [subjectId]);

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
    return <Loading label="Carregando questões..." />;
  }

  if (questions.length === 0) {
    return <p className="text-ink/60">Nenhuma questão cadastrada pra essa matéria ainda.</p>;
  }

  return (
    <QuizRunner
      questions={questions}
      voltarHref="/simulado"
      voltarLabel="escolher outra matéria"
    />
  );
}
