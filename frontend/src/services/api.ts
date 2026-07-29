// Centraliza toda comunicação com o backend.
// Se a URL da API mudar, ou se quiser adicionar auth automático,
// só mexe aqui — nenhum componente chama fetch diretamente.

import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
  getProfile: () => request("/auth/profile"),

  getSubjects: () => request("/subjects"),
  setSubjectDifficulty: (subjectId: string, difficulty: number) =>
    request(`/subjects/${subjectId}/difficulty`, {
      method: "POST",
      body: JSON.stringify({ difficulty }),
    }),

  getQuestionsBySubject: (subjectId: string) => request(`/questions/subject/${subjectId}`),

  generatePlan: () => request("/study-plans/generate", { method: "POST" }),
  getPlan: () => request("/study-plans/user"),

  submitAttempt: (data: { questionId: string; chosenLabel: string; timeSpentSeconds?: number }) =>
    request("/attempts", { method: "POST", body: JSON.stringify(data) }),
  getReviewQuestions: () => request("/attempts/review"),

  getProgress: () => request("/progress/user"),

  searchTopic: (query: string) =>
    request("/custom-topics/search", { method: "POST", body: JSON.stringify({ query }) }),
  getCustomTopic: (id: string) => request(`/custom-topics/${id}`),
  addCustomTopic: (id: string) => request(`/custom-topics/${id}/add`, { method: "POST" }),
  removeCustomTopic: (id: string) => request(`/custom-topics/${id}/remove`, { method: "POST" }),
  getMyCustomTopics: () => request("/custom-topics/mine"),
};
