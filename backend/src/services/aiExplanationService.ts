/**
 * Isolado de propósito: se um dia você quiser trocar de provedor de IA
 * (Gemini <-> OpenAI <-> outro), só mexe neste arquivo.
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
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro da API Gemini:", JSON.stringify(data));
    return "Não foi possível gerar explicação agora.";
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  return text || "Não foi possível gerar explicação agora.";
}
