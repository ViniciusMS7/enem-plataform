import { prisma } from "../config/prisma";

const LIMITE_PESQUISAS_IA = 8;
const NUM_QUESTOES_GERADAS = 5;

function normalizarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

type ConteudoGerado = {
  summary: string;
  questions: {
    statement: string;
    explanation: string;
    alternatives: { label: string; text: string; isCorrect: boolean }[];
  }[];
};

async function gerarConteudoComIA(query: string): Promise<ConteudoGerado> {
  const prompt = `
Crie material de estudo sobre o assunto: "${query}".

Responda SOMENTE com um JSON válido, no formato:

{
  "summary": "um resumo didático de 3 a 5 parágrafos sobre o assunto, explicando os conceitos principais",
  "questions": [
    {
      "statement": "enunciado de uma questão de múltipla escolha sobre o assunto",
      "explanation": "explicação curta de por que a resposta certa é essa",
      "alternatives": [
        { "label": "A", "text": "...", "isCorrect": false },
        { "label": "B", "text": "...", "isCorrect": true },
        { "label": "C", "text": "...", "isCorrect": false },
        { "label": "D", "text": "...", "isCorrect": false },
        { "label": "E", "text": "...", "isCorrect": false }
      ]
    }
  ]
}

Gere exatamente ${NUM_QUESTOES_GERADAS} questões, cada uma com exatamente 5 alternativas e só uma correta.
`.trim();

  // Google AI Studio / Gemini API — tem camada gratuita sem cartão de crédito.
  // Pegue uma chave em https://aistudio.google.com/apikey e coloque em GEMINI_API_KEY no .env
  const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY || ""}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.error("Erro da API Gemini:", JSON.stringify(data));
    throw new Error("Não foi possível gerar o conteúdo agora.");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("A IA retornou um formato inesperado. Tente pesquisar de novo.");
  }
}

export async function buscarOuGerarTopico(query: string, userId: string) {
  const slug = normalizarSlug(query);
  if (!slug) throw new Error("Pesquisa vazia");

  // 1. Já existe em cache? Devolve na hora, sem gastar IA.
  const existente = await prisma.customTopic.findUnique({
    where: { slug },
    include: { questions: { include: { alternatives: true } } },
  });
  if (existente) return { topic: existente, deCache: true };

  // 2. Não existe ainda — checa se o usuário tem pesquisas de IA disponíveis
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Usuário não encontrado");

  if (user.customSearchesUsed >= LIMITE_PESQUISAS_IA) {
    return { topic: null, deCache: false, limiteAtingido: true };
  }

  // 3. Gera com IA e salva pra virar cache pra próxima pessoa
  const gerado = await gerarConteudoComIA(query);

  const topic = await prisma.customTopic.create({
    data: {
      query,
      slug,
      summary: gerado.summary,
      questions: {
        create: gerado.questions.map((q) => ({
          statement: q.statement,
          explanation: q.explanation,
          alternatives: { create: q.alternatives },
        })),
      },
    },
    include: { questions: { include: { alternatives: true } } },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { customSearchesUsed: { increment: 1 } },
  });

  return { topic, deCache: false };
}

export async function getCustomTopicById(id: string) {
  return prisma.customTopic.findUnique({
    where: { id },
    include: { questions: { include: { alternatives: true } } },
  });
}

// "Salva" um assunto pesquisado nas matérias do usuário — idempotente,
// chamar de novo pro mesmo assunto não duplica nem dá erro.
export async function addCustomTopicForUser(userId: string, customTopicId: string) {
  const topic = await prisma.customTopic.findUnique({ where: { id: customTopicId } });
  if (!topic) throw new Error("Assunto não encontrado");

  return prisma.userCustomTopic.upsert({
    where: { userId_customTopicId: { userId, customTopicId } },
    update: {},
    create: { userId, customTopicId },
  });
}

export async function removeCustomTopicForUser(userId: string, customTopicId: string) {
  await prisma.userCustomTopic.deleteMany({ where: { userId, customTopicId } });
}

export async function listCustomTopicsForUser(userId: string) {
  const salvos = await prisma.userCustomTopic.findMany({
    where: { userId },
    include: { customTopic: { include: { questions: true } } },
    orderBy: { createdAt: "desc" },
  });
  return salvos.map((s) => s.customTopic);
}
