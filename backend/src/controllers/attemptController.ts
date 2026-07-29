import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { explainWrongAnswer } from "../services/aiExplanationService";
import { updateStreak } from "../services/streakService";

// Limite de explicações por IA por usuário. Ajuste esse número
// livremente — é só uma constante, não precisa mexer em mais nada.
const LIMITE_EXPLICACOES_IA = 5;

export async function submitAttempt(req: Request, res: Response) {
  const userId = req.userId!;
  const { questionId, chosenLabel, timeSpentSeconds } = req.body;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { alternatives: true },
  });
  if (!question) return res.status(404).json({ error: "Questão não encontrada" });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  const correta = question.alternatives.find((a) => a.isCorrect);
  const isCorrect = correta?.label === chosenLabel;

  let aiExplanation: string | null = null;
  const explicacoesRestantes = LIMITE_EXPLICACOES_IA - user.aiExplanationsUsed;

  if (!isCorrect) {
    if (question.explanation) {
      // Já tem explicação escrita à mão — usa ela, sem gastar IA
      aiExplanation = question.explanation;
    } else if (explicacoesRestantes > 0) {
      aiExplanation = await explainWrongAnswer(question, chosenLabel);
      await prisma.user.update({
        where: { id: userId },
        data: { aiExplanationsUsed: { increment: 1 } },
      });
    } else {
      aiExplanation = "LIMITE_ATINGIDO";
    }
  }

  const attempt = await prisma.attempt.create({
    data: { userId, questionId, chosenLabel, isCorrect, aiExplanation, timeSpentSeconds },
  });

  await updateStreak(userId);

  // Atualiza o progresso agregado da matéria (usado depois pelo cronograma)
  await prisma.progress.upsert({
    where: { userId_subjectId: { userId, subjectId: question.subjectId } },
    update: {
      correctCount: { increment: isCorrect ? 1 : 0 },
      totalCount: { increment: 1 },
      lastReviewed: new Date(),
    },
    create: {
      userId,
      subjectId: question.subjectId,
      correctCount: isCorrect ? 1 : 0,
      totalCount: 1,
    },
  });

  res.status(201).json({
    ...attempt,
    correctLabel: correta?.label,
    explicacoesRestantes: isCorrect ? explicacoesRestantes : Math.max(0, explicacoesRestantes - 1),
  });
}

// Pega as questões cuja última tentativa do aluno foi errada — usado
// no "modo replay" pra montar um simulado só com o que ele ainda erra.
export async function getQuestionsForReview(req: Request, res: Response) {
  const userId = req.userId!;

  const attempts = await prisma.attempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Mantém só a tentativa mais recente de cada questão
  const ultimaTentativaPorQuestao = new Map<string, (typeof attempts)[number]>();
  for (const a of attempts) {
    if (!ultimaTentativaPorQuestao.has(a.questionId)) {
      ultimaTentativaPorQuestao.set(a.questionId, a);
    }
  }

  const idsErradas = [...ultimaTentativaPorQuestao.values()]
    .filter((a) => !a.isCorrect)
    .map((a) => a.questionId);

  if (idsErradas.length === 0) return res.json([]);

  const questoes = await prisma.question.findMany({
    where: { id: { in: idsErradas } },
    include: { alternatives: true, subject: true },
  });

  res.json(questoes);
}
