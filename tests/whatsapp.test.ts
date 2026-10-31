import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  WHATSAPP_PHONE,
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY,
  WHATSAPP_DISPLAY_PHONE,
  MAX_WHATSAPP_MESSAGE_LENGTH,
  generateOrderProtocol,
  sanitizeWhatsAppMessage,
  formatWhatsAppOrderMessage,
  buildWhatsAppUrl,
} from "../src/lib/whatsapp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

test("1. Constante e canal oficial exclusivo (88) 99709-9082", () => {
  assert.equal(WHATSAPP_PHONE, "5588997099082");
  assert.equal(WHATSAPP_NUMBER, "5588997099082");
  assert.equal(WHATSAPP_DISPLAY, "(88) 99709-9082");
  assert.equal(WHATSAPP_DISPLAY_PHONE, "(88) 99709-9082");

  // Garante que o arquivo de módulo não possui outros números de telefone
  const fileContent = fs.readFileSync(path.join(rootDir, "src/lib/whatsapp.ts"), "utf-8");
  const phoneMatches = fileContent.match(/55\d{10,11}/g) || [];
  for (const match of phoneMatches) {
    assert.equal(match, "5588997099082", `Número inesperado encontrado no código: ${match}`);
  }
});

test("2. Gerador de protocolo curto de atendimento", () => {
  const protocol = generateOrderProtocol();
  assert.match(protocol, /^#RP-\d{4}$/, "Protocolo gerado deve seguir o padrão #RP-XXXX com 4 dígitos");

  const customProtocol = generateOrderProtocol("8492");
  assert.equal(customProtocol, "#RP-8492");

  const fullCustom = generateOrderProtocol("#RP-9999");
  assert.equal(fullCustom, "#RP-9999");
});

test("3. Formatação de pedido com preços fixos (D2C)", () => {
  const payload = {
    protocol: "#RP-1234",
    items: [
      { name: "Polpa de Mangaba", quantity: 3, unit: "100g", unitPrice: 16.5, subtotal: 49.5 },
      { name: "Polpa de Abacaxi", quantity: 2, unit: "100g", unitPrice: 14.0, subtotal: 28.0 },
    ],
    totalItems: 5,
    estimatedTotal: 77.5,
    hasUnpricedItems: false,
  };

  const message = formatWhatsAppOrderMessage(payload);

  assert.ok(message.includes("#RP-1234"), "Deve conter código de protocolo");
  assert.ok(message.includes("Rainha das Polpas"), "Deve identificar a marca");
  assert.ok(message.includes("3x Polpa de Mangaba (100g)"), "Deve listar quantidade e sabor");
  assert.ok(message.includes("2x Polpa de Abacaxi (100g)"), "Deve listar quantidade e sabor");
  assert.ok(message.includes("R$ 49,50") || message.includes("49,50"), "Deve incluir subtotal formatado");
  assert.ok(message.includes("Total: 5 pacotes/unidades"), "Deve incluir total de pacotes");
  assert.ok(message.includes("R$ 77,50") || message.includes("77,50"), "Deve incluir valor estimado total");
  assert.ok(!message.includes("Dados do Cliente:"), "Não deve conter bloco de cliente vazio");
});

test("4. Formatação de pedido com itens 'Sob consulta' (modo cotação)", () => {
  const payload = {
    protocol: "#RP-5678",
    items: [
      { name: "Polpa de Acerola", quantity: 4, unit: "100g", unitPrice: undefined, subtotal: undefined },
      { name: "Polpa de Caju", quantity: 2, unit: "100g", unitPrice: 15.0, subtotal: 30.0 },
    ],
    totalItems: 6,
    hasUnpricedItems: true,
  };

  const message = formatWhatsAppOrderMessage(payload);

  assert.ok(message.includes("#RP-5678"));
  assert.ok(message.includes("4x Polpa de Acerola (100g): Sob consulta"));
  assert.ok(message.includes("Total: 6 pacotes/unidades"));
  assert.ok(message.includes("Valor estimado: Sob consulta"));
});

test("5. Bloco completo de dados opcionais do cliente", () => {
  const payload = {
    protocol: "#RP-4321",
    items: [
      { name: "Polpa de Maracujá", quantity: 2, unit: "100g", unitPrice: 18.0, subtotal: 36.0 },
    ],
    customer: {
      name: "Maria Silva",
      deliveryMode: "Entrega",
      location: "Bairro Centro, Rua das Flores 123",
      paymentMethod: "Pix",
      notes: "Por favor, entregar após as 14h.",
    },
  };

  const message = formatWhatsAppOrderMessage(payload);

  assert.ok(message.includes("Dados do Cliente:"));
  assert.ok(message.includes("Nome: Maria Silva"));
  assert.ok(message.includes("Modalidade: Entrega"));
  assert.ok(message.includes("Bairro/Endereço: Bairro Centro, Rua das Flores 123"));
  assert.ok(message.includes("Forma de pagamento: Pix"));
  assert.ok(message.includes("Observações: Por favor, entregar após as 14h."));
});

test("6. Sanitização de caracteres de controle e quebras de linha", () => {
  const dirty = "Linha 1\r\nLinha 2\rLinha 3\x00\x08\x1F\x7F com texto limpo.";
  const cleaned = sanitizeWhatsAppMessage(dirty);

  assert.equal(cleaned, "Linha 1\nLinha 2\nLinha 3 com texto limpo.");
  assert.ok(!cleaned.includes("\r"), "Não deve conter retorno de carro");
  assert.ok(!cleaned.includes("\x00"), "Não deve conter caractere nulo");
});

test("7. Limite seguro de caracteres (máximo 1800 caracteres)", () => {
  const longNote = "A".repeat(2500);
  const payload = {
    protocol: "#RP-9999",
    items: [{ name: "Polpa de Morango", quantity: 1, unit: "100g" }],
    notes: longNote,
  };

  const message = formatWhatsAppOrderMessage(payload);
  assert.ok(message.length <= MAX_WHATSAPP_MESSAGE_LENGTH, `Comprimento ${message.length} deve ser <= 1800`);
  assert.equal(message.length, 1800);
});

test("8. buildWhatsAppUrl gera deep link correto com encodeURIComponent e canal único", () => {
  const message = "Olá! Teste de mensagem com acentuação: maçã & maracujá (88) 99709-9082.";
  const url = buildWhatsAppUrl(message);

  assert.ok(url.startsWith("https://wa.me/5588997099082?text="));
  assert.ok(!url.includes(" "), "URL não deve conter espaços crus");

  const queryParam = url.split("?text=")[1];
  const decoded = decodeURIComponent(queryParam);
  assert.equal(decoded, message);
});

test("9. Contratos visuais e de acessibilidade do FloatingWhatsAppButton", () => {
  const buttonFile = path.join(rootDir, "src/components/FloatingWhatsAppButton.tsx");
  const content = fs.readFileSync(buttonFile, "utf-8");

  assert.ok(content.includes("motion-reduce:"), "Deve conter suporte a prefers-reduced-motion");
  assert.ok(content.includes("WHATSAPP_PHONE"), "Deve importar canal canônico");
  assert.ok(content.includes("aria-label"), "Deve possuir atributo aria-label para acessibilidade");
  assert.ok(content.includes("target=\"_blank\""), "Deve abrir em nova aba");
  assert.ok(content.includes("rel=\"noopener noreferrer\""), "Deve usar rel seguro");
});

test("10. Contratos e elementos de pré-checkout do CartDrawer", () => {
  const drawerFile = path.join(rootDir, "src/components/CartDrawer.tsx");
  const content = fs.readFileSync(drawerFile, "utf-8");

  assert.ok(content.includes("Finalizar Pedido no WhatsApp"), "Deve conter botão primário de finalizar no WhatsApp");
  assert.ok(content.includes("Copiar Pedido"), "Deve conter botão secundário de copiar pedido");
  assert.ok(content.includes("navigator.clipboard"), "Deve utilizar clipboard API para fallback");
  assert.ok(content.includes("deliveryMode"), "Deve conter seletor de modalidade Entrega/Retirada");
  assert.ok(content.includes("paymentMethod"), "Deve conter seletor de pagamento Pix/Cartão/Dinheiro");
  assert.ok(content.includes("formatWhatsAppOrderMessage"), "Deve utilizar formatador canônico");
});
