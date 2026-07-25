"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/services/api";
import { Subject } from "@/types";
import { iconePorMateria } from "@/components/subjectIcons";

export default function EscolherSimulado() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    api.getSubjects().then(setSubjects);
  }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-4xl tracking-tight mb-2 fade-up">Simulado</h1>
      <p className="text-ink/70 mb-10 fade-up" style={{ animationDelay: "0.05s" }}>
        Escolhe a matéria pra praticar agora.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subjects.map((s, i) => {
          const Icon = iconePorMateria(s.name);
          return (
            <Link
              key={s.id}
              href={`/simulado/${s.id}`}
              className="group border-2 border-ink p-5 bg-white/40 card-lift fade-up flex items-center justify-between"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 border-2 border-ink flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="font-display font-bold">{s.name}</p>
                  <p className="font-mono text-xs text-ink/50">{s.area}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-ink/30 group-hover:text-ink group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
