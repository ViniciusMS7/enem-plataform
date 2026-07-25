// Centraliza toda comunicação com o backend.
// Se a URL da API mudar, ou se quiser adicionar auth automático,
// só mexe aqui — nenhum componente chama fetch diretamente.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
  return res.json();
}

export const api = {
  register: (data: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  getSubjects: () => request("/subjects"),
  setSubjectDifficulty: (subjectId: string, userId: string, difficulty: number) =>
    request(`/subjects/${subjectId}/difficulty`, {
      method: "POST",
      body: JSON.stringify({ userId, difficulty }),
    }),
  getQuestionsBySubject: (subjectId: string) => request(`/questions/subject/${subjectId}`),
  generatePlan: (userId: string) =>
    request("/study-plans/generate", { method: "POST", body: JSON.stringify({ userId }) }),
  getPlan: (userId: string) => request(`/study-plans/user/${userId}`),
  submitAttempt: (data: { userId: string; questionId: string; chosenLabel: string }) =>
    request("/attempts", { method: "POST", body: JSON.stringify(data) }),
};
