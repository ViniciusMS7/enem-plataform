"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getUser, clearUser, StoredUser } from "@/services/auth";
import { useToast } from "./ToastProvider";

export default function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const showToast = useToast();
  const [user, setUser] = useState<StoredUser | null>(null);

  // O layout (e esse componente) continua montado entre navegações no
  // App Router — sem isso, o menu não percebia quando o login/logout
  // mudava o localStorage. Rechecar a cada troca de rota resolve.
  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  function sair() {
    clearUser();
    showToast("Você saiu. Até a próxima!", "info");
    router.push("/");
  }

  if (!user) {
    return (
      <Link href="/login" className="relative group py-1">
        entrar
        <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
      </Link>
    );
  }

  return (
    <button
      onClick={sair}
      className="inline-flex items-center gap-1.5 relative group py-1"
      title="Sair da conta"
    >
      <LogOut size={14} /> sair
      <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
    </button>
  );
}
