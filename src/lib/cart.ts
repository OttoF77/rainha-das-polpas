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

export const validQuantity = (quantity: number) =>
  Number.isInteger(quantity) && quantity >= 1 && quantity <= 999;

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const withQuantity = (item: CartItem, quantity: number): CartItem => ({
  ...item,
  quantity,
  subtotal: item.unitPrice === undefined ? undefined : (Math.round(item.unitPrice * 100) * quantity) / 100,
});

export function addCartItem(
  items: CartItem[],
  product: Product,
  quantity = 1,
  overrideUnitPrice?: number
): CartItem[] {
  if (!validQuantity(quantity)) return items;
  const existing = items.find((item) => item.productId === product.id);
  if (existing) {
    const updated = {
      ...existing,
      unitPrice: overrideUnitPrice !== undefined ? overrideUnitPrice : existing.unitPrice,
    };
    return items.map((item) =>
      item === existing ? withQuantity(updated, Math.min(999, item.quantity + quantity)) : item
    );
  }
  const price = overrideUnitPrice !== undefined ? overrideUnitPrice : product.precoUnitario;
  const unitPrice = price !== undefined && Number.isFinite(price) && price >= 0 ? price : undefined;
  const newItem: CartItem = {
    productId: product.id,
    slug: product.slug,
    name: product.nome,
    unit: product.unidadePadrao,
    image: product.imagemTemporaria,
    quantity,
    unitPrice,
  };
  return [...items, withQuantity(newItem, quantity)];
}

export function updateCartQuantity(items: CartItem[], productId: string, quantity: number): CartItem[] {
  if (quantity === 0) return items.filter((item) => item.productId !== productId);
  if (!validQuantity(quantity)) return items;
  return items.map((item) => (item.productId === productId ? withQuantity(item, quantity) : item));
}

/**
 * Aplica ou invalida os preços regionais aos itens do carrinho.
 * Se prices for nulo/indefinido (logout, desautenticação, UF não atendida), todos os valores são invalidados (undefined).
 * Se um produto específico não constar na tabela da UF, permanece sem preço (sob consulta).
 */
export function applyRegionalPrices(
  items: CartItem[],
  prices: Record<string, number> | null | undefined
): CartItem[] {
  if (!prices) {
    return items.map((item) => ({
      ...item,
      unitPrice: undefined,
      subtotal: undefined,
    }));
  }

  return items.map((item) => {
    const rawPrice = prices[item.productId];
    const unitPrice =
      rawPrice !== undefined && Number.isFinite(rawPrice) && rawPrice >= 0 ? rawPrice : undefined;
    return {
      ...item,
      unitPrice,
      subtotal: unitPrice === undefined ? undefined : (Math.round(unitPrice * 100) * item.quantity) / 100,
    };
  });
}

export function cartTotals(items: CartItem[]) {
  const hasUnpricedItems = items.length === 0 || items.some((item) => item.unitPrice === undefined);
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    hasUnpricedItems,
    estimatedTotal: hasUnpricedItems
      ? undefined
      : items.reduce((sum, item) => sum + Math.round((item.subtotal ?? 0) * 100), 0) / 100,
  };
}

export function serializeCart(items: CartItem[]): string {
  // Salva estritamente productId e quantity. Preços NUNCA são salvos no localStorage.
  return JSON.stringify({
    version: 1,
    items: items.map(({ productId, quantity }) => ({ productId, quantity })),
  });
}

export function deserializeCart(raw: string | null, products: Product[]): CartItem[] {
  try {
    const payload: unknown = JSON.parse(raw ?? "null");
    if (
      !payload ||
      typeof payload !== "object" ||
      !("version" in payload) ||
      payload.version !== 1 ||
      !("items" in payload) ||
      !Array.isArray(payload.items)
    ) {
      return [];
    }
    let items: CartItem[] = [];
    for (const entry of payload.items) {
      if (
        !entry ||
        typeof entry !== "object" ||
        typeof entry.productId !== "string" ||
        !validQuantity(entry.quantity)
      ) {
        continue;
      }
      const product = products.find((p) => p.id === entry.productId);
      // Persiste apenas identidade e quantidade. Preços virão da tabela regional na sessão do cliente.
      if (product && !items.some((item) => item.productId === product.id)) {
        items = addCartItem(items, product, entry.quantity);
      }
    }
    return items;
  } catch {
    return [];
  }
}
