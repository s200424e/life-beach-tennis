/* ============================================================
   LIFE BEACH TENNIS — dados da página
   Tudo aqui saiu dos stories/destaques do Instagram, do Linktree
   e do PDF da lojinha. O que está marcado com CONFIRMAR é dedução
   ou pode estar desatualizado: confirme com o dono.
   ============================================================ */
window.LIFE = {
  nome: 'Life Beach Tennis',
  instagram: 'lifebeachtennis___',
  whatsapp: '5561998073434',
  waze: 'https://waze.com/ul/h6vjvgrqub',
  // Coordenadas tiradas do link do Waze. CONFIRMAR o endereço por escrito.
  lat: -15.823596, lon: -48.011949,
  endereco: 'Park Way · Águas Claras, Brasília-DF',

  perfil: { posts: 201, seguidores: 2256, seguindo: 200 },

  // Horário de funcionamento (destaque "Horários"). dias: 0=dom … 6=sáb
  funcionamento: [
    { dias: [1, 2, 3, 4, 5], abre: 7, fecha: 23, rotulo: 'Segunda a sexta', texto: '07h às 23h' },
    { dias: [6, 0], abre: 8, fecha: 17, rotulo: 'Sábado e domingo', texto: '08h às 17h' }
  ],

  // Destaque "Planos". CONFIRMAR: os valores parecem ser por mês em cada ciclo.
  planos: {
    ciclos: [
      { id: 'mensal', nome: 'Mensal', meses: 1 },
      { id: 'trimestral', nome: 'Trimestral', meses: 3 },
      { id: 'semestral', nome: 'Semestral', meses: 6 },
      { id: 'anual', nome: 'Anual', meses: 12 }
    ],
    com: { mensal: [310, 440], trimestral: [300, 425], semestral: [290, 410], anual: [270, 380] },
    sem: { mensal: [290, 390], trimestral: [270, 365], semestral: [250, 345], anual: [230, 325] },
    clubinho: {
      com: [{ nome: 'Mensal', preco: 170 }, { nome: 'Semestral', preco: 150 }, { nome: 'Anual', preco: 130 }],
      sem: [{ nome: 'Mensal para alunos', preco: 100 }]
    },
    matricula: 60,
    dayUseNaoAluno: 25,          // CONFIRMAR: o calendário de novembro fala em "Day Use especial por R$ 30"
    experimental: 20,
    descontoFamilia: 7,
    descontoCasal: 5,
    maxAlunos: 6,
    horariosAulas: ['Terça a sexta, das 7h às 10h', 'Segunda a quinta, das 17h às 21h'],
    juvenis: {
      professor: 'Hudson Paiva',
      turmas: [
        { nome: 'Aula de iniciação', duracao: '1 hora por aula', precos: [290, 410] },
        { nome: 'Treinamento juvenil', duracao: '1h30 por aula', precos: [420, 650] }
      ],
      regras: ['Exclusivamente no plano semestral', 'Day Use incluso']
    }
  },

  // Destaque "Day Use": quadras liberadas por dia e período. CONFIRMAR se continua valendo.
  dayUse: {
    0: [{ periodo: 'Manhã', de: 8, ate: 12, quadras: 4 }, { periodo: 'Tarde', de: 12, ate: 17, quadras: 2 }],
    1: [{ periodo: 'Manhã', de: 7, ate: 12, quadras: 2 }, { periodo: '18h às 21h', de: 18, ate: 21, quadras: 2 }, { periodo: '21h às 23h', de: 21, ate: 23, quadras: 6 }],
    2: [{ periodo: 'Manhã', de: 7, ate: 12, quadras: 2 }, { periodo: '18h às 21h', de: 18, ate: 21, quadras: 2 }, { periodo: '21h às 23h', de: 21, ate: 23, quadras: 6 }],
    3: [{ periodo: 'Manhã', de: 7, ate: 12, quadras: 2 }, { periodo: '18h às 21h', de: 18, ate: 21, quadras: 2 }, { periodo: '21h às 23h', de: 21, ate: 23, quadras: 6 }],
    4: [{ periodo: 'Manhã', de: 7, ate: 12, quadras: 2 }, { periodo: '18h às 21h', de: 18, ate: 21, quadras: 3 }, { periodo: '21h às 23h', de: 21, ate: 23, quadras: 6 }],
    5: [{ periodo: 'Manhã', de: 7, ate: 12, quadras: 2 }, { periodo: '21h às 23h', de: 21, ate: 23, quadras: 6 }],
    6: [{ periodo: 'Manhã', de: 8, ate: 12, quadras: 4 }, { periodo: 'Tarde', de: 12, ate: 17, quadras: 2 }]
  },
  totalQuadras: 6,

  // Destaque "Wellhub"
  convenios: {
    planos: [
      { nome: 'Gold', checkins: '2 por semana ou 8 por mês', regra: 'Agendamento com 1 dia de antecedência' },
      { nome: 'Gold+', checkins: '2 por semana ou 8 por mês', regra: 'Agendamento com 1 dia de antecedência' },
      { nome: 'Platinum', checkins: '3 por semana ou 12 por mês', regra: 'Agendamento com 1 dia de antecedência' },
      { nome: 'Diamond', checkins: '3 por semana ou 12 por mês', regra: 'Direito a horário fixo na agenda da unidade' }
    ],
    abas: [
      { nome: 'Regras', itens: ['Aulas de segunda a sábado', 'Cada aula dura 1 hora', 'A 1ª aula, de nivelamento, custa 1 check-in', 'Falta sem aviso prévio custa 1 check-in', 'Os horários disponíveis ficam no grupo de WhatsApp'] },
      { nome: 'Day Use', itens: ['1 dia de uso das quadras equivale a 1 check-in', 'O check-in pode ser feito no mesmo dia', 'Válido todos os dias', 'Verifique a disponibilidade antes de ir'] },
      { nome: 'Cancelamento', itens: ['Cancele com no mínimo 10h de antecedência para não ter custo', 'Com chuva intensa a aula é cancelada sem custos', 'Falta sem aviso prévio não dá direito a reposição', 'Falta sem aviso e sem check-in impede de marcar outras aulas'] }
    ]
  },

  professores: [
    { id: 'alisson', nome: 'Alisson', sobrenome: 'Borges', frase: 'Apaixonado por esportes e por ensinar',
      itens: ['Formado em Educação Física', 'Atleta de beach tennis desde 2021', 'Módulos 1, 2 e 3 da CRAB Beach Tennis (Marcela Evangelista)', '2º lugar no ranking FBT, categoria Mista Pro/A, em 2024', 'Time DF na Copa das Federações de BT, categoria 40+, em 2024', '1º lugar no ranking ABTDF, categoria A, em 2024'] },
    { id: 'hudson', nome: 'Hudson', sobrenome: 'Paiva', frase: '',
      itens: ['26 anos de formação esportiva', '6 anos de beach tennis', 'Especializado em diversas áreas de treinamento', 'Metodologia específica para o público juvenil', 'Ciências do esporte aplicadas ao BT', 'Já foi técnico amador convocado pela Federação do DF'] },
    { id: 'kleber', nome: 'Kleber', sobrenome: 'Carvalho', frase: '',
      itens: ['Formado em Educação Física', 'Ex-atleta de badminton', 'Atleta de beach tennis desde 2022'] },
    { id: 'filipe', nome: 'Filipe', sobrenome: 'Maia', frase: '',
      itens: ['Formando em Educação Física', 'Atleta de beach tennis desde 2020', 'Formado pela metodologia Calango desde 2020', 'Módulos 1, 2 e 3 da CRAB (Marcela Evangelista)', 'Curso de Beach Tennis FBT, módulo verde', 'Atleta Pro/A', '1º do ranking ABTDF, categoria A/Open, em 2024', 'Time DF na Copa dos Estados de BT, A/Open, em 2025'] },
    { id: 'cleilson', nome: 'Cleilson', sobrenome: 'Moreira', frase: '',
      itens: ['Formado em Educação Física', 'Atleta e professor de beach tennis desde 2019', 'Formado pela metodologia Calango desde 2019', 'Módulos 1 e 2 (Marcela Evangelista)', 'Atleta e professor de tênis de 2009 a 2019'] },
    { id: 'alex', nome: 'Alex', sobrenome: 'Ferreira', frase: 'O beach tennis, que começou como um hobby, virou minha profissão',
      itens: ['Formado em Educação Física', 'Atleta de beach tennis há 4 anos', 'Experiência com natação e futebol'] }
  ],

  // Destaque "Cardápio" (os stories não mostram preço)
  cardapio: [
    { img: 'img/cardapio/fraldinha.webp', nome: 'Fraldinha na chapa', nota: 'com queijo' },
    { img: 'img/cardapio/baguete.webp', nome: 'Baguete', nota: 'com carne desfiada e vinagrete' },
    { img: 'img/cardapio/espetinho.webp', nome: 'Espetinho do Guto', nota: 'com vinagrete e farofa' },
    { img: 'img/cardapio/carne-de-sol.webp', nome: 'Carne de sol', nota: 'com mandioca' }
  ],

  // Destaque "Programação" — calendário de novembro. CONFIRMAR o ano (deduzido: 2026).
  agenda: [
    { data: '2026-11-14', titulo: 'Campeonato interno de iniciantes', texto: '' },
    { data: '2026-11-15', titulo: 'Day Use especial', texto: 'Day Use por R$ 30 e um Powerade para refrescar.' },
    { data: '2026-11-20', titulo: 'Dia da Consciência Negra', texto: 'Funcionamento das 8h às 14h. Almoço executivo: parmegiana.' },
    { data: '2026-11-21', titulo: 'Sábado do carreteiro', texto: '10% de desconto em todos os petiscos e Amstel em promoção.' },
    { data: '2026-11-28', titulo: 'Aniversário de 2 anos da Life', destaque: true, texto: 'Uma grande festa com música ao vivo, desafios nas quadras, bingo e muitas surpresas.' }
  ],

  // Destaque de aniversários
  festa: {
    nome: 'Pacote Feijoada',
    resumo: '4h de quadra e buffet',
    preco: 2990,
    incluso: ['30 pessoas', '4 horas de quadra', 'Buffet self-service completo', 'Refrigerante liberado'],
    cardapio: ['Feijoada completa', 'Arroz', 'Couve', 'Farofa', 'Vinagrete', 'Laranja', 'Torresmo'],
    pagamento: 'Pix ou 3x no cartão',
    aviso: 'Consumo de bebidas somente pelo bar da casa.'
  },

  // PDF "Lojinha - Life Beach". CONFIRMAR: a tabela diz "preço final sugerido"; tamanhos não informados.
  // Cada peça tem variações (modelo ou cor). "cor" pinta a bolinha da variação; sem "cor" vira um botão de texto.
  // CONFIRMAR: a Dry feminina não tem preço próprio na tabela (usei o da Dry, R$ 98).
  loja: [
    { nome: 'Camiseta Dry', tipo: 'Performance', det: 'Dry com elastano, 100% sublimada. Leve e seca rápido, feita para a areia.', preco: 98,
      var: [{ nome: 'Masculina', img: 'img/loja/dry-masculina.webp' }, { nome: 'Feminina', img: 'img/loja/dry-feminina.webp' }] },
    { nome: 'Regata feminina Dry', tipo: 'Performance', det: 'Dry com elastano, 100% sublimada, com o mesmo degradê da camiseta.', preco: 91,
      var: [{ nome: 'Preto e areia', img: 'img/loja/regata.webp' }] },
    { nome: 'Camiseta Poliamida', tipo: 'Dia a dia', det: 'Toque macio e cores neutras, com o logo LIFE no peito.', preco: 126,
      var: [{ nome: 'Off-white', cor: '#E6E2D6', img: 'img/loja/poliamida-offwhite.webp' }, { nome: 'Caramelo', cor: '#C9A37E', img: 'img/loja/poliamida-caramelo.webp' },
            { nome: 'Areia', cor: '#E8D7B1', img: 'img/loja/poliamida-areia.webp' }, { nome: 'Cinza', cor: '#ABA39C', img: 'img/loja/poliamida-cinza.webp' }] },
    { nome: 'Corta-vento', tipo: 'Agasalho', det: 'Com capuz, zíper e estampas na frente e nas costas. Também existe na cor branca.', preco: 156,
      var: [{ nome: 'Preto', cor: '#1E1E1E', img: 'img/loja/corta-vento-preto.webp' }] },
    { nome: 'Boné bordado', tipo: 'Acessório', det: 'Logo LIFE bordado na frente.', preco: 56,
      var: [{ nome: 'Off-white', cor: '#E8E4D8', img: 'img/loja/bone-offwhite.webp' }, { nome: 'Preto', cor: '#1E1E1E', img: 'img/loja/bone-preto.webp' }] },
    { nome: 'Moletom', tipo: 'Agasalho', det: 'Com capuz e bolso canguru, para as noites frias de Brasília. Off-white ou preto.', preco: 135,
      var: [{ nome: 'Off-white e preto', img: 'img/loja/moletom.webp' }] }
  ],

  // Destaque "Parceiros"
  parceiros: [
    ['Sol', 'Cerveza desde 1899'], ['Brasal Veículos', 'SIA Trecho, Ceilândia e Taguatinga'], ['Powerade', 'Power para sua conquista'],
    ['Manteiga da Terra', 'Feito para ficar na memória'], ['Shopping Risk', 'Papelaria e material escolar'], ['AlugLog', 'Locação de equipamentos'],
    ['Financers', 'Contabilidade empresarial'], ['WFA Negócios', 'Planejamento financeiro'], ['Solutions', 'Comunicação visual'], ['BSB Beach Sports', 'Loja de beach tennis em BSB']
  ],

  stories: [
    { img: 'img/story/horario.webp', nome: 'Horários' },
    { img: 'img/story/planos-com.webp', nome: 'Planos' },
    { img: 'img/story/planos-info.webp', nome: 'Planos' },
    { img: 'img/story/planos-sem.webp', nome: 'Planos' },
    { img: 'img/story/juvenis.webp', nome: 'Juvenis' },
    { img: 'img/story/day-use.webp', nome: 'Day Use' },
    { img: 'img/story/calendario.webp', nome: 'Programação' },
    { img: 'img/story/feijoada.webp', nome: 'Festas' }
  ],

  perguntas: [
    ['Quanto custa a aula experimental?', 'R$ 20. Se você se matricular, esse valor é descontado da primeira mensalidade.'],
    ['Preciso ser aluno para jogar?', 'Não. Com o Day Use você usa as quadras sem ser aluno, por R$ 25. Vale checar a disponibilidade antes de ir.'],
    ['Vocês aceitam Wellhub e TotalPass?', 'Sim, nos planos Gold, Gold+, Platinum e Diamond. A primeira aula é de nivelamento e custa 1 check-in.'],
    ['Quantos alunos tem em cada aula?', 'No máximo 6 alunos por aula.'],
    ['Quais são os horários das aulas?', 'De terça a sexta, das 7h às 10h, e de segunda a quinta, das 17h às 21h.'],
    ['Tem desconto para casal ou família?', 'Tem: 5% no plano casal e 7% no plano família (cônjuge, filhos e pais), a partir de 3 membros.'],
    ['Dá para comemorar aniversário aí?', 'Dá. O Pacote Feijoada inclui 4 horas de quadra e buffet para 30 pessoas por R$ 2.990.'],
    ['Qual é o horário de funcionamento?', 'De segunda a sexta, das 07h às 23h. Sábado e domingo, das 08h às 17h.']
  ]
};
