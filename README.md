# Plataforma de Estudos ENEM/Vestibular

Estrutura organizada por domínio, pensada pra você adicionar features
sem precisar reescrever o que já existe.

## Estrutura de pastas

```
enem-platform/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # modelagem do banco (já pronta)
│   └── src/
│       ├── controllers/            # recebe request, chama service, devolve response
│       ├── services/                # regra de negócio (spaced repetition, IA, etc)
│       ├── routes/                  # define os endpoints (/users, /questions...)
│       ├── models/                  # tipos/DTOs auxiliares (se não usar só Prisma)
│       ├── middlewares/            # auth, validação, tratamento de erro
│       ├── jobs/                    # tarefas agendadas (ex: gerar cronograma da semana)
│       ├── config/                  # conexão com banco, variáveis de ambiente
│       └── index.ts                 # ponto de entrada do servidor
│
├── frontend/
│   └── src/
│       ├── app/                     # páginas (Next.js App Router)
│       ├── components/              # componentes reutilizáveis (Timeline, QuestionCard...)
│       ├── hooks/                   # lógica reutilizável (useStudyPlan, useAttempts...)
│       ├── services/                # chamadas de API (fetch pro backend)
│       ├── types/                   # tipos TypeScript compartilhados
│       └── styles/                  # Tailwind config e globals
│
└── docs/                            # anotações técnicas, decisões de arquitetura
```

## Por que essa organização

- **Separação por responsabilidade**: cada camada faz uma coisa só.
  Trocar o banco, o front, ou adicionar uma IA diferente não obriga
  mexer nas outras camadas.
- **`services/` é o coração**: toda regra nova (novo algoritmo de
  cronograma, nova forma de gerar explicação) entra aqui, isolada.
- **Banco pensado pra crescer**: `Subject` → `Topic` → `Question` já
  suporta você adicionar novas matérias/temas sem alterar código, só
  inserindo linhas novas.

## Ordem sugerida de implementação

1. `backend`: rodar `npx prisma migrate dev` pra criar as tabelas
2. Cadastro de usuário + login (`controllers/authController`)
3. CRUD de `Subject`/`UserSubject` (aluno marca dificuldades)
4. `services/studyPlanService.ts`: lógica de spaced repetition
5. Popular `Question`/`Alternative` com questões reais do ENEM
6. Tela de simulado no frontend
7. Só por último: plugar API de IA em `services/aiExplanationService.ts`

## Variáveis de ambiente (backend/.env)

```
DATABASE_URL="postgresql://user:senha@localhost:5432/enem_platform"
JWT_SECRET="troque_isso"
AI_API_KEY="sua_chave_aqui"
```
