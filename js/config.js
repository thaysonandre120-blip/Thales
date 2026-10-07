/**
 * J. THALES PINTURAS - CONSTANTES E DADOS DO SITE
 * 
 * Todos os textos, números de contato, links sociais e depoimentos
 * estão concentrados neste arquivo para facilitar qualquer edição futura.
 */

const SITE_CONFIG = {
  // Informações da Empresa
  empresa: {
    nome: "J. Thales Pinturas",
    pintor: "Thales",
    cidade: "Itajaí",
    estado: "SC",
    posicionamento: "Entre os 3 melhores pintores de Itajaí",
    anoFundacao: "2018",
  },

  // Contato e WhatsApp
  // O botão de WhatsApp só pode aparecer em 2 lugares: Header e Seção Contato.
  whatsapp: {
    // Número formatado para exibição visual
    numeroExibicao: "(83) 99191-2530",
    // Número com DDI (55) + DDD (83) + dígitos (sem espaços ou traços) para o link wa.me
    numeroLink: "5583991912530",
    // Mensagem inicial enviada pelo cliente ao clicar
    mensagemPadrao: "Olá, Thales! Gostaria de conversar sobre um projeto de pintura em Itajaí e região.",
    // Rótulos dos botões
    textoBotaoHeader: "WhatsApp",
    textoBotaoContato: "Falar com o Thales no WhatsApp"
  },

  // Redes Sociais
  redesSociais: {
    instagram: {
      exibir: true,
      usuario: "@jthalespinturas", // Altere para o seu @ de usuário
      url: "https://instagram.com/jthalespinturas"
    },
    youtube: {
      exibir: true, // Mude para false se preferir ocultar o link do YouTube
      usuario: "J. Thales Pinturas",
      url: "https://youtube.com/@jthalespinturas"
    }
  },

  // Faixa de Credibilidade (Itens objetivos sem números inventados)
  credibilidade: [
    { rotulo: "Top 3 em Itajaí", detalhe: "Reconhecimento comprovado em alto padrão" },
    { rotulo: "Residencial, predial e comercial", detalhe: "Estrutura para obras de qualquer porte" },
    { rotulo: "Aplicação de pedras naturais", detalhe: "Especialidade técnica diferenciada" },
    { rotulo: "Itajaí e região", detalhe: "Atendimento ágil com rigor de cronograma" }
  ],

  // Seção de Mensagem (vídeo de fundo em loop, entre Obras e Avaliações/Contato)
  mensagem: {
    titulo: "Cada parede conta uma história",
    texto: "Cada obra é conduzida pelo Thales com preparo rigoroso, acabamento preciso e respeito ao espaço do cliente, do primeiro passo à entrega.",
    // Tocam em sequência e em ciclo infinito (1 → 2 → 1 ...)
    videos: [
      { src: "/videos/mensagem-1.mp4", poster: "/videos/mensagem-1.jpg" },
      { src: "/videos/mensagem-2.mp4", poster: "/videos/mensagem-2.jpg" }
    ]
  },

  // Seção Sobre
  sobre: {
    titulo: "Excelência técnica, rigor e compromisso com o resultado.",
    paragrafos: [
      "Sob o comando do pintor Thales, a J. Thales Pinturas consolidou-se como referência em Itajaí na execução de acabamentos de alta complexidade para residências modernas, edifícios e condomínios de alto padrão.",
      "Com método focado em precisão técnica, preparação rigorosa de superfícies e domínio da aplicação de pedras naturais, a empresa entrega obras sem imperfeições, respeitando cronogramas e garantindo limpeza exemplar durante todo o processo.",
      "Entre os 3 melhores pintores de Itajaí, o Thales atua diretamente na condução técnica de cada trabalho, oferecendo o padrão de confiabilidade e serenidade que investidores, engenheiros e proprietários exigem."
    ]
  },

  // Lista Editorial de Serviços (01 a 05 - Sem cards e sem botões)
  servicos: [
    {
      numero: "01",
      titulo: "Pintura residencial",
      descricao: "Acabamento de altíssima precisão para casas modernas, coberturas e condomínios fechados.",
      destaque: false
    },
    {
      numero: "02",
      titulo: "Pintura predial e comercial",
      descricao: "Soluções estruturadas para edifícios, salas corporativas e empreendimentos imobiliários.",
      destaque: false
    },
    {
      numero: "03",
      titulo: "Revitalização e trabalho em altura",
      descricao: "Tratamento de patologias, impermeabilização e pintura externa em fachadas com total segurança.",
      destaque: false
    },
    {
      numero: "04",
      titulo: "Aplicação de pedras naturais",
      descricao: "Instalação, tratamento mineral e proteção hidrofugante de pedras nobres com esmero arquitetônico.",
      destaque: true // Destacado conforme instrução
    },
    {
      numero: "05",
      titulo: "Limpeza pós-obra",
      descricao: "Entrega impecável com eliminação total de respingos, poeira e resíduos em vidros e esquadrias.",
      destaque: false
    }
  ],

  // Obras (6 Trabalhos)
  obras: [
    {
      imagem: "/images/obra-1.jpg",
      tipo: "Residência de Alto Padrão",
      cidade: "Itajaí, SC",
      alt: "Pintura interna e acabamento de alto padrão em living integrado em Itajaí"
    },
    {
      imagem: "/images/obra-2.jpg",
      tipo: "Fachada Predial Contemporânea",
      cidade: "Itajaí, SC",
      alt: "Pintura e revitalização externa de edifício contemporâneo em Itajaí"
    },
    {
      imagem: "/images/obra-3.jpg",
      tipo: "Aplicação de Pedras Naturais",
      cidade: "Itajaí, SC",
      alt: "Aplicação minuciosa de revestimento em pedras naturais em residência moderna"
    },
    {
      imagem: "/images/obra-4.jpg",
      tipo: "Empreendimento Residencial & Studios",
      cidade: "Itajaí, SC",
      alt: "Pintura completa de edifício de studios e apartamentos modernos em Itajaí"
    },
    {
      imagem: "/images/obra-5.jpg",
      tipo: "Revitalização e Trabalho em Altura",
      cidade: "Itajaí, SC",
      alt: "Execução técnica de pintura em altura e restauração de fachada predial"
    },
    {
      imagem: "/images/obra-6.jpg",
      tipo: "Pintura Fina e Entrega Pós-Obra",
      cidade: "Itajaí, SC",
      alt: "Acabamento fino entregue totalmente limpo e pronto para habitação em Itajaí"
    }
  ],

  // 3 Depoimentos de Clientes (Visual de citação simples, sem card)
  avaliacoes: [
    {
      nome: "Eng. Marcos Silveira",
      obra: "Edifício Residencial e Fachada",
      cidade: "Itajaí, SC",
      depoimento: "O Thales conduziu o cronograma da fachada com rigor absoluto. O acabamento dos recortes, a uniformidade da aplicação e o respeito às normas técnicas colocam o trabalho dele em outro patamar em Santa Catarina."
    },
    {
      nome: "Camila Duarte",
      obra: "Residência de Alto Padrão",
      cidade: "Praia Brava, Itajaí, SC",
      depoimento: "Contratamos para a pintura geral e a aplicação de pedras naturais na fachada e na área social. O cuidado com a proteção dos pisos, a limpeza no final e o refinamento das paredes superaram qualquer expectativa."
    },
    {
      nome: "Rodrigo Becker",
      obra: "Empreendimento de Studios & Kitnets",
      cidade: "Itajaí, SC",
      depoimento: "Excelente padrão de alinhamento e velocidade na entrega das unidades modernas. Linhas retas perfeitas, comunicação transparente e postura profissional do início ao fim."
    }
  ],

  // Região de Atendimento (Frase curta sem listar bairros ou cidades)
  regiao: {
    titulo: "Itajaí e região",
    descricao: "Atendimento técnico direcionado a obras residenciais, prediais e comerciais em Itajaí e região, com logística ágil, compromisso de prazo e padrão superior de acabamento."
  }
};
