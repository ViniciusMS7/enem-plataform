import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Populando banco...");

  // ---------------- MATÉRIAS ----------------
  const matematica = await prisma.subject.create({
    data: { name: "Matemática", area: "Matemática e suas Tecnologias" },
  });
  const portugues = await prisma.subject.create({
    data: { name: "Português", area: "Linguagens e Códigos" },
  });
  const quimica = await prisma.subject.create({
    data: { name: "Química", area: "Ciências da Natureza" },
  });
  const historia = await prisma.subject.create({
    data: { name: "História", area: "Ciências Humanas" },
  });

  // ---------------- TÓPICOS ----------------
  const funcoes = await prisma.topic.create({
    data: { name: "Funções", subjectId: matematica.id },
  });
  const porcentagem = await prisma.topic.create({
    data: { name: "Porcentagem e Estatística", subjectId: matematica.id },
  });
  const geometria = await prisma.topic.create({
    data: { name: "Geometria", subjectId: matematica.id },
  });

  const interpretacao = await prisma.topic.create({
    data: { name: "Interpretação de Texto", subjectId: portugues.id },
  });
  const gramatica = await prisma.topic.create({
    data: { name: "Gramática", subjectId: portugues.id },
  });
  const literatura = await prisma.topic.create({
    data: { name: "Literatura", subjectId: portugues.id },
  });

  const estequiometria = await prisma.topic.create({
    data: { name: "Estequiometria", subjectId: quimica.id },
  });
  const organica = await prisma.topic.create({
    data: { name: "Química Orgânica", subjectId: quimica.id },
  });

  const brasilColonia = await prisma.topic.create({
    data: { name: "Brasil Colônia", subjectId: historia.id },
  });
  const republica = await prisma.topic.create({
    data: { name: "República e Getúlio Vargas", subjectId: historia.id },
  });

  // ---------------- QUESTÕES: MATEMÁTICA ----------------
  await prisma.question.create({
    data: {
      statement:
        "Uma função f(x) = 2x + 3 representa o custo de produção de x unidades de um produto, em reais. Qual o custo de produzir 10 unidades?",
      year: 2023,
      subjectId: matematica.id,
      topicId: funcoes.id,
      difficulty: 2,
      alternatives: {
        create: [
          { label: "A", text: "R$ 20", isCorrect: false },
          { label: "B", text: "R$ 23", isCorrect: false },
          { label: "C", text: "R$ 25", isCorrect: false },
          { label: "D", text: "R$ 30", isCorrect: false },
          { label: "E", text: "R$ 23,00 (2×10+3)", isCorrect: true },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "Uma loja aumentou o preço de um produto em 20% e, um mês depois, deu um desconto de 20% sobre o novo valor. Em relação ao preço original, o produto ficou:",
      year: 2022,
      subjectId: matematica.id,
      topicId: porcentagem.id,
      difficulty: 3,
      alternatives: {
        create: [
          { label: "A", text: "Com o mesmo preço original", isCorrect: false },
          { label: "B", text: "4% mais barato que o original", isCorrect: true },
          { label: "C", text: "4% mais caro que o original", isCorrect: false },
          { label: "D", text: "20% mais barato que o original", isCorrect: false },
          { label: "E", text: "40% mais barato que o original", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "Um terreno retangular tem 30 metros de comprimento por 20 metros de largura. Qual a área total desse terreno, em metros quadrados?",
      year: 2021,
      subjectId: matematica.id,
      topicId: geometria.id,
      difficulty: 1,
      alternatives: {
        create: [
          { label: "A", text: "50 m²", isCorrect: false },
          { label: "B", text: "100 m²", isCorrect: false },
          { label: "C", text: "300 m²", isCorrect: false },
          { label: "D", text: "600 m²", isCorrect: true },
          { label: "E", text: "900 m²", isCorrect: false },
        ],
      },
    },
  });

  // ---------------- QUESTÕES: PORTUGUÊS ----------------
  await prisma.question.create({
    data: {
      statement:
        "Em um texto, quando o autor usa uma palavra com sentido diferente do literal para causar um efeito de estilo, esse recurso é chamado de:",
      year: 2022,
      subjectId: portugues.id,
      topicId: interpretacao.id,
      difficulty: 3,
      alternatives: {
        create: [
          { label: "A", text: "Denotação", isCorrect: false },
          { label: "B", text: "Conotação", isCorrect: true },
          { label: "C", text: "Homonímia", isCorrect: false },
          { label: "D", text: "Paronímia", isCorrect: false },
          { label: "E", text: "Polissemia restrita", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "Na frase 'Havia muitos alunos na sala, mas apenas um fez a pergunta certa', a palavra 'mas' estabelece entre as orações uma relação de:",
      year: 2020,
      subjectId: portugues.id,
      topicId: gramatica.id,
      difficulty: 2,
      alternatives: {
        create: [
          { label: "A", text: "Adição", isCorrect: false },
          { label: "B", text: "Explicação", isCorrect: false },
          { label: "C", text: "Oposição/contraste", isCorrect: true },
          { label: "D", text: "Conclusão", isCorrect: false },
          { label: "E", text: "Comparação", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "O movimento literário brasileiro marcado pela Semana de Arte Moderna de 1922, que rompeu com padrões clássicos e valorizou a linguagem coloquial, é conhecido como:",
      year: 2019,
      subjectId: portugues.id,
      topicId: literatura.id,
      difficulty: 2,
      alternatives: {
        create: [
          { label: "A", text: "Romantismo", isCorrect: false },
          { label: "B", text: "Realismo", isCorrect: false },
          { label: "C", text: "Modernismo", isCorrect: true },
          { label: "D", text: "Parnasianismo", isCorrect: false },
          { label: "E", text: "Barroco", isCorrect: false },
        ],
      },
    },
  });

  // ---------------- QUESTÕES: QUÍMICA ----------------
  await prisma.question.create({
    data: {
      statement:
        "Na reação de combustão completa do metano (CH₄ + 2O₂ → CO₂ + 2H₂O), quantos mols de O₂ são necessários para queimar completamente 3 mols de CH₄?",
      year: 2023,
      subjectId: quimica.id,
      topicId: estequiometria.id,
      difficulty: 3,
      alternatives: {
        create: [
          { label: "A", text: "2 mols", isCorrect: false },
          { label: "B", text: "3 mols", isCorrect: false },
          { label: "C", text: "5 mols", isCorrect: false },
          { label: "D", text: "6 mols", isCorrect: true },
          { label: "E", text: "9 mols", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Os hidrocarbonetos são compostos formados basicamente por átomos de:",
      year: 2021,
      subjectId: quimica.id,
      topicId: organica.id,
      difficulty: 1,
      alternatives: {
        create: [
          { label: "A", text: "Carbono e hidrogênio", isCorrect: true },
          { label: "B", text: "Carbono e oxigênio", isCorrect: false },
          { label: "C", text: "Hidrogênio e nitrogênio", isCorrect: false },
          { label: "D", text: "Oxigênio e nitrogênio", isCorrect: false },
          { label: "E", text: "Carbono e enxofre", isCorrect: false },
        ],
      },
    },
  });

  // ---------------- QUESTÕES: HISTÓRIA ----------------
  await prisma.question.create({
    data: {
      statement:
        "O sistema econômico predominante no Brasil Colônia, baseado na grande propriedade rural, na monocultura voltada à exportação e no trabalho escravo, é conhecido como:",
      year: 2022,
      subjectId: historia.id,
      topicId: brasilColonia.id,
      difficulty: 2,
      alternatives: {
        create: [
          { label: "A", text: "Sistema de capitanias hereditárias", isCorrect: false },
          { label: "B", text: "Plantation", isCorrect: true },
          { label: "C", text: "Bandeirismo", isCorrect: false },
          { label: "D", text: "Sesmaria", isCorrect: false },
          { label: "E", text: "Feudalismo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "O período do governo de Getúlio Vargas entre 1937 e 1945, marcado pelo fechamento do Congresso e centralização do poder, ficou conhecido como:",
      year: 2020,
      subjectId: historia.id,
      topicId: republica.id,
      difficulty: 2,
      alternatives: {
        create: [
          { label: "A", text: "Era Vargas", isCorrect: false },
          { label: "B", text: "República Velha", isCorrect: false },
          { label: "C", text: "Estado Novo", isCorrect: true },
          { label: "D", text: "Nova República", isCorrect: false },
          { label: "E", text: "Governo Provisório", isCorrect: false },
        ],
      },
    },
  });

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
