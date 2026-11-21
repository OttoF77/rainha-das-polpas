import { PRODUCTS, type Product } from "@/data/products";
import type {
  IndustryCatalogProductDto,
  IndustryCatalogSectionV1,
  PublicLeadCaptureRequestDto,
  PublicLeadCaptureResponseDto,
  WhatsAppOrderIntentDto,
  WhatsAppOrderIntentResponseDto,
} from "@/types/sysotto-contracts";

export const DEFAULT_SITE_SLUG = "rainhadaspolpas";
export const DEFAULT_API_TIMEOUT_MS = 3000;

export function getSysottoApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SYSOTTO_API_URL || "").trim();
}

export function getSiteSlug(): string {
  return (process.env.NEXT_PUBLIC_SITE_SLUG || DEFAULT_SITE_SLUG).trim();
}

const isTestEnv =
  typeof process !== "undefined" &&
  (process.env.NODE_ENV === "test" ||
    process.argv?.includes("--test") ||
    process.argv?.some((arg) => arg.includes("test")));

/**
 * Creates sanitised headers for public endpoints.
 * Enforces IND-001 & IND-005: X-Tenant-Id header is strictly prohibited on public requests.
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

function extractIndustryCatalogSection(data: unknown): IndustryCatalogSectionV1 | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  // Accepts either the section directly ({ type: "IndustryCatalog_V1", ... })
  // or wrapped in a site builder response ({ catalog: ... }, { sections: [...] }, or { content: { sections: [...] } })
  if (record.type === "IndustryCatalog_V1" && Array.isArray(record.products)) {
    return record as unknown as IndustryCatalogSectionV1;
  }

  const catalog = record.catalog as Record<string, unknown> | undefined;
  if (catalog && catalog.type === "IndustryCatalog_V1" && Array.isArray(catalog.products)) {
    return catalog as unknown as IndustryCatalogSectionV1;
  }

  const content = record.content as Record<string, unknown> | undefined;
  const sections = Array.isArray(record.sections)
    ? record.sections
    : Array.isArray(content?.sections)
      ? content.sections
      : null;

  if (sections) {
    const found = sections.find(
      (s): s is Record<string, unknown> =>
        Boolean(s && typeof s === "object" && (s as { type?: unknown }).type === "IndustryCatalog_V1")
    );
    if (found && Array.isArray(found.products)) {
      return found as unknown as IndustryCatalogSectionV1;
    }
  }

  return null;
}

/**
 * Fetches the published public catalog projection (IndustryCatalog_V1) for the tenant.
 * Conforms to IND-001/IND-005: Tenant resolution occurs exclusively by slug or Host.
 */
export async function fetchPublicCatalog(
  siteSlug: string = getSiteSlug(),
  fetchFn: typeof fetch = fetch,
  timeoutMs: number = DEFAULT_API_TIMEOUT_MS
): Promise<IndustryCatalogSectionV1 | null> {
  const baseUrl = getSysottoApiBaseUrl();
  if (!baseUrl) {
    return null;
  }

  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const encodedSlug = encodeURIComponent(siteSlug);
  const candidateUrls = [
    `${cleanBaseUrl}/api/v1/public/sites/${encodedSlug}/catalog`,
    `${cleanBaseUrl}/api/v1/landing-pages/${encodedSlug}`,
  ];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    for (let i = 0; i < candidateUrls.length; i++) {
      const response = await fetchFn(candidateUrls[i], {
        method: "GET",
        headers: createPublicHeaders(),
        signal: controller.signal,
      });

      if (response.status === 404 && i < candidateUrls.length - 1) {
        continue;
      }

      if (!response.ok) {
        if (!isTestEnv) {
          console.warn(`[SysottoApi] Falha ao consultar catálogo remoto (${response.status}): fallback local ativado.`);
        }
        return null;
      }

      const data = await response.json();
      return extractIndustryCatalogSection(data);
    }

    return null;
  } catch (error) {
    if (!isTestEnv) {
      console.warn("[SysottoApi] Erro de rede ou timeout ao consultar catálogo remoto: fallback local ativado.", error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Merges canonical remote product data with local nutritional metadata and prices.
 */
export function mergeCatalogWithLocalProducts(
  remoteProducts: IndustryCatalogProductDto[],
  localProducts: Product[] = PRODUCTS
): Product[] {
  if (!remoteProducts || remoteProducts.length === 0) {
    return localProducts;
  }

  const localById = new Map<string, Product>();
  const localByName = new Map<string, Product>();
  const localBySlug = new Map<string, Product>();

  for (const p of localProducts) {
    localById.set(p.id.toLowerCase(), p);
    localByName.set(p.nome.toLowerCase(), p);
    localBySlug.set(p.slug.toLowerCase(), p);
  }

  return remoteProducts.map((remote) => {
    const match =
      localById.get(remote.productId.toLowerCase()) ||
      localByName.get(remote.name.toLowerCase()) ||
      localBySlug.get(remote.productId.toLowerCase());

    const remoteImage =
      Array.isArray(remote.images) && remote.images.length > 0 && remote.images[0]?.url
        ? remote.images[0].url
        : undefined;

    if (match) {
      return {
        ...match,
        nome: remote.name || match.nome,
        descricaoCurta: remote.description || match.descricaoCurta,
        unidadePadrao: remote.unitOfMeasure || match.unidadePadrao,
        imagemTemporaria: remoteImage || match.imagemTemporaria,
      };
    }

    // Unmatched remote product - create compliant Product item
    const generatedSlug = remote.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      id: remote.productId,
      slug: generatedSlug || `produto-${remote.productId}`,
      nome: remote.name,
      nomeCientifico: "",
      descricaoCurta: remote.description || "",
      beneficios: ["100% Fruta Natural", "Sem Conservantes"],
      tags: ["100% Natural", "Sem Conservantes"],
      unidadePadrao: remote.unitOfMeasure || "Pacote 1kg (10x100g)",
      imagemTemporaria: remoteImage || "/images/products/mangaba_done.png",
    };
  });
}

/**
 * Returns catalog products with graceful fallback to local dataset.
 * Returns local products immediately if NEXT_PUBLIC_SYSOTTO_API_URL is not set.
 */
export async function getCatalogProducts(
  options: { siteSlug?: string; fetchFn?: typeof fetch; timeoutMs?: number } = {}
): Promise<Product[]> {
  const baseUrl = getSysottoApiBaseUrl();
  if (!baseUrl) {
    return PRODUCTS;
  }

  try {
    const catalogSection = await fetchPublicCatalog(
      options.siteSlug || getSiteSlug(),
      options.fetchFn,
      options.timeoutMs
    );

    if (!catalogSection || !Array.isArray(catalogSection.products) || catalogSection.products.length === 0) {
      return PRODUCTS;
    }

    return mergeCatalogWithLocalProducts(catalogSection.products, PRODUCTS);
  } catch {
    return PRODUCTS;
  }
}

/**
 * Captures a public lead (Sysotto.Communication / SiteBuilder).
 * Fail-closed behavior: Returns success: false if the API is offline or unconfigured.
 */
export async function capturePublicLead(
  data: PublicLeadCaptureRequestDto,
  options: { fetchFn?: typeof fetch; timeoutMs?: number } = {}
): Promise<PublicLeadCaptureResponseDto> {
  const baseUrl = getSysottoApiBaseUrl();
  if (!baseUrl) {
    return { success: false, message: "Sysotto API não configurada" };
  }

  const siteSlug = data.siteSlug || getSiteSlug();
  const endpointUrl = `${baseUrl.replace(/\/+$/, "")}/api/v1/public/sites/${encodeURIComponent(siteSlug)}/leads`;
  const fetchFn = options.fetchFn || fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_API_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(endpointUrl, {
      method: "POST",
      headers: createPublicHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ ...data, siteSlug }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { success: false, message: `Erro HTTP ${response.status}` };
    }

    const result = await response.json().catch(() => ({}));
    return { success: true, ...result };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return { success: false, message };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Records a WhatsApp checkout order intent (Sysotto.Sales).
 * Fail-closed behavior: Returns success: false if the API is offline or unconfigured.
 */
export async function recordOrderIntent(
  data: WhatsAppOrderIntentDto,
  options: { fetchFn?: typeof fetch; timeoutMs?: number } = {}
): Promise<WhatsAppOrderIntentResponseDto> {
  const baseUrl = getSysottoApiBaseUrl();
  if (!baseUrl) {
    return { success: false, message: "Sysotto API não configurada" };
  }

  const siteSlug = data.siteSlug || getSiteSlug();
  const endpointUrl = `${baseUrl.replace(/\/+$/, "")}/api/v1/public/sites/${encodeURIComponent(siteSlug)}/orders/intent`;
  const fetchFn = options.fetchFn || fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_API_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(endpointUrl, {
      method: "POST",
      headers: createPublicHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ ...data, siteSlug }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { success: false, message: `Erro HTTP ${response.status}` };
    }

    const result = await response.json().catch(() => ({}));
    return { success: true, protocol: data.protocol, ...result };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return { success: false, message };
  } finally {
    clearTimeout(timeoutId);
  }
}
