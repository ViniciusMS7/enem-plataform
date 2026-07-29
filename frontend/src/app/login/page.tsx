"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/services/api";
import { saveUser } from "@/services/auth";
import MarkerUnderline from "@/components/MarkerUnderline";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const { user, token } = await api.login({ email, password });
      saveUser(user, token);
      router.push("/materias");
    } catch (err) {
      setErro("E-mail ou senha incorretos.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-sm fade-up">
      <h1 className="font-display font-bold text-4xl tracking-tight mb-1">
        <span className="relative inline-block">
          Entrar
          <MarkerUnderline />
        </span>
      </h1>
      <p className="text-ink/70 mb-10">Bom te ver de novo.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide mb-1.5">E-mail</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-ink bg-white/60 px-3 py-2.5 focus:outline-none focus:border-accent focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide mb-1.5">Senha</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-ink bg-white/60 px-3 py-2.5 focus:outline-none focus:border-accent focus:bg-white transition-colors"
          />
        </div>

        {erro && <p className="text-incorrect text-sm">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full inline-flex items-center justify-center gap-2 font-mono text-sm bg-ink text-paper px-4 py-3.5 hover:bg-accent hover:text-ink transition-colors disabled:opacity-50"
        >
          {carregando ? "entrando..." : "entrar"}
          {!carregando && <ArrowRight size={16} />}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-mono border-b-2 border-accent">
          criar conta
        </Link>
      </p>
    </div>
  );
}
