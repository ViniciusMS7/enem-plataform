import { Github, Linkedin } from "lucide-react";
import CountdownStamp from "@/components/CountdownStamp";

export default function Sobre() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display font-bold text-3xl mb-1">Sobre o Reta Final</h1>
        <p className="text-ink/70 leading-relaxed max-w-lg">
          Uma plataforma feita pra tirar o estudo pro ENEM do modo aleatório: marca
          o que pesa, recebe um cronograma com peso pro que você mais erra, e treina
          com simulados de verdade — cronometrados, com revisão automática dos seus erros.
        </p>
      </div>

      <div className="border-2 border-ink p-6 bg-white/40 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-1">
            desenvolvido por
          </p>
          <p className="font-display font-bold text-2xl">Vinicius Moura</p>
          <p className="text-ink/70 text-sm mt-1">
            Estudante de Engenharia de Computação, construindo esse projeto como
            prática de desenvolvimento full-stack.
          </p>

          <div className="flex gap-5 mt-4">
            <a
              href="https://github.com/ViniciusMS7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm border-b-2 border-accent hover:gap-3 transition-all"
            >
              <Github size={16} /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/vinicius-moura-9045ba351/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm border-b-2 border-accent hover:gap-3 transition-all"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>
        </div>

        <CountdownStamp />
      </div>
    </div>
  );
}
