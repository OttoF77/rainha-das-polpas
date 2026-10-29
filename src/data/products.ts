export interface Product {
  id: string;
  slug: string;
  nome: string;
  nomeCientifico: string;
  descricaoCurta: string;
  beneficios: string[];
  tags: string[];
  unidadePadrao: string;
  precoUnitario?: number;
  imagemTemporaria: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "abacaxi",
    slug: "polpa-de-abacaxi",
    nome: "Polpa de Abacaxi",
    nomeCientifico: "Ananas comosus",
    descricaoCurta:
      "Rico em bromelina, uma enzima que auxilia na digestão e possui propriedades anti-inflamatórias. Também fortalece o sistema imunológico e ajuda na absorção de nutrientes essenciais para o corpo.",
    beneficios: [
      "Auxilia na digestão com bromelina natural",
      "Propriedades anti-inflamatórias comprovadas",
      "Fortalece o sistema imunológico",
      "Melhora a absorção de nutrientes vitais",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Rico em Vitamina C", "Digestivo"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 14.0,
    imagemTemporaria: "/images/products/abacaxi_done.png",
  },
  {
    id: "acerola",
    slug: "polpa-de-acerola",
    nome: "Polpa de Acerola",
    nomeCientifico: "Malpighia emarginata",
    descricaoCurta:
      "Rica em vitamina C, a acerola é uma fruta poderosa para fortalecer o sistema imunológico. Seu alto teor de antioxidantes ajuda a combater os radicais livres e proteger o organismo. Perfeita para sucos revigorantes e nutritivos.",
    beneficios: [
      "Campeã em Vitamina C natural",
      "Poderosa ação antioxidante",
      "Combate os radicais livres e retarda o envelhecimento celular",
      "Revigorante e fonte diária de vitalidade",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Super Vitamina C", "Energia"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 13.5,
    imagemTemporaria: "/images/products/acerola_done.jpg",
  },
  {
    id: "caja",
    slug: "polpa-de-caja",
    nome: "Polpa de Cajá",
    nomeCientifico: "Spondias mombin",
    descricaoCurta:
      "O cajá é uma fruta tropical com sabor único, agridoce e refrescante. Rica em vitamina C e antioxidantes, é perfeita para sucos e vitaminas que trazem aquele gostinho autêntico do nordeste brasileiro.",
    beneficios: [
      "Sabor marcante e extremamente refrescante",
      "Rico em fósforo, ferro e cálcio",
      "Fonte de carotenoides e vitamina C",
      "Auxilia na hidratação e reposição mineral",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Regional", "Refrescante"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 14.5,
    imagemTemporaria: "/images/products/caja_done.png",
  },
  {
    id: "caju",
    slug: "polpa-de-caju",
    nome: "Polpa de Caju",
    nomeCientifico: "Anacardium occidentale",
    descricaoCurta:
      "O caju é uma fruta tipicamente brasileira, rica em vitamina C e antioxidantes. Seu sabor único e refrescante traz toda a autenticidade do nordeste brasileiro para seu suco. Perfeito para bebidas e sobremesas tropicais.",
    beneficios: [
      "Até 5 vezes mais vitamina C que a laranja",
      "Rico em minerais como zinco, magnésio e ferro",
      "Fortalece defesas naturais e saúde da pele",
      "Sabor encorpado e aromático",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Rico em Vitamina C", "Nordeste"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 14.0,
    imagemTemporaria: "/images/products/caju_done.png",
  },
  {
    id: "goiaba",
    slug: "polpa-de-goiaba",
    nome: "Polpa de Goiaba",
    nomeCientifico: "Psidium guajava",
    descricaoCurta:
      "A goiaba é uma fruta rica em vitamina C, fibras e antioxidantes como o licopeno. Seu sabor doce e incomparável a torna perfeita para sucos nutritivos e refrescantes. Uma excelente opção para quem busca uma bebida saudável e saborosa.",
    beneficios: [
      "Rica em licopeno e antioxidantes protetores",
      "Excelente fonte de fibras alimentares solúveis",
      "Auxilia na saúde cardiovascular e digestiva",
      "Textura aveludada e aroma irresistível",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Rica em Fibras", "Licopeno"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 13.5,
    imagemTemporaria: "/images/products/goiaba_done.png",
  },
  {
    id: "graviola",
    slug: "polpa-de-graviola",
    nome: "Polpa de Graviola",
    nomeCientifico: "Annona muricata",
    descricaoCurta:
      "A graviola é uma fruta tropical com sabor exótico e diversas propriedades funcionais. Rica em vitaminas e antioxidantes, é conhecida por seus benefícios para a saúde. Seu sabor único a torna perfeita para sucos refrescantes e nutritivos.",
    beneficios: [
      "Compostos bioativos e fitoquímicos funcionais",
      "Rica em vitaminas do complexo B e vitamina C",
      "Ação diurética suave e relaxante muscular",
      "Cremosidade incomparável para sucos e vitaminas",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Funcional", "Cremosa"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 16.0,
    imagemTemporaria: "/images/products/graviola_done.jpeg",
  },
  {
    id: "manga",
    slug: "polpa-de-manga",
    nome: "Polpa de Manga",
    nomeCientifico: "Mangifera indica",
    descricaoCurta:
      "A manga é uma fruta tropical rica em vitaminas A e C, com um sabor doce e marcante. Sua polpa cremosa é perfeita para sucos refrescantes, vitaminas nutritivas e sobremesas irresistíveis. Um verdadeiro tesouro da natureza em forma de sabor.",
    beneficios: [
      "Rica em betacaroteno e vitamina A para a visão e imunidade",
      "Fibras digestivas que auxiliam na saciedade",
      "Doçura 100% natural, sem adição de açúcares",
      "Polpa densa e aveludada de altíssimo rendimento",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Rica em Vitamina A", "Sabor Doce"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 13.5,
    imagemTemporaria: "/images/products/manga_done.jpeg",
  },
  {
    id: "mangaba",
    slug: "polpa-de-mangaba",
    nome: "Polpa de Mangaba",
    nomeCientifico: "Hancornia speciosa",
    descricaoCurta:
      "Fruta nativa e emblemática do cerrado e restingas do nordeste, a mangaba possui sabor aromático, agridoce e inconfundível. Rica em vitaminas A, B e C, ferro e cálcio, reúne alto valor nutricional com propriedades antioxidantes e digestivas autênticas.",
    beneficios: [
      "Rica em vitaminas A, B1, B2 e C",
      "Fonte de ferro, cálcio e fósforo essenciais",
      "Propriedades digestivas e antioxidantes naturais",
      "Sabor autêntico e perfumado da flora brasileira",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Tesouro Regional", "Antioxidante"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 16.5,
    imagemTemporaria: "/images/products/mangaba_done.jpg",
  },
  {
    id: "maracuja",
    slug: "polpa-de-maracuja",
    nome: "Polpa de Maracujá",
    nomeCientifico: "Passiflora edulis",
    descricaoCurta:
      "O maracujá é uma fruta rica em vitaminas do complexo B e possui propriedades calmantes naturais. Seu sabor intenso e tropical é perfeito para sucos refrescantes, sobremesas e drinks especiais. Uma opção versátil que traz aquele toque único às suas receitas.",
    beneficios: [
      "Propriedades calmantes e relaxantes naturais (passiflorina)",
      "Rico em vitaminas do complexo B, A e C",
      "Equilíbrio perfeito de acidez e frescor tropical",
      "Auxilia na redução da ansiedade e indução ao sono",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Calmante Natural", "Aroma Marcante"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 15.5,
    imagemTemporaria: "/images/products/maracuja_done.jpeg",
  },
  {
    id: "morango",
    slug: "polpa-de-morango",
    nome: "Polpa de Morango",
    nomeCientifico: "Fragaria x ananassa",
    descricaoCurta:
      "O morango é uma fruta rica em vitamina C e antioxidantes, com sabor doce e aroma inconfundível. Sua polpa é perfeita para vitaminas, sobremesas e sucos refrescantes. Uma opção versátil que agrada a todos os paladares e traz aquele toque especial às suas receitas.",
    beneficios: [
      "Rico em antocianinas com alta ação anti-inflamatória",
      "Baixo índice glicêmico e calórico",
      "Estimula a síntese de colágeno e saúde da pele",
      "Favorito absoluto de crianças e adultos",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Antioxidante", "Favorito da Casa"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 16.5,
    imagemTemporaria: "/images/products/morango_done.jpeg",
  },
  {
    id: "seriguela",
    slug: "polpa-de-seriguela",
    nome: "Polpa de Seriguela",
    nomeCientifico: "Spondias purpurea",
    descricaoCurta:
      "A seriguela é uma fruta tropical típica do nordeste brasileiro, rica em vitaminas A e C. Seu sabor agridoce e aroma característico a tornam perfeita para sucos refrescantes e sobremesas regionais. Uma opção autêntica que traz todo o sabor e tradição da culinária nordestina.",
    beneficios: [
      "Fonte energética rápida com carboidratos saudáveis",
      "Rica em cálcio, fósforo e ferro",
      "Ajuda no trânsito intestinal e na imunidade",
      "Sabor tradicional da cultura sertaneja nordestina",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Tradição Nordestina", "Energético"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 15.0,
    imagemTemporaria: "/images/products/seriguela_done.jpeg",
  },
  {
    id: "tamarindo",
    slug: "polpa-de-tamarindo",
    nome: "Polpa de Tamarindo",
    nomeCientifico: "Tamarindus indica",
    descricaoCurta:
      "O tamarindo é uma fruta tropical com sabor único e marcante, rica em antioxidantes e minerais como potássio e magnésio. Sua polpa versátil é perfeita para sucos refrescantes, molhos e bebidas especiais. O sabor agridoce característico traz um toque exótico e sofisticado às suas receitas.",
    beneficios: [
      "Regulador natural do trânsito gastrointestinal",
      "Concentração elevada de potássio, magnésio e ferro",
      "Ação protetora hepática e antioxidante",
      "Sabor agridoce exótico de grande personalidade culinária",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Digestivo", "Rico em Minerais"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 14.5,
    imagemTemporaria: "/images/products/tamarindo_done.jpeg",
  },
  {
    id: "uva",
    slug: "polpa-de-uva",
    nome: "Polpa de Uva",
    nomeCientifico: "Vitis vinifera",
    descricaoCurta:
      "A uva é uma fruta rica em antioxidantes, especialmente resveratrol, e minerais essenciais. Sua polpa doce e refrescante é perfeita para sucos, vitaminas e bebidas especiais. Com alto teor de flavonoides e propriedades antioxidantes, a uva traz benefícios para a saúde além de um sabor incomparável às suas receitas.",
    beneficios: [
      "Concentrado em resveratrol e polifenóis cardioprotetores",
      "Auxilia na circulação sanguínea e controle da pressão arterial",
      "Ação protetora contra o estresse oxidativo celular",
      "Sabor adocicado, refrescante e muito apreciado",
    ],
    tags: ["100% Natural", "Sem Conservantes", "Resveratrol", "Saúde do Coração"],
    unidadePadrao: "Pacote 1kg (10x100g)",
    precoUnitario: 15.0,
    imagemTemporaria: "/images/products/uva_done.jpeg",
  },
];

export const TOTAL_OFFICIAL_FLAVORS = PRODUCTS.length;
