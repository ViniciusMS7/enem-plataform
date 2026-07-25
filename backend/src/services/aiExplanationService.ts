/**
 * Isolado de propósito: se um dia você quiser trocar de provedor de IA
 * (Anthropic <-> OpenAI <-> outro), só mexe neste arquivo.
 * O resto do sistema só chama `explainWrongAnswer` e recebe uma string.
 */

type QuestionWithAlternatives = {
  statement: string;
  alternatives: { label: string; text: string; isCorrect: boolean }[];
};

export async function explainWrongAnswer(
  question: QuestionWithAlternatives,
  chosenLabel: string
): Promise<string> {
  const correta = question.alternatives.find((a) => a.isCorrect);
  const escolhida = question.alternatives.find((a) => a.label === chosenLabel);

  const prompt = `
Questão: ${question.statement}
Alternativa correta: ${correta?.label} - ${correta?.text}
Alternativa que o aluno escolheu: ${escolhida?.label} - ${escolhida?.text}

Explique de forma curta e didática por que a alternativa correta é essa,
e por que a escolhida está errada. Fale diretamente com o aluno.
`.trim();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.AI_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro da API Anthropic:", JSON.stringify(data));
    return "Não foi possível gerar explicação agora.";
  }

  const text = data?.content?.[0]?.text;

  return text || "Não foi possível gerar explicação agora.";
}
