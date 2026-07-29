import { prisma } from "../config/prisma";

/**
 * Atualiza a sequência de dias seguidos estudando (streak).
 * Chamado toda vez que o aluno responde uma questão.
 *
 * Regras:
 * - Primeira vez estudando: streak = 1
 * - Estudou ontem: streak += 1
 * - Já estudou hoje: não muda nada
 * - Ficou mais de 1 dia sem estudar: streak volta pra 1
 */
export async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (!user.lastStudyDate) {
    return prisma.user.update({
      where: { id: userId },
      data: { currentStreak: 1, longestStreak: Math.max(1, user.longestStreak), lastStudyDate: hoje },
    });
  }

  const ultimoDia = new Date(user.lastStudyDate);
  ultimoDia.setHours(0, 0, 0, 0);

  const diffDias = Math.round((hoje.getTime() - ultimoDia.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDias === 0) {
    return; // já estudou hoje, nada muda
  }

  const novoStreak = diffDias === 1 ? user.currentStreak + 1 : 1;

  return prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: novoStreak,
      longestStreak: Math.max(novoStreak, user.longestStreak),
      lastStudyDate: hoje,
    },
  });
}
