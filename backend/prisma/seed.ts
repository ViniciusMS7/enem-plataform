import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Populando banco...");

  // Limpa dados do seed anterior antes de recriar, pra poder rodar
  // "npx prisma db seed" mais de uma vez sem esbarrar em unique constraint
  // (ex: Subject.name). Respeita a ordem das foreign keys: filhos primeiro.
  await prisma.attempt.deleteMany({});
  await prisma.alternative.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.studySession.deleteMany({});
  await prisma.progress.deleteMany({});
  await prisma.userSubject.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.subject.deleteMany({});
  console.log("Dados antigos de matérias/questões limpos.");

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
  const fisica = await prisma.subject.create({
    data: { name: "Física", area: "Ciências da Natureza" },
  });
  const biologia = await prisma.subject.create({
    data: { name: "Biologia", area: "Ciências da Natureza" },
  });
  const geografia = await prisma.subject.create({
    data: { name: "Geografia", area: "Ciências Humanas" },
  });
  const filosofia = await prisma.subject.create({
    data: { name: "Filosofia", area: "Ciências Humanas" },
  });
  const sociologia = await prisma.subject.create({
    data: { name: "Sociologia", area: "Ciências Humanas" },
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

  const mecanica = await prisma.topic.create({
    data: { name: "Mecânica", subjectId: fisica.id },
  });
  const eletricidade = await prisma.topic.create({
    data: { name: "Eletricidade", subjectId: fisica.id },
  });

  const ecologia = await prisma.topic.create({
    data: { name: "Ecologia", subjectId: biologia.id },
  });
  const genetica = await prisma.topic.create({
    data: { name: "Genética", subjectId: biologia.id },
  });

  const urbanizacao = await prisma.topic.create({
    data: { name: "Urbanização", subjectId: geografia.id },
  });
  const climatologia = await prisma.topic.create({
    data: { name: "Climatologia", subjectId: geografia.id },
  });

  const eticaFilosofia = await prisma.topic.create({
    data: { name: "Ética", subjectId: filosofia.id },
  });
  const filosofiaPolitica = await prisma.topic.create({
    data: { name: "Filosofia Política", subjectId: filosofia.id },
  });

  const movimentosSociais = await prisma.topic.create({
    data: { name: "Movimentos Sociais", subjectId: sociologia.id },
  });
  const trabalhoSociologia = await prisma.topic.create({
    data: { name: "Trabalho e Sociedade", subjectId: sociologia.id },
  });

  // ---------------- QUESTÕES: MATEMÁTICA ----------------
  await prisma.question.create({
    data: {
      statement:
        "Uma loja especializada em bicicletas registrou suas vendas ao longo dos quatro trimestres de 2023, conforme o gráfico de barras a seguir. O dono da loja quer entender o comportamento das vendas para planejar a compra de estoque do próximo ano.\nEle percebeu que, entre dois trimestres consecutivos, houve o maior salto percentual de crescimento nas vendas — maior até do que o salto entre o 3º e o 4º trimestre.\nCom base nos dados do gráfico, entre quais trimestres ocorreu o maior crescimento percentual nas vendas?",
      imageUrl: "/questions/grafico-vendas-bicicletas.svg",
      year: 2023,
      subjectId: matematica.id,
      topicId: porcentagem.id,
      difficulty: 3,
      explanation:
        "Calculando o crescimento percentual entre cada par consecutivo: do 1º pro 2º trimestre, (140-90)/90 ≈ 55,6%. Do 2º pro 3º, houve queda (não crescimento). Do 3º pro 4º, (180-120)/120 = 50%. Como 55,6% > 50%, o maior salto percentual foi do 1º pro 2º trimestre — mesmo o 4º trimestre tendo o maior valor absoluto.",
      alternatives: {
        create: [
          { label: "A", text: "1º e 2º trimestres", isCorrect: true },
          { label: "B", text: "2º e 3º trimestres", isCorrect: false },
          { label: "C", text: "3º e 4º trimestres", isCorrect: false },
          { label: "D", text: "Não é possível calcular sem os valores exatos", isCorrect: false },
          { label: "E", text: "O crescimento percentual foi igual em todos os trimestres", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "Um lojista, buscando aumentar a percepção de valor de um produto antes de uma grande liquidação, aumentou o preço de um televisor em 20% em relação ao valor original. Um mês depois, durante a campanha promocional, anunciou um desconto de 20% sobre esse novo valor, alegando ser 'a maior queda de preço do ano'.\nUm cliente, desconfiado da propaganda, resolveu calcular se o preço final ficou realmente mais barato do que o valor cobrado antes de toda a manobra comercial.\nEm relação ao preço original (antes do aumento), o valor final do televisor, depois do aumento seguido do desconto, ficou:",
      year: 2022,
      subjectId: matematica.id,
      topicId: porcentagem.id,
      difficulty: 3,
      explanation:
        "Pega um preço fácil pra testar, tipo R$100. Depois do aumento de 20%: R$120. Depois do desconto de 20% sobre R$120 (não sobre os R$100 originais!): R$120 - 24 = R$96. Ou seja, 4% mais barato que o original. O erro clássico é achar que os dois 20% se cancelam.",
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
        "Uma prefeitura pretende revitalizar um terreno retangular abandonado no centro da cidade, transformando-o em uma praça pública com piso intertravado. Segundo a planta enviada pela empresa de engenharia, o terreno mede 30 metros de comprimento por 20 metros de largura.\nPara o edital de licitação, a prefeitura precisa informar às empresas interessadas a área total que deverá ser pavimentada, para que elas possam calcular a quantidade de material necessário e o orçamento da obra.\nQual é a área total desse terreno, em metros quadrados?",
      year: 2021,
      subjectId: matematica.id,
      topicId: geometria.id,
      difficulty: 1,
      explanation:
        "Área do retângulo é comprimento × largura: 30 × 20 = 600 m². Cuidado pra não confundir com perímetro (que seria 2×(30+20) = 100 m).",
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
        "A tirinha a seguir retrata uma situação comum no ambiente de trabalho contemporâneo: o contraste entre a linguagem formal, esperada em determinados contextos profissionais, e a linguagem informal, usada no dia a dia entre colegas.\nNo último quadrinho, o personagem reage à fala anterior minimizando a diferença entre os dois registros de linguagem, tratando a formalidade como um mero 'jeito de falar' entre outros possíveis.\nConsiderando os conceitos de variação linguística, o humor da tirinha é construído principalmente por meio:",
      imageUrl: "/questions/tirinha-linguagem-formal.svg",
      year: 2022,
      subjectId: portugues.id,
      topicId: interpretacao.id,
      difficulty: 3,
      explanation:
        "O humor nasce do choque entre dois registros de linguagem (formal x informal) empregados pelos personagens em um mesmo contexto comunicativo. Não se trata de um erro gramatical, mas de adequação da linguagem à situação — conceito central da sociolinguística cobrado com frequência no ENEM. A resposta certa evita confundir 'variação linguística' com 'erro de português'.",
      alternatives: {
        create: [
          { label: "A", text: "de um erro gramatical cometido por um dos personagens", isCorrect: false },
          {
            label: "B",
            text: "do contraste entre registros de linguagem adequados a contextos comunicativos distintos",
            isCorrect: true,
          },
          { label: "C", text: "do uso exclusivo de gírias regionais desconhecidas do leitor", isCorrect: false },
          { label: "D", text: "da ausência de pontuação nas falas dos personagens", isCorrect: false },
          { label: "E", text: "de uma crítica à ortografia oficial da língua portuguesa", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "Durante uma reunião de conselho de classe, a coordenadora pedagógica apresentou um levantamento sobre o desempenho da turma: 'Havia muitos alunos na sala, mas apenas um fez a pergunta certa durante toda a explicação do conteúdo.' Um professor, analisando a frase depois, chamou atenção para o papel que a palavra 'mas' desempenha na construção do sentido.\nNessa frase, a palavra 'mas' estabelece entre as orações uma relação de:",
      year: 2020,
      subjectId: portugues.id,
      topicId: gramatica.id,
      difficulty: 2,
      explanation:
        "'Mas' é uma conjunção adversativa clássica — ela sempre marca contraste/oposição entre duas ideias. Aqui, contrasta 'muitos alunos' com 'apenas um' que fez a pergunta certa.",
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
        "Em fevereiro de 1922, um grupo de escritores, artistas plásticos e músicos brasileiros organizou, no Theatro Municipal de São Paulo, uma série de exposições, leitura de poemas e apresentações musicais que provocaram forte reação do público da época, acostumado a padrões estéticos mais tradicionais. O evento reunia nomes que buscavam romper com as regras rígidas de composição então vigentes e aproximar a literatura da língua realmente falada pelos brasileiros, incorporando temas nacionais e uma linguagem mais coloquial.\nEsse evento é considerado o marco inicial de qual movimento literário brasileiro?",
      year: 2019,
      subjectId: portugues.id,
      topicId: literatura.id,
      difficulty: 2,
      explanation:
        "A Semana de Arte Moderna de 1922 (em São Paulo) é o marco inicial do Modernismo brasileiro — movimento que rompeu com as regras rígidas do Parnasianismo e passou a valorizar a língua falada do dia a dia.",
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
        "Um engenheiro responsável pelo dimensionamento de um sistema de aquecimento residencial a gás precisa calcular a quantidade de oxigênio necessária para garantir a combustão completa do metano (CH₄), principal componente do gás natural, evitando a formação de monóxido de carbono — um gás tóxico gerado quando a combustão é incompleta.\nA equação química balanceada da combustão completa do metano é: CH₄ + 2O₂ → CO₂ + 2H₂O.\nSe o sistema consome 3 mols de CH₄ por hora em operação plena, quantos mols de O₂ são necessários, no mínimo, para garantir a combustão completa nesse período?",
      year: 2023,
      subjectId: quimica.id,
      topicId: estequiometria.id,
      difficulty: 3,
      explanation:
        "A equação já balanceada diz que 1 mol de CH₄ precisa de 2 mols de O₂. Então, por regra de três: 3 mols de CH₄ × 2 = 6 mols de O₂.",
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
      statement:
        "O Brasil é um dos maiores produtores mundiais de etanol combustível, obtido principalmente a partir da fermentação da cana-de-açúcar. Diferente da gasolina, que é uma mistura complexa de hidrocarbonetos (compostos formados só por carbono e hidrogênio), o etanol apresenta em sua estrutura um grupo funcional adicional, responsável por várias de suas propriedades características, como a alta solubilidade em água.\nA figura a seguir representa a fórmula estrutural simplificada do etanol.\nCom base na estrutura representada, o grupo funcional que diferencia o etanol de um hidrocarboneto comum, e que é responsável por sua solubilidade em água, é o grupo:",
      imageUrl: "/questions/estrutura-etanol.svg",
      year: 2021,
      subjectId: quimica.id,
      topicId: organica.id,
      difficulty: 2,
      explanation:
        "O grupo -OH ligado a um carbono saturado é a hidroxila, característica da função álcool. É esse grupo, ausente nos hidrocarbonetos puros (que têm só C e H), que permite ao etanol formar pontes de hidrogênio com a água — daí sua alta solubilidade, diferente da gasolina.",
      alternatives: {
        create: [
          { label: "A", text: "Carbonila", isCorrect: false },
          { label: "B", text: "Carboxila", isCorrect: false },
          { label: "C", text: "Hidroxila (-OH)", isCorrect: true },
          { label: "D", text: "Amina", isCorrect: false },
          { label: "E", text: "Nitro", isCorrect: false },
        ],
      },
    },
  });

  // ---------------- QUESTÕES: HISTÓRIA ----------------
  await prisma.question.create({
    data: {
      statement:
        "Durante os séculos XVI e XVII, a economia da colônia portuguesa na América esteve fortemente organizada em torno da produção açucareira. Grandes propriedades rurais concentravam a produção de um único produto voltado quase que exclusivamente ao mercado europeu, sustentadas pelo trabalho compulsório de africanos escravizados. O esquema a seguir representa, de forma simplificada, o fluxo desse sistema produtivo, desde a produção no engenho até o consumo final na metrópole.\nEsse conjunto de características — grande propriedade rural, monocultura para exportação e trabalho escravo — é conhecido na historiografia como:",
      imageUrl: "/questions/esquema-ciclo-acucar.svg",
      year: 2022,
      subjectId: historia.id,
      topicId: brasilColonia.id,
      difficulty: 2,
      explanation:
        "Plantation é o nome do sistema que combina três características: latifúndio (grande propriedade), monocultura voltada pra exportação, e mão de obra escrava. Foi a base da economia açucareira e depois cafeeira no Brasil.",
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
        "Em 10 de novembro de 1937, o presidente Getúlio Vargas anunciou, em cadeia de rádio, a outorga de uma nova Constituição e o fechamento do Congresso Nacional, sob a justificativa de conter uma suposta ameaça comunista ao país — o chamado Plano Cohen, hoje amplamente considerado forjado pelos próprios apoiadores do governo para legitimar o golpe. A partir desse momento, o Brasil entrou em um período de forte centralização do poder no Executivo, censura à imprensa e perseguição a opositores políticos, que se estenderia até 1945.\nEsse período específico do governo Vargas, entre 1937 e 1945, é conhecido como:",
      year: 2020,
      subjectId: historia.id,
      topicId: republica.id,
      difficulty: 2,
      explanation:
        "Estado Novo é o nome específico dado à fase ditatorial da Era Vargas (1937-1945), quando ele fechou o Congresso e governou por decreto. 'Era Vargas' é o termo mais amplo, que cobre todo o período 1930-1945 — por isso não é a resposta mais precisa aqui.",
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

  // ---------------- QUESTÕES: FÍSICA ----------------
  await prisma.question.create({
    data: {
      statement:
        "Em um teste de segurança veicular, um carro de 1000 kg trafega a 20 m/s (72 km/h) quando o motorista aciona os freios bruscamente, parando completamente o veículo em 4 segundos, de forma uniforme.\nA equipe de engenharia precisa calcular a intensidade da força média de frenagem aplicada pelo sistema de freios para avaliar se ele atende às normas de segurança.\nConsiderando que a desaceleração foi constante, qual é a intensidade aproximada da força média de frenagem aplicada ao carro?",
      year: 2023,
      subjectId: fisica.id,
      topicId: mecanica.id,
      difficulty: 3,
      explanation:
        "Primeiro, a desaceleração: a = Δv/Δt = 20/4 = 5 m/s². Depois, pela 2ª Lei de Newton, F = m×a = 1000 × 5 = 5000 N. O erro comum é esquecer de calcular a aceleração antes e tentar usar a velocidade direto na fórmula da força.",
      alternatives: {
        create: [
          { label: "A", text: "500 N", isCorrect: false },
          { label: "B", text: "1000 N", isCorrect: false },
          { label: "C", text: "4000 N", isCorrect: false },
          { label: "D", text: "5000 N", isCorrect: true },
          { label: "E", text: "20000 N", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "Uma família decidiu substituir todas as lâmpadas incandescentes de 60 W de sua casa por lâmpadas de LED de 9 W, que produzem luminosidade equivalente. A residência tem 10 lâmpadas que ficam acesas em média 5 horas por dia.\nSabendo que a concessionária de energia cobra R$ 0,80 por kWh consumido, a família quer estimar quanto vai economizar por mês (considere 30 dias) só com a troca dessas lâmpadas.\nQual é a economia mensal aproximada obtida com a substituição das 10 lâmpadas incandescentes pelas de LED?",
      year: 2022,
      subjectId: fisica.id,
      topicId: eletricidade.id,
      difficulty: 3,
      explanation:
        "Consumo incandescente: 10 × 60 W = 600 W = 0,6 kW; por dia: 0,6 × 5h = 3 kWh; por mês: 3 × 30 = 90 kWh. Consumo LED: 10 × 9 W = 90 W = 0,09 kW; por dia: 0,09 × 5h = 0,45 kWh; por mês: 0,45 × 30 = 13,5 kWh. Diferença: 90 - 13,5 = 76,5 kWh. Em reais: 76,5 × R$0,80 = R$61,20.",
      alternatives: {
        create: [
          { label: "A", text: "R$ 6,12", isCorrect: false },
          { label: "B", text: "R$ 12,00", isCorrect: false },
          { label: "C", text: "R$ 61,20", isCorrect: true },
          { label: "D", text: "R$ 72,00", isCorrect: false },
          { label: "E", text: "R$ 90,00", isCorrect: false },
        ],
      },
    },
  });

  // ---------------- QUESTÕES: BIOLOGIA ----------------
  await prisma.question.create({
    data: {
      statement:
        "Em um lago artificial usado para pesca esportiva, pesquisadores introduziram uma espécie de peixe carnívoro não nativa para 'melhorar' a experiência dos pescadores. Poucos anos depois, notaram um declínio acentuado na população de peixes herbívoros nativos e, paradoxalmente, um crescimento descontrolado de algas na superfície da água, prejudicando a qualidade do ambiente aquático.\nCom base nos conceitos de cadeia alimentar e equilíbrio ecológico, a explicação mais provável para o crescimento das algas, após a introdução do predador não nativo, é que:",
      year: 2022,
      subjectId: biologia.id,
      topicId: ecologia.id,
      difficulty: 3,
      explanation:
        "O predador introduzido reduziu a população de peixes herbívoros, que antes controlavam naturalmente as algas ao se alimentar delas. Com menos herbívoros, as algas ficaram sem controle biológico e proliferaram — um efeito em cascata clássico de desequilíbrio de cadeia alimentar causado por espécie invasora.",
      alternatives: {
        create: [
          {
            label: "A",
            text: "o predador introduzido reduziu os herbívoros que controlavam as algas, gerando um efeito cascata na cadeia alimentar",
            isCorrect: true,
          },
          { label: "B", text: "as algas passaram a se alimentar diretamente do peixe predador", isCorrect: false },
          { label: "C", text: "o novo predador fertilizou a água com seus excrementos, sem relação com os herbívoros", isCorrect: false },
          { label: "D", text: "a introdução da espécie não teve nenhum efeito sobre a cadeia alimentar do lago", isCorrect: false },
          { label: "E", text: "as algas são produtoras primárias e, por isso, nunca sofrem influência de predadores", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "Um casal, ambos com visão normal, teve um filho com daltonismo — condição genética recessiva ligada ao cromossomo X. Curiosos, eles procuraram um geneticista para entender como isso foi possível, já que nenhum dos dois apresenta a condição.\nO geneticista explicou que isso ocorre porque a mãe, mesmo enxergando normalmente, pode carregar o alelo recessivo em um dos seus dois cromossomos X sem manifestar a doença.\nCom base nesse padrão de herança ligada ao sexo, a situação genética mais provável da mãe é a de:",
      year: 2021,
      subjectId: biologia.id,
      topicId: genetica.id,
      difficulty: 3,
      explanation:
        "Como o daltonismo é recessivo e ligado ao X, um filho afeitado (XdY) precisa ter recebido o alelo Xd da mãe. Se a mãe enxerga normalmente mas carrega o alelo, ela é heterozigota (portadora), com genótipo XXd — um X normal e um X com o alelo recessivo. O pai, com visão normal, tem genótipo XY (normal), contribuindo com o Y para o filho.",
      alternatives: {
        create: [
          { label: "A", text: "portadora heterozigota (XXd), sem manifestar a condição", isCorrect: true },
          { label: "B", text: "homozigota recessiva (XdXd), devendo manifestar daltonismo", isCorrect: false },
          { label: "C", text: "homozigota dominante (XX), sem carregar o alelo recessivo", isCorrect: false },
          { label: "D", text: "portadora do alelo no cromossomo Y", isCorrect: false },
          { label: "E", text: "afetada, mas com manifestação apenas parcial da condição", isCorrect: false },
        ],
      },
    },
  });

  // ---------------- QUESTÕES: GEOGRAFIA ----------------
  await prisma.question.create({
    data: {
      statement:
        "Nas últimas décadas, diversas cidades brasileiras de médio porte passaram por um processo acelerado de expansão urbana sem planejamento adequado, resultando na ocupação de áreas de risco (encostas, margens de rios) por população de baixa renda, enquanto bairros centrais bem infraestruturados concentram serviços e valorização imobiliária.\nEsse fenômeno, comum em cidades de países em desenvolvimento, é conhecido na Geografia Urbana como:",
      year: 2022,
      subjectId: geografia.id,
      topicId: urbanizacao.id,
      difficulty: 2,
      explanation:
        "Segregação socioespacial é o conceito que descreve exatamente essa divisão desigual do espaço urbano, em que grupos de renda mais baixa são empurrados para áreas periféricas ou de risco, enquanto a infraestrutura urbana se concentra nas áreas mais valorizadas — reforçando desigualdades sociais no espaço da cidade.",
      alternatives: {
        create: [
          { label: "A", text: "Conurbação", isCorrect: false },
          { label: "B", text: "Segregação socioespacial", isCorrect: true },
          { label: "C", text: "Êxodo rural", isCorrect: false },
          { label: "D", text: "Gentrificação total", isCorrect: false },
          { label: "E", text: "Metropolização compacta", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "Um agricultor do interior do Nordeste brasileiro relata que, nos últimos anos, o regime de chuvas da região tem ficado ainda mais irregular, com períodos de seca mais longos intercalados por chuvas intensas e concentradas, dificultando o planejamento do plantio. Ele associa essa mudança tanto a fatores climáticos globais quanto às características históricas do clima semiárido da região.\nO clima predominante na região onde esse agricultor vive, caracterizado por baixos índices pluviométricos e chuvas irregulares concentradas em curtos períodos, é classificado como:",
      year: 2021,
      subjectId: geografia.id,
      topicId: climatologia.id,
      difficulty: 2,
      explanation:
        "O clima semiárido é a classificação correta para o sertão nordestino: baixos índices de chuva (geralmente abaixo de 800mm/ano), irregularidade pluviométrica e chuvas concentradas em curtos períodos do ano, resultando na vegetação de caatinga adaptada à escassez de água.",
      alternatives: {
        create: [
          { label: "A", text: "Equatorial úmido", isCorrect: false },
          { label: "B", text: "Tropical de altitude", isCorrect: false },
          { label: "C", text: "Semiárido", isCorrect: true },
          { label: "D", text: "Subtropical", isCorrect: false },
          { label: "E", text: "Tropical litorâneo", isCorrect: false },
        ],
      },
    },
  });

  // ---------------- QUESTÕES: FILOSOFIA ----------------
  await prisma.question.create({
    data: {
      statement:
        "Um funcionário público percebe que poderia desviar uma pequena quantia de dinheiro de um projeto sem que ninguém jamais descobrisse, já que os controles de fiscalização daquele setor são falhos. Mesmo tendo certeza da impunidade, ele decide não realizar o desvio, refletindo que agiria da mesma forma mesmo que ninguém estivesse observando, porque considera esse tipo de ação errada em si mesma, independentemente das consequências ou de ser descoberto.\nA postura desse funcionário, que julga a ação como certa ou errada em si mesma e não pelas suas consequências, está mais alinhada com a corrente ética conhecida como:",
      year: 2022,
      subjectId: filosofia.id,
      topicId: eticaFilosofia.id,
      difficulty: 3,
      explanation:
        "A ética deontológica (associada a Kant) julga a moralidade de uma ação com base em deveres e princípios, independentemente das consequências — diferente do utilitarismo, que avalia a ação pelo resultado que ela produz (maior bem para o maior número de pessoas). Como o funcionário age por princípio, mesmo sem risco de punição, a postura é deontológica.",
      alternatives: {
        create: [
          { label: "A", text: "Utilitarismo, que avalia a ação pelas suas consequências", isCorrect: false },
          { label: "B", text: "Ética deontológica, que avalia a ação em si, por dever moral", isCorrect: true },
          { label: "C", text: "Hedonismo, que busca o prazer como fim último", isCorrect: false },
          { label: "D", text: "Relativismo moral, que nega critérios universais de certo e errado", isCorrect: false },
          { label: "E", text: "Niilismo, que nega qualquer valor moral às ações humanas", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "No século XVII, o filósofo Thomas Hobbes defendeu que, em um hipotético 'estado de natureza' anterior à formação da sociedade civil, os seres humanos viveriam em constante conflito uns com os outros na disputa por recursos escassos, numa condição que ele descreveu como guerra de todos contra todos. Para escapar desse cenário, os indivíduos abririam mão de parte de sua liberdade em favor de uma autoridade soberana, capaz de garantir ordem e segurança.\nEsse acordo hipotético entre os indivíduos, que dá origem ao Estado e à autoridade política segundo Hobbes, é conhecido na filosofia política como:",
      year: 2020,
      subjectId: filosofia.id,
      topicId: filosofiaPolitica.id,
      difficulty: 2,
      explanation:
        "Contrato social é o conceito central da filosofia política moderna (usado por Hobbes, Locke e Rousseau, cada um com uma visão diferente) que explica a origem do Estado como um acordo entre indivíduos que abrem mão de parte de sua liberdade natural em troca de ordem, segurança e proteção mútua.",
      alternatives: {
        create: [
          { label: "A", text: "Contrato social", isCorrect: true },
          { label: "B", text: "Materialismo histórico", isCorrect: false },
          { label: "C", text: "Alegoria da caverna", isCorrect: false },
          { label: "D", text: "Imperativo categórico", isCorrect: false },
          { label: "E", text: "Dialética hegeliana", isCorrect: false },
        ],
      },
    },
  });

  // ---------------- QUESTÕES: SOCIOLOGIA ----------------
  await prisma.question.create({
    data: {
      statement:
        "Ao longo do século XX, trabalhadores em diversos países se organizaram coletivamente para reivindicar melhores condições de trabalho, redução da jornada e direitos trabalhistas, formando entidades que negociavam diretamente com patrões e Estado em nome de categorias inteiras de trabalhadores, e não apenas de indivíduos isolados.\nEssas organizações coletivas de trabalhadores, voltadas à defesa de interesses da categoria por meio de negociação e mobilização, são conhecidas como:",
      year: 2021,
      subjectId: sociologia.id,
      topicId: trabalhoSociologia.id,
      difficulty: 1,
      explanation:
        "Sindicatos são as organizações que representam coletivamente os interesses de uma categoria de trabalhadores, negociando com empregadores e Estado por melhores salários, condições de trabalho e direitos — um dos temas centrais da sociologia do trabalho.",
      alternatives: {
        create: [
          { label: "A", text: "Sindicatos", isCorrect: true },
          { label: "B", text: "Cooperativas de crédito", isCorrect: false },
          { label: "C", text: "Partidos políticos", isCorrect: false },
          { label: "D", text: "Organizações não governamentais internacionais", isCorrect: false },
          { label: "E", text: "Conselhos tutelares", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement:
        "Nas décadas de 1960 e 1970, diversos grupos historicamente marginalizados — como movimentos negros, feministas e, mais tarde, o movimento LGBT — passaram a se organizar publicamente para reivindicar reconhecimento de direitos, visibilidade e mudanças em leis e práticas sociais discriminatórias, usando estratégias como passeatas, manifestos e ocupação do debate público.\nEsse tipo de mobilização coletiva, organizada em torno de uma identidade ou pauta específica para reivindicar direitos e transformação social, é classificado pela Sociologia como:",
      year: 2023,
      subjectId: sociologia.id,
      topicId: movimentosSociais.id,
      difficulty: 2,
      explanation:
        "Movimento social é o conceito sociológico para ações coletivas organizadas, com certo grau de continuidade, voltadas a promover ou resistir a mudanças sociais, geralmente em torno de uma identidade, pauta ou interesse comum — como os exemplos citados no enunciado.",
      alternatives: {
        create: [
          { label: "A", text: "Movimento social", isCorrect: true },
          { label: "B", text: "Estratificação social", isCorrect: false },
          { label: "C", text: "Coesão mecânica", isCorrect: false },
          { label: "D", text: "Anomia social", isCorrect: false },
          { label: "E", text: "Endogenia cultural", isCorrect: false },
        ],
      },
    },
  });


  const progressoes = await prisma.topic.create({
    data: { name: "Progressões", subjectId: matematica.id },
  });
  const probabilidade = await prisma.topic.create({
    data: { name: "Probabilidade", subjectId: matematica.id },
  });

  const figurasLinguagem = await prisma.topic.create({
    data: { name: "Figuras de Linguagem", subjectId: portugues.id },
  });
  const coesaoTextual = await prisma.topic.create({
    data: { name: "Coesão e Coerência", subjectId: portugues.id },
  });

  const quimicaGeral = await prisma.topic.create({
    data: { name: "Química Geral", subjectId: quimica.id },
  });
  const fisicoQuimica = await prisma.topic.create({
    data: { name: "Físico-Química", subjectId: quimica.id },
  });

  const guerraFria = await prisma.topic.create({
    data: { name: "Segunda Guerra e Guerra Fria", subjectId: historia.id },
  });
  const americaLatina = await prisma.topic.create({
    data: { name: "Independências na América Latina", subjectId: historia.id },
  });

  const termologia = await prisma.topic.create({
    data: { name: "Termologia", subjectId: fisica.id },
  });
  const ondulatoria = await prisma.topic.create({
    data: { name: "Óptica e Ondas", subjectId: fisica.id },
  });

  const citologia = await prisma.topic.create({
    data: { name: "Citologia", subjectId: biologia.id },
  });
  const fisiologiaHumana = await prisma.topic.create({
    data: { name: "Fisiologia Humana", subjectId: biologia.id },
  });

  const geopolitica = await prisma.topic.create({
    data: { name: "Geopolítica", subjectId: geografia.id },
  });
  const espacoRural = await prisma.topic.create({
    data: { name: "Agropecuária e Espaço Rural", subjectId: geografia.id },
  });

  const filosofiaAntiga = await prisma.topic.create({
    data: { name: "Filosofia Antiga", subjectId: filosofia.id },
  });
  const teoriaConhecimento = await prisma.topic.create({
    data: { name: "Teoria do Conhecimento", subjectId: filosofia.id },
  });

  const culturaIdentidade = await prisma.topic.create({
    data: { name: "Cultura e Identidade", subjectId: sociologia.id },
  });
  const cidadaniaDireitos = await prisma.topic.create({
    data: { name: "Cidadania e Direitos", subjectId: sociologia.id },
  });


  // ---------------- NOVAS QUESTÕES: MATEMÁTICA ----------------

  await prisma.question.create({
    data: {
      statement: "Uma progressão aritmética tem primeiro termo 5 e razão 4. Qual é o décimo termo dessa sequência?",
      year: 2021,
      subjectId: matematica.id,
      topicId: progressoes.id,
      difficulty: 2,
      explanation: "Fórmula do termo geral da PA: an = a1 + (n-1)×r. Aqui: a10 = 5 + 9×4 = 5 + 36 = 41.",
      alternatives: {
        create: [
          { label: "A", text: "31", isCorrect: false },
          { label: "B", text: "36", isCorrect: false },
          { label: "C", text: "41", isCorrect: true },
          { label: "D", text: "45", isCorrect: false },
          { label: "E", text: "49", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Numa progressão geométrica, o primeiro termo é 3 e a razão é 2. Qual é o quinto termo?",
      year: 2020,
      subjectId: matematica.id,
      topicId: progressoes.id,
      difficulty: 2,
      explanation: "Fórmula da PG: an = a1 × r^(n-1). Aqui: a5 = 3 × 2^4 = 3 × 16 = 48.",
      alternatives: {
        create: [
          { label: "A", text: "24", isCorrect: false },
          { label: "B", text: "32", isCorrect: false },
          { label: "C", text: "40", isCorrect: false },
          { label: "D", text: "48", isCorrect: true },
          { label: "E", text: "96", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A soma dos 10 primeiros termos da progressão aritmética (2, 5, 8, 11, ...) é:",
      year: 2019,
      subjectId: matematica.id,
      topicId: progressoes.id,
      difficulty: 3,
      explanation: "Razão r=3. a10 = 2+9×3=29. Soma = (a1+an)×n/2 = (2+29)×10/2 = 31×5 = 155.",
      alternatives: {
        create: [
          { label: "A", text: "110", isCorrect: false },
          { label: "B", text: "135", isCorrect: false },
          { label: "C", text: "155", isCorrect: true },
          { label: "D", text: "170", isCorrect: false },
          { label: "E", text: "190", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Em uma pesquisa com 400 pessoas, 30% disseram preferir café a chá. Quantas pessoas preferem café?",
      year: 2022,
      subjectId: matematica.id,
      topicId: porcentagem.id,
      difficulty: 1,
      explanation: "30% de 400 é 0,30 × 400 = 120 pessoas.",
      alternatives: {
        create: [
          { label: "A", text: "30", isCorrect: false },
          { label: "B", text: "80", isCorrect: false },
          { label: "C", text: "100", isCorrect: false },
          { label: "D", text: "120", isCorrect: true },
          { label: "E", text: "140", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Um investimento de R$ 2.000 rendeu R$ 240 de juros em um ano. Qual foi a taxa de juros anual?",
      year: 2021,
      subjectId: matematica.id,
      topicId: porcentagem.id,
      difficulty: 2,
      explanation: "Taxa = juros/capital = 240/2000 = 0,12 = 12%.",
      alternatives: {
        create: [
          { label: "A", text: "8%", isCorrect: false },
          { label: "B", text: "10%", isCorrect: false },
          { label: "C", text: "12%", isCorrect: true },
          { label: "D", text: "15%", isCorrect: false },
          { label: "E", text: "24%", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Em uma turma de 25 alunos, a média das notas foi 7,0. Se um aluno com nota 5,0 sair da turma, qual passa a ser a nova média (aproximada)?",
      year: 2020,
      subjectId: matematica.id,
      topicId: porcentagem.id,
      difficulty: 3,
      explanation: "Soma total = 25×7=175. Retirando o 5: soma=170, alunos=24. Nova média=170/24≈7,08.",
      alternatives: {
        create: [
          { label: "A", text: "6,80", isCorrect: false },
          { label: "B", text: "6,92", isCorrect: false },
          { label: "C", text: "7,08", isCorrect: true },
          { label: "D", text: "7,20", isCorrect: false },
          { label: "E", text: "7,50", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Um triângulo retângulo tem catetos de 6 cm e 8 cm. Qual é a medida da hipotenusa?",
      year: 2019,
      subjectId: matematica.id,
      topicId: geometria.id,
      difficulty: 1,
      explanation: "Teorema de Pitágoras: h² = 6² + 8² = 36+64=100, então h=10 cm.",
      alternatives: {
        create: [
          { label: "A", text: "9 cm", isCorrect: false },
          { label: "B", text: "10 cm", isCorrect: true },
          { label: "C", text: "12 cm", isCorrect: false },
          { label: "D", text: "14 cm", isCorrect: false },
          { label: "E", text: "100 cm", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Uma caixa d'água tem formato cilíndrico com raio da base de 2 m e altura de 3 m. Qual é aproximadamente o volume dessa caixa (use π ≈ 3,14)?",
      year: 2022,
      subjectId: matematica.id,
      topicId: geometria.id,
      difficulty: 3,
      explanation: "Volume do cilindro = π×r²×h = 3,14 × 4 × 3 = 37,68 m³.",
      alternatives: {
        create: [
          { label: "A", text: "18,84 m³", isCorrect: false },
          { label: "B", text: "25,12 m³", isCorrect: false },
          { label: "C", text: "37,68 m³", isCorrect: true },
          { label: "D", text: "50,24 m³", isCorrect: false },
          { label: "E", text: "75,36 m³", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Ao jogar um dado de 6 faces uma vez, qual a probabilidade de sair um número par?",
      year: 2020,
      subjectId: matematica.id,
      topicId: probabilidade.id,
      difficulty: 1,
      explanation: "Números pares de 1 a 6: {2,4,6}, ou seja, 3 casos favoráveis em 6 possíveis. P = 3/6 = 1/2.",
      alternatives: {
        create: [
          { label: "A", text: "1/6", isCorrect: false },
          { label: "B", text: "1/3", isCorrect: false },
          { label: "C", text: "1/2", isCorrect: true },
          { label: "D", text: "2/3", isCorrect: false },
          { label: "E", text: "5/6", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Uma urna tem 4 bolas vermelhas e 6 bolas azuis. Ao retirar uma bola ao acaso, qual a probabilidade de ser vermelha?",
      year: 2021,
      subjectId: matematica.id,
      topicId: probabilidade.id,
      difficulty: 1,
      explanation: "Total de bolas = 10, vermelhas = 4. P = 4/10 = 2/5 = 40%.",
      alternatives: {
        create: [
          { label: "A", text: "20%", isCorrect: false },
          { label: "B", text: "30%", isCorrect: false },
          { label: "C", text: "40%", isCorrect: true },
          { label: "D", text: "50%", isCorrect: false },
          { label: "E", text: "60%", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Um terreno em formato de trapézio tem bases de 10 m e 6 m, e altura de 4 m. Qual é a área desse terreno?",
      year: 2019,
      subjectId: matematica.id,
      topicId: geometria.id,
      difficulty: 2,
      explanation: "Área do trapézio = (base maior + base menor)×altura/2 = (10+6)×4/2 = 64/2 = 32 m².",
      alternatives: {
        create: [
          { label: "A", text: "16 m²", isCorrect: false },
          { label: "B", text: "24 m²", isCorrect: false },
          { label: "C", text: "32 m²", isCorrect: true },
          { label: "D", text: "40 m²", isCorrect: false },
          { label: "E", text: "64 m²", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A função g(x) = x² - 4x + 3 tem suas raízes (valores de x para g(x)=0) iguais a:",
      year: 2022,
      subjectId: matematica.id,
      topicId: funcoes.id,
      difficulty: 3,
      explanation: "Usando Bhaskara ou fatoração: x²-4x+3=(x-1)(x-3). As raízes são x=1 e x=3.",
      alternatives: {
        create: [
          { label: "A", text: "1 e 3", isCorrect: true },
          { label: "B", text: "-1 e -3", isCorrect: false },
          { label: "C", text: "2 e 2", isCorrect: false },
          { label: "D", text: "0 e 4", isCorrect: false },
          { label: "E", text: "1 e -3", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Se dois eventos consecutivos e independentes têm, cada um, 50% de chance de ocorrer, qual a probabilidade de os dois ocorrerem juntos?",
      year: 2021,
      subjectId: matematica.id,
      topicId: probabilidade.id,
      difficulty: 2,
      explanation: "Para eventos independentes, multiplica-se as probabilidades: 0,5 × 0,5 = 0,25 = 25%.",
      alternatives: {
        create: [
          { label: "A", text: "100%", isCorrect: false },
          { label: "B", text: "75%", isCorrect: false },
          { label: "C", text: "50%", isCorrect: false },
          { label: "D", text: "25%", isCorrect: true },
          { label: "E", text: "10%", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O sétimo termo de uma progressão aritmética é 20, e a razão é 3. Qual é o primeiro termo dessa progressão?",
      year: 2020,
      subjectId: matematica.id,
      topicId: progressoes.id,
      difficulty: 2,
      explanation: "a7 = a1 + 6×r → 20 = a1 + 18 → a1 = 2.",
      alternatives: {
        create: [
          { label: "A", text: "2", isCorrect: true },
          { label: "B", text: "5", isCorrect: false },
          { label: "C", text: "8", isCorrect: false },
          { label: "D", text: "11", isCorrect: false },
          { label: "E", text: "14", isCorrect: false },
        ],
      },
    },
  });


  // ---------------- NOVAS QUESTÕES: PORTUGUÊS ----------------

  await prisma.question.create({
    data: {
      statement: "Na frase 'O tempo é um rio que corre sem volta', a relação estabelecida entre 'tempo' e 'rio' é uma:",
      year: 2021,
      subjectId: portugues.id,
      topicId: figurasLinguagem.id,
      difficulty: 2,
      explanation: "Metáfora é a comparação implícita entre dois elementos sem uso de conectivo comparativo ('como', 'tal qual'). Aqui, o tempo é chamado diretamente de rio.",
      alternatives: {
        create: [
          { label: "A", text: "Metonímia", isCorrect: false },
          { label: "B", text: "Metáfora", isCorrect: true },
          { label: "C", text: "Hipérbole", isCorrect: false },
          { label: "D", text: "Ironia", isCorrect: false },
          { label: "E", text: "Eufemismo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "'Ela chorou rios de lágrimas' é um exemplo de qual figura de linguagem, que exagera intencionalmente a realidade?",
      year: 2020,
      subjectId: portugues.id,
      topicId: figurasLinguagem.id,
      difficulty: 1,
      explanation: "Hipérbole é o exagero proposital para dar ênfase a uma ideia — ninguém chora literalmente 'rios' de lágrimas.",
      alternatives: {
        create: [
          { label: "A", text: "Hipérbole", isCorrect: true },
          { label: "B", text: "Antítese", isCorrect: false },
          { label: "C", text: "Prosopopeia", isCorrect: false },
          { label: "D", text: "Elipse", isCorrect: false },
          { label: "E", text: "Anáfora", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Em 'O Brasil vai às urnas em outubro', a palavra 'Brasil' está sendo usada no lugar de 'os brasileiros', configurando uma:",
      year: 2022,
      subjectId: portugues.id,
      topicId: figurasLinguagem.id,
      difficulty: 3,
      explanation: "Metonímia é a substituição de uma palavra por outra que tem relação lógica de proximidade (o país pelo seu povo, o todo pela parte, etc.), diferente da metáfora, que é baseada em semelhança.",
      alternatives: {
        create: [
          { label: "A", text: "Metáfora", isCorrect: false },
          { label: "B", text: "Metonímia", isCorrect: true },
          { label: "C", text: "Catacrese", isCorrect: false },
          { label: "D", text: "Sinestesia", isCorrect: false },
          { label: "E", text: "Personificação", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "No trecho 'Chegou, sentou, comeu e foi embora', o uso repetido da conjunção 'e' e a ausência de outros conectivos evidenciam:",
      year: 2019,
      subjectId: portugues.id,
      topicId: coesaoTextual.id,
      difficulty: 2,
      explanation: "O trecho usa coordenação simples (assíndeto/polissíndeto) para dar ritmo rápido à narrativa, encadeando ações em sequência sem explicações — recurso comum pra transmitir agilidade.",
      alternatives: {
        create: [
          { label: "A", text: "Subordinação adverbial", isCorrect: false },
          { label: "B", text: "Coordenação para dar ritmo às ações", isCorrect: true },
          { label: "C", text: "Uso de conectivos concessivos", isCorrect: false },
          { label: "D", text: "Discurso indireto livre", isCorrect: false },
          { label: "E", text: "Oração intercalada", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Na frase 'Ele disse que viria, contudo não apareceu', a palavra 'contudo' estabelece uma relação de:",
      year: 2021,
      subjectId: portugues.id,
      topicId: coesaoTextual.id,
      difficulty: 1,
      explanation: "'Contudo' é uma conjunção adversativa, assim como 'mas' e 'porém' — indica contraste entre a promessa de vir e o fato de não ter aparecido.",
      alternatives: {
        create: [
          { label: "A", text: "Adição", isCorrect: false },
          { label: "B", text: "Causa", isCorrect: false },
          { label: "C", text: "Oposição", isCorrect: true },
          { label: "D", text: "Conclusão", isCorrect: false },
          { label: "E", text: "Condição", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Repetir a mesma palavra ou expressão no início de versos ou frases seguidas, como em 'Amar é... amar é... amar é...', é chamado de:",
      year: 2020,
      subjectId: portugues.id,
      topicId: figurasLinguagem.id,
      difficulty: 2,
      explanation: "Anáfora é justamente essa repetição proposital no início de versos ou frases consecutivas, usada pra criar ritmo e ênfase — muito comum em poesia.",
      alternatives: {
        create: [
          { label: "A", text: "Anáfora", isCorrect: true },
          { label: "B", text: "Elipse", isCorrect: false },
          { label: "C", text: "Zeugma", isCorrect: false },
          { label: "D", text: "Pleonasmo", isCorrect: false },
          { label: "E", text: "Assíndeto", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Machado de Assis, autor de 'Dom Casmurro', é considerado o principal representante de qual escola literária brasileira?",
      year: 2019,
      subjectId: portugues.id,
      topicId: literatura.id,
      difficulty: 2,
      explanation: "Machado de Assis é o grande nome do Realismo brasileiro — movimento que critica os costumes da sociedade e explora a psicologia complexa dos personagens, rompendo com o idealismo romântico.",
      alternatives: {
        create: [
          { label: "A", text: "Romantismo", isCorrect: false },
          { label: "B", text: "Realismo", isCorrect: true },
          { label: "C", text: "Naturalismo", isCorrect: false },
          { label: "D", text: "Parnasianismo", isCorrect: false },
          { label: "E", text: "Simbolismo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O movimento literário do século XIX marcado pela idealização do amor, do herói nacional (como o indígena) e da natureza é o:",
      year: 2020,
      subjectId: portugues.id,
      topicId: literatura.id,
      difficulty: 1,
      explanation: "O Romantismo brasileiro (com autores como José de Alencar) valorizou justamente essa idealização: amor perfeito, heróis nacionais como o índio, e a natureza exuberante como símbolo do país.",
      alternatives: {
        create: [
          { label: "A", text: "Barroco", isCorrect: false },
          { label: "B", text: "Arcadismo", isCorrect: false },
          { label: "C", text: "Romantismo", isCorrect: true },
          { label: "D", text: "Realismo", isCorrect: false },
          { label: "E", text: "Modernismo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Na frase 'Se eu tivesse dinheiro, viajaria pelo mundo', o verbo 'tivesse' está no modo:",
      year: 2022,
      subjectId: portugues.id,
      topicId: gramatica.id,
      difficulty: 3,
      explanation: "'Tivesse' é pretérito imperfeito do subjuntivo, usado justamente em orações condicionais que expressam hipótese ('se eu tivesse...').",
      alternatives: {
        create: [
          { label: "A", text: "Indicativo", isCorrect: false },
          { label: "B", text: "Subjuntivo", isCorrect: true },
          { label: "C", text: "Imperativo", isCorrect: false },
          { label: "D", text: "Infinitivo", isCorrect: false },
          { label: "E", text: "Gerúndio", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Na frase 'Fazem dois anos que ele se mudou', segundo a norma culta, o verbo 'fazer' deveria estar:",
      year: 2021,
      subjectId: portugues.id,
      topicId: gramatica.id,
      difficulty: 3,
      explanation: "Quando indica tempo decorrido, 'fazer' é impessoal (sem sujeito) e por isso deve ficar sempre no singular: 'Faz dois anos', não 'Fazem'.",
      alternatives: {
        create: [
          { label: "A", text: "No plural, 'fazem', como está", isCorrect: false },
          { label: "B", text: "No singular, 'faz'", isCorrect: true },
          { label: "C", text: "No futuro, 'fará'", isCorrect: false },
          { label: "D", text: "No pretérito perfeito composto", isCorrect: false },
          { label: "E", text: "Não há erro na frase", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A retirada de um termo que pode ser subentendido pelo contexto, como em 'Eu gosto de café; ela, de chá' (onde se omite 'gosta'), é chamada de:",
      year: 2020,
      subjectId: portugues.id,
      topicId: coesaoTextual.id,
      difficulty: 2,
      explanation: "Elipse é a omissão de um termo facilmente recuperável pelo contexto — nesse caso, o verbo 'gosta' fica subentendido na segunda oração.",
      alternatives: {
        create: [
          { label: "A", text: "Elipse", isCorrect: true },
          { label: "B", text: "Zeugma", isCorrect: false },
          { label: "C", text: "Pleonasmo", isCorrect: false },
          { label: "D", text: "Hipérbato", isCorrect: false },
          { label: "E", text: "Silepse", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Guimarães Rosa e Clarice Lispector são associados a qual fase do Modernismo brasileiro, marcada pela renovação da linguagem e da forma da prosa?",
      year: 2019,
      subjectId: portugues.id,
      topicId: literatura.id,
      difficulty: 3,
      explanation: "Ambos pertencem à terceira geração do Modernismo (pós-1945), conhecida por uma prosa mais experimental — Guimarães Rosa com o regionalismo universalizante, Clarice com o fluxo de consciência introspectivo.",
      alternatives: {
        create: [
          { label: "A", text: "Primeira geração modernista (1922)", isCorrect: false },
          { label: "B", text: "Segunda geração modernista", isCorrect: false },
          { label: "C", text: "Terceira geração modernista", isCorrect: true },
          { label: "D", text: "Pré-modernismo", isCorrect: false },
          { label: "E", text: "Simbolismo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Em 'Ele é um verdadeiro leão em campo', o uso da palavra 'leão' para descrever a coragem do jogador é um exemplo de:",
      year: 2022,
      subjectId: portugues.id,
      topicId: figurasLinguagem.id,
      difficulty: 1,
      explanation: "É uma metáfora: comparar implicitamente o jogador a um leão, sugerindo força e coragem, sem usar conectivo comparativo.",
      alternatives: {
        create: [
          { label: "A", text: "Comparação explícita", isCorrect: false },
          { label: "B", text: "Metáfora", isCorrect: true },
          { label: "C", text: "Metonímia", isCorrect: false },
          { label: "D", text: "Onomatopeia", isCorrect: false },
          { label: "E", text: "Catacrese", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Em uma redação, usar palavras como 'entretanto', 'portanto' e 'além disso' para conectar parágrafos e ideias serve principalmente para garantir:",
      year: 2021,
      subjectId: portugues.id,
      topicId: coesaoTextual.id,
      difficulty: 1,
      explanation: "Esses conectivos (conjunções e advérbios) são elementos de coesão textual — eles amarram as ideias entre frases e parágrafos, deixando o texto mais fluido e lógico, o que é essencial pra nota na redação do ENEM.",
      alternatives: {
        create: [
          { label: "A", text: "A coesão textual", isCorrect: true },
          { label: "B", text: "A concordância verbal", isCorrect: false },
          { label: "C", text: "A regência nominal", isCorrect: false },
          { label: "D", text: "A ortografia correta", isCorrect: false },
          { label: "E", text: "A pontuação obrigatória", isCorrect: false },
        ],
      },
    },
  });


  // ---------------- NOVAS QUESTÕES: QUÍMICA ----------------

  await prisma.question.create({
    data: {
      statement: "O número atômico de um elemento representa a quantidade de qual partícula presente no núcleo?",
      year: 2020,
      subjectId: quimica.id,
      topicId: quimicaGeral.id,
      difficulty: 1,
      explanation: "Número atômico (Z) é, por definição, o número de prótons no núcleo do átomo — é ele que identifica de qual elemento químico se trata.",
      alternatives: {
        create: [
          { label: "A", text: "Prótons", isCorrect: true },
          { label: "B", text: "Nêutrons", isCorrect: false },
          { label: "C", text: "Elétrons na camada de valência", isCorrect: false },
          { label: "D", text: "Prótons e nêutrons somados", isCorrect: false },
          { label: "E", text: "Isótopos", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Na tabela periódica, os elementos de um mesmo grupo (coluna) têm em comum principalmente:",
      year: 2021,
      subjectId: quimica.id,
      topicId: quimicaGeral.id,
      difficulty: 2,
      explanation: "Elementos do mesmo grupo têm o mesmo número de elétrons na camada de valência, o que faz com que tenham propriedades químicas parecidas.",
      alternatives: {
        create: [
          { label: "A", text: "O mesmo número de nêutrons", isCorrect: false },
          { label: "B", text: "A mesma massa atômica", isCorrect: false },
          { label: "C", text: "O mesmo número de elétrons na camada de valência", isCorrect: true },
          { label: "D", text: "O mesmo estado físico", isCorrect: false },
          { label: "E", text: "O mesmo número de prótons", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Uma solução com pH igual a 3 é classificada como:",
      year: 2022,
      subjectId: quimica.id,
      topicId: fisicoQuimica.id,
      difficulty: 1,
      explanation: "A escala de pH vai de 0 a 14, sendo 7 neutro. Valores abaixo de 7 são ácidos, e quanto mais próximo de 0, mais ácida a solução — pH 3 é claramente ácido.",
      alternatives: {
        create: [
          { label: "A", text: "Ácida", isCorrect: true },
          { label: "B", text: "Neutra", isCorrect: false },
          { label: "C", text: "Básica (alcalina)", isCorrect: false },
          { label: "D", text: "Anfótera", isCorrect: false },
          { label: "E", text: "Indefinida sem mais dados", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Ao misturar um ácido com uma base em quantidades equivalentes, a reação que ocorre é chamada de:",
      year: 2019,
      subjectId: quimica.id,
      topicId: fisicoQuimica.id,
      difficulty: 1,
      explanation: "Reação de neutralização: ácido + base formam sal + água, e o caráter ácido/básico da mistura se anula (idealmente ficando neutra).",
      alternatives: {
        create: [
          { label: "A", text: "Neutralização", isCorrect: true },
          { label: "B", text: "Combustão", isCorrect: false },
          { label: "C", text: "Oxirredução", isCorrect: false },
          { label: "D", text: "Síntese", isCorrect: false },
          { label: "E", text: "Decomposição", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Qual é a massa molar aproximada da água (H₂O), considerando H = 1 g/mol e O = 16 g/mol?",
      year: 2020,
      subjectId: quimica.id,
      topicId: estequiometria.id,
      difficulty: 2,
      explanation: "Massa molar = 2×(massa do H) + 1×(massa do O) = 2×1 + 16 = 18 g/mol.",
      alternatives: {
        create: [
          { label: "A", text: "16 g/mol", isCorrect: false },
          { label: "B", text: "17 g/mol", isCorrect: false },
          { label: "C", text: "18 g/mol", isCorrect: true },
          { label: "D", text: "20 g/mol", isCorrect: false },
          { label: "E", text: "34 g/mol", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Na reação 2H₂ + O₂ → 2H₂O, quantos mols de água são formados a partir de 4 mols de H₂ (com O₂ em excesso)?",
      year: 2021,
      subjectId: quimica.id,
      topicId: estequiometria.id,
      difficulty: 2,
      explanation: "A proporção é 2 mols de H₂ para 2 mols de H₂O, ou seja, 1:1. Com 4 mols de H₂, formam-se 4 mols de H₂O.",
      alternatives: {
        create: [
          { label: "A", text: "2 mols", isCorrect: false },
          { label: "B", text: "4 mols", isCorrect: true },
          { label: "C", text: "6 mols", isCorrect: false },
          { label: "D", text: "8 mols", isCorrect: false },
          { label: "E", text: "1 mol", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Os alcanos são hidrocarbonetos caracterizados por apresentarem, entre os átomos de carbono, apenas ligações:",
      year: 2019,
      subjectId: quimica.id,
      topicId: organica.id,
      difficulty: 2,
      explanation: "Alcanos são hidrocarbonetos saturados: têm só ligações simples (sigma) entre os carbonos, diferente dos alcenos (uma dupla) e alcinos (uma tripla).",
      alternatives: {
        create: [
          { label: "A", text: "Simples", isCorrect: true },
          { label: "B", text: "Duplas", isCorrect: false },
          { label: "C", text: "Triplas", isCorrect: false },
          { label: "D", text: "Duplas e triplas alternadas", isCorrect: false },
          { label: "E", text: "Iônicas", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O etanol (CH₃CH₂OH), usado como combustível no Brasil, pertence a qual função orgânica?",
      year: 2022,
      subjectId: quimica.id,
      topicId: organica.id,
      difficulty: 1,
      explanation: "A presença do grupo -OH ligado a um carbono saturado caracteriza a função álcool — o etanol é o álcool mais conhecido, usado em bebidas e combustível.",
      alternatives: {
        create: [
          { label: "A", text: "Álcool", isCorrect: true },
          { label: "B", text: "Ácido carboxílico", isCorrect: false },
          { label: "C", text: "Cetona", isCorrect: false },
          { label: "D", text: "Éter", isCorrect: false },
          { label: "E", text: "Aldeído", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Um processo em que ocorre a transferência de elétrons entre substâncias, com variação do número de oxidação, é chamado de reação de:",
      year: 2020,
      subjectId: quimica.id,
      topicId: fisicoQuimica.id,
      difficulty: 3,
      explanation: "Reação de oxirredução (redox): uma substância perde elétrons (oxida) enquanto outra ganha (reduz), sempre com mudança no número de oxidação (Nox).",
      alternatives: {
        create: [
          { label: "A", text: "Oxirredução", isCorrect: true },
          { label: "B", text: "Neutralização", isCorrect: false },
          { label: "C", text: "Dupla troca", isCorrect: false },
          { label: "D", text: "Hidrólise", isCorrect: false },
          { label: "E", text: "Esterificação", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A quantidade de calor liberada em uma reação exotérmica indica que, em relação aos reagentes, a energia dos produtos é:",
      year: 2021,
      subjectId: quimica.id,
      topicId: fisicoQuimica.id,
      difficulty: 3,
      explanation: "Em reações exotérmicas, energia é liberada para o ambiente, o que significa que os produtos ficam com energia menor do que a dos reagentes.",
      alternatives: {
        create: [
          { label: "A", text: "Maior", isCorrect: false },
          { label: "B", text: "Menor", isCorrect: true },
          { label: "C", text: "Igual", isCorrect: false },
          { label: "D", text: "Indefinida", isCorrect: false },
          { label: "E", text: "Depende só da temperatura ambiente", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Isótopos de um mesmo elemento químico têm o mesmo número de prótons, mas diferem no número de:",
      year: 2019,
      subjectId: quimica.id,
      topicId: quimicaGeral.id,
      difficulty: 1,
      explanation: "Isótopos têm o mesmo Z (prótons, o que define o elemento) mas número diferente de nêutrons, o que altera a massa atômica.",
      alternatives: {
        create: [
          { label: "A", text: "Elétrons na última camada", isCorrect: false },
          { label: "B", text: "Prótons", isCorrect: false },
          { label: "C", text: "Nêutrons", isCorrect: true },
          { label: "D", text: "Cargas elétricas", isCorrect: false },
          { label: "E", text: "Estados de oxidação", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A camada de ozônio (O₃) protege a Terra ao absorver principalmente qual tipo de radiação solar?",
      year: 2020,
      subjectId: quimica.id,
      topicId: quimicaGeral.id,
      difficulty: 1,
      explanation: "O ozônio estratosférico absorve grande parte da radiação ultravioleta (UV) do sol, que em excesso é prejudicial à pele e aos seres vivos.",
      alternatives: {
        create: [
          { label: "A", text: "Infravermelha", isCorrect: false },
          { label: "B", text: "Ultravioleta", isCorrect: true },
          { label: "C", text: "Radiação gama", isCorrect: false },
          { label: "D", text: "Micro-ondas", isCorrect: false },
          { label: "E", text: "Ondas de rádio", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Ao queimar 1 mol de metano completamente, são consumidos 2 mols de O₂. Quantos mols de O₂ são necessários para queimar 5 mols de metano?",
      year: 2022,
      subjectId: quimica.id,
      topicId: estequiometria.id,
      difficulty: 2,
      explanation: "Regra de três simples: se 1 mol de CH₄ precisa de 2 mols de O₂, então 5 mols de CH₄ precisam de 5×2=10 mols de O₂.",
      alternatives: {
        create: [
          { label: "A", text: "5 mols", isCorrect: false },
          { label: "B", text: "8 mols", isCorrect: false },
          { label: "C", text: "10 mols", isCorrect: true },
          { label: "D", text: "12 mols", isCorrect: false },
          { label: "E", text: "15 mols", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Os ácidos carboxílicos, função orgânica presente no vinagre (ácido acético), são caracterizados pela presença do grupo funcional:",
      year: 2021,
      subjectId: quimica.id,
      topicId: organica.id,
      difficulty: 2,
      explanation: "O grupo carboxila (-COOH) é o que define os ácidos carboxílicos — é ele que dá a essas substâncias, como o ácido acético, seu caráter ácido.",
      alternatives: {
        create: [
          { label: "A", text: "Carboxila (-COOH)", isCorrect: true },
          { label: "B", text: "Hidroxila (-OH)", isCorrect: false },
          { label: "C", text: "Carbonila (-CO-)", isCorrect: false },
          { label: "D", text: "Amina (-NH2)", isCorrect: false },
          { label: "E", text: "Éster", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A chuva ácida é um fenômeno ambiental causado principalmente pela liberação de quais gases na atmosfera, provenientes da queima de combustíveis fósseis?",
      year: 2019,
      subjectId: quimica.id,
      topicId: fisicoQuimica.id,
      difficulty: 2,
      explanation: "Óxidos de enxofre (SO₂, SO₃) e de nitrogênio (NOx), liberados na queima de combustíveis fósseis, reagem com a água da atmosfera formando ácidos que caem como chuva ácida.",
      alternatives: {
        create: [
          { label: "A", text: "Gás carbônico e oxigênio", isCorrect: false },
          { label: "B", text: "Óxidos de enxofre e de nitrogênio", isCorrect: true },
          { label: "C", text: "Metano e hidrogênio", isCorrect: false },
          { label: "D", text: "Gás nobre e vapor d'água", isCorrect: false },
          { label: "E", text: "Ozônio e nitrogênio puro", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Um átomo neutro que possui 11 prótons e 12 nêutrons tem, portanto, quantos elétrons?",
      year: 2020,
      subjectId: quimica.id,
      topicId: quimicaGeral.id,
      difficulty: 1,
      explanation: "Em um átomo neutro, o número de elétrons é igual ao número de prótons — nesse caso, 11 elétrons (o número de nêutrons não afeta essa contagem).",
      alternatives: {
        create: [
          { label: "A", text: "11", isCorrect: true },
          { label: "B", text: "12", isCorrect: false },
          { label: "C", text: "22", isCorrect: false },
          { label: "D", text: "23", isCorrect: false },
          { label: "E", text: "1", isCorrect: false },
        ],
      },
    },
  });


  // ---------------- NOVAS QUESTÕES: HISTÓRIA ----------------

  await prisma.question.create({
    data: {
      statement: "A Segunda Guerra Mundial (1939-1945) teve como um de seus estopins a invasão de qual país pela Alemanha nazista em 1939?",
      year: 2020,
      subjectId: historia.id,
      topicId: guerraFria.id,
      difficulty: 1,
      explanation: "A invasão da Polônia pela Alemanha em setembro de 1939 levou França e Reino Unido a declararem guerra à Alemanha, dando início oficial à Segunda Guerra Mundial.",
      alternatives: {
        create: [
          { label: "A", text: "França", isCorrect: false },
          { label: "B", text: "Polônia", isCorrect: true },
          { label: "C", text: "União Soviética", isCorrect: false },
          { label: "D", text: "Reino Unido", isCorrect: false },
          { label: "E", text: "Bélgica", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A Guerra Fria (1947-1991) foi marcada pela disputa ideológica e geopolítica entre quais duas potências?",
      year: 2021,
      subjectId: historia.id,
      topicId: guerraFria.id,
      difficulty: 1,
      explanation: "A Guerra Fria opôs Estados Unidos (capitalismo) e União Soviética (socialismo/comunismo), sem confronto militar direto entre as duas potências, mas com disputa de influência global.",
      alternatives: {
        create: [
          { label: "A", text: "Alemanha e França", isCorrect: false },
          { label: "B", text: "EUA e União Soviética", isCorrect: true },
          { label: "C", text: "China e Japão", isCorrect: false },
          { label: "D", text: "Reino Unido e Alemanha", isCorrect: false },
          { label: "E", text: "EUA e China", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A construção do Muro de Berlim em 1961 simbolizou a divisão entre:",
      year: 2019,
      subjectId: historia.id,
      topicId: guerraFria.id,
      difficulty: 2,
      explanation: "O Muro de Berlim separava a Alemanha Ocidental (capitalista, aliada aos EUA) da Alemanha Oriental (socialista, aliada à URSS), tornando-se o símbolo mais forte da Guerra Fria na Europa.",
      alternatives: {
        create: [
          { label: "A", text: "Norte e Sul da Alemanha", isCorrect: false },
          { label: "B", text: "Alemanha Ocidental (capitalista) e Oriental (socialista)", isCorrect: true },
          { label: "C", text: "Católicos e protestantes alemães", isCorrect: false },
          { label: "D", text: "Áustria e Alemanha", isCorrect: false },
          { label: "E", text: "Zonas industriais e agrícolas", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O extermínio sistemático de judeus e outras minorias promovido pelo regime nazista durante a Segunda Guerra ficou conhecido como:",
      year: 2022,
      subjectId: historia.id,
      topicId: guerraFria.id,
      difficulty: 1,
      explanation: "O Holocausto foi o genocídio sistemático de cerca de 6 milhões de judeus, além de outras minorias, promovido pelo regime nazista de Hitler.",
      alternatives: {
        create: [
          { label: "A", text: "Holocausto", isCorrect: true },
          { label: "B", text: "Apartheid", isCorrect: false },
          { label: "C", text: "Genocídio armênio", isCorrect: false },
          { label: "D", text: "Grande Purga", isCorrect: false },
          { label: "E", text: "Inquisição", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O processo de independência da maioria dos países da América espanhola, no início do século XIX, foi fortemente influenciado por qual evento europeu?",
      year: 2020,
      subjectId: historia.id,
      topicId: americaLatina.id,
      difficulty: 3,
      explanation: "A invasão napoleônica à Espanha e Portugal (1807-1808) enfraqueceu o controle das metrópoles ibéricas sobre suas colônias, abrindo caminho para os movimentos de independência na América Latina.",
      alternatives: {
        create: [
          { label: "A", text: "A Revolução Francesa", isCorrect: false },
          { label: "B", text: "A invasão napoleônica à Península Ibérica", isCorrect: true },
          { label: "C", text: "A unificação da Itália", isCorrect: false },
          { label: "D", text: "A Primeira Guerra Mundial", isCorrect: false },
          { label: "E", text: "O Congresso de Viena, isoladamente", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Simón Bolívar é uma figura central na história da América Latina por ter liderado processos de independência em qual região?",
      year: 2019,
      subjectId: historia.id,
      topicId: americaLatina.id,
      difficulty: 2,
      explanation: "Bolívar liderou movimentos de independência em vários territórios da América do Sul hispânica (atuais Venezuela, Colômbia, Equador, Peru e Bolívia), sendo por isso chamado de 'O Libertador'.",
      alternatives: {
        create: [
          { label: "A", text: "América do Norte", isCorrect: false },
          { label: "B", text: "América Central apenas", isCorrect: false },
          { label: "C", text: "América do Sul hispânica", isCorrect: true },
          { label: "D", text: "Brasil", isCorrect: false },
          { label: "E", text: "Caribe francês", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Diferente da maior parte da América Latina, o Brasil se tornou independente de Portugal em 1822 mantendo qual forma de governo logo em seguida?",
      year: 2021,
      subjectId: historia.id,
      topicId: americaLatina.id,
      difficulty: 2,
      explanation: "O Brasil manteve a monarquia após a independência, com Dom Pedro I como imperador — diferente dos vizinhos hispano-americanos, que em geral se tornaram repúblicas.",
      alternatives: {
        create: [
          { label: "A", text: "República presidencialista", isCorrect: false },
          { label: "B", text: "Monarquia (Império)", isCorrect: true },
          { label: "C", text: "Regime parlamentarista republicano", isCorrect: false },
          { label: "D", text: "Confederação de estados", isCorrect: false },
          { label: "E", text: "Protetorado britânico", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A Revolução de 1930, que levou Getúlio Vargas ao poder, teve entre suas causas a insatisfação com qual arranjo político da República Velha?",
      year: 2020,
      subjectId: historia.id,
      topicId: republica.id,
      difficulty: 3,
      explanation: "A chamada 'política do café com leite' (revezamento de poder entre elites de São Paulo e Minas Gerais) gerou insatisfação, especialmente quando o presidente Washington Luís rompeu esse acordo, o que ajudou a detonar a Revolução de 1930.",
      alternatives: {
        create: [
          { label: "A", text: "A política do café com leite", isCorrect: true },
          { label: "B", text: "A abolição da escravatura", isCorrect: false },
          { label: "C", text: "A Guerra do Paraguai", isCorrect: false },
          { label: "D", text: "A Proclamação da República", isCorrect: false },
          { label: "E", text: "O Tratado de Tordesilhas", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Durante o Estado Novo (1937-1945), Getúlio Vargas criou a CLT (Consolidação das Leis do Trabalho), que tinha como objetivo principal:",
      year: 2022,
      subjectId: historia.id,
      topicId: republica.id,
      difficulty: 2,
      explanation: "A CLT unificou e ampliou direitos trabalhistas (férias, jornada de trabalho, salário mínimo etc.), sendo usada por Vargas também como forma de conquistar apoio popular, especialmente da classe trabalhadora urbana.",
      alternatives: {
        create: [
          { label: "A", text: "Regulamentar direitos trabalhistas", isCorrect: true },
          { label: "B", text: "Abolir o trabalho assalariado", isCorrect: false },
          { label: "C", text: "Criar o voto feminino", isCorrect: false },
          { label: "D", text: "Extinguir os sindicatos", isCorrect: false },
          { label: "E", text: "Privatizar empresas estatais", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O período conhecido como 'República Velha' ou 'Primeira República' no Brasil corresponde aproximadamente a qual intervalo de anos?",
      year: 2019,
      subjectId: historia.id,
      topicId: republica.id,
      difficulty: 1,
      explanation: "A República Velha vai da Proclamação da República (1889) até a Revolução de 1930, que encerra esse período e leva Getúlio Vargas ao poder.",
      alternatives: {
        create: [
          { label: "A", text: "1822-1889", isCorrect: false },
          { label: "B", text: "1889-1930", isCorrect: true },
          { label: "C", text: "1930-1945", isCorrect: false },
          { label: "D", text: "1945-1964", isCorrect: false },
          { label: "E", text: "1964-1985", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "No sistema colonial da 'plantation', o principal produto de exportação durante boa parte do período colonial brasileiro foi:",
      year: 2020,
      subjectId: historia.id,
      topicId: brasilColonia.id,
      difficulty: 1,
      explanation: "O açúcar foi o principal produto de exportação do Brasil colonial, especialmente entre os séculos XVI e XVII, cultivado em engenhos no Nordeste com mão de obra escrava.",
      alternatives: {
        create: [
          { label: "A", text: "Café", isCorrect: false },
          { label: "B", text: "Açúcar", isCorrect: true },
          { label: "C", text: "Ouro", isCorrect: false },
          { label: "D", text: "Algodão", isCorrect: false },
          { label: "E", text: "Borracha", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O ciclo do ouro, no século XVIII, deslocou o eixo econômico da colônia para qual região do Brasil?",
      year: 2021,
      subjectId: historia.id,
      topicId: brasilColonia.id,
      difficulty: 2,
      explanation: "A descoberta de ouro em Minas Gerais no final do século XVII deslocou o eixo econômico e político da colônia do litoral nordestino para a região central-sul, incluindo a mudança da capital para o Rio de Janeiro em 1763.",
      alternatives: {
        create: [
          { label: "A", text: "Nordeste açucareiro", isCorrect: false },
          { label: "B", text: "Amazônia", isCorrect: false },
          { label: "C", text: "Minas Gerais e região Sudeste", isCorrect: true },
          { label: "D", text: "Sul pecuarista", isCorrect: false },
          { label: "E", text: "Litoral paulista apenas", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "As Capitanias Hereditárias, criadas em 1534, tinham como principal objetivo, do ponto de vista de Portugal:",
      year: 2019,
      subjectId: historia.id,
      topicId: brasilColonia.id,
      difficulty: 2,
      explanation: "Diante da ameaça de invasões estrangeiras (como as francesas) e do alto custo de administrar diretamente a colônia, Portugal dividiu o território em capitanias e delegou a particulares (donatários) a tarefa de colonizá-las e defendê-las.",
      alternatives: {
        create: [
          { label: "A", text: "Dar autonomia política total ao Brasil", isCorrect: false },
          { label: "B", text: "Facilitar a colonização e defesa do território a baixo custo pra Coroa", isCorrect: true },
          { label: "C", text: "Estabelecer o trabalho assalariado", isCorrect: false },
          { label: "D", text: "Criar uma república descentralizada", isCorrect: false },
          { label: "E", text: "Abolir o pacto colonial", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O Iluminismo, movimento intelectual europeu do século XVIII que valorizava a razão, influenciou diretamente qual das revoluções abaixo?",
      year: 2022,
      subjectId: historia.id,
      topicId: americaLatina.id,
      difficulty: 2,
      explanation: "A Revolução Francesa (1789) foi fortemente influenciada pelos ideais iluministas de liberdade, igualdade e soberania popular, que também inspiraram movimentos de independência nas Américas.",
      alternatives: {
        create: [
          { label: "A", text: "Revolução Francesa", isCorrect: true },
          { label: "B", text: "Revolução Industrial isoladamente", isCorrect: false },
          { label: "C", text: "Cruzadas", isCorrect: false },
          { label: "D", text: "Reforma Protestante", isCorrect: false },
          { label: "E", text: "Renascimento Cultural", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A Crise dos Mísseis de Cuba, em 1962, é considerada um dos momentos de maior tensão da Guerra Fria porque:",
      year: 2021,
      subjectId: historia.id,
      topicId: guerraFria.id,
      difficulty: 3,
      explanation: "A instalação de mísseis soviéticos em Cuba, próximo aos EUA, levou o mundo à beira de um confronto nuclear direto entre as duas superpotências, sendo resolvida por negociação diplomática de última hora.",
      alternatives: {
        create: [
          { label: "A", text: "Foi o único confronto militar direto entre EUA e URSS", isCorrect: false },
          { label: "B", text: "Quase resultou em confronto nuclear direto entre EUA e URSS", isCorrect: true },
          { label: "C", text: "Marcou o fim definitivo da Guerra Fria", isCorrect: false },
          { label: "D", text: "Envolveu apenas países latino-americanos", isCorrect: false },
          { label: "E", text: "Foi resolvida com a queda do Muro de Berlim", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O trabalho escravo africano foi predominante na economia colonial brasileira principalmente a partir de qual justificativa histórica usada pelos colonizadores?",
      year: 2020,
      subjectId: historia.id,
      topicId: brasilColonia.id,
      difficulty: 2,
      explanation: "Após a resistência e o declínio da escravização indígena (dificultada também pela ação jesuítica), os colonizadores intensificaram o tráfico de africanos escravizados, baseando-se em justificativas econômicas e em preconceitos raciais da época para legitimar a exploração.",
      alternatives: {
        create: [
          { label: "A", text: "A escravidão indígena era proibida desde o início da colonização", isCorrect: false },
          { label: "B", text: "O declínio do uso de mão de obra indígena e o lucro do tráfico negreiro", isCorrect: true },
          { label: "C", text: "Os africanos se ofereciam voluntariamente para o trabalho", isCorrect: false },
          { label: "D", text: "Uma determinação exclusiva da Igreja Católica", isCorrect: false },
          { label: "E", text: "A ausência total de mão de obra livre disponível", isCorrect: false },
        ],
      },
    },
  });


  // ---------------- NOVAS QUESTÕES: FÍSICA ----------------

  await prisma.question.create({
    data: {
      statement: "Um carro parte do repouso e atinge 20 m/s em 5 segundos, com aceleração constante. Qual é essa aceleração?",
      year: 2020,
      subjectId: fisica.id,
      topicId: mecanica.id,
      difficulty: 1,
      explanation: "Aceleração = variação de velocidade / tempo = (20-0)/5 = 4 m/s².",
      alternatives: {
        create: [
          { label: "A", text: "2 m/s²", isCorrect: false },
          { label: "B", text: "4 m/s²", isCorrect: true },
          { label: "C", text: "5 m/s²", isCorrect: false },
          { label: "D", text: "10 m/s²", isCorrect: false },
          { label: "E", text: "20 m/s²", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Um objeto de massa 10 kg está sujeito a uma força resultante de 50 N. Qual é a aceleração desse objeto, segundo a Segunda Lei de Newton?",
      year: 2021,
      subjectId: fisica.id,
      topicId: mecanica.id,
      difficulty: 1,
      explanation: "Pela Segunda Lei de Newton, F = m×a, então a = F/m = 50/10 = 5 m/s².",
      alternatives: {
        create: [
          { label: "A", text: "0,2 m/s²", isCorrect: false },
          { label: "B", text: "2 m/s²", isCorrect: false },
          { label: "C", text: "5 m/s²", isCorrect: true },
          { label: "D", text: "10 m/s²", isCorrect: false },
          { label: "E", text: "50 m/s²", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Quando você está em um ônibus que freia bruscamente e seu corpo é jogado para frente, isso ilustra qual lei física?",
      year: 2019,
      subjectId: fisica.id,
      topicId: mecanica.id,
      difficulty: 2,
      explanation: "É a Primeira Lei de Newton (Lei da Inércia): um corpo tende a manter seu estado de movimento a menos que uma força atue sobre ele — seu corpo 'quer' continuar se movendo mesmo quando o ônibus para.",
      alternatives: {
        create: [
          { label: "A", text: "Primeira Lei de Newton (Inércia)", isCorrect: true },
          { label: "B", text: "Segunda Lei de Newton", isCorrect: false },
          { label: "C", text: "Terceira Lei de Newton", isCorrect: false },
          { label: "D", text: "Lei da Gravitação Universal", isCorrect: false },
          { label: "E", text: "Lei de Conservação de Energia", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Um circuito elétrico simples tem uma resistência de 10 Ω submetida a uma tensão de 20 V. Qual é a corrente elétrica que passa por esse resistor?",
      year: 2022,
      subjectId: fisica.id,
      topicId: eletricidade.id,
      difficulty: 1,
      explanation: "Pela Lei de Ohm, U = R×i, então i = U/R = 20/10 = 2 A (ampères).",
      alternatives: {
        create: [
          { label: "A", text: "0,5 A", isCorrect: false },
          { label: "B", text: "2 A", isCorrect: true },
          { label: "C", text: "10 A", isCorrect: false },
          { label: "D", text: "20 A", isCorrect: false },
          { label: "E", text: "200 A", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Dois resistores de 4 Ω cada, ligados em série, têm resistência equivalente igual a:",
      year: 2020,
      subjectId: fisica.id,
      topicId: eletricidade.id,
      difficulty: 2,
      explanation: "Em associação em série, as resistências simplesmente se somam: Req = 4 + 4 = 8 Ω.",
      alternatives: {
        create: [
          { label: "A", text: "2 Ω", isCorrect: false },
          { label: "B", text: "4 Ω", isCorrect: false },
          { label: "C", text: "8 Ω", isCorrect: true },
          { label: "D", text: "16 Ω", isCorrect: false },
          { label: "E", text: "0,5 Ω", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A potência elétrica de um aparelho ligado a 110 V, consumindo uma corrente de 2 A, é de:",
      year: 2021,
      subjectId: fisica.id,
      topicId: eletricidade.id,
      difficulty: 2,
      explanation: "Potência = tensão × corrente = 110 × 2 = 220 W.",
      alternatives: {
        create: [
          { label: "A", text: "55 W", isCorrect: false },
          { label: "B", text: "112 W", isCorrect: false },
          { label: "C", text: "220 W", isCorrect: true },
          { label: "D", text: "440 W", isCorrect: false },
          { label: "E", text: "55000 W", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Ao aquecer um corpo, aumentando sua temperatura de 20°C para 100°C, o que ocorre com a energia cinética média das partículas desse corpo?",
      year: 2019,
      subjectId: fisica.id,
      topicId: termologia.id,
      difficulty: 2,
      explanation: "Temperatura está diretamente relacionada à energia cinética média das partículas — aumentar a temperatura significa aumentar essa energia cinética média (as partículas se movem mais rápido).",
      alternatives: {
        create: [
          { label: "A", text: "Diminui", isCorrect: false },
          { label: "B", text: "Permanece igual", isCorrect: false },
          { label: "C", text: "Aumenta", isCorrect: true },
          { label: "D", text: "Torna-se negativa", isCorrect: false },
          { label: "E", text: "Depende só da pressão", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A conversão de 100°C para a escala Kelvin resulta em qual temperatura, sabendo que K = °C + 273?",
      year: 2020,
      subjectId: fisica.id,
      topicId: termologia.id,
      difficulty: 1,
      explanation: "K = °C + 273, então 100 + 273 = 373 K.",
      alternatives: {
        create: [
          { label: "A", text: "100 K", isCorrect: false },
          { label: "B", text: "273 K", isCorrect: false },
          { label: "C", text: "373 K", isCorrect: true },
          { label: "D", text: "473 K", isCorrect: false },
          { label: "E", text: "0 K", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O fenômeno em que um gás se transforma diretamente em sólido, sem passar pelo estado líquido, é chamado de:",
      year: 2022,
      subjectId: fisica.id,
      topicId: termologia.id,
      difficulty: 2,
      explanation: "Esse processo é chamado de sublimação inversa (ou ressublimação/sublimação regressiva) — o exemplo mais comum de sublimação (sólido→gás) é o gelo-seco (CO₂ sólido).",
      alternatives: {
        create: [
          { label: "A", text: "Fusão", isCorrect: false },
          { label: "B", text: "Vaporização", isCorrect: false },
          { label: "C", text: "Condensação", isCorrect: false },
          { label: "D", text: "Sublimação (ressublimação)", isCorrect: true },
          { label: "E", text: "Solidificação", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A velocidade do som no ar é bem menor que a velocidade da luz. Esse é o motivo pelo qual, durante uma tempestade, você vê o relâmpago:",
      year: 2021,
      subjectId: fisica.id,
      topicId: ondulatoria.id,
      difficulty: 1,
      explanation: "A luz viaja muito mais rápido que o som (aproximadamente 300.000 km/s contra 340 m/s), então enxergamos o relâmpago quase instantaneamente e só depois ouvimos o trovão.",
      alternatives: {
        create: [
          { label: "A", text: "Antes de ouvir o trovão", isCorrect: true },
          { label: "B", text: "Depois de ouvir o trovão", isCorrect: false },
          { label: "C", text: "Exatamente ao mesmo tempo", isCorrect: false },
          { label: "D", text: "Só se estiver muito perto", isCorrect: false },
          { label: "E", text: "Nunca antes do trovão", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Um espelho que faz convergir os raios de luz refletidos, sendo usado em faróis de carro e telescópios, é do tipo:",
      year: 2019,
      subjectId: fisica.id,
      topicId: ondulatoria.id,
      difficulty: 2,
      explanation: "Espelhos côncavos têm a superfície refletora curvada 'para dentro', o que faz os raios de luz convergirem — por isso são usados pra concentrar luz, como em faróis e telescópios refletores.",
      alternatives: {
        create: [
          { label: "A", text: "Plano", isCorrect: false },
          { label: "B", text: "Côncavo", isCorrect: true },
          { label: "C", text: "Convexo", isCorrect: false },
          { label: "D", text: "Difuso", isCorrect: false },
          { label: "E", text: "Polarizado", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O efeito em que a frequência percebida de um som muda conforme a fonte sonora se aproxima ou se afasta do observador (como a sirene de uma ambulância) é chamado de:",
      year: 2020,
      subjectId: fisica.id,
      topicId: ondulatoria.id,
      difficulty: 3,
      explanation: "Efeito Doppler: quando a fonte se aproxima, a frequência percebida aumenta (som mais agudo); quando se afasta, diminui (som mais grave) — é o clássico exemplo da sirene da ambulância.",
      alternatives: {
        create: [
          { label: "A", text: "Efeito Doppler", isCorrect: true },
          { label: "B", text: "Efeito fotoelétrico", isCorrect: false },
          { label: "C", text: "Ressonância", isCorrect: false },
          { label: "D", text: "Difração", isCorrect: false },
          { label: "E", text: "Refração", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Um corpo em queda livre, desprezando a resistência do ar, tem sua velocidade aumentando de forma constante devido à ação de qual grandeza?",
      year: 2022,
      subjectId: fisica.id,
      topicId: mecanica.id,
      difficulty: 1,
      explanation: "A aceleração da gravidade (g ≈ 9,8 m/s² na Terra) é constante e faz a velocidade do corpo em queda livre aumentar de forma uniforme, desprezando o atrito com o ar.",
      alternatives: {
        create: [
          { label: "A", text: "Aceleração da gravidade", isCorrect: true },
          { label: "B", text: "Força de atrito", isCorrect: false },
          { label: "C", text: "Empuxo", isCorrect: false },
          { label: "D", text: "Força elétrica", isCorrect: false },
          { label: "E", text: "Pressão atmosférica", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Uma lâmpada de 60 W ligada por 10 horas consome quantos kWh de energia elétrica?",
      year: 2021,
      subjectId: fisica.id,
      topicId: eletricidade.id,
      difficulty: 2,
      explanation: "Energia (kWh) = potência (kW) × tempo (h) = 0,06 kW × 10 h = 0,6 kWh.",
      alternatives: {
        create: [
          { label: "A", text: "0,06 kWh", isCorrect: false },
          { label: "B", text: "0,6 kWh", isCorrect: true },
          { label: "C", text: "6 kWh", isCorrect: false },
          { label: "D", text: "60 kWh", isCorrect: false },
          { label: "E", text: "600 kWh", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Pela Terceira Lei de Newton (ação e reação), quando você empurra uma parede com uma força, o que acontece?",
      year: 2019,
      subjectId: fisica.id,
      topicId: mecanica.id,
      difficulty: 1,
      explanation: "A Terceira Lei de Newton diz que toda ação gera uma reação de mesma intensidade e direção, mas sentido oposto — a parede empurra você de volta com a mesma força que você aplicou nela.",
      alternatives: {
        create: [
          { label: "A", text: "A parede não reage, pois está fixa", isCorrect: false },
          { label: "B", text: "A parede empurra você de volta com força igual e sentido oposto", isCorrect: true },
          { label: "C", text: "Você não sente força nenhuma", isCorrect: false },
          { label: "D", text: "A força se anula completamente", isCorrect: false },
          { label: "E", text: "A parede aplica o dobro da força em você", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Em um circuito elétrico em paralelo, ao contrário do circuito em série, o que acontece se uma das lâmpadas queimar?",
      year: 2020,
      subjectId: fisica.id,
      topicId: eletricidade.id,
      difficulty: 2,
      explanation: "No circuito em paralelo, cada componente tem seu próprio caminho de corrente — se uma lâmpada queimar, as outras continuam acesas normalmente, diferente do circuito em série, onde todas apagariam.",
      alternatives: {
        create: [
          { label: "A", text: "Todas as lâmpadas apagam", isCorrect: false },
          { label: "B", text: "As outras lâmpadas continuam acesas normalmente", isCorrect: true },
          { label: "C", text: "O circuito para de conduzir eletricidade completamente", isCorrect: false },
          { label: "D", text: "A tensão total dobra", isCorrect: false },
          { label: "E", text: "A corrente para de existir em todo o circuito", isCorrect: false },
        ],
      },
    },
  });


  // ---------------- NOVAS QUESTÕES: BIOLOGIA ----------------

  await prisma.question.create({
    data: {
      statement: "A organela responsável pela produção de energia (ATP) através da respiração celular, muitas vezes chamada de 'usina de energia' da célula, é a:",
      year: 2020,
      subjectId: biologia.id,
      topicId: citologia.id,
      difficulty: 1,
      explanation: "A mitocôndria é onde ocorre a respiração celular aeróbica, processo que gera a maior parte do ATP (energia) usado pela célula — por isso o apelido de 'usina de energia'.",
      alternatives: {
        create: [
          { label: "A", text: "Mitocôndria", isCorrect: true },
          { label: "B", text: "Ribossomo", isCorrect: false },
          { label: "C", text: "Complexo de Golgi", isCorrect: false },
          { label: "D", text: "Núcleo", isCorrect: false },
          { label: "E", text: "Vacúolo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A diferença fundamental entre células procariontes e eucariontes é que as procariontes:",
      year: 2021,
      subjectId: biologia.id,
      topicId: citologia.id,
      difficulty: 2,
      explanation: "Células procariontes (como as bactérias) não possuem núcleo organizado por membrana — o material genético fica disperso no citoplasma, diferente das eucariontes, que têm núcleo bem delimitado.",
      alternatives: {
        create: [
          { label: "A", text: "Não possuem núcleo organizado por membrana", isCorrect: true },
          { label: "B", text: "Não possuem parede celular", isCorrect: false },
          { label: "C", text: "São sempre maiores que as eucariontes", isCorrect: false },
          { label: "D", text: "Não realizam nenhum tipo de metabolismo", isCorrect: false },
          { label: "E", text: "Possuem sempre múltiplos núcleos", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A organela responsável por realizar a fotossíntese nas células vegetais, convertendo luz solar em energia química, é o:",
      year: 2019,
      subjectId: biologia.id,
      topicId: citologia.id,
      difficulty: 1,
      explanation: "O cloroplasto contém a clorofila, pigmento que capta a luz solar e permite a fotossíntese — processo que converte CO₂ e água em glicose e oxigênio usando energia luminosa.",
      alternatives: {
        create: [
          { label: "A", text: "Cloroplasto", isCorrect: true },
          { label: "B", text: "Lisossomo", isCorrect: false },
          { label: "C", text: "Retículo endoplasmático", isCorrect: false },
          { label: "D", text: "Centríolo", isCorrect: false },
          { label: "E", text: "Peroxissomo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O sistema digestório humano tem início na boca e termina no ânus. Onde ocorre a maior parte da absorção dos nutrientes já digeridos?",
      year: 2022,
      subjectId: biologia.id,
      topicId: fisiologiaHumana.id,
      difficulty: 2,
      explanation: "É no intestino delgado que ocorre a maior parte da absorção de nutrientes, graças às suas vilosidades intestinais que aumentam bastante a área de contato com os alimentos digeridos.",
      alternatives: {
        create: [
          { label: "A", text: "Estômago", isCorrect: false },
          { label: "B", text: "Intestino delgado", isCorrect: true },
          { label: "C", text: "Intestino grosso", isCorrect: false },
          { label: "D", text: "Esôfago", isCorrect: false },
          { label: "E", text: "Fígado", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O sangue humano é bombeado pelo coração, órgão dividido em quatro cavidades. Qual delas é responsável por bombear sangue para todo o corpo (exceto os pulmões)?",
      year: 2020,
      subjectId: biologia.id,
      topicId: fisiologiaHumana.id,
      difficulty: 3,
      explanation: "O ventrículo esquerdo é a cavidade mais musculosa do coração, responsável por bombear o sangue oxigenado para todo o corpo através da artéria aorta (circulação sistêmica).",
      alternatives: {
        create: [
          { label: "A", text: "Átrio direito", isCorrect: false },
          { label: "B", text: "Átrio esquerdo", isCorrect: false },
          { label: "C", text: "Ventrículo direito", isCorrect: false },
          { label: "D", text: "Ventrículo esquerdo", isCorrect: true },
          { label: "E", text: "Válvula mitral", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Durante a respiração, o gás oxigênio inspirado é trocado por gás carbônico nos pulmões, em estruturas microscópicas chamadas:",
      year: 2021,
      subjectId: biologia.id,
      topicId: fisiologiaHumana.id,
      difficulty: 1,
      explanation: "Os alvéolos pulmonares são pequenas bolsas onde ocorre a troca gasosa (hematose): o oxigênio passa para o sangue e o gás carbônico sai do sangue para ser expirado.",
      alternatives: {
        create: [
          { label: "A", text: "Bronquíolos", isCorrect: false },
          { label: "B", text: "Alvéolos", isCorrect: true },
          { label: "C", text: "Traqueia", isCorrect: false },
          { label: "D", text: "Laringe", isCorrect: false },
          { label: "E", text: "Pleura", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Em um ecossistema, os organismos que produzem seu próprio alimento através da fotossíntese, formando a base da cadeia alimentar, são chamados de:",
      year: 2019,
      subjectId: biologia.id,
      topicId: ecologia.id,
      difficulty: 1,
      explanation: "Produtores (como plantas e algas) são autotróficos — produzem seu próprio alimento via fotossíntese, servindo de base energética para todos os outros níveis da cadeia alimentar.",
      alternatives: {
        create: [
          { label: "A", text: "Produtores", isCorrect: true },
          { label: "B", text: "Consumidores primários", isCorrect: false },
          { label: "C", text: "Decompositores", isCorrect: false },
          { label: "D", text: "Consumidores secundários", isCorrect: false },
          { label: "E", text: "Predadores de topo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Os decompositores (como fungos e bactérias) têm papel fundamental em um ecossistema porque:",
      year: 2020,
      subjectId: biologia.id,
      topicId: ecologia.id,
      difficulty: 2,
      explanation: "Os decompositores quebram a matéria orgânica morta (restos de plantas e animais), devolvendo nutrientes ao solo e permitindo que esses nutrientes sejam reaproveitados pelos produtores — fechando o ciclo da matéria.",
      alternatives: {
        create: [
          { label: "A", text: "Produzem oxigênio em grande quantidade", isCorrect: false },
          { label: "B", text: "Devolvem nutrientes ao ambiente ao decompor matéria orgânica", isCorrect: true },
          { label: "C", text: "São os principais predadores do ecossistema", isCorrect: false },
          { label: "D", text: "Realizam fotossíntese em grande escala", isCorrect: false },
          { label: "E", text: "Não têm nenhuma função ecológica relevante", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O desmatamento de grandes áreas florestais, como a Amazônia, afeta diretamente qual ciclo biogeoquímico global, contribuindo para o aquecimento do planeta?",
      year: 2022,
      subjectId: biologia.id,
      topicId: ecologia.id,
      difficulty: 2,
      explanation: "O desmatamento reduz a capacidade das florestas de absorver CO₂ (via fotossíntese) e ainda libera carbono estocado nas árvores quando queimadas, afetando diretamente o ciclo do carbono e intensificando o efeito estufa.",
      alternatives: {
        create: [
          { label: "A", text: "Ciclo do carbono", isCorrect: true },
          { label: "B", text: "Ciclo do fósforo apenas", isCorrect: false },
          { label: "C", text: "Ciclo da água exclusivamente", isCorrect: false },
          { label: "D", text: "Nenhum ciclo é afetado", isCorrect: false },
          { label: "E", text: "Apenas o ciclo do nitrogênio", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Segundo as Leis de Mendel, quando se cruzam dois indivíduos heterozigotos (Aa x Aa) para uma característica, qual a proporção genotípica esperada na geração seguinte?",
      year: 2021,
      subjectId: biologia.id,
      topicId: genetica.id,
      difficulty: 3,
      explanation: "No cruzamento Aa x Aa, a proporção genotípica esperada é 1 AA : 2 Aa : 1 aa (25% homozigoto dominante, 50% heterozigoto, 25% homozigoto recessivo).",
      alternatives: {
        create: [
          { label: "A", text: "1 AA : 2 Aa : 1 aa", isCorrect: true },
          { label: "B", text: "1 AA : 1 aa", isCorrect: false },
          { label: "C", text: "3 AA : 1 aa", isCorrect: false },
          { label: "D", text: "Todos Aa", isCorrect: false },
          { label: "E", text: "2 AA : 2 aa", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O DNA (ácido desoxirribonucleico) é a molécula que carrega as informações genéticas dos seres vivos. Ele está localizado principalmente em qual estrutura da célula eucarionte?",
      year: 2019,
      subjectId: biologia.id,
      topicId: genetica.id,
      difficulty: 1,
      explanation: "Nas células eucariontes, o DNA fica organizado dentro do núcleo, formando os cromossomos (há também um pouco de DNA na mitocôndria, mas a maior parte está no núcleo).",
      alternatives: {
        create: [
          { label: "A", text: "Núcleo", isCorrect: true },
          { label: "B", text: "Ribossomo", isCorrect: false },
          { label: "C", text: "Complexo de Golgi", isCorrect: false },
          { label: "D", text: "Membrana plasmática", isCorrect: false },
          { label: "E", text: "Vacúolo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Uma característica determinada por um gene recessivo só se manifesta no fenótipo do indivíduo quando ele é:",
      year: 2020,
      subjectId: biologia.id,
      topicId: genetica.id,
      difficulty: 2,
      explanation: "Genes recessivos só se expressam no fenótipo quando o indivíduo é homozigoto recessivo (aa) — na condição heterozigota (Aa), o gene dominante 'mascara' o recessivo.",
      alternatives: {
        create: [
          { label: "A", text: "Heterozigoto (Aa)", isCorrect: false },
          { label: "B", text: "Homozigoto dominante (AA)", isCorrect: false },
          { label: "C", text: "Homozigoto recessivo (aa)", isCorrect: true },
          { label: "D", text: "Portador assintomático", isCorrect: false },
          { label: "E", text: "Sempre, independente do genótipo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A relação ecológica em que duas espécies vivem juntas e ambas se beneficiam, como as bactérias que ajudam na digestão do intestino humano, é chamada de:",
      year: 2021,
      subjectId: biologia.id,
      topicId: ecologia.id,
      difficulty: 1,
      explanation: "Mutualismo é a relação ecológica harmônica em que ambas as espécies envolvidas se beneficiam — como no caso das bactérias intestinais, que recebem abrigo e nutrientes enquanto ajudam na digestão do hospedeiro.",
      alternatives: {
        create: [
          { label: "A", text: "Mutualismo", isCorrect: true },
          { label: "B", text: "Parasitismo", isCorrect: false },
          { label: "C", text: "Competição", isCorrect: false },
          { label: "D", text: "Predatismo", isCorrect: false },
          { label: "E", text: "Amensalismo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O sistema nervoso humano é dividido em Sistema Nervoso Central (SNC) e Sistema Nervoso Periférico (SNP). O SNC é formado por quais estruturas?",
      year: 2022,
      subjectId: biologia.id,
      topicId: fisiologiaHumana.id,
      difficulty: 2,
      explanation: "O Sistema Nervoso Central é formado pelo encéfalo (cérebro, cerebelo e tronco encefálico) e pela medula espinhal — as demais estruturas nervosas (nervos periféricos) fazem parte do SNP.",
      alternatives: {
        create: [
          { label: "A", text: "Encéfalo e medula espinhal", isCorrect: true },
          { label: "B", text: "Apenas os nervos periféricos", isCorrect: false },
          { label: "C", text: "Apenas o coração e vasos sanguíneos", isCorrect: false },
          { label: "D", text: "Rins e bexiga", isCorrect: false },
          { label: "E", text: "Pulmões e diafragma", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A membrana plasmática, que envolve todas as células, é composta principalmente por qual tipo de molécula, organizada em uma bicamada?",
      year: 2020,
      subjectId: biologia.id,
      topicId: citologia.id,
      difficulty: 2,
      explanation: "A membrana plasmática é formada principalmente por uma bicamada de fosfolipídios, com proteínas inseridas nela, controlando o que entra e sai da célula.",
      alternatives: {
        create: [
          { label: "A", text: "Fosfolipídios", isCorrect: true },
          { label: "B", text: "Celulose", isCorrect: false },
          { label: "C", text: "Amido", isCorrect: false },
          { label: "D", text: "DNA", isCorrect: false },
          { label: "E", text: "Glicogênio puro", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A vacinação funciona estimulando o sistema imunológico a produzir defesas contra um agente infeccioso, sem causar a doença. Essas defesas produzidas pelo organismo são chamadas de:",
      year: 2019,
      subjectId: biologia.id,
      topicId: fisiologiaHumana.id,
      difficulty: 1,
      explanation: "Anticorpos são proteínas produzidas pelos linfócitos (glóbulos brancos) em resposta a um antígeno — a vacina expõe o corpo a uma versão inofensiva do agente infeccioso, ensinando o sistema imune a produzir esses anticorpos antecipadamente.",
      alternatives: {
        create: [
          { label: "A", text: "Anticorpos", isCorrect: true },
          { label: "B", text: "Hormônios", isCorrect: false },
          { label: "C", text: "Enzimas digestivas", isCorrect: false },
          { label: "D", text: "Hemácias", isCorrect: false },
          { label: "E", text: "Plaquetas", isCorrect: false },
        ],
      },
    },
  });


  // ---------------- NOVAS QUESTÕES: GEOGRAFIA ----------------

  await prisma.question.create({
    data: {
      statement: "O êxodo rural, fenômeno intenso no Brasil a partir da segunda metade do século XX, é caracterizado por:",
      year: 2020,
      subjectId: geografia.id,
      topicId: urbanizacao.id,
      difficulty: 1,
      explanation: "Êxodo rural é a migração da população do campo para as cidades, geralmente em busca de emprego e melhores condições de vida — foi um dos principais motores da rápida urbanização brasileira.",
      alternatives: {
        create: [
          { label: "A", text: "Migração do campo para as cidades", isCorrect: true },
          { label: "B", text: "Migração das cidades para o campo", isCorrect: false },
          { label: "C", text: "Crescimento da população rural", isCorrect: false },
          { label: "D", text: "Redução da população urbana", isCorrect: false },
          { label: "E", text: "Estagnação populacional total", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "As favelas e ocupações irregulares em grandes cidades brasileiras são, em grande parte, consequência de qual problema urbano?",
      year: 2021,
      subjectId: geografia.id,
      topicId: urbanizacao.id,
      difficulty: 2,
      explanation: "O déficit habitacional e a especulação imobiliária (que encarece moradias regulares em áreas centrais) empurram parte da população para ocupações irregulares em áreas de risco ou periféricas, formando favelas.",
      alternatives: {
        create: [
          { label: "A", text: "Excesso de moradias populares disponíveis", isCorrect: false },
          { label: "B", text: "Déficit habitacional e especulação imobiliária", isCorrect: true },
          { label: "C", text: "Falta de população nas cidades", isCorrect: false },
          { label: "D", text: "Excesso de áreas verdes protegidas", isCorrect: false },
          { label: "E", text: "Planejamento urbano perfeito", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "'Cidades globais', como Nova York, Londres e São Paulo, são assim chamadas por concentrarem principalmente:",
      year: 2019,
      subjectId: geografia.id,
      topicId: urbanizacao.id,
      difficulty: 3,
      explanation: "Cidades globais concentram centros de decisão financeira, sedes de grandes corporações multinacionais e serviços avançados, exercendo forte influência econômica e política em escala mundial.",
      alternatives: {
        create: [
          { label: "A", text: "Centros de decisão financeira e sedes de multinacionais", isCorrect: true },
          { label: "B", text: "A maior parte da produção agrícola mundial", isCorrect: false },
          { label: "C", text: "Reservas florestais intocadas", isCorrect: false },
          { label: "D", text: "A menor densidade populacional do planeta", isCorrect: false },
          { label: "E", text: "Apenas atividades extrativistas", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O efeito estufa é um fenômeno natural essencial para manter a Terra aquecida, mas vem sendo intensificado pela ação humana principalmente através de:",
      year: 2022,
      subjectId: geografia.id,
      topicId: climatologia.id,
      difficulty: 1,
      explanation: "A queima de combustíveis fósseis (carvão, petróleo, gás natural) libera grandes quantidades de CO₂ e outros gases de efeito estufa, intensificando o fenômeno natural e causando o aquecimento global acelerado.",
      alternatives: {
        create: [
          { label: "A", text: "Queima de combustíveis fósseis", isCorrect: true },
          { label: "B", text: "Aumento das áreas de floresta nativa", isCorrect: false },
          { label: "C", text: "Redução do uso de veículos", isCorrect: false },
          { label: "D", text: "Diminuição da população mundial", isCorrect: false },
          { label: "E", text: "Aumento do uso de energia solar", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O clima equatorial, presente na região amazônica, é caracterizado principalmente por:",
      year: 2020,
      subjectId: geografia.id,
      topicId: climatologia.id,
      difficulty: 1,
      explanation: "O clima equatorial é marcado por altas temperaturas o ano todo e chuvas abundantes e bem distribuídas ao longo do ano, sem uma estação seca definida — o que favorece a floresta densa da Amazônia.",
      alternatives: {
        create: [
          { label: "A", text: "Temperaturas altas o ano todo e chuvas abundantes", isCorrect: true },
          { label: "B", text: "Invernos rigorosos e verões secos", isCorrect: false },
          { label: "C", text: "Ausência quase total de chuvas", isCorrect: false },
          { label: "D", text: "Temperaturas baixas constantes", isCorrect: false },
          { label: "E", text: "Grandes variações sazonais extremas", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Fenômenos climáticos como El Niño e La Niña estão relacionados a alterações na temperatura de qual oceano, afetando o clima global?",
      year: 2021,
      subjectId: geografia.id,
      topicId: climatologia.id,
      difficulty: 2,
      explanation: "El Niño e La Niña são fenômenos ligados ao aquecimento (El Niño) ou resfriamento (La Niña) anormal das águas do Oceano Pacífico equatorial, o que altera padrões de chuva e temperatura em diversas regiões do mundo.",
      alternatives: {
        create: [
          { label: "A", text: "Oceano Atlântico", isCorrect: false },
          { label: "B", text: "Oceano Pacífico", isCorrect: true },
          { label: "C", text: "Oceano Índico", isCorrect: false },
          { label: "D", text: "Oceano Ártico", isCorrect: false },
          { label: "E", text: "Mar Mediterrâneo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Blocos econômicos regionais, como o Mercosul e a União Europeia, têm como um de seus principais objetivos:",
      year: 2019,
      subjectId: geografia.id,
      topicId: geopolitica.id,
      difficulty: 2,
      explanation: "Blocos econômicos buscam facilitar o comércio entre seus membros, reduzindo ou eliminando tarifas alfandegárias e barreiras comerciais, fortalecendo a economia regional em conjunto.",
      alternatives: {
        create: [
          { label: "A", text: "Facilitar o comércio entre os países-membros", isCorrect: true },
          { label: "B", text: "Isolar completamente os países do comércio externo", isCorrect: false },
          { label: "C", text: "Eliminar todas as fronteiras políticas do mundo", isCorrect: false },
          { label: "D", text: "Unificar todas as moedas mundiais", isCorrect: false },
          { label: "E", text: "Acabar com organizações internacionais", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A Organização das Nações Unidas (ONU) foi criada em 1945, logo após a Segunda Guerra Mundial, com o principal objetivo de:",
      year: 2020,
      subjectId: geografia.id,
      topicId: geopolitica.id,
      difficulty: 1,
      explanation: "A ONU foi criada para promover a paz e segurança internacional, prevenindo novos conflitos globais como as duas Guerras Mundiais, além de fomentar cooperação entre as nações.",
      alternatives: {
        create: [
          { label: "A", text: "Promover a paz e segurança internacional", isCorrect: true },
          { label: "B", text: "Controlar a economia de todos os países", isCorrect: false },
          { label: "C", text: "Substituir os governos nacionais", isCorrect: false },
          { label: "D", text: "Financiar apenas o comércio de armas", isCorrect: false },
          { label: "E", text: "Ser um bloco econômico regional", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A chamada 'nova ordem mundial multipolar' que se discute atualmente se refere a:",
      year: 2022,
      subjectId: geografia.id,
      topicId: geopolitica.id,
      difficulty: 3,
      explanation: "Diferente da bipolaridade da Guerra Fria (EUA x URSS) ou da unipolaridade dos EUA nos anos 1990-2000, a multipolaridade se refere à existência de múltiplos centros de poder global relevantes simultaneamente (como EUA, China, União Europeia, entre outros).",
      alternatives: {
        create: [
          { label: "A", text: "Um único país dominando toda a geopolítica mundial", isCorrect: false },
          { label: "B", text: "Múltiplos centros de poder e influência global coexistindo", isCorrect: true },
          { label: "C", text: "O retorno estrito ao sistema bipolar da Guerra Fria", isCorrect: false },
          { label: "D", text: "O fim de toda forma de disputa geopolítica", isCorrect: false },
          { label: "E", text: "Uma organização única governando o planeta", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O agronegócio brasileiro é fortemente baseado na monocultura de exportação, como soja e cana-de-açúcar. Uma crítica comum a esse modelo é:",
      year: 2021,
      subjectId: geografia.id,
      topicId: espacoRural.id,
      difficulty: 2,
      explanation: "A monocultura em larga escala tende a gerar concentração fundiária (grandes propriedades) e impactos ambientais como desmatamento e uso intensivo de agrotóxicos, além de gerar menos empregos por hectare do que a agricultura familiar diversificada.",
      alternatives: {
        create: [
          { label: "A", text: "Concentração de terras e impactos ambientais", isCorrect: true },
          { label: "B", text: "Geração excessiva de empregos rurais", isCorrect: false },
          { label: "C", text: "Diversificação extrema de culturas plantadas", isCorrect: false },
          { label: "D", text: "Ausência total de exportações", isCorrect: false },
          { label: "E", text: "Nenhum impacto ambiental relevante", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A agricultura familiar, diferente do agronegócio de larga escala, é caracterizada principalmente por:",
      year: 2019,
      subjectId: geografia.id,
      topicId: espacoRural.id,
      difficulty: 1,
      explanation: "A agricultura familiar é baseada em pequenas propriedades, com mão de obra majoritariamente da própria família, geralmente voltada tanto para subsistência quanto para o mercado local — é uma importante fonte de alimentos no Brasil, como frutas, legumes e verduras.",
      alternatives: {
        create: [
          { label: "A", text: "Pequenas propriedades com mão de obra familiar", isCorrect: true },
          { label: "B", text: "Grandes latifúndios mecanizados", isCorrect: false },
          { label: "C", text: "Exclusivamente monocultura de exportação", isCorrect: false },
          { label: "D", text: "Uso exclusivo de mão de obra assalariada estrangeira", isCorrect: false },
          { label: "E", text: "Produção voltada só para exportação", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A Revolução Verde, ocorrida a partir da década de 1960, transformou a agricultura mundial principalmente através de:",
      year: 2020,
      subjectId: geografia.id,
      topicId: espacoRural.id,
      difficulty: 3,
      explanation: "A Revolução Verde introduziu sementes geneticamente melhoradas, fertilizantes químicos, agrotóxicos e mecanização intensiva, aumentando muito a produtividade agrícola, mas também gerando dependência tecnológica e impactos ambientais.",
      alternatives: {
        create: [
          { label: "A", text: "Sementes melhoradas, fertilizantes químicos e mecanização", isCorrect: true },
          { label: "B", text: "Abandono total do uso de máquinas agrícolas", isCorrect: false },
          { label: "C", text: "Proibição de fertilizantes e agrotóxicos", isCorrect: false },
          { label: "D", text: "Retorno a técnicas agrícolas pré-industriais", isCorrect: false },
          { label: "E", text: "Fim da produção agrícola em larga escala", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A desertificação, processo de degradação de terras em áreas secas, é intensificada principalmente por:",
      year: 2021,
      subjectId: geografia.id,
      topicId: climatologia.id,
      difficulty: 2,
      explanation: "O desmatamento, o superpastoreio e práticas agrícolas inadequadas em regiões já naturalmente secas aceleram a degradação do solo, tornando-o cada vez mais árido e improdutivo — um processo acelerado pelas mudanças climáticas.",
      alternatives: {
        create: [
          { label: "A", text: "Desmatamento e uso inadequado do solo em áreas secas", isCorrect: true },
          { label: "B", text: "Excesso de chuvas na região", isCorrect: false },
          { label: "C", text: "Reflorestamento intensivo", isCorrect: false },
          { label: "D", text: "Diminuição do pastoreio de animais", isCorrect: false },
          { label: "E", text: "Aumento da umidade do ar constante", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A urbanização acelerada e desordenada de muitas cidades brasileiras no século XX resultou em qual problema ambiental urbano comum?",
      year: 2022,
      subjectId: geografia.id,
      topicId: urbanizacao.id,
      difficulty: 1,
      explanation: "A ocupação desordenada, muitas vezes em áreas de risco (encostas, margens de rios), sem planejamento adequado de drenagem, é uma das principais causas de enchentes e deslizamentos recorrentes em grandes cidades brasileiras.",
      alternatives: {
        create: [
          { label: "A", text: "Enchentes e deslizamentos de terra", isCorrect: true },
          { label: "B", text: "Excesso de áreas verdes preservadas", isCorrect: false },
          { label: "C", text: "Baixa densidade populacional", isCorrect: false },
          { label: "D", text: "Ausência completa de problemas de mobilidade", isCorrect: false },
          { label: "E", text: "Redução do custo de moradia em todas as regiões", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Países chamados de 'potências emergentes', como o Brasil, integram o grupo conhecido pela sigla:",
      year: 2020,
      subjectId: geografia.id,
      topicId: geopolitica.id,
      difficulty: 1,
      explanation: "BRICS é a sigla que reúne Brasil, Rússia, Índia, China e África do Sul — países emergentes que ganharam destaque econômico e político nas últimas décadas.",
      alternatives: {
        create: [
          { label: "A", text: "BRICS", isCorrect: true },
          { label: "B", text: "OTAN", isCorrect: false },
          { label: "C", text: "G7", isCorrect: false },
          { label: "D", text: "OPEP", isCorrect: false },
          { label: "E", text: "União Europeia", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A gentrificação é um processo urbano em que áreas centrais antes degradadas passam por valorização imobiliária. Um efeito comum desse processo é:",
      year: 2021,
      subjectId: geografia.id,
      topicId: urbanizacao.id,
      difficulty: 3,
      explanation: "A gentrificação valoriza a região (com reformas, comércio novo, segurança), mas encarece aluguéis e o custo de vida, muitas vezes expulsando os antigos moradores de menor renda para outras áreas da cidade.",
      alternatives: {
        create: [
          { label: "A", text: "Expulsão dos moradores originais de baixa renda pela valorização", isCorrect: true },
          { label: "B", text: "Queda geral do valor dos imóveis na região", isCorrect: false },
          { label: "C", text: "Redução do comércio local", isCorrect: false },
          { label: "D", text: "Fixação garantida de todos os antigos moradores", isCorrect: false },
          { label: "E", text: "Nenhuma alteração na dinâmica populacional", isCorrect: false },
        ],
      },
    },
  });


  // ---------------- NOVAS QUESTÕES: FILOSOFIA ----------------

  await prisma.question.create({
    data: {
      statement: "Sócrates, considerado um dos fundadores da filosofia ocidental, é conhecido por sua célebre frase que resume seu método de investigação:",
      year: 2020,
      subjectId: filosofia.id,
      topicId: filosofiaAntiga.id,
      difficulty: 1,
      explanation: "'Só sei que nada sei' resume a postura socrática de reconhecer a própria ignorância como ponto de partida para o verdadeiro conhecimento, incentivando o questionamento constante através do diálogo (método socrático).",
      alternatives: {
        create: [
          { label: "A", text: "'Penso, logo existo'", isCorrect: false },
          { label: "B", text: "'Só sei que nada sei'", isCorrect: true },
          { label: "C", text: "'O homem é a medida de todas as coisas'", isCorrect: false },
          { label: "D", text: "'Conhece-te a ti mesmo através da fé'", isCorrect: false },
          { label: "E", text: "'A vida não examinada não vale a pena ser vivida, disse outro filósofo'", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Platão, discípulo de Sócrates, desenvolveu a Teoria das Ideias (ou Formas), segundo a qual o mundo sensível (que percebemos pelos sentidos) é:",
      year: 2021,
      subjectId: filosofia.id,
      topicId: filosofiaAntiga.id,
      difficulty: 3,
      explanation: "Para Platão, o mundo sensível é apenas uma cópia imperfeita e passageira do mundo das Ideias, que é o único verdadeiramente real, eterno e perfeito — acessível apenas pela razão, não pelos sentidos.",
      alternatives: {
        create: [
          { label: "A", text: "Uma cópia imperfeita do mundo das Ideias", isCorrect: true },
          { label: "B", text: "A única realidade que existe", isCorrect: false },
          { label: "C", text: "Superior ao mundo das Ideias", isCorrect: false },
          { label: "D", text: "Idêntico ao mundo das Ideias", isCorrect: false },
          { label: "E", text: "Inexistente por completo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Aristóteles, aluno de Platão, discordava de seu mestre ao defender que o conhecimento deveria partir principalmente:",
      year: 2019,
      subjectId: filosofia.id,
      topicId: filosofiaAntiga.id,
      difficulty: 2,
      explanation: "Diferente de Platão (que valorizava o mundo das Ideias acessado pela razão pura), Aristóteles valorizava a observação empírica do mundo sensível como ponto de partida do conhecimento — sendo considerado o pai do método empírico.",
      alternatives: {
        create: [
          { label: "A", text: "Da observação da realidade sensível (empirismo)", isCorrect: true },
          { label: "B", text: "Exclusivamente da intuição divina", isCorrect: false },
          { label: "C", text: "Apenas de sonhos e visões", isCorrect: false },
          { label: "D", text: "Da autoridade religiosa", isCorrect: false },
          { label: "E", text: "Da adivinhação e oráculos", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Na Teoria do Conhecimento, a corrente filosófica que defende que todo conhecimento deriva fundamentalmente da experiência sensível é chamada de:",
      year: 2020,
      subjectId: filosofia.id,
      topicId: teoriaConhecimento.id,
      difficulty: 2,
      explanation: "O Empirismo (com filósofos como John Locke e David Hume) sustenta que a mente nasce como uma 'tábula rasa' e todo conhecimento vem da experiência sensorial — em oposição ao racionalismo, que valoriza a razão pura.",
      alternatives: {
        create: [
          { label: "A", text: "Racionalismo", isCorrect: false },
          { label: "B", text: "Empirismo", isCorrect: true },
          { label: "C", text: "Ceticismo absoluto", isCorrect: false },
          { label: "D", text: "Dogmatismo", isCorrect: false },
          { label: "E", text: "Idealismo transcendental exclusivamente", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "René Descartes, considerado o pai da filosofia moderna, buscou uma base absolutamente certa para o conhecimento através do método da dúvida, chegando à conclusão expressa em:",
      year: 2022,
      subjectId: filosofia.id,
      topicId: teoriaConhecimento.id,
      difficulty: 2,
      explanation: "'Penso, logo existo' (Cogito, ergo sum) é a certeza fundamental que Descartes encontra: mesmo duvidando de tudo, o próprio ato de duvidar/pensar prova a existência do sujeito que pensa.",
      alternatives: {
        create: [
          { label: "A", text: "'Penso, logo existo'", isCorrect: true },
          { label: "B", text: "'Conhece-te a ti mesmo'", isCorrect: false },
          { label: "C", text: "'O homem é bom por natureza'", isCorrect: false },
          { label: "D", text: "'Tudo que existe é matéria'", isCorrect: false },
          { label: "E", text: "'A dúvida é impossível'", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Immanuel Kant propôs que o conhecimento humano resulta da combinação entre a experiência sensível e estruturas a priori (anteriores à experiência) da própria mente. Essa posição é conhecida como:",
      year: 2021,
      subjectId: filosofia.id,
      topicId: teoriaConhecimento.id,
      difficulty: 3,
      explanation: "O Idealismo transcendental (ou criticismo) de Kant busca superar a dicotomia entre racionalismo e empirismo, defendendo que a mente organiza ativamente os dados da experiência através de categorias a priori, como espaço e tempo.",
      alternatives: {
        create: [
          { label: "A", text: "Idealismo transcendental (criticismo)", isCorrect: true },
          { label: "B", text: "Empirismo puro", isCorrect: false },
          { label: "C", text: "Ceticismo radical", isCorrect: false },
          { label: "D", text: "Materialismo dialético", isCorrect: false },
          { label: "E", text: "Positivismo lógico", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Na Ética, a corrente filosófica que julga uma ação moralmente correta com base em suas consequências (o maior bem para o maior número de pessoas) é chamada de:",
      year: 2019,
      subjectId: filosofia.id,
      topicId: eticaFilosofia.id,
      difficulty: 2,
      explanation: "O Utilitarismo, defendido por filósofos como Jeremy Bentham e John Stuart Mill, avalia a moralidade de uma ação pelas suas consequências práticas, buscando maximizar o bem-estar geral.",
      alternatives: {
        create: [
          { label: "A", text: "Utilitarismo", isCorrect: true },
          { label: "B", text: "Deontologia kantiana", isCorrect: false },
          { label: "C", text: "Ética das virtudes aristotélica", isCorrect: false },
          { label: "D", text: "Niilismo", isCorrect: false },
          { label: "E", text: "Hedonismo puro individual", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Immanuel Kant, na Ética, defende que uma ação só é verdadeiramente moral quando realizada por dever, seguindo princípios universais, independente das consequências. Essa posição é chamada de:",
      year: 2020,
      subjectId: filosofia.id,
      topicId: eticaFilosofia.id,
      difficulty: 3,
      explanation: "A ética deontológica kantiana julga a moralidade pela intenção e pelo cumprimento do dever segundo o 'imperativo categórico' (agir apenas segundo máximas que poderiam se tornar leis universais), não pelas consequências da ação.",
      alternatives: {
        create: [
          { label: "A", text: "Ética deontológica", isCorrect: true },
          { label: "B", text: "Utilitarismo", isCorrect: false },
          { label: "C", text: "Relativismo moral", isCorrect: false },
          { label: "D", text: "Hedonismo", isCorrect: false },
          { label: "E", text: "Ceticismo ético", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Aristóteles, na 'Ética a Nicômaco', defende que a felicidade (eudaimonia) é alcançada principalmente através de:",
      year: 2021,
      subjectId: filosofia.id,
      topicId: eticaFilosofia.id,
      difficulty: 2,
      explanation: "Para Aristóteles, a felicidade genuína (eudaimonia) é alcançada pelo exercício das virtudes e da razão ao longo da vida — não é um estado momentâneo de prazer, mas resultado de um viver virtuoso e equilibrado.",
      alternatives: {
        create: [
          { label: "A", text: "O exercício das virtudes e da razão", isCorrect: true },
          { label: "B", text: "O acúmulo de riqueza material", isCorrect: false },
          { label: "C", text: "A busca isolada por prazeres momentâneos", isCorrect: false },
          { label: "D", text: "A total ausência de responsabilidades", isCorrect: false },
          { label: "E", text: "A submissão completa a outros indivíduos", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "No campo da Filosofia Política, o filósofo Thomas Hobbes descreveu o 'estado de natureza' (antes da formação da sociedade) como um estado de:",
      year: 2020,
      subjectId: filosofia.id,
      topicId: filosofiaPolitica.id,
      difficulty: 2,
      explanation: "Hobbes descreve o estado de natureza como 'guerra de todos contra todos', onde a vida seria 'solitária, pobre, sórdida, embrutecida e curta' — daí a necessidade de um contrato social que institua um Estado forte (o 'Leviatã') para garantir a paz.",
      alternatives: {
        create: [
          { label: "A", text: "Guerra de todos contra todos", isCorrect: true },
          { label: "B", text: "Paz e cooperação espontânea perfeita", isCorrect: false },
          { label: "C", text: "Organização estatal já plenamente desenvolvida", isCorrect: false },
          { label: "D", text: "Ausência total de conflitos por natureza", isCorrect: false },
          { label: "E", text: "Igualdade econômica absoluta", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Jean-Jacques Rousseau, diferente de Hobbes, via o ser humano no estado de natureza como originalmente:",
      year: 2022,
      subjectId: filosofia.id,
      topicId: filosofiaPolitica.id,
      difficulty: 2,
      explanation: "Rousseau defende que o ser humano é naturalmente bom ('bom selvagem'), sendo corrompido pela própria sociedade e suas desigualdades — uma visão bem diferente e otimista em relação a Hobbes.",
      alternatives: {
        create: [
          { label: "A", text: "Bom por natureza, corrompido pela sociedade", isCorrect: true },
          { label: "B", text: "Cruel e violento por natureza", isCorrect: false },
          { label: "C", text: "Já plenamente civilizado desde o nascimento", isCorrect: false },
          { label: "D", text: "Incapaz de qualquer forma de razão", isCorrect: false },
          { label: "E", text: "Idêntico aos animais em tudo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O conceito de 'contrato social', presente em filósofos como Hobbes, Locke e Rousseau, se refere basicamente a:",
      year: 2019,
      subjectId: filosofia.id,
      topicId: filosofiaPolitica.id,
      difficulty: 2,
      explanation: "O contrato social é a ideia (teórica) de que os indivíduos abrem mão de parte de sua liberdade natural em troca da proteção e organização oferecidas por um Estado, formando assim a sociedade civil organizada.",
      alternatives: {
        create: [
          { label: "A", text: "Um acordo entre indivíduos para formar a sociedade civil e o Estado", isCorrect: true },
          { label: "B", text: "Um documento histórico real assinado por todos os cidadãos", isCorrect: false },
          { label: "C", text: "A abolição total de qualquer forma de governo", isCorrect: false },
          { label: "D", text: "Um tratado apenas entre nações", isCorrect: false },
          { label: "E", text: "A eliminação da propriedade privada", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O ceticismo filosófico, corrente que questiona a possibilidade de um conhecimento absolutamente certo, tem em Pirro da Élide um de seus representantes na Antiguidade. Essa corrente defende principalmente:",
      year: 2021,
      subjectId: filosofia.id,
      topicId: teoriaConhecimento.id,
      difficulty: 3,
      explanation: "O ceticismo questiona a possibilidade de se alcançar certezas absolutas sobre a realidade, defendendo a suspensão do juízo (epoché) diante de afirmações dogmáticas, mantendo uma postura de dúvida permanente.",
      alternatives: {
        create: [
          { label: "A", text: "A suspensão do juízo diante de afirmações dogmáticas", isCorrect: true },
          { label: "B", text: "A certeza absoluta sobre todo o conhecimento humano", isCorrect: false },
          { label: "C", text: "A fé como única fonte válida de conhecimento", isCorrect: false },
          { label: "D", text: "A impossibilidade total de qualquer ação prática", isCorrect: false },
          { label: "E", text: "A adoção cega de qualquer opinião popular", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Na Grécia Antiga, os sofistas, contemporâneos de Sócrates, eram conhecidos principalmente por:",
      year: 2020,
      subjectId: filosofia.id,
      topicId: filosofiaAntiga.id,
      difficulty: 2,
      explanation: "Os sofistas eram mestres itinerantes que ensinavam retórica e argumentação, muitas vezes cobrando por isso, e defendiam certo relativismo (como na frase de Protágoras: 'o homem é a medida de todas as coisas') — postura criticada por Sócrates.",
      alternatives: {
        create: [
          { label: "A", text: "Ensinar retórica e defender certo relativismo moral", isCorrect: true },
          { label: "B", text: "Viver isolados, sem contato com outros cidadãos", isCorrect: false },
          { label: "C", text: "Rejeitar totalmente qualquer forma de ensino remunerado", isCorrect: false },
          { label: "D", text: "Defender verdades absolutas e imutáveis", isCorrect: false },
          { label: "E", text: "Ignorar completamente a linguagem e o discurso", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A alegoria da caverna, criada por Platão, ilustra a diferença entre o mundo sensível (das aparências) e o mundo inteligível (das Ideias), sugerindo que o processo de conhecimento verdadeiro é comparado a:",
      year: 2022,
      subjectId: filosofia.id,
      topicId: filosofiaAntiga.id,
      difficulty: 3,
      explanation: "Na alegoria, prisioneiros veem apenas sombras na parede de uma caverna (o mundo sensível) até que um deles se liberta e sai para ver o mundo real iluminado pelo sol (o mundo das Ideias) — um processo difícil e gradual de libertação rumo ao conhecimento verdadeiro.",
      alternatives: {
        create: [
          { label: "A", text: "Uma libertação gradual e difícil rumo à verdade", isCorrect: true },
          { label: "B", text: "Um processo instantâneo e sem esforço", isCorrect: false },
          { label: "C", text: "Uma experiência exclusivamente sensorial", isCorrect: false },
          { label: "D", text: "Um caminho que não exige razão alguma", isCorrect: false },
          { label: "E", text: "Um retorno definitivo à ignorância", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A expressão 'a dúvida metódica' está associada a qual filósofo, que a usou como ferramenta para alcançar certezas absolutas no conhecimento?",
      year: 2019,
      subjectId: filosofia.id,
      topicId: teoriaConhecimento.id,
      difficulty: 1,
      explanation: "René Descartes desenvolveu o método da dúvida (dúvida metódica/hiperbólica): duvidar sistematicamente de tudo que pode ser duvidado, até encontrar uma base indubitável de conhecimento — chegando ao 'penso, logo existo'.",
      alternatives: {
        create: [
          { label: "A", text: "René Descartes", isCorrect: true },
          { label: "B", text: "Aristóteles", isCorrect: false },
          { label: "C", text: "Sócrates", isCorrect: false },
          { label: "D", text: "Rousseau", isCorrect: false },
          { label: "E", text: "Hobbes", isCorrect: false },
        ],
      },
    },
  });


  // ---------------- NOVAS QUESTÕES: SOCIOLOGIA ----------------

  await prisma.question.create({
    data: {
      statement: "Émile Durkheim, um dos fundadores da Sociologia, defendia que os 'fatos sociais' deveriam ser estudados como:",
      year: 2020,
      subjectId: sociologia.id,
      topicId: cidadaniaDireitos.id,
      difficulty: 2,
      explanation: "Durkheim propunha que os fatos sociais (normas, valores, instituições) fossem estudados como 'coisas', ou seja, com objetividade e método científico, exteriores e coercitivos sobre os indivíduos.",
      alternatives: {
        create: [
          { label: "A", text: "Coisas, com método objetivo e científico", isCorrect: true },
          { label: "B", text: "Opiniões pessoais dos pesquisadores", isCorrect: false },
          { label: "C", text: "Fenômenos exclusivamente biológicos", isCorrect: false },
          { label: "D", text: "Fatos sem nenhuma relevância de estudo", isCorrect: false },
          { label: "E", text: "Crenças religiosas apenas", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Karl Marx analisou a sociedade capitalista a partir da luta entre classes sociais, destacando principalmente o conflito entre:",
      year: 2021,
      subjectId: sociologia.id,
      topicId: trabalhoSociologia.id,
      difficulty: 1,
      explanation: "Para Marx, o conflito central do capitalismo é entre a burguesia (donos dos meios de produção) e o proletariado (trabalhadores que vendem sua força de trabalho) — uma relação marcada pela exploração e pela mais-valia.",
      alternatives: {
        create: [
          { label: "A", text: "Burguesia e proletariado", isCorrect: true },
          { label: "B", text: "Nobres e clero", isCorrect: false },
          { label: "C", text: "Homens e mulheres exclusivamente", isCorrect: false },
          { label: "D", text: "Cidades e campo apenas", isCorrect: false },
          { label: "E", text: "Países ricos e pobres apenas", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Max Weber, outro fundador da Sociologia clássica, propôs o conceito de 'ação social' para analisar comportamentos que:",
      year: 2019,
      subjectId: sociologia.id,
      topicId: cidadaniaDireitos.id,
      difficulty: 3,
      explanation: "Para Weber, ação social é toda conduta humana orientada pelo comportamento de outras pessoas, carregada de sentido subjetivo — diferente de simples reações automáticas, envolve intenção e significado atribuído pelo próprio indivíduo.",
      alternatives: {
        create: [
          { label: "A", text: "São orientados pelo comportamento de outras pessoas e carregam sentido", isCorrect: true },
          { label: "B", text: "Ocorrem de forma totalmente isolada da sociedade", isCorrect: false },
          { label: "C", text: "São sempre determinados biologicamente", isCorrect: false },
          { label: "D", text: "Não têm nenhuma intenção ou significado", isCorrect: false },
          { label: "E", text: "São exclusivos de sociedades primitivas", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A divisão internacional do trabalho, no contexto da globalização, é caracterizada por:",
      year: 2022,
      subjectId: sociologia.id,
      topicId: trabalhoSociologia.id,
      difficulty: 2,
      explanation: "Na divisão internacional do trabalho, diferentes países se especializam em diferentes etapas da produção (matéria-prima, manufatura, tecnologia), geralmente refletindo desigualdades entre países centrais e periféricos.",
      alternatives: {
        create: [
          { label: "A", text: "Diferentes países se especializando em etapas distintas da produção", isCorrect: true },
          { label: "B", text: "Todos os países produzindo exatamente os mesmos bens", isCorrect: false },
          { label: "C", text: "O fim completo do comércio internacional", isCorrect: false },
          { label: "D", text: "Isolamento total das economias nacionais", isCorrect: false },
          { label: "E", text: "Ausência de qualquer forma de desigualdade econômica", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A precarização do trabalho, tema recorrente na Sociologia contemporânea, se refere a:",
      year: 2020,
      subjectId: sociologia.id,
      topicId: trabalhoSociologia.id,
      difficulty: 2,
      explanation: "Precarização se refere à perda de direitos trabalhistas, à informalidade e à instabilidade nas relações de trabalho — fenômeno intensificado por mudanças tecnológicas e novos modelos de negócio, como o trabalho por aplicativo.",
      alternatives: {
        create: [
          { label: "A", text: "Perda de direitos trabalhistas e aumento da instabilidade no emprego", isCorrect: true },
          { label: "B", text: "Aumento generalizado da estabilidade no emprego", isCorrect: false },
          { label: "C", text: "Ampliação de todos os direitos trabalhistas", isCorrect: false },
          { label: "D", text: "Fim total do desemprego no mundo", isCorrect: false },
          { label: "E", text: "Redução da jornada sem perda de direitos", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A cultura, em termos sociológicos, pode ser definida como:",
      year: 2019,
      subjectId: sociologia.id,
      topicId: culturaIdentidade.id,
      difficulty: 1,
      explanation: "Cultura, na Sociologia, é o conjunto de valores, crenças, costumes, normas e práticas compartilhadas por um grupo social, transmitidas e aprendidas socialmente — não é algo biológico ou inato.",
      alternatives: {
        create: [
          { label: "A", text: "O conjunto de valores, crenças e práticas compartilhadas por um grupo", isCorrect: true },
          { label: "B", text: "Uma característica biológica herdada geneticamente", isCorrect: false },
          { label: "C", text: "Algo fixo e que nunca muda ao longo do tempo", isCorrect: false },
          { label: "D", text: "Exclusiva de sociedades consideradas 'desenvolvidas'", isCorrect: false },
          { label: "E", text: "Sinônimo apenas de erudição artística", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O etnocentrismo é a tendência de julgar outras culturas a partir dos valores da própria cultura, considerando-a superior. Em oposição a essa postura, a Antropologia e a Sociologia defendem o:",
      year: 2021,
      subjectId: sociologia.id,
      topicId: culturaIdentidade.id,
      difficulty: 2,
      explanation: "O relativismo cultural propõe compreender cada cultura a partir de seus próprios valores e contexto, sem hierarquizá-las como superiores ou inferiores — uma postura oposta ao etnocentrismo.",
      alternatives: {
        create: [
          { label: "A", text: "Relativismo cultural", isCorrect: true },
          { label: "B", text: "Etnocentrismo radical", isCorrect: false },
          { label: "C", text: "Determinismo biológico", isCorrect: false },
          { label: "D", text: "Nacionalismo cultural", isCorrect: false },
          { label: "E", text: "Fundamentalismo religioso", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A globalização cultural, marcada pela difusão de produtos midiáticos e hábitos de consumo em escala mundial, é criticada por alguns sociólogos por gerar:",
      year: 2020,
      subjectId: sociologia.id,
      topicId: culturaIdentidade.id,
      difficulty: 3,
      explanation: "Uma das críticas mais comuns é o risco de homogeneização cultural, em que culturas locais e tradições específicas perdem espaço diante da padronização de hábitos, valores e produtos globais, principalmente de origem ocidental.",
      alternatives: {
        create: [
          { label: "A", text: "Homogeneização cultural, com perda de tradições locais", isCorrect: true },
          { label: "B", text: "Fortalecimento exclusivo de culturas locais isoladas", isCorrect: false },
          { label: "C", text: "Fim total da comunicação entre povos", isCorrect: false },
          { label: "D", text: "Eliminação completa do consumo de mídia", isCorrect: false },
          { label: "E", text: "Isolamento cultural crescente entre nações", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Movimentos sociais, como o movimento negro, o movimento LGBTQIA+ e o movimento feminista, têm em comum a luta por:",
      year: 2022,
      subjectId: sociologia.id,
      topicId: movimentosSociais.id,
      difficulty: 1,
      explanation: "Apesar de pautas específicas diferentes, esses movimentos compartilham a luta contra desigualdades sociais estruturais e pela ampliação e garantia de direitos e cidadania para grupos historicamente marginalizados.",
      alternatives: {
        create: [
          { label: "A", text: "Ampliação de direitos e combate a desigualdades estruturais", isCorrect: true },
          { label: "B", text: "Manutenção do status quo social", isCorrect: false },
          { label: "C", text: "Fim de qualquer forma de organização coletiva", isCorrect: false },
          { label: "D", text: "Isolamento completo de seus integrantes", isCorrect: false },
          { label: "E", text: "Apoio incondicional a governos autoritários", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O conceito de 'cidadania', na Sociologia e Ciência Política, envolve não apenas direitos civis e políticos, mas também direitos sociais, como educação e saúde. Essa ampliação do conceito é atribuída principalmente a qual autor?",
      year: 2019,
      subjectId: sociologia.id,
      topicId: cidadaniaDireitos.id,
      difficulty: 3,
      explanation: "T.H. Marshall é o autor clássico que sistematizou a evolução da cidadania em três dimensões — civil, política e social —, defendendo que a cidadania plena inclui também direitos sociais garantidos pelo Estado, como educação e saúde.",
      alternatives: {
        create: [
          { label: "A", text: "T.H. Marshall", isCorrect: true },
          { label: "B", text: "Émile Durkheim", isCorrect: false },
          { label: "C", text: "Karl Marx exclusivamente", isCorrect: false },
          { label: "D", text: "Max Weber exclusivamente", isCorrect: false },
          { label: "E", text: "Auguste Comte", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A desigualdade social no Brasil é frequentemente medida por indicadores como o Índice de Gini, que avalia:",
      year: 2021,
      subjectId: sociologia.id,
      topicId: cidadaniaDireitos.id,
      difficulty: 2,
      explanation: "O Índice de Gini mede o grau de concentração de renda em uma sociedade, variando de 0 (igualdade perfeita) a 1 (desigualdade máxima) — quanto mais próximo de 1, maior a concentração de renda nas mãos de poucos.",
      alternatives: {
        create: [
          { label: "A", text: "O grau de concentração de renda de uma população", isCorrect: true },
          { label: "B", text: "A taxa de natalidade de um país", isCorrect: false },
          { label: "C", text: "O número total de habitantes de uma cidade", isCorrect: false },
          { label: "D", text: "A quantidade de escolas públicas disponíveis", isCorrect: false },
          { label: "E", text: "O índice de poluição do ar", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A automação e a robotização crescente do trabalho, discutidas pela Sociologia do Trabalho contemporânea, geram debates principalmente sobre:",
      year: 2020,
      subjectId: sociologia.id,
      topicId: trabalhoSociologia.id,
      difficulty: 2,
      explanation: "Um dos principais debates é sobre o desemprego estrutural (postos de trabalho substituídos por máquinas/IA) e a necessidade de requalificação profissional dos trabalhadores para se adaptarem às novas demandas do mercado.",
      alternatives: {
        create: [
          { label: "A", text: "Desemprego estrutural e necessidade de requalificação profissional", isCorrect: true },
          { label: "B", text: "Aumento garantido de empregos em todos os setores", isCorrect: false },
          { label: "C", text: "Fim total da necessidade de trabalho humano hoje", isCorrect: false },
          { label: "D", text: "Nenhum impacto relevante no mercado de trabalho", isCorrect: false },
          { label: "E", text: "Redução da desigualdade automaticamente", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Os movimentos sociais que surgiram no Brasil durante a ditadura militar (1964-1985), como os sindicatos e o movimento estudantil, tinham como uma de suas principais pautas:",
      year: 2022,
      subjectId: sociologia.id,
      topicId: movimentosSociais.id,
      difficulty: 2,
      explanation: "Durante a ditadura, esses movimentos lutavam principalmente pela redemocratização do país, contra a censura e a repressão política, além de defender direitos trabalhistas e civis suprimidos pelo regime autoritário.",
      alternatives: {
        create: [
          { label: "A", text: "A redemocratização do país e o fim da repressão política", isCorrect: true },
          { label: "B", text: "O fortalecimento do regime militar vigente", isCorrect: false },
          { label: "C", text: "A extinção de qualquer forma de sindicato", isCorrect: false },
          { label: "D", text: "O apoio incondicional à censura", isCorrect: false },
          { label: "E", text: "A manutenção do estado de exceção", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A Constituição Federal de 1988, conhecida como 'Constituição Cidadã', é assim chamada principalmente por:",
      year: 2019,
      subjectId: sociologia.id,
      topicId: cidadaniaDireitos.id,
      difficulty: 1,
      explanation: "A Constituição de 1988 ampliou significativamente os direitos sociais, civis e políticos dos brasileiros após o fim da ditadura militar, consolidando garantias como saúde, educação e assistência social como direitos universais.",
      alternatives: {
        create: [
          { label: "A", text: "Ampliar significativamente os direitos sociais e civis dos brasileiros", isCorrect: true },
          { label: "B", text: "Reduzir os direitos conquistados anteriormente", isCorrect: false },
          { label: "C", text: "Manter a censura vigente na ditadura", isCorrect: false },
          { label: "D", text: "Eliminar o direito ao voto", isCorrect: false },
          { label: "E", text: "Não alterar nada em relação à Constituição anterior", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O preconceito e a discriminação racial no Brasil, segundo diversos sociólogos, têm raízes históricas ligadas principalmente a:",
      year: 2021,
      subjectId: sociologia.id,
      topicId: culturaIdentidade.id,
      difficulty: 3,
      explanation: "A herança da escravidão (que durou quase 400 anos no Brasil) e a ausência de políticas efetivas de inclusão da população negra após a abolição (1888) são frequentemente apontadas como raízes estruturais do racismo na sociedade brasileira.",
      alternatives: {
        create: [
          { label: "A", text: "A herança histórica da escravidão e a exclusão pós-abolição", isCorrect: true },
          { label: "B", text: "Fatores exclusivamente biológicos entre raças", isCorrect: false },
          { label: "C", text: "Uma característica recente, sem relação histórica", isCorrect: false },
          { label: "D", text: "A ausência total de desigualdade após 1888", isCorrect: false },
          { label: "E", text: "Políticas de inclusão bem-sucedidas desde a abolição", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A 'indústria cultural', conceito desenvolvido por Theodor Adorno e Max Horkheimer (Escola de Frankfurt), critica principalmente:",
      year: 2020,
      subjectId: sociologia.id,
      topicId: culturaIdentidade.id,
      difficulty: 3,
      explanation: "O conceito critica a produção em massa de bens culturais (filmes, música, TV) como mercadorias padronizadas, que promoveriam uma cultura de entretenimento passivo, alienante e voltada ao consumo, mais do que à reflexão crítica.",
      alternatives: {
        create: [
          { label: "A", text: "A produção em massa de cultura padronizada e voltada ao consumo", isCorrect: true },
          { label: "B", text: "O incentivo excessivo à reflexão crítica pela mídia", isCorrect: false },
          { label: "C", text: "A ausência total de meios de comunicação", isCorrect: false },
          { label: "D", text: "A valorização exclusiva da cultura popular tradicional", isCorrect: false },
          { label: "E", text: "A censura estatal como único problema cultural", isCorrect: false },
        ],
      },
    },
  });


  // ---------------- QUESTÕES COMPLEMENTARES (fechar 20 por matéria) ----------------

  await prisma.question.create({
    data: {
      statement: "A área de um círculo com raio de 5 cm é aproximadamente (use π ≈ 3,14):",
      year: 2021,
      subjectId: matematica.id,
      topicId: geometria.id,
      difficulty: 2,
      explanation: "Área do círculo = π × r² = 3,14 × 25 = 78,5 cm².",
      alternatives: {
        create: [
          { label: "A", text: "31,4 cm²", isCorrect: false },
          { label: "B", text: "62,8 cm²", isCorrect: false },
          { label: "C", text: "78,5 cm²", isCorrect: true },
          { label: "D", text: "157 cm²", isCorrect: false },
          { label: "E", text: "25 cm²", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Se um produto custava R$ 80 e teve um desconto de 15%, qual é o novo preço?",
      year: 2020,
      subjectId: matematica.id,
      topicId: porcentagem.id,
      difficulty: 1,
      explanation: "15% de 80 = 12. Novo preço = 80 - 12 = R$ 68.",
      alternatives: {
        create: [
          { label: "A", text: "R$ 65", isCorrect: false },
          { label: "B", text: "R$ 68", isCorrect: true },
          { label: "C", text: "R$ 70", isCorrect: false },
          { label: "D", text: "R$ 72", isCorrect: false },
          { label: "E", text: "R$ 75", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A função h(x) = 3x - 6 corta o eixo x (h(x)=0) no ponto:",
      year: 2022,
      subjectId: matematica.id,
      topicId: funcoes.id,
      difficulty: 1,
      explanation: "3x - 6 = 0 → 3x = 6 → x = 2. A função corta o eixo x em x=2.",
      alternatives: {
        create: [
          { label: "A", text: "x = -2", isCorrect: false },
          { label: "B", text: "x = 0", isCorrect: false },
          { label: "C", text: "x = 2", isCorrect: true },
          { label: "D", text: "x = 3", isCorrect: false },
          { label: "E", text: "x = 6", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Na frase 'Aquele político é uma raposa', a comparação implícita entre o político e o animal, sugerindo esperteza, configura uma:",
      year: 2020,
      subjectId: portugues.id,
      topicId: figurasLinguagem.id,
      difficulty: 1,
      explanation: "É uma metáfora — atribuir a característica do animal (esperteza da raposa) ao político de forma implícita, sem usar conectivo comparativo como 'como'.",
      alternatives: {
        create: [
          { label: "A", text: "Metáfora", isCorrect: true },
          { label: "B", text: "Metonímia", isCorrect: false },
          { label: "C", text: "Antítese", isCorrect: false },
          { label: "D", text: "Eufemismo", isCorrect: false },
          { label: "E", text: "Onomatopeia", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O período composto 'Estudei bastante, mas não fui bem na prova' apresenta duas orações ligadas por uma conjunção do tipo:",
      year: 2021,
      subjectId: portugues.id,
      topicId: gramatica.id,
      difficulty: 2,
      explanation: "'Mas' é conjunção coordenativa adversativa, ligando duas orações independentes que se opõem em sentido (estudar bastante x não ir bem).",
      alternatives: {
        create: [
          { label: "A", text: "Coordenativa adversativa", isCorrect: true },
          { label: "B", text: "Subordinativa causal", isCorrect: false },
          { label: "C", text: "Subordinativa concessiva", isCorrect: false },
          { label: "D", text: "Coordenativa aditiva", isCorrect: false },
          { label: "E", text: "Subordinativa condicional", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "José de Alencar, autor de 'Iracema' e 'O Guarani', é um dos principais nomes de qual fase do Romantismo brasileiro, marcada pela idealização do indígena?",
      year: 2019,
      subjectId: portugues.id,
      topicId: literatura.id,
      difficulty: 2,
      explanation: "José de Alencar é o principal representante do indianismo romântico, fase que idealizava o indígena como herói nacional, numa tentativa de construir uma identidade literária genuinamente brasileira.",
      alternatives: {
        create: [
          { label: "A", text: "Indianismo romântico", isCorrect: true },
          { label: "B", text: "Naturalismo", isCorrect: false },
          { label: "C", text: "Parnasianismo", isCorrect: false },
          { label: "D", text: "Concretismo", isCorrect: false },
          { label: "E", text: "Trovadorismo", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A tabela periódica organiza os elementos químicos principalmente em ordem crescente de:",
      year: 2020,
      subjectId: quimica.id,
      topicId: quimicaGeral.id,
      difficulty: 1,
      explanation: "A tabela periódica moderna organiza os elementos em ordem crescente de número atômico (quantidade de prótons), não mais por massa atômica como na proposta original de Mendeleev.",
      alternatives: {
        create: [
          { label: "A", text: "Número atômico", isCorrect: true },
          { label: "B", text: "Cor do elemento", isCorrect: false },
          { label: "C", text: "Estado físico à temperatura ambiente", isCorrect: false },
          { label: "D", text: "Ano de descoberta", isCorrect: false },
          { label: "E", text: "Ordem alfabética", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "As cetonas, função orgânica presente na acetona (removedor de esmalte), são caracterizadas pela presença do grupo carbonila localizado:",
      year: 2021,
      subjectId: quimica.id,
      topicId: organica.id,
      difficulty: 3,
      explanation: "Nas cetonas, o grupo carbonila (C=O) fica entre dois carbonos da cadeia (carbono secundário), diferente dos aldeídos, em que a carbonila fica na ponta da cadeia (carbono primário).",
      alternatives: {
        create: [
          { label: "A", text: "Entre dois átomos de carbono da cadeia", isCorrect: true },
          { label: "B", text: "Sempre na extremidade da cadeia", isCorrect: false },
          { label: "C", text: "Ligado a um átomo de nitrogênio", isCorrect: false },
          { label: "D", text: "Fora da cadeia carbônica", isCorrect: false },
          { label: "E", text: "Ligado obrigatoriamente a um anel aromático", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A Proclamação da República no Brasil, em 15 de novembro de 1889, foi liderada principalmente por:",
      year: 2020,
      subjectId: historia.id,
      topicId: republica.id,
      difficulty: 1,
      explanation: "A Proclamação da República foi um golpe militar liderado pelo Marechal Deodoro da Fonseca, com apoio de setores do Exército insatisfeitos com a monarquia, encerrando o Império de Dom Pedro II.",
      alternatives: {
        create: [
          { label: "A", text: "Setores do Exército, liderados por Deodoro da Fonseca", isCorrect: true },
          { label: "B", text: "Um plebiscito popular direto", isCorrect: false },
          { label: "C", text: "A própria família real, voluntariamente", isCorrect: false },
          { label: "D", text: "A Igreja Católica", isCorrect: false },
          { label: "E", text: "Uma invasão estrangeira", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A Lei Áurea, assinada em 1888 pela Princesa Isabel, teve como consequência imediata:",
      year: 2021,
      subjectId: historia.id,
      topicId: brasilColonia.id,
      difficulty: 1,
      explanation: "A Lei Áurea aboliu formalmente a escravidão no Brasil, mas não veio acompanhada de políticas de inclusão social ou reparação para a população recém-liberta, o que gerou marginalização social duradoura.",
      alternatives: {
        create: [
          { label: "A", text: "A abolição formal da escravidão, sem políticas de inclusão", isCorrect: true },
          { label: "B", text: "A distribuição imediata de terras aos ex-escravizados", isCorrect: false },
          { label: "C", text: "O fim total do preconceito racial no país", isCorrect: false },
          { label: "D", text: "A criação de um sistema de cotas universitárias", isCorrect: false },
          { label: "E", text: "A imediata proclamação da República", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Um objeto de 5 kg é erguido a uma altura de 2 m. Considerando g = 10 m/s², qual é a energia potencial gravitacional adquirida por esse objeto?",
      year: 2020,
      subjectId: fisica.id,
      topicId: mecanica.id,
      difficulty: 2,
      explanation: "Energia potencial gravitacional = m × g × h = 5 × 10 × 2 = 100 J.",
      alternatives: {
        create: [
          { label: "A", text: "10 J", isCorrect: false },
          { label: "B", text: "20 J", isCorrect: false },
          { label: "C", text: "50 J", isCorrect: false },
          { label: "D", text: "100 J", isCorrect: true },
          { label: "E", text: "200 J", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A refração da luz, fenômeno que faz um lápis parecer 'quebrado' dentro de um copo com água, ocorre porque a luz:",
      year: 2021,
      subjectId: fisica.id,
      topicId: ondulatoria.id,
      difficulty: 2,
      explanation: "Refração é a mudança de direção da luz ao passar de um meio para outro com densidade óptica diferente (do ar para a água, por exemplo), o que causa essa ilusão de 'quebra' visual.",
      alternatives: {
        create: [
          { label: "A", text: "Muda de velocidade e direção ao mudar de meio", isCorrect: true },
          { label: "B", text: "Para completamente ao entrar na água", isCorrect: false },
          { label: "C", text: "Não sofre nenhuma alteração ao mudar de meio", isCorrect: false },
          { label: "D", text: "Se transforma em som", isCorrect: false },
          { label: "E", text: "É absorvida totalmente pela água", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A fotossíntese, processo realizado pelas plantas, consome gás carbônico (CO₂) e água, produzindo glicose e liberando qual gás para a atmosfera?",
      year: 2019,
      subjectId: biologia.id,
      topicId: ecologia.id,
      difficulty: 1,
      explanation: "A fotossíntese libera oxigênio (O₂) como subproduto, essencial para a respiração da maioria dos seres vivos, incluindo os humanos.",
      alternatives: {
        create: [
          { label: "A", text: "Gás carbônico", isCorrect: false },
          { label: "B", text: "Oxigênio", isCorrect: true },
          { label: "C", text: "Gás metano", isCorrect: false },
          { label: "D", text: "Nitrogênio", isCorrect: false },
          { label: "E", text: "Hidrogênio", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Mutações genéticas são alterações no material genético (DNA) de um organismo. Do ponto de vista evolutivo, as mutações são importantes principalmente por:",
      year: 2021,
      subjectId: biologia.id,
      topicId: genetica.id,
      difficulty: 2,
      explanation: "Mutações são a principal fonte de variabilidade genética nas populações, matéria-prima sobre a qual a seleção natural atua, permitindo a evolução das espécies ao longo do tempo.",
      alternatives: {
        create: [
          { label: "A", text: "Gerarem variabilidade genética, base da seleção natural", isCorrect: true },
          { label: "B", text: "Sempre causarem a morte imediata do organismo", isCorrect: false },
          { label: "C", text: "Impedirem qualquer forma de evolução", isCorrect: false },
          { label: "D", text: "Não terem nenhum efeito nas populações", isCorrect: false },
          { label: "E", text: "Ocorrerem apenas em seres humanos", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "As metrópoles regionais, diferente das metrópoles nacionais, exercem influência econômica e de serviços principalmente:",
      year: 2020,
      subjectId: geografia.id,
      topicId: urbanizacao.id,
      difficulty: 2,
      explanation: "Metrópoles regionais (como Recife, Belém, Curitiba) polarizam e influenciam uma região específica do país, oferecendo serviços e empregos para cidades ao seu redor, mas com alcance menor que metrópoles nacionais como São Paulo.",
      alternatives: {
        create: [
          { label: "A", text: "Sobre uma região específica do país", isCorrect: true },
          { label: "B", text: "Sobre o mundo inteiro, sem exceção", isCorrect: false },
          { label: "C", text: "Apenas sobre a própria cidade, isoladamente", isCorrect: false },
          { label: "D", text: "Sobre nenhuma área, pois não têm influência", isCorrect: false },
          { label: "E", text: "Exclusivamente sobre áreas rurais", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "As monções e ventos alísios são exemplos de fenômenos que influenciam diretamente:",
      year: 2022,
      subjectId: geografia.id,
      topicId: climatologia.id,
      difficulty: 2,
      explanation: "Monções e ventos alísios são padrões de circulação atmosférica que influenciam diretamente o clima e o regime de chuvas de diversas regiões do planeta, como o Sul e Sudeste Asiático (monções) e as zonas tropicais (alísios).",
      alternatives: {
        create: [
          { label: "A", text: "O clima e o regime de chuvas de diversas regiões", isCorrect: true },
          { label: "B", text: "Apenas a temperatura da água dos oceanos", isCorrect: false },
          { label: "C", text: "Somente fenômenos vulcânicos", isCorrect: false },
          { label: "D", text: "A rotação da Terra diretamente", isCorrect: false },
          { label: "E", text: "Nenhum fenômeno climático relevante", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Epicuro, filósofo grego, defendia que a felicidade estava ligada à busca por prazeres moderados e à ausência de perturbações da alma (ataraxia). Essa corrente ficou conhecida como:",
      year: 2020,
      subjectId: filosofia.id,
      topicId: filosofiaAntiga.id,
      difficulty: 2,
      explanation: "O Epicurismo defendia a busca por prazeres simples e moderados (não excessos) e a tranquilidade da alma (ataraxia) como caminho para a felicidade, evitando dores e perturbações desnecessárias.",
      alternatives: {
        create: [
          { label: "A", text: "Epicurismo", isCorrect: true },
          { label: "B", text: "Estoicismo", isCorrect: false },
          { label: "C", text: "Ceticismo", isCorrect: false },
          { label: "D", text: "Cinismo", isCorrect: false },
          { label: "E", text: "Hedonismo desenfreado", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "O Estoicismo, corrente filosófica helenística, defendia que a felicidade e a virtude estavam ligadas principalmente a:",
      year: 2021,
      subjectId: filosofia.id,
      topicId: filosofiaAntiga.id,
      difficulty: 3,
      explanation: "Os estoicos defendiam viver em conformidade com a razão e aceitar com serenidade aquilo que não está sob nosso controle, buscando o autocontrole emocional diante das adversidades da vida.",
      alternatives: {
        create: [
          { label: "A", text: "Viver conforme a razão e aceitar o que não se pode controlar", isCorrect: true },
          { label: "B", text: "Buscar exclusivamente prazeres físicos intensos", isCorrect: false },
          { label: "C", text: "Rejeitar toda forma de convívio social", isCorrect: false },
          { label: "D", text: "Acumular o máximo de riquezas possível", isCorrect: false },
          { label: "E", text: "Depender inteiramente da sorte e do acaso", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "A alienação, conceito central na obra de Karl Marx, se refere, no contexto do trabalho capitalista, ao processo em que o trabalhador:",
      year: 2020,
      subjectId: sociologia.id,
      topicId: trabalhoSociologia.id,
      difficulty: 3,
      explanation: "Para Marx, a alienação no trabalho ocorre quando o trabalhador se torna estranho ao produto do seu próprio trabalho e ao processo produtivo, já que não detém os meios de produção nem o controle sobre o que produz, servindo apenas para gerar lucro ao capitalista.",
      alternatives: {
        create: [
          { label: "A", text: "Se torna estranho ao produto e ao processo do seu próprio trabalho", isCorrect: true },
          { label: "B", text: "Passa a controlar totalmente os meios de produção", isCorrect: false },
          { label: "C", text: "Recebe todo o valor gerado pelo seu trabalho", isCorrect: false },
          { label: "D", text: "Deixa de fazer parte da sociedade capitalista", isCorrect: false },
          { label: "E", text: "Se torna dono da empresa em que trabalha", isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      statement: "Pierre Bourdieu, sociólogo francês, desenvolveu o conceito de 'capital cultural' para explicar como:",
      year: 2021,
      subjectId: sociologia.id,
      topicId: culturaIdentidade.id,
      difficulty: 3,
      explanation: "Bourdieu usa 'capital cultural' para explicar como o acesso desigual a bens culturais, educação e conhecimento (herdados da família ou adquiridos) reproduz e legitima desigualdades sociais entre as classes, muitas vezes de forma pouco percebida.",
      alternatives: {
        create: [
          { label: "A", text: "Desigualdades educacionais e culturais se reproduzem entre classes sociais", isCorrect: true },
          { label: "B", text: "Todas as classes sociais têm exatamente o mesmo acesso à cultura", isCorrect: false },
          { label: "C", text: "A cultura não tem nenhuma relação com desigualdade social", isCorrect: false },
          { label: "D", text: "Apenas fatores econômicos importam na mobilidade social", isCorrect: false },
          { label: "E", text: "O capital cultural é sempre herdado geneticamente", isCorrect: false },
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
