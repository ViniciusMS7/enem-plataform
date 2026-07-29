import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getUserProfile(req: Request, res: Response) {
  const userId = req.userId!;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      currentStreak: true,
      longestStreak: true,
      lastStudyDate: true,
    },
  });

  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  res.json(user);
}
