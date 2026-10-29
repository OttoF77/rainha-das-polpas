"use client";

import { createContext, useEffect, useRef, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import { addCartItem, updateCartQuantity, cartTotals, deserializeCart, serializeCart, CART_STORAGE_KEY, type CartItem } from "@/lib/cart";

interface CartContextValue extends ReturnType<typeof cartTotals> {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
export const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const current = useRef<CartItem[]>([]);
  const [announcement, setAnnouncement] = useState({ text: "", revision: 0 });
  useEffect(() => {
    let restored: CartItem[] = [];
    try { restored = deserializeCart(window.localStorage.getItem(CART_STORAGE_KEY), PRODUCTS); } catch { /* Storage may be disabled. */ }
    current.current = restored;
    // Hydrate only after mount so the server and initial client render match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(restored);
  }, []);
  function commit(next: CartItem[]) {
    current.current = next;
    setItems(next);
    try { window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(next)); } catch { /* Keep the in-memory cart usable. */ }
  }
  function addItem(product: Product, quantity = 1) {
    const next = addCartItem(current.current, product, quantity);
    const added = cartTotals(next).totalItems - cartTotals(current.current).totalItems;
    commit(next);
    setAnnouncement(previous => ({ revision: previous.revision + 1, text: added > 0 ? `${added} unidade(s) de ${product.nome} adicionada(s) ao carrinho.` : "Quantidade não alterada. O limite é de 999 unidades por produto." }));
  }
  return <CartContext.Provider value={{ items, ...cartTotals(items), addItem, removeItem: id => commit(current.current.filter(item => item.productId !== id)), updateQuantity: (id, quantity) => commit(updateCartQuantity(current.current, id, quantity)), clearCart: () => commit([]) }}>
    {children}
    <div className="sr-only" aria-live="polite" aria-atomic="true"><span key={announcement.revision}>{announcement.text}</span></div>
  </CartContext.Provider>;
}
