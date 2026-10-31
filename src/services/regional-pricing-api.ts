import {
  OFFICIAL_REGIONAL_PRICE_TABLES,
  UNSUPPORTED_STATES,
} from "@/data/regional-prices";
import { MOCK_CUSTOMERS } from "@/data/mock-customers";
import { getSysottoApiBaseUrl, getSiteSlug, DEFAULT_API_TIMEOUT_MS } from "@/services/sysotto-api";
import type {
  CustomerAddress,
  CustomerAuthSession,
  CustomerUser,
  PricingStatus,
  RegionalPriceTable,
} from "@/types/regional-pricing";

/**
 * Normaliza e sanitiza cabeçalhos públicos garantindo conformidade com IND-001 e IND-005.
 * X-Tenant-Id é expressamente proibido em requisições de clientes públicos.
 */
function createPublicHeaders(additionalHeaders: Record<string, string> = {}): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...additionalHeaders,
  };

  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === "x-tenant-id") {
      delete headers[key];
    }
  }

  return headers;
}

/**
 * Resolve o endereço selecionado do cliente autenticado.
 */
export function resolveCustomerAddress(customer: CustomerUser | null): CustomerAddress | null {
  if (!customer || !Array.isArray(customer.addresses) || customer.addresses.length === 0) {
    return null;
  }
  const index = customer.selectedAddressIndex ?? 0;
  return customer.addresses[index] || customer.addresses[0] || null;
}

/**
 * Resolve a UF oficial a partir do endereço cadastrado do cliente.
 * O texto livre de bairro ou cidade NÃO deve determinar sozinho a tabela de preços.
 */
export function resolveCustomerUf(customer: CustomerUser | null): string | null {
  const address = resolveCustomerAddress(customer);
  if (!address || !address.state) {
    return null;
  }
  const cleanState = address.state.trim().toUpperCase();
  return cleanState.length === 2 ? cleanState : null;
}

export interface FetchRegionalTableResult {
  status: PricingStatus;
  table?: RegionalPriceTable;
  message?: string;
}

/**
 * Consulta a tabela regional vigente para a UF do cliente via API ou fallback de negócio.
 * Não recorre silenciosamente a preço genérico; estados de erro e UF não atendida são explícitos.
 */
export async function fetchRegionalPriceTable(
  uf: string,
  options: {
    siteSlug?: string;
    fetchFn?: typeof fetch;
    timeoutMs?: number;
  } = {}
): Promise<FetchRegionalTableResult> {
  const cleanUf = (uf || "").trim().toUpperCase();
  if (!cleanUf || cleanUf.length !== 2) {
    return {
      status: "NO_ADDRESS",
      message: "Endereço sem estado (UF) válido informado.",
    };
  }

  // Verificação prévia de estados sem rota refrigerada homologada
  if (UNSUPPORTED_STATES.includes(cleanUf)) {
    return {
      status: "UNSUPPORTED_REGION",
      message: `No momento as entregas não atendem o estado ${cleanUf}. Consulte o atendimento comercial.`,
    };
  }

  const baseUrl = getSysottoApiBaseUrl();
  const fetchFn = options.fetchFn || fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_API_TIMEOUT_MS;
  const siteSlug = options.siteSlug || getSiteSlug();

  if (baseUrl) {
    const endpointUrl = `${baseUrl.replace(/\/+$/, "")}/api/v1/public/sites/${encodeURIComponent(siteSlug)}/pricing/${encodeURIComponent(cleanUf)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchFn(endpointUrl, {
        method: "GET",
        headers: createPublicHeaders(),
        signal: controller.signal,
      });

      if (response.status === 404) {
        return {
          status: "UNSUPPORTED_REGION",
          message: `Tabela comercial não disponível para o estado ${cleanUf}.`,
        };
      }

      if (!response.ok) {
        return {
          status: "PRICING_UNAVAILABLE",
          message: `Falha na consulta da tabela regional (HTTP ${response.status}).`,
        };
      }

      const data = await response.json();
      if (data && typeof data === "object" && data.prices && typeof data.prices === "object") {
        return {
          status: "ACTIVE",
          table: data as RegionalPriceTable,
        };
      }

      return {
        status: "PRICING_UNAVAILABLE",
        message: "Resposta da API de precificação malformada.",
      };
    } catch {
      return {
        status: "PRICING_UNAVAILABLE",
        message: "Erro de conexão ou timeout ao consultar tabela regional.",
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Fallback para tabelas oficiais homologadas pelo negócio (quando API remota não estiver configurada)
  const officialTable = OFFICIAL_REGIONAL_PRICE_TABLES[cleanUf];
  if (officialTable) {
    return {
      status: "ACTIVE",
      table: officialTable,
    };
  }

  return {
    status: "UNSUPPORTED_REGION",
    message: `No momento não possuímos rota de entrega ativa para ${cleanUf}.`,
  };
}

/**
 * Autentica o cliente por e-mail ou identificador.
 */
export async function authenticateCustomerByEmail(
  email: string,
  options: {
    siteSlug?: string;
    fetchFn?: typeof fetch;
    timeoutMs?: number;
  } = {}
): Promise<{ success: boolean; session?: CustomerAuthSession; message?: string }> {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, message: "E-mail de cliente obrigatório." };
  }

  const baseUrl = getSysottoApiBaseUrl();
  const fetchFn = options.fetchFn || fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_API_TIMEOUT_MS;
  const siteSlug = options.siteSlug || getSiteSlug();

  if (baseUrl) {
    const endpointUrl = `${baseUrl.replace(/\/+$/, "")}/api/v1/public/sites/${encodeURIComponent(siteSlug)}/customers/auth`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchFn(endpointUrl, {
        method: "POST",
        headers: createPublicHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ email: cleanEmail }),
        signal: controller.signal,
      });

      if (!response.ok) {
        return { success: false, message: `Cliente não encontrado ou credenciais inválidas (HTTP ${response.status}).` };
      }

      const data = await response.json();
      return { success: true, session: data as CustomerAuthSession };
    } catch {
      return { success: false, message: "Erro de conexão ao autenticar cliente." };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Resolução local em modo demo/fallback
  const found = MOCK_CUSTOMERS.find((c) => c.email.toLowerCase() === cleanEmail);
  if (found) {
    return {
      success: true,
      session: {
        token: `demo-token-${found.id}`,
        user: found,
      },
    };
  }

  // Se não coincidir exatamente com os mocks, gera sessão com endereço CE padrão ou busca por prefixo
  if (cleanEmail.includes("@")) {
    const isSp = cleanEmail.includes("sp");
    const isAm = cleanEmail.includes("am");
    const isPi = cleanEmail.includes("pi");
    const state = isSp ? "SP" : isAm ? "AM" : isPi ? "PI" : "CE";
    const city = isSp ? "São Paulo" : isAm ? "Manaus" : isPi ? "Teresina" : "Fortaleza";

    const dynamicCustomer: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: cleanEmail,
      addresses: [
        {
          street: "Rua do Cliente",
          number: "100",
          neighborhood: "Bairro Central",
          city,
          state,
        },
      ],
      selectedAddressIndex: 0,
    };

    return {
      success: true,
      session: {
        token: `demo-token-${dynamicCustomer.id}`,
        user: dynamicCustomer,
      },
    };
  }

  return { success: false, message: "Formato de e-mail inválido." };
}
