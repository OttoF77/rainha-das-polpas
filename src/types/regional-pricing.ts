/**
 * Contratos e tipos para Precificação Regional por Estado (UF) e Autenticação de Clientes.
 * Conforme Requisitos S3-04 (refs #11).
 *
 * Guardrails:
 * - IND-001, IND-005: Proibição estrita de X-Tenant-Id em requisições públicas.
 * - Preços exibidos exclusivamente no carrinho após login e identificação de UF.
 * - Nunca inferir preços a partir da UF; valores são estritamente definidos pelo negócio.
 */

export type BrazilianState =
  | "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES" | "GO"
  | "MA" | "MT" | "MS" | "MG" | "PA" | "PB" | "PR" | "PE" | "PI"
  | "RJ" | "RN" | "RS" | "RO" | "RR" | "SC" | "SP" | "SE" | "TO";

export interface CustomerAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: BrazilianState | string; // UF (ex: "CE", "SP")
  postalCode?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string; // CPF ou CNPJ
  addresses: CustomerAddress[];
  selectedAddressIndex?: number;
}

export interface CustomerAuthSession {
  token: string;
  user: CustomerUser;
}

export interface RegionalPriceTable {
  state: BrazilianState | string;
  stateName: string;
  effectiveDate: string;
  includesRegionalFreight: boolean;
  prices: Record<string, number>; // productId -> unitPrice em BRL
  notes?: string;
}

export type PricingStatus =
  | "UNAUTHENTICATED"        // Não autenticado: preços ocultos
  | "NO_ADDRESS"             // Autenticado, mas sem endereço de entrega com UF válida
  | "UNSUPPORTED_REGION"     // UF não atendida pela malha logística
  | "PRODUCT_UNPRICED"       // Produto sem preço cadastrado na tabela da UF
  | "PRICING_UNAVAILABLE"    // Falha ou indisponibilidade da API
  | "ACTIVE";                // Tabela regional carregada e ativa com sucesso
