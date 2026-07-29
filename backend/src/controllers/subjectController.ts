import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function listSubjects(_req: Request, res: Response) {
  const subjects = await prisma.subject.findMany({ include: { topics: true } });
  res.json(subjects);
}

// Aluno marca o quão difícil considera cada matéria (1 a 5).
// Essa nota alimenta o algoritmo de cronograma (studyPlanService).
export async function setUserSubjectDifficulty(req: Request, res: Response) {
  const { subjectId } = req.params;
  const userId = req.userId!;
  const { difficulty } = req.body;

  const record = await prisma.userSubject.upsert({
    where: { userId_subjectId: { userId, subjectId } },
    update: { difficulty },
    create: { userId, subjectId, difficulty },
  });

  res.json(record);
}
