import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getProgressByUser(req: Request, res: Response) {
  const userId = req.userId!;

  const progress = await prisma.progress.findMany({
    where: { userId },
    include: { subject: true },
    orderBy: { lastReviewed: "desc" },
  });

  // Tempo médio por questão em cada matéria, calculado a partir das
  // tentativas que tiveram tempo registrado (timeSpentSeconds).
  const attempts = await prisma.attempt.findMany({
    where: { userId, timeSpentSeconds: { not: null } },
    include: { question: true },
  });

  const tempoPorMateria: Record<string, { soma: number; total: number }> = {};
  for (const a of attempts) {
    const subjectId = a.question.subjectId;
    if (!tempoPorMateria[subjectId]) tempoPorMateria[subjectId] = { soma: 0, total: 0 };
    tempoPorMateria[subjectId].soma += a.timeSpentSeconds || 0;
    tempoPorMateria[subjectId].total += 1;
  }

  const resultado = progress.map((p) => {
    const tempo = tempoPorMateria[p.subjectId];
    return {
      subjectId: p.subjectId,
      subjectName: p.subject.name,
      correctCount: p.correctCount,
      totalCount: p.totalCount,
      accuracy: p.totalCount > 0 ? Math.round((p.correctCount / p.totalCount) * 100) : 0,
      avgTimeSeconds: tempo ? Math.round(tempo.soma / tempo.total) : null,
      lastReviewed: p.lastReviewed,
    };
  });

  res.json(resultado);
}
