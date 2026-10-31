import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  OFFICIAL_REGIONAL_PRICE_TABLES,
  SUPPORTED_STATES,
  UNSUPPORTED_STATES,
} from "../src/data/regional-prices";
import { MOCK_CUSTOMERS } from "../src/data/mock-customers";
import {
  fetchRegionalPriceTable,
  resolveCustomerAddress,
  resolveCustomerUf,
  authenticateCustomerByEmail,
} from "../src/services/regional-pricing-api";
import {
  addCartItem,
  applyRegionalPrices,
  cartTotals,
  serializeCart,
  deserializeCart,
} from "../src/lib/cart";
import { formatWhatsAppOrderMessage } from "../src/lib/whatsapp";
import { PRODUCTS } from "../src/data/products";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

test("1. Nenhum preço aparece no catálogo público, cards ou modal de detalhes", () => {
  const cardContent = fs.readFileSync(path.join(rootDir, "src/components/ProductCard.tsx"), "utf-8");
  const modalContent = fs.readFileSync(path.join(rootDir, "src/components/ProductDetailModal.tsx"), "utf-8");
  const gridContent = fs.readFileSync(path.join(rootDir, "src/components/ProductGrid.tsx"), "utf-8");

  // Verifica ausência de 'Preço sugerido' e 'formattedPrice' nos componentes públicos
  assert.ok(
    !cardContent.includes("Preço sugerido"),
    "ProductCard não deve exibir 'Preço sugerido'"
  );
  assert.ok(
    !cardContent.includes("formattedPrice"),
    "ProductCard não deve calcular nem exibir formattedPrice"
  );
  assert.ok(
    !modalContent.includes("formattedPrice"),
    "ProductDetailModal não deve calcular nem exibir formattedPrice"
  );
  assert.ok(
    !gridContent.includes("formattedPrice"),
    "ProductGrid não deve manipular preços nos cards"
  );
});

test("2. Cliente sem login monta e mantém o carrinho, mas não visualiza preços (preços sob consulta)", () => {
  const mangaba = PRODUCTS.find((p) => p.id === "mangaba")!;
  const abacaxi = PRODUCTS.find((p) => p.id === "abacaxi")!;

  // Adiciona itens sem autenticação (preços indefinidos)
  let items = addCartItem([], mangaba, 3);
  items = addCartItem(items, abacaxi, 2);

  // Aplica tabela regional nula (sessão anônima / sem login)
  const unpricedItems = applyRegionalPrices(items, null);

  assert.equal(unpricedItems.length, 2);
  assert.equal(unpricedItems[0].quantity, 3);
  assert.equal(unpricedItems[0].unitPrice, undefined);
  assert.equal(unpricedItems[0].subtotal, undefined);
  assert.equal(unpricedItems[1].unitPrice, undefined);
  assert.equal(unpricedItems[1].subtotal, undefined);

  const totals = cartTotals(unpricedItems);
  assert.equal(totals.totalItems, 5);
  assert.equal(totals.hasUnpricedItems, true);
  assert.equal(totals.estimatedTotal, undefined);
});

test("3. Login e identificação de UF válida liberam valores corretos para CE e SP (diferenças de frete inclusas)", async () => {
  const ceTable = OFFICIAL_REGIONAL_PRICE_TABLES["CE"];
  const spTable = OFFICIAL_REGIONAL_PRICE_TABLES["SP"];

  assert.ok(ceTable, "Tabela de preços do Ceará (CE) deve existir");
  assert.ok(spTable, "Tabela de preços de São Paulo (SP) deve existir");

  // Mangaba no CE é R$ 16,50; em SP com frete interestadual é R$ 22,00
  assert.equal(ceTable.prices["mangaba"], 16.5);
  assert.equal(spTable.prices["mangaba"], 22.0);

  // Abacaxi no CE é R$ 14,00; em SP é R$ 18,50
  assert.equal(ceTable.prices["abacaxi"], 14.0);
  assert.equal(spTable.prices["abacaxi"], 18.5);

  const mangaba = PRODUCTS.find((p) => p.id === "mangaba")!;
  const abacaxi = PRODUCTS.find((p) => p.id === "abacaxi")!;

  let items = addCartItem([], mangaba, 2); // 2 mangabas
  items = addCartItem(items, abacaxi, 1);  // 1 abacaxi

  // 1. Aplica Tabela do Ceará (CE)
  const ceItems = applyRegionalPrices(items, ceTable.prices);
  assert.equal(ceItems[0].unitPrice, 16.5);
  assert.equal(ceItems[0].subtotal, 33.0);
  assert.equal(ceItems[1].unitPrice, 14.0);
  assert.equal(ceItems[1].subtotal, 14.0);

  const ceTotals = cartTotals(ceItems);
  assert.equal(ceTotals.totalItems, 3);
  assert.equal(ceTotals.hasUnpricedItems, false);
  assert.equal(ceTotals.estimatedTotal, 47.0); // 33 + 14 = 47.00

  // 2. Aplica Tabela de São Paulo (SP)
  const spItems = applyRegionalPrices(items, spTable.prices);
  assert.equal(spItems[0].unitPrice, 22.0);
  assert.equal(spItems[0].subtotal, 44.0);
  assert.equal(spItems[1].unitPrice, 18.5);
  assert.equal(spItems[1].subtotal, 18.5);

  const spTotals = cartTotals(spItems);
  assert.equal(spTotals.totalItems, 3);
  assert.equal(spTotals.hasUnpricedItems, false);
  assert.equal(spTotals.estimatedTotal, 62.5); // 44 + 18.5 = 62.50
});

test("4. Mudança de UF, logout e troca de cliente eliminam imediatamente os valores anteriores preservando produtos", () => {
  const mangaba = PRODUCTS.find((p) => p.id === "mangaba")!;
  const items = addCartItem([], mangaba, 4);

  // Cliente autenticado em SP
  const spTable = OFFICIAL_REGIONAL_PRICE_TABLES["SP"];
  let pricedItems = applyRegionalPrices(items, spTable.prices);
  assert.equal(pricedItems[0].subtotal, 88.0); // 4 * 22.0

  // Troca para CE: recalcula imediatamente com a tabela do CE
  const ceTable = OFFICIAL_REGIONAL_PRICE_TABLES["CE"];
  pricedItems = applyRegionalPrices(pricedItems, ceTable.prices);
  assert.equal(pricedItems[0].quantity, 4);
  assert.equal(pricedItems[0].unitPrice, 16.5);
  assert.equal(pricedItems[0].subtotal, 66.0); // 4 * 16.5

  // Logout do cliente: anula imediatamente preços, mantendo 4 mangabas no carrinho
  const loggedOutItems = applyRegionalPrices(pricedItems, null);
  assert.equal(loggedOutItems[0].quantity, 4);
  assert.equal(loggedOutItems[0].unitPrice, undefined);
  assert.equal(loggedOutItems[0].subtotal, undefined);
  assert.equal(cartTotals(loggedOutItems).estimatedTotal, undefined);
  assert.equal(cartTotals(loggedOutItems).hasUnpricedItems, true);
});

test("5. Ausência de endereço e UF não atendida possuem estados explícitos sem recorrer a preço genérico", async () => {
  assert.ok(SUPPORTED_STATES.includes("CE"));
  assert.ok(UNSUPPORTED_STATES.includes("AM"));

  const authRes = await authenticateCustomerByEmail("maria.ce@exemplo.com");
  assert.equal(authRes.success, true);
  assert.equal(authRes.session?.user.id, "cust-ce-01");

  // Cliente sem endereço
  const noAddressUser = MOCK_CUSTOMERS.find((c) => c.id === "cust-no-address")!;
  assert.equal(resolveCustomerAddress(noAddressUser), null);
  assert.equal(resolveCustomerUf(noAddressUser), null);

  const noAddressRes = await fetchRegionalPriceTable("");
  assert.equal(noAddressRes.status, "NO_ADDRESS");
  assert.equal(noAddressRes.table, undefined);

  // Cliente em estado não atendido (Amazonas - AM)
  const amUser = MOCK_CUSTOMERS.find((c) => c.id === "cust-unsupported-am")!;
  assert.equal(resolveCustomerUf(amUser), "AM");

  const amRes = await fetchRegionalPriceTable("AM");
  assert.equal(amRes.status, "UNSUPPORTED_REGION");
  assert.equal(amRes.table, undefined);
  assert.match(amRes.message!, /não atendem o estado AM/i);
});

test("6. Produto ausente na tabela regional permanece explicitamente sob consulta", () => {
  const mangaba = PRODUCTS.find((p) => p.id === "mangaba")!;
  const customTablePrices: Record<string, number> = {
    // Mangaba NÃO está cadastrada nesta tabela hipotética
    abacaxi: 15.0,
  };

  const items = addCartItem([], mangaba, 2);
  const evaluated = applyRegionalPrices(items, customTablePrices);

  assert.equal(evaluated[0].unitPrice, undefined);
  assert.equal(evaluated[0].subtotal, undefined);
  assert.equal(cartTotals(evaluated).hasUnpricedItems, true);
  assert.equal(cartTotals(evaluated).estimatedTotal, undefined);
});

test("7. Resumo WhatsApp integra a tabela regional vigente e protege contra preços desatualizados", () => {
  const mangaba = PRODUCTS.find((p) => p.id === "mangaba")!;
  const ceTable = OFFICIAL_REGIONAL_PRICE_TABLES["CE"];
  const ceItems = applyRegionalPrices(addCartItem([], mangaba, 3), ceTable.prices);

  // Mensagem com Tabela CE ativa
  const msgCe = formatWhatsAppOrderMessage({
    protocol: "#RP-1001",
    items: ceItems,
    totalItems: 3,
    estimatedTotal: 49.5,
    hasUnpricedItems: false,
    regionalTable: {
      state: "CE",
      stateName: "Ceará",
      includesRegionalFreight: true,
    },
    customer: {
      name: "Maria Oliveira",
      location: "Fortaleza/CE",
    },
  });

  assert.ok(msgCe.includes("Região de Entrega: CE (Frete regional incluso)"));
  assert.ok(msgCe.includes("3x Polpa de Mangaba"));
  assert.ok(msgCe.includes("49,50"));
  assert.ok(!msgCe.includes("Sob consulta"));

  // Mensagem anônima (sem login / preços sob consulta)
  const anonymousItems = applyRegionalPrices(addCartItem([], mangaba, 3), null);
  const msgAnon = formatWhatsAppOrderMessage({
    protocol: "#RP-1002",
    items: anonymousItems,
    totalItems: 3,
    hasUnpricedItems: true,
  });

  assert.ok(!msgAnon.includes("Região de Entrega: CE"));
  assert.ok(msgAnon.includes("Sob consulta"));
  assert.ok(msgAnon.includes("Valor estimado: Sob consulta"));
});

test("8. Persistência estrita em localStorage: apenas productId e quantity", () => {
  const mangaba = PRODUCTS.find((p) => p.id === "mangaba")!;
  const pricedItems = applyRegionalPrices(addCartItem([], mangaba, 3), { mangaba: 999.0 });

  const serialized = serializeCart(pricedItems);
  assert.ok(!serialized.includes("999"), "Preços NUNCA devem ser salvos no localStorage");
  assert.ok(!serialized.includes("unitPrice"));
  assert.ok(!serialized.includes("subtotal"));

  const parsed = JSON.parse(serialized);
  assert.deepEqual(parsed, {
    version: 1,
    items: [{ productId: "mangaba", quantity: 3 }],
  });

  const restored = deserializeCart(serialized, PRODUCTS);
  assert.equal(restored.length, 1);
  assert.equal(restored[0].productId, "mangaba");
  assert.equal(restored[0].quantity, 3);
});

test("9. PROIBIÇÃO estrita do cabeçalho X-Tenant-Id na consulta de tabela regional (IND-001, IND-005)", async () => {
  const prevApi = process.env.NEXT_PUBLIC_SYSOTTO_API_URL;
  process.env.NEXT_PUBLIC_SYSOTTO_API_URL = "https://api.sysotto.test";

  try {
    let capturedHeaders: Record<string, string> = {};
    const mockFetch = (async (_url: string | URL | Request, init?: RequestInit) => {
      capturedHeaders = (init?.headers as Record<string, string>) || {};
      return new Response(
        JSON.stringify({
          state: "CE",
          stateName: "Ceará",
          effectiveDate: "2026-10-01",
          includesRegionalFreight: true,
          prices: { mangaba: 16.5 },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    await fetchRegionalPriceTable("CE", { fetchFn: mockFetch });

    const headerKeys = Object.keys(capturedHeaders).map((k) => k.toLowerCase());
    assert.ok(
      !headerKeys.includes("x-tenant-id"),
      "Consulta de precificação regional JAMAIS deve enviar X-Tenant-Id"
    );
  } finally {
    process.env.NEXT_PUBLIC_SYSOTTO_API_URL = prevApi;
  }
});
