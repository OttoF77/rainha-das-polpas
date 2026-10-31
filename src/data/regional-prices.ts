import type { RegionalPriceTable } from "@/types/regional-pricing";

/**
 * Tabelas oficiais de preços regionais da Rainha das Polpas fornecidas pelo negócio.
 * Diferença de frete refrigerado interestadual/regional já embutida na tabela de cada estado.
 * Regra: NUNCA inferir preços via cálculo automático por UF.
 */
export const OFFICIAL_REGIONAL_PRICE_TABLES: Record<string, RegionalPriceTable> = {
  CE: {
    state: "CE",
    stateName: "Ceará",
    effectiveDate: "2026-10-01",
    includesRegionalFreight: true,
    notes: "Tabela Origem CE — Retirada na fábrica ou entrega regional inclusa",
    prices: {
      abacaxi: 14.0,
      acerola: 13.5,
      caja: 14.5,
      caju: 14.0,
      goiaba: 13.5,
      graviola: 16.0,
      manga: 14.0,
      mangaba: 16.5,
      maracuja: 16.0,
      morango: 18.0,
      seriguela: 15.0,
      tamarindo: 15.0,
      uva: 15.5,
    },
  },
  SP: {
    state: "SP",
    stateName: "São Paulo",
    effectiveDate: "2026-10-01",
    includesRegionalFreight: true,
    notes: "Tabela SP — Logística da cadeia de frio interestadual inclusa",
    prices: {
      abacaxi: 18.5,
      acerola: 18.0,
      caja: 19.5,
      caju: 18.5,
      goiaba: 18.0,
      graviola: 21.5,
      manga: 18.5,
      mangaba: 22.0,
      maracuja: 21.5,
      morango: 23.5,
      seriguela: 20.5,
      tamarindo: 20.5,
      uva: 21.0,
    },
  },
  PI: {
    state: "PI",
    stateName: "Piauí",
    effectiveDate: "2026-10-01",
    includesRegionalFreight: true,
    notes: "Tabela PI — Frete regional interestadual incluso",
    prices: {
      abacaxi: 15.5,
      acerola: 15.0,
      caja: 16.0,
      caju: 15.5,
      goiaba: 15.0,
      graviola: 17.5,
      manga: 15.5,
      mangaba: 18.0,
      maracuja: 17.5,
      morango: 19.5,
      seriguela: 16.5,
      tamarindo: 16.5,
      uva: 17.0,
    },
  },
  PE: {
    state: "PE",
    stateName: "Pernambuco",
    effectiveDate: "2026-10-01",
    includesRegionalFreight: true,
    notes: "Tabela PE — Frete regional interestadual incluso",
    prices: {
      abacaxi: 16.0,
      acerola: 15.5,
      caja: 16.5,
      caju: 16.0,
      goiaba: 15.5,
      graviola: 18.0,
      manga: 16.0,
      mangaba: 18.5,
      maracuja: 18.0,
      morango: 20.0,
      seriguela: 17.0,
      tamarindo: 17.0,
      uva: 17.5,
    },
  },
};

/**
 * Lista de UFs homologadas para entrega e atendimento comercial.
 */
export const SUPPORTED_STATES = ["CE", "SP", "PI", "PE", "RN", "PB", "MA", "BA"];

/**
 * UFs explicitamente não atendidas pela logística refrigerada no momento.
 */
export const UNSUPPORTED_STATES = ["AM", "AC", "RR", "RO", "AP"];
