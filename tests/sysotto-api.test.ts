import test from "node:test";
import assert from "node:assert/strict";
import { PRODUCTS } from "../src/data/products";
import {
  DEFAULT_SITE_SLUG,
  getSysottoApiBaseUrl,
  getSiteSlug,
  fetchPublicCatalog,
  mergeCatalogWithLocalProducts,
  getCatalogProducts,
  capturePublicLead,
  recordOrderIntent,
} from "../src/services/sysotto-api";
import type {
  IndustryCatalogProductDto,
  IndustryCatalogSectionV1,
  PublicLeadCaptureRequestDto,
  WhatsAppOrderIntentDto,
} from "../src/types/sysotto-contracts";

test("1. Configurações padrão e resolução por slug", () => {
  assert.equal(DEFAULT_SITE_SLUG, "rainhadaspolpas");
  assert.equal(getSiteSlug(), "rainhadaspolpas");
  assert.equal(getSysottoApiBaseUrl(), "");
});

test("2. PROIBIÇÃO estrita do cabeçalho X-Tenant-Id em todas as chamadas públicas (IND-001, IND-005)", async () => {
  const previousApiUrl = process.env.NEXT_PUBLIC_SYSOTTO_API_URL;
  process.env.NEXT_PUBLIC_SYSOTTO_API_URL = "https://api.sysotto.test";

  try {
    let capturedCatalogHeaders: Record<string, string> = {};
    const mockCatalogFetch = (async (_url: string | URL | Request, init?: RequestInit) => {
      capturedCatalogHeaders = (init?.headers as Record<string, string>) || {};
      return new Response(
        JSON.stringify({
          type: "IndustryCatalog_V1",
          id: "industry-catalog",
          isVisible: true,
          products: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    await fetchPublicCatalog("rainhadaspolpas", mockCatalogFetch);
    const catalogHeaderKeys = Object.keys(capturedCatalogHeaders).map((k) => k.toLowerCase());
    assert.ok(
      !catalogHeaderKeys.includes("x-tenant-id"),
      "Chamada de catálogo público JAMAIS deve enviar X-Tenant-Id"
    );

    let capturedLeadHeaders: Record<string, string> = {};
    const mockLeadFetch = (async (_url: string | URL | Request, init?: RequestInit) => {
      capturedLeadHeaders = (init?.headers as Record<string, string>) || {};
      return new Response(JSON.stringify({ success: true, leadId: "lead-1" }), { status: 200 });
    }) as typeof fetch;

    await capturePublicLead(
      { siteSlug: "rainhadaspolpas", name: "Cliente Teste", email: "cliente@teste.com" },
      { fetchFn: mockLeadFetch }
    );
    const leadHeaderKeys = Object.keys(capturedLeadHeaders).map((k) => k.toLowerCase());
    assert.ok(
      !leadHeaderKeys.includes("x-tenant-id"),
      "Chamada de captura de lead pública JAMAIS deve enviar X-Tenant-Id"
    );

    let capturedIntentHeaders: Record<string, string> = {};
    const mockIntentFetch = (async (_url: string | URL | Request, init?: RequestInit) => {
      capturedIntentHeaders = (init?.headers as Record<string, string>) || {};
      return new Response(JSON.stringify({ success: true, intentId: "intent-1" }), { status: 200 });
    }) as typeof fetch;

    await recordOrderIntent(
      {
        siteSlug: "rainhadaspolpas",
        protocol: "#RP-1111",
        items: [{ productName: "Polpa de Mangaba", quantity: 2, unit: "100g" }],
        totalItems: 2,
        hasUnpricedItems: false,
      },
      { fetchFn: mockIntentFetch }
    );
    const intentHeaderKeys = Object.keys(capturedIntentHeaders).map((k) => k.toLowerCase());
    assert.ok(
      !intentHeaderKeys.includes("x-tenant-id"),
      "Chamada de intenção de pedido pública JAMAIS deve enviar X-Tenant-Id"
    );
  } finally {
    process.env.NEXT_PUBLIC_SYSOTTO_API_URL = previousApiUrl;
  }
});

test("3. Sucesso na consulta remota e merge compatível com IndustryCatalog_V1", async () => {
  const previousApiUrl = process.env.NEXT_PUBLIC_SYSOTTO_API_URL;
  process.env.NEXT_PUBLIC_SYSOTTO_API_URL = "https://api.sysotto.test";

  try {
    const remoteProducts: IndustryCatalogProductDto[] = [
      {
        productId: "mangaba",
        name: "Polpa de Mangaba Artesanal",
        description: "Colheita fresca do cerrado cearense",
        unitOfMeasure: "Pacote 1kg (10x100g)",
        images: [{ assetId: "asset-1", url: "/images/custom-mangaba.png" }],
      },
      {
        productId: "abacaxi",
        name: "Polpa de Abacaxi Pérola",
        description: "Doçura equilibrada e natural",
        unitOfMeasure: "Pacote 1kg (10x100g)",
        images: [{ assetId: "asset-2", url: "/images/custom-abacaxi.png" }],
      },
    ];

    const catalogPayload: IndustryCatalogSectionV1 = {
      type: "IndustryCatalog_V1",
      id: "industry-catalog",
      isVisible: true,
      title: "Nossos Produtos",
      introduction: "Direto da fábrica",
      products: remoteProducts,
    };

    const mockFetch = (async (url: string | URL | Request) => {
      assert.ok(String(url).includes("/api/v1/public/sites/rainhadaspolpas/catalog"));
      return new Response(JSON.stringify(catalogPayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const products = await getCatalogProducts({ fetchFn: mockFetch });

    // Testa diretamente a função pura de merge
    const directlyMerged = mergeCatalogWithLocalProducts(remoteProducts, PRODUCTS);
    assert.equal(directlyMerged.length, 2);
    assert.equal(directlyMerged[0].nome, "Polpa de Mangaba Artesanal");

    assert.equal(products.length, 2);

    const mangaba = products.find((p) => p.id === "mangaba");
    assert.ok(mangaba);
    assert.equal(mangaba.nome, "Polpa de Mangaba Artesanal");
    assert.equal(mangaba.descricaoCurta, "Colheita fresca do cerrado cearense");
    assert.equal(mangaba.imagemTemporaria, "/images/custom-mangaba.png");
    // Metadados locais preservados
    assert.equal(mangaba.nomeCientifico, "Hancornia speciosa");
    assert.ok(mangaba.beneficios.length > 0);
    assert.equal(mangaba.precoUnitario, 16.5);

    const abacaxi = products.find((p) => p.id === "abacaxi");
    assert.ok(abacaxi);
    assert.equal(abacaxi.nome, "Polpa de Abacaxi Pérola");
    assert.equal(abacaxi.imagemTemporaria, "/images/custom-abacaxi.png");
    assert.equal(abacaxi.nomeCientifico, "Ananas comosus");
  } finally {
    process.env.NEXT_PUBLIC_SYSOTTO_API_URL = previousApiUrl;
  }
});

test("4. Resiliência: Fallback imediato quando NEXT_PUBLIC_SYSOTTO_API_URL não está configurada", async () => {
  const previousApiUrl = process.env.NEXT_PUBLIC_SYSOTTO_API_URL;
  delete process.env.NEXT_PUBLIC_SYSOTTO_API_URL;

  try {
    let fetchCalled = false;
    const mockFetch = (async () => {
      fetchCalled = true;
      return new Response("{}", { status: 200 });
    }) as typeof fetch;

    const products = await getCatalogProducts({ fetchFn: mockFetch });
    assert.equal(fetchCalled, false, "Não deve disparar fetch quando API URL estiver ausente");
    assert.equal(products.length, PRODUCTS.length);
    assert.equal(products, PRODUCTS);
  } finally {
    process.env.NEXT_PUBLIC_SYSOTTO_API_URL = previousApiUrl;
  }
});

test("5. Resiliência: Fallback transparente em caso de erro HTTP 5xx da API", async () => {
  const previousApiUrl = process.env.NEXT_PUBLIC_SYSOTTO_API_URL;
  process.env.NEXT_PUBLIC_SYSOTTO_API_URL = "https://api.sysotto.test";

  try {
    const mockFetch500 = (async () => {
      return new Response("Internal Server Error", { status: 500 });
    }) as typeof fetch;

    const products = await getCatalogProducts({ fetchFn: mockFetch500 });
    assert.equal(products.length, PRODUCTS.length, "Deve retornar catálogo local em caso de 500");
    assert.equal(products[0].id, PRODUCTS[0].id);
  } finally {
    process.env.NEXT_PUBLIC_SYSOTTO_API_URL = previousApiUrl;
  }
});

test("6. Resiliência: Fallback transparente em caso de timeout do AbortController", async () => {
  const previousApiUrl = process.env.NEXT_PUBLIC_SYSOTTO_API_URL;
  process.env.NEXT_PUBLIC_SYSOTTO_API_URL = "https://api.sysotto.test";

  try {
    const mockTimeoutFetch = ((_url: string | URL | Request, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        if (init?.signal) {
          init.signal.addEventListener("abort", () => {
            const err = new Error("The operation was aborted");
            err.name = "AbortError";
            reject(err);
          });
        }
      });
    }) as typeof fetch;

    const startTime = Date.now();
    const products = await getCatalogProducts({ fetchFn: mockTimeoutFetch, timeoutMs: 50 });
    const elapsed = Date.now() - startTime;

    assert.ok(elapsed < 1000, "Deve cancelar prontamente dentro do timeout");
    assert.equal(products.length, PRODUCTS.length, "Deve retornar catálogo local após timeout");
  } finally {
    process.env.NEXT_PUBLIC_SYSOTTO_API_URL = previousApiUrl;
  }
});

test("7. Captura de lead (Communication): Sucesso e Fail-Closed", async () => {
  const previousApiUrl = process.env.NEXT_PUBLIC_SYSOTTO_API_URL;
  process.env.NEXT_PUBLIC_SYSOTTO_API_URL = "https://api.sysotto.test";

  try {
    const leadPayload: PublicLeadCaptureRequestDto = {
      siteSlug: "rainhadaspolpas",
      name: "Distribuidora de Alimentos",
      email: "contato@distribuidora.com",
      phone: "88999990000",
      company: "Distribuidora Nordeste",
      message: "Gostaria de cotar 500kg de polpa de mangaba",
    };

    let postUrl = "";
    let postBody = "";
    const mockSuccessFetch = (async (url: string | URL | Request, init?: RequestInit) => {
      postUrl = String(url);
      postBody = String(init?.body);
      return new Response(JSON.stringify({ success: true, leadId: "lead-abc-123" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const successResult = await capturePublicLead(leadPayload, { fetchFn: mockSuccessFetch });
    assert.equal(successResult.success, true);
    assert.equal(successResult.leadId, "lead-abc-123");
    assert.ok(postUrl.includes("/api/v1/public/sites/rainhadaspolpas/leads"));
    assert.ok(postBody.includes("Distribuidora Nordeste"));

    // Fail-Closed se a API retornar erro HTTP
    const mockErrorFetch = (async () => {
      return new Response("Service Unavailable", { status: 503 });
    }) as typeof fetch;

    const errorResult = await capturePublicLead(leadPayload, { fetchFn: mockErrorFetch });
    assert.equal(errorResult.success, false);
    assert.ok(errorResult.message?.includes("503"));
  } finally {
    process.env.NEXT_PUBLIC_SYSOTTO_API_URL = previousApiUrl;
  }
});

test("8. Registro de intenção de pedido (Sales): Sucesso e Fail-Closed", async () => {
  const previousApiUrl = process.env.NEXT_PUBLIC_SYSOTTO_API_URL;
  process.env.NEXT_PUBLIC_SYSOTTO_API_URL = "https://api.sysotto.test";

  try {
    const intentPayload: WhatsAppOrderIntentDto = {
      siteSlug: "rainhadaspolpas",
      protocol: "#RP-8492",
      customerName: "Joao Santos",
      deliveryMode: "Entrega",
      location: "Bairro de Fatima",
      paymentMethod: "Pix",
      items: [
        { productId: "mangaba", productName: "Polpa de Mangaba", quantity: 5, unit: "100g", unitPrice: 16.5, subtotal: 82.5 },
      ],
      totalItems: 5,
      estimatedTotal: 82.5,
      hasUnpricedItems: false,
    };

    let intentUrl = "";
    let intentBody = "";
    const mockSuccessFetch = (async (url: string | URL | Request, init?: RequestInit) => {
      intentUrl = String(url);
      intentBody = String(init?.body);
      return new Response(JSON.stringify({ success: true, intentId: "intent-xyz-789" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const result = await recordOrderIntent(intentPayload, { fetchFn: mockSuccessFetch });
    assert.equal(result.success, true);
    assert.equal(result.protocol, "#RP-8492");
    assert.equal(result.intentId, "intent-xyz-789");
    assert.ok(intentUrl.includes("/api/v1/public/sites/rainhadaspolpas/orders/intent"));
    assert.ok(intentBody.includes("#RP-8492"));

    // Fail-Closed em caso de falha de conexão
    const mockNetworkErrorFetch = (async () => {
      throw new Error("Network connection refused");
    }) as typeof fetch;

    const failedResult = await recordOrderIntent(intentPayload, { fetchFn: mockNetworkErrorFetch });
    assert.equal(failedResult.success, false);
    assert.ok(failedResult.message?.includes("connection refused"));
  } finally {
    process.env.NEXT_PUBLIC_SYSOTTO_API_URL = previousApiUrl;
  }
});

test("9. Compatibilidade com PublicLandingPageResponse (/api/v1/landing-pages/{slug}) após 404 na rota /public/sites", async () => {
  const previousApiUrl = process.env.NEXT_PUBLIC_SYSOTTO_API_URL;
  process.env.NEXT_PUBLIC_SYSOTTO_API_URL = "/sysotto-api";

  try {
    const requestedUrls: string[] = [];
    const mockLandingPageFetch = (async (url: string | URL | Request) => {
      const target = String(url);
      requestedUrls.push(target);

      if (target === "/sysotto-api/api/v1/public/sites/rainhadaspolpas/catalog") {
        return new Response("Not Found", { status: 404 });
      }

      if (target === "/sysotto-api/api/v1/landing-pages/rainhadaspolpas") {
        return new Response(
          JSON.stringify({
            slug: "rainhadaspolpas",
            content: {
              sections: [
                { type: "Hero_V1", title: "Rainha das Polpas" },
                {
                  type: "IndustryCatalog_V1",
                  id: "catalog-1",
                  isVisible: true,
                  products: [
                    {
                      productId: "mangaba",
                      name: "Polpa de Mangaba API",
                      description: "Sincronizada via Sysotto.Api",
                      unitOfMeasure: "Pacote 1kg (10x100g)",
                    },
                  ],
                },
              ],
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response("Unexpected", { status: 500 });
    }) as typeof fetch;

    const products = await getCatalogProducts({ fetchFn: mockLandingPageFetch });
    assert.deepEqual(requestedUrls, [
      "/sysotto-api/api/v1/public/sites/rainhadaspolpas/catalog",
      "/sysotto-api/api/v1/landing-pages/rainhadaspolpas",
    ]);
    assert.equal(products.length, 1);
    assert.equal(products[0].nome, "Polpa de Mangaba API");
    assert.equal(products[0].nomeCientifico, "Hancornia speciosa");
  } finally {
    process.env.NEXT_PUBLIC_SYSOTTO_API_URL = previousApiUrl;
  }
});
