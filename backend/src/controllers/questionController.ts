import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function listQuestionsBySubject(req: Request, res: Response) {
  const { subjectId } = req.params;
  const questions = await prisma.question.findMany({
    where: { subjectId },
    include: { alternatives: true, topic: true },
  });
  res.json(questions);
}

export async function getQuestion(req: Request, res: Response) {
  const { id } = req.params;
  const question = await prisma.question.findUnique({
    where: { id },
    include: { alternatives: true },
  });
  if (!question) return res.status(404).json({ error: "Questão não encontrada" });
  res.json(question);
}
