// Guarda o usuário logado no localStorage do navegador.
// Simples de propósito — dá pra trocar por um Context/estado global depois.

export type StoredUser = { id: string; name: string; email: string };

const KEY = "reta-final:user";

export function saveUser(user: StoredUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  localStorage.removeItem(KEY);
}
