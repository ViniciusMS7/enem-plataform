// Guarda o usuário logado e o token de sessão no localStorage do navegador.
// Simples de propósito — dá pra trocar por um Context/estado global depois.

export type StoredUser = { id: string; name: string; email: string };

const USER_KEY = "reta-final:user";
const TOKEN_KEY = "reta-final:token";

export function saveUser(user: StoredUser, token: string) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
