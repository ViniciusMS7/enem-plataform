"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Sparkles, Database, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { api } from "@/services/api";
import { getUser, StoredUser } from "@/services/auth";
import { useToast } from "@/components/ToastProvider";
import Loading from "@/components/Loading";

type Alternative = { id: string; label: string; text: string; isCorrect: boolean };
type Question = { id: string; statement: string; explanation: string; alternatives: Alternative[] };
type Topic = { id: string; query: string; summary: string; questions: Question[] };

// Lista grande só pra alimentar o autocomplete — não precisa bater com
// o que já existe no banco, é só sugestão de o que digitar.
const TEMAS_SUGERIDOS = [
  "Cálculo I",
  "Cálculo II",
  "Álgebra Linear",
  "Engenharia de Software",
  "Estrutura de Dados",
  "Programação Orientada a Objetos",
  "Banco de Dados",
  "Redes de Computadores",
  "Sistemas Operacionais",
  "Inteligência Artificial",
  "Machine Learning",
  "Física Quântica básica",
  "Física I - Mecânica",
  "Termodinâmica",
  "Química Orgânica",
  "Direito Constitucional",
  "Direito Penal",
  "Direito Civil",
  "Administração de Empresas",
  "Marketing Digital",
  "Contabilidade Básica",
  "Economia Brasileira",
  "Psicologia Cognitiva",
  "Estatística Aplicada",
  "Probabilidade",
  "Anatomia Humana",
  "Farmacologia básica",
  "Microbiologia",
  "Genética",
  "História do Brasil",
  "História Geral",
  "Geopolítica Mundial",
  "Filosofia Antiga",
  "Sociologia do Trabalho",
  "Concurso público - Português",
  "Concurso público - Raciocínio Lógico",
  "Inglês instrumental",
  "Segurança da Informação",
  "DevOps",
  "Design de Interfaces (UI/UX)",
];

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function Pesquisar() {
  const showToast = useToast();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [carregandoUser, setCarregandoUser] = useState(true);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [limiteAtingido, setLimiteAtingido] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [deCache, setDeCache] = useState(false);
  const [assuntosSalvos, setAssuntosSalvos] = useState<Set<string>>(new Set());
  const [salvando, setSalvando] = useState(false);

  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [respondidas, setRespondidas] = useState(0);

  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(-1);
  const caixaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getUser());
    setCarregandoUser(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    api.getMyCustomTopics().then((topicos: { id: string }[]) => {
      setAssuntosSalvos(new Set(topicos.map((t) => t.id)));
    });
  }, [user]);

  async function salvarAssunto() {
    if (!user || !topic || salvando) return;
    setSalvando(true);
    try {
      await api.addCustomTopic(topic.id);
      setAssuntosSalvos((s) => new Set(s).add(topic.id));
      showToast(`"${topic.query}" foi pras suas matérias.`, "success");
    } catch {
      showToast("Não deu pra salvar esse assunto. Tenta de novo.", "error");
    } finally {
      setSalvando(false);
    }
  }

  const sugestoesFiltradas = useMemo(() => {
    const termo = normalizar(busca.trim());
    if (!termo) return [];
    return TEMAS_SUGERIDOS.filter((t) => normalizar(t).includes(termo)).slice(0, 6);
  }, [busca]);

  // fecha o dropdown se clicar fora da caixa de busca
  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (caixaRef.current && !caixaRef.current.contains(e.target as Node)) {
        setDropdownAberto(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  async function pesquisar(termo?: string) {
    const q = (termo ?? busca).trim();
    if (!q || !user) return;

    setDropdownAberto(false);
    setCarregando(true);
    setErro(null);
    setLimiteAtingido(false);
    setTopic(null);
    setIndice(0);
    setEscolhida(null);
    setAcertos(0);
    setRespondidas(0);

    try {
      const resultado = await api.searchTopic(q);
      if (resultado.limiteAtingido) {
        setLimiteAtingido(true);
      } else {
        setTopic(resultado.topic);
        setDeCache(resultado.deCache);
      }
    } catch (e) {
      setErro("Não consegui gerar esse conteúdo agora. Tenta de novo em instantes.");
    } finally {
      setCarregando(false);
    }
  }

  function selecionarSugestao(s: string) {
    setBusca(s);
    setDropdownAberto(false);
    setIndiceAtivo(-1);
    pesquisar(s);
  }

  function aoDigitar(e: React.KeyboardEvent<HTMLInputElement>) {
    if (dropdownAberto && sugestoesFiltradas.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndiceAtivo((i) => (i + 1) % sugestoesFiltradas.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndiceAtivo((i) => (i - 1 + sugestoesFiltradas.length) % sugestoesFiltradas.length);
        return;
      }
      if (e.key === "Escape") {
        setDropdownAberto(false);
        return;
      }
      if (e.key === "Enter" && indiceAtivo >= 0) {
        e.preventDefault();
        selecionarSugestao(sugestoesFiltradas[indiceAtivo]);
        return;
      }
    }
    if (e.key === "Enter") pesquisar();
  }

  if (carregandoUser) {
    return null;
  }

  if (!user) {
    return (
      <div>
        <p className="mb-4">Você precisa criar uma conta primeiro.</p>
        <Link href="/cadastro" className="font-mono text-sm border-b-2 border-accent">
          → criar conta
        </Link>
      </div>
    );
  }

  const questao = topic?.questions[indice];

  function responder(label: string) {
    if (escolhida) return;
    setEscolhida(label);
    setRespondidas((r) => r + 1);
    const correta = questao?.alternatives.find((a) => a.isCorrect);
    if (correta?.label === label) setAcertos((a) => a + 1);
  }

  function proxima() {
    setEscolhida(null);
    setIndice((i) => i + 1);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={22} />
        <h1 className="font-display font-bold text-3xl">Pesquisar qualquer assunto</h1>
      </div>
      <p className="text-ink/70 mb-6">
        Não fica só no ENEM. Digite qualquer matéria ou tema — faculdade, concurso, curiosidade —
        e a IA monta um resumo e questões pra você estudar.
      </p>

      <div ref={caixaRef} className="relative mb-4">
        <div className="flex gap-2">
          <input
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setDropdownAberto(true);
              setIndiceAtivo(-1);
            }}
            onFocus={() => busca.trim() && setDropdownAberto(true)}
            onKeyDown={aoDigitar}
            placeholder="Ex: Cálculo I, Engenharia de Software, Direito Penal..."
            autoComplete="off"
            className="flex-1 border-2 border-ink bg-white/60 px-3 py-2 focus:outline-none focus:border-accent"
          />
          <button
            onClick={() => pesquisar()}
            disabled={carregando || !busca.trim()}
            className="inline-flex items-center gap-2 font-mono text-sm bg-ink text-paper px-4 py-2 hover:bg-accent hover:text-ink transition-colors disabled:opacity-40"
          >
            <Search size={16} /> {carregando ? "gerando..." : "pesquisar"}
          </button>
        </div>

        {dropdownAberto && sugestoesFiltradas.length > 0 && (
          <ul className="absolute z-10 top-full left-0 right-[92px] mt-1 border-2 border-ink bg-paper shadow-[4px_4px_0_0_rgba(22,35,59,1)]">
            {sugestoesFiltradas.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selecionarSugestao(s)}
                  className={`w-full text-left px-3 py-2 text-sm font-mono flex items-center gap-2 ${
                    i === indiceAtivo ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                >
                  <Search size={13} className="text-ink/40 shrink-0" />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!topic && !carregando && (
        <div className="flex gap-2 flex-wrap mb-8">
          {TEMAS_SUGERIDOS.slice(0, 5).map((s) => (
            <button
              key={s}
              onClick={() => selecionarSugestao(s)}
              className="font-mono text-xs border-2 border-ink/30 px-3 py-1.5 hover:border-ink hover:bg-accent transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {carregando && (
        <div className="border-2 border-ink p-6 bg-white/40 flex justify-center">
          <Loading label="Montando o resumo e as questões, só um instante..." />
        </div>
      )}

      {erro && <p className="text-incorrect mb-6">{erro}</p>}

      {limiteAtingido && (
        <div className="border-2 border-incorrect bg-incorrect/10 p-6">
          <p className="font-display font-bold mb-1">Limite de pesquisas atingido</p>
          <p className="text-sm text-ink/70">
            Você já usou todas as suas pesquisas de assuntos novos por enquanto. Assuntos já
            pesquisados por outras pessoas continuam disponíveis de graça — tenta um dos
            sugeridos acima.
          </p>
        </div>
      )}

      {topic && (
        <div className="space-y-6 fade-up">
          <div className="border-2 border-ink p-6 bg-white/40">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <p className="font-display font-bold text-xl">{topic.query}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1 font-mono text-xs text-ink/50">
                  <Database size={12} /> {deCache ? "resultado em cache" : "gerado agora"}
                </span>
                <button
                  onClick={salvarAssunto}
                  disabled={salvando || assuntosSalvos.has(topic.id)}
                  className={`inline-flex items-center gap-1.5 font-mono text-xs border-2 px-3 py-1.5 transition-colors ${
                    assuntosSalvos.has(topic.id)
                      ? "border-correct text-correct bg-correct/10"
                      : "border-ink hover:bg-accent disabled:opacity-50"
                  }`}
                >
                  {assuntosSalvos.has(topic.id) ? (
                    <>
                      <BookmarkCheck size={14} /> nas suas matérias
                    </>
                  ) : (
                    <>
                      <BookmarkPlus size={14} /> {salvando ? "salvando..." : "adicionar às matérias"}
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line text-ink/80">
              {topic.summary}
            </p>
          </div>

          {questao ? (
            <div className="border-2 border-ink p-6 bg-white/40" key={questao.id}>
              <p className="font-mono text-xs text-ink/50 mb-3">
                questão {indice + 1} de {topic.questions.length}
              </p>
              <p className="mb-6 leading-relaxed">{questao.statement}</p>

              <div className="space-y-2">
                {questao.alternatives.map((alt) => {
                  let cor = "border-ink hover:bg-accent hover:-translate-y-0.5";
                  if (escolhida) {
                    if (alt.isCorrect) cor = "border-correct bg-correct/20";
                    else if (alt.label === escolhida) cor = "border-incorrect bg-incorrect/20";
                    else cor = "border-ink/30 opacity-50";
                  }
                  return (
                    <button
                      key={alt.id}
                      disabled={!!escolhida}
                      onClick={() => responder(alt.label)}
                      className={`w-full text-left border-2 px-4 py-3 transition-all ${cor}`}
                    >
                      <span className="font-mono font-bold mr-2">{alt.label}</span>
                      {alt.text}
                    </button>
                  );
                })}
              </div>

              {escolhida && (
                <div className="mt-4 pt-4 border-t border-ink/20">
                  <p className="text-sm text-ink/80 mb-4">{questao.explanation}</p>
                  <button
                    onClick={proxima}
                    className="inline-flex items-center gap-2 font-mono text-sm bg-ink text-paper px-4 py-2 hover:bg-accent hover:text-ink transition-colors"
                  >
                    próxima <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-ink p-6 bg-white/40 text-center">
              <p className="font-display font-bold text-xl mb-2">
                {acertos}/{respondidas} acertos nesse assunto
              </p>
              <button
                onClick={() => {
                  setBusca("");
                  setTopic(null);
                }}
                className="inline-flex items-center gap-1 font-mono text-sm border-b-2 border-accent"
              >
                pesquisar outro assunto <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
