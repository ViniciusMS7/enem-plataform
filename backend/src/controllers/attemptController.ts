import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { explainWrongAnswer } from "../services/aiExplanationService";

// Limite de explicações por IA por usuário. Ajuste esse número
// livremente — é só uma constante, não precisa mexer em mais nada.
const LIMITE_EXPLICACOES_IA = 5;

export async function submitAttempt(req: Request, res: Response) {
  const { userId, questionId, chosenLabel } = req.body;

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
    if (explicacoesRestantes > 0) {
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
    data: { userId, questionId, chosenLabel, isCorrect, aiExplanation },
  });

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
