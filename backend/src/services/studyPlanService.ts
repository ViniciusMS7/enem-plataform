import { prisma } from "../config/prisma";

/**
 * Lógica de repetição espaçada (spaced repetition), versão simples.
 *
 * Ideia central: matérias que o aluno considera mais difíceis (nota alta
 * em UserSubject.difficulty) e/ou que ele tem mais errado (Progress) devem
 * aparecer com mais frequência na semana.
 *
 * Isso é proposital simples agora — dá pra evoluir depois pro algoritmo
 * SM-2 (usado em Anki) sem mudar a assinatura da função, só a lógica interna.
 */

const DIAS_DA_SEMANA = 7;
const SESSOES_MIN_POR_MATERIA = 1;
const SESSOES_MAX_POR_MATERIA = 4;
const DURACAO_PADRAO_MIN = 45;

export async function generatePlanForUser(userId: string) {
  const userSubjects = await prisma.userSubject.findMany({
    where: { userId },
    include: { subject: true },
  });

  const progress = await prisma.progress.findMany({ where: { userId } });

  const weekStart = getStartOfWeek(new Date());

  const plan = await prisma.studyPlan.create({
    data: { userId, weekStart },
  });

  const sessions = [];
  let dayCursor = 0;

  for (const us of userSubjects) {
    const acertos = progress.find((p) => p.subjectId === us.subjectId);
    const taxaAcerto = acertos && acertos.totalCount > 0
      ? acertos.correctCount / acertos.totalCount
      : 0.5; // sem histórico ainda, assume neutro

    // Quanto maior a dificuldade declarada e menor a taxa de acerto,
    // mais sessões na semana (limitado ao máximo definido acima).
    const pesoDificuldade = us.difficulty / 5; // 0.2 a 1.0
    const pesoErro = 1 - taxaAcerto; // 0 (sempre acerta) a 1 (sempre erra)
    const score = (pesoDificuldade + pesoErro) / 2;

    const numSessoes = Math.max(
      SESSOES_MIN_POR_MATERIA,
      Math.min(SESSOES_MAX_POR_MATERIA, Math.round(score * SESSOES_MAX_POR_MATERIA))
    );

    for (let i = 0; i < numSessoes; i++) {
      const scheduledFor = new Date(weekStart);
      scheduledFor.setDate(weekStart.getDate() + (dayCursor % DIAS_DA_SEMANA));
      dayCursor++;

      sessions.push({
        studyPlanId: plan.id,
        subjectId: us.subjectId,
        scheduledFor,
        durationMin: DURACAO_PADRAO_MIN,
      });
    }
  }

  await prisma.studySession.createMany({ data: sessions });

  return prisma.studyPlan.findUnique({
    where: { id: plan.id },
    include: { sessions: { include: { subject: true } } },
  });
}

export async function getLatestPlan(userId: string) {
  return prisma.studyPlan.findFirst({
    where: { userId },
    orderBy: { weekStart: "desc" },
    include: { sessions: { include: { subject: true } } },
  });
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
