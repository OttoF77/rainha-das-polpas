import { formatMoney } from "./cart";

export const WHATSAPP_PHONE = "5588997099082";
export const WHATSAPP_NUMBER = "5588997099082";
export const WHATSAPP_DISPLAY = "(88) 99709-9082";
export const WHATSAPP_DISPLAY_PHONE = "(88) 99709-9082";
export const MAX_WHATSAPP_MESSAGE_LENGTH = 1800;

export interface WhatsAppOrderItem {
  name: string;
  quantity: number;
  unit?: string;
  unitPrice?: number;
  subtotal?: number;
}

export interface WhatsAppCustomerInfo {
  name?: string;
  deliveryMode?: "Entrega" | "Retirada" | string;
  location?: string;
  neighborhood?: string;
  paymentMethod?: "Pix" | "Cartão" | "Dinheiro" | string;
  notes?: string;
  state?: string; // UF validada
}

export interface WhatsAppRegionalInfo {
  state: string; // UF (ex: "CE", "SP")
  stateName?: string; // Ex: "Ceará", "São Paulo"
  includesRegionalFreight?: boolean;
}

export interface WhatsAppOrderPayload {
  items: WhatsAppOrderItem[];
  totalItems?: number;
  estimatedTotal?: number;
  hasUnpricedItems?: boolean;
  protocol?: string;
  customer?: WhatsAppCustomerInfo;
  regionalTable?: WhatsAppRegionalInfo;
  // Shorthand fields
  name?: string;
  deliveryMode?: string;
  location?: string;
  neighborhood?: string;
  paymentMethod?: string;
  notes?: string;
  appliedState?: string;
}

/**
 * Generates a short client-side order reference protocol code (e.g. "#RP-8492").
 */
export function generateOrderProtocol(code?: string | number): string {
  if (code !== undefined && code !== null && String(code).trim().length > 0) {
    const raw = String(code).trim();
    return raw.startsWith("#") ? raw : `#RP-${raw}`;
  }
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `#RP-${randomSuffix}`;
}

export const generateProtocol = generateOrderProtocol;
export const generateOrderCode = generateOrderProtocol;

/**
 * Sanitizes a message for WhatsApp by normalizing newlines, stripping control characters,
 * and limiting length to a safe mobile threshold (max 1800 characters).
 */
export function sanitizeWhatsAppMessage(text: string): string {
  if (!text) return "";
  // 1. Normalize line breaks to \n
  let normalized = text.replace(/\r\n|\r/g, "\n");
  // 2. Remove control characters except \n (ASCII 0-9, 11-31, 127-159)
  normalized = normalized.replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, "");
  // 3. Truncate safely to max allowed length
  if (normalized.length > MAX_WHATSAPP_MESSAGE_LENGTH) {
    normalized = normalized.slice(0, MAX_WHATSAPP_MESSAGE_LENGTH);
  }
  return normalized;
}

/**
 * Formats a structured order message adhering to D2C food commerce best practices.
 * Inlcudes regional price table information when applicable.
 */
export function formatWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const protocol = payload.protocol || generateOrderProtocol();
  const totalItems = payload.totalItems ?? payload.items.reduce((sum, item) => sum + item.quantity, 0);
  const hasUnpriced = payload.hasUnpricedItems ?? payload.items.some(item => item.unitPrice === undefined || item.subtotal === undefined);
  const estimatedTotal = hasUnpriced ? undefined : (payload.estimatedTotal ?? payload.items.reduce((sum, item) => sum + (item.subtotal ?? 0), 0));

  const customerName = payload.customer?.name || payload.name;
  const deliveryMode = payload.customer?.deliveryMode || payload.deliveryMode;
  const location = payload.customer?.location || payload.customer?.neighborhood || payload.location || payload.neighborhood;
  const paymentMethod = payload.customer?.paymentMethod || payload.paymentMethod;
  const notes = payload.customer?.notes || payload.notes;

  const regional = payload.regionalTable || (payload.appliedState ? { state: payload.appliedState } : undefined);

  const lines: string[] = [
    `Olá! Gostaria de fazer um pedido na Rainha das Polpas (${protocol}):`,
  ];

  if (regional?.state) {
    const freightTag = regional.includesRegionalFreight ? " (Frete regional incluso)" : "";
    lines.push(`Região de Entrega: ${regional.state}${freightTag}`);
  }

  lines.push(
    "",
    "Itens do Pedido:",
    ...payload.items.map(item => `• ${item.quantity}x ${item.name} (${item.unit || "100g"}): ${item.subtotal === undefined ? "Sob consulta" : formatMoney(item.subtotal)}`),
    "",
    `Total: ${totalItems} pacotes/unidades`,
    `Valor estimado: ${hasUnpriced || estimatedTotal === undefined ? "Sob consulta" : formatMoney(estimatedTotal)}`,
  );

  const customerLines: string[] = [];
  if (customerName?.trim()) customerLines.push(`Nome: ${customerName.trim()}`);
  if (deliveryMode?.trim()) customerLines.push(`Modalidade: ${deliveryMode.trim()}`);
  if (location?.trim()) customerLines.push(`Bairro/Endereço: ${location.trim()}`);
  if (paymentMethod?.trim()) customerLines.push(`Forma de pagamento: ${paymentMethod.trim()}`);
  if (notes?.trim()) customerLines.push(`Observações: ${notes.trim()}`);

  if (customerLines.length > 0) {
    lines.push("", "Dados do Cliente:", ...customerLines);
  }

  return sanitizeWhatsAppMessage(lines.join("\n"));
}

/**
 * Builds a universal deep link for WhatsApp with strict URL encoding.
 */
export function buildWhatsAppUrl(message: string, phone = WHATSAPP_PHONE): string {
  const cleanPhone = phone.replace(/\D/g, "") || WHATSAPP_PHONE;
  const sanitized = sanitizeWhatsAppMessage(message);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(sanitized)}`;
}
