import type { Product } from "../data/products";

export const CART_STORAGE_KEY = "rainha_das_polpas_cart_v1";
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
  image: string;
}
export const validQuantity = (quantity: number) => Number.isInteger(quantity) && quantity >= 1 && quantity <= 999;
export const formatMoney = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const withQuantity = (item: CartItem, quantity: number): CartItem => ({
  ...item, quantity, subtotal: item.unitPrice === undefined ? undefined : Math.round(item.unitPrice * 100) * quantity / 100,
});
export function addCartItem(items: CartItem[], product: Product, quantity = 1): CartItem[] {
  if (!validQuantity(quantity)) return items;
  const existing = items.find(item => item.productId === product.id);
  if (existing) return items.map(item => item === existing ? withQuantity(item, Math.min(999, item.quantity + quantity)) : item);
  const price = product.precoUnitario;
  const unitPrice = price !== undefined && Number.isFinite(price) && price >= 0 ? price : undefined;
  return [...items, withQuantity({ productId: product.id, slug: product.slug, name: product.nome, unit: product.unidadePadrao, image: product.imagemTemporaria, quantity, unitPrice }, quantity)];
}
export function updateCartQuantity(items: CartItem[], productId: string, quantity: number): CartItem[] {
  if (quantity === 0) return items.filter(item => item.productId !== productId);
  if (!validQuantity(quantity)) return items;
  return items.map(item => item.productId === productId ? withQuantity(item, quantity) : item);
}
export function cartTotals(items: CartItem[]) {
  const hasUnpricedItems = items.some(item => item.unitPrice === undefined);
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    hasUnpricedItems,
    estimatedTotal: hasUnpricedItems ? undefined : items.reduce((sum, item) => sum + Math.round((item.subtotal ?? 0) * 100), 0) / 100,
  };
}
export function serializeCart(items: CartItem[]): string {
  return JSON.stringify({ version: 1, items: items.map(({ productId, quantity }) => ({ productId, quantity })) });
}
export function deserializeCart(raw: string | null, products: Product[]): CartItem[] {
  try {
    const payload: unknown = JSON.parse(raw ?? "null");
    if (!payload || typeof payload !== "object" || !("version" in payload) || payload.version !== 1 || !("items" in payload) || !Array.isArray(payload.items)) return [];
    let items: CartItem[] = [];
    for (const entry of payload.items) {
      if (!entry || typeof entry !== "object" || typeof entry.productId !== "string" || !validQuantity(entry.quantity)) continue;
      const product = products.find(product => product.id === entry.productId);
      // Persist identity/quantity only: prices and descriptions always come from the current catalog.
      if (product && !items.some(item => item.productId === product.id)) items = addCartItem(items, product, entry.quantity);
    }
    return items;
  } catch { return []; }
}
