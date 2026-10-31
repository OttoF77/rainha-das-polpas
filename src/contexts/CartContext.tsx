"use client";

import { createContext, useEffect, useRef, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import {
  addCartItem,
  updateCartQuantity,
  applyRegionalPrices,
  cartTotals,
  deserializeCart,
  serializeCart,
  CART_STORAGE_KEY,
  type CartItem,
} from "@/lib/cart";
import {
  fetchRegionalPriceTable,
  resolveCustomerAddress,
  resolveCustomerUf,
  authenticateCustomerByEmail,
} from "@/services/regional-pricing-api";
import type {
  CustomerAddress,
  CustomerUser,
  PricingStatus,
  RegionalPriceTable,
} from "@/types/regional-pricing";

const CUSTOMER_STORAGE_KEY = "rainha_das_polpas_customer_session_v1";

export interface CartContextValue {
  // Itens e métricas do carrinho
  items: CartItem[];
  totalItems: number;
  hasUnpricedItems: boolean;
  estimatedTotal?: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Autenticação do cliente e Precificação Regional por UF
  user: CustomerUser | null;
  isAuthenticated: boolean;
  currentAddress: CustomerAddress | null;
  currentUf: string | null;
  pricingStatus: PricingStatus;
  priceTable: RegionalPriceTable | null;
  pricingMessage?: string;
  login: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  selectAddress: (index: number) => void;
  setManualUf: (uf: string) => Promise<void>;
  setForcedStatus: (status: PricingStatus | null) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const currentItems = useRef<CartItem[]>([]);
  const [announcement, setAnnouncement] = useState({ text: "", revision: 0 });

  // Estado de autenticação e precificação regional
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [currentAddress, setCurrentAddress] = useState<CustomerAddress | null>(null);
  const [currentUf, setCurrentUf] = useState<string | null>(null);
  const [pricingStatus, setPricingStatus] = useState<PricingStatus>("UNAUTHENTICATED");
  const [priceTable, setPriceTable] = useState<RegionalPriceTable | null>(null);
  const [pricingMessage, setPricingMessage] = useState<string | undefined>();
  const [forcedStatus, setForcedStatus] = useState<PricingStatus | null>(null);

  // Carrega carrinho e sessão do cliente após montagem
  useEffect(() => {
    let restoredItems: CartItem[] = [];
    try {
      restoredItems = deserializeCart(window.localStorage.getItem(CART_STORAGE_KEY), PRODUCTS);
    } catch {
      /* storage desativado */
    }

    let restoredUser: CustomerUser | null = null;
    try {
      const storedSession = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (storedSession) {
        restoredUser = JSON.parse(storedSession);
      }
    } catch {
      /* storage desativado */
    }

    currentItems.current = restoredItems;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(restoredItems);

    if (restoredUser) {
      setUser(restoredUser);
      const addr = resolveCustomerAddress(restoredUser);
      const uf = resolveCustomerUf(restoredUser);
      setCurrentAddress(addr);
      setCurrentUf(uf);
    }
  }, []);

  // Recalcula a tabela regional sempre que o usuário, endereço ou UF alterar
  useEffect(() => {
    let isCancelled = false;

    async function evaluatePricing() {
      if (forcedStatus) {
        setPricingStatus(forcedStatus);
        setPriceTable(null);
        const unpriced = applyRegionalPrices(currentItems.current, null);
        currentItems.current = unpriced;
        setItems(unpriced);
        return;
      }

      if (!user) {
        setPricingStatus("UNAUTHENTICATED");
        setPriceTable(null);
        setPricingMessage("Entre na sua conta para consultar os preços para o seu estado.");
        const unpriced = applyRegionalPrices(currentItems.current, null);
        currentItems.current = unpriced;
        setItems(unpriced);
        return;
      }

      const address = resolveCustomerAddress(user);
      const uf = resolveCustomerUf(user);
      setCurrentAddress(address);
      setCurrentUf(uf);

      if (!address || !uf) {
        setPricingStatus("NO_ADDRESS");
        setPriceTable(null);
        setPricingMessage("Nenhum endereço com UF válida informado. Complete seu cadastro para visualizar os preços.");
        const unpriced = applyRegionalPrices(currentItems.current, null);
        currentItems.current = unpriced;
        setItems(unpriced);
        return;
      }

      const result = await fetchRegionalPriceTable(uf);
      if (isCancelled) return;

      if (result.status === "ACTIVE" && result.table) {
        setPricingStatus("ACTIVE");
        setPriceTable(result.table);
        setPricingMessage(undefined);
        const priced = applyRegionalPrices(currentItems.current, result.table.prices);
        currentItems.current = priced;
        setItems(priced);
      } else {
        setPricingStatus(result.status);
        setPriceTable(null);
        setPricingMessage(result.message);
        const unpriced = applyRegionalPrices(currentItems.current, null);
        currentItems.current = unpriced;
        setItems(unpriced);
      }
    }

    evaluatePricing();

    return () => {
      isCancelled = true;
    };
  }, [user, forcedStatus]);

  function commitItems(next: CartItem[]) {
    currentItems.current = next;
    setItems(next);
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(next));
    } catch {
      /* Continua em memória */
    }
  }

  function addItem(product: Product, quantity = 1) {
    // Se tabela regional estiver ativa, usa o preço da tabela; caso contrário undefined
    const unitPrice = priceTable?.prices ? priceTable.prices[product.id] : undefined;
    const next = addCartItem(currentItems.current, product, quantity, unitPrice);
    const added = cartTotals(next).totalItems - cartTotals(currentItems.current).totalItems;
    commitItems(next);
    setAnnouncement((previous) => ({
      revision: previous.revision + 1,
      text:
        added > 0
          ? `${added} unidade(s) de ${product.nome} adicionada(s) ao carrinho.`
          : "Quantidade não alterada. O limite é de 999 unidades por produto.",
    }));
  }

  function removeItem(productId: string) {
    commitItems(currentItems.current.filter((item) => item.productId !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    commitItems(updateCartQuantity(currentItems.current, productId, quantity));
  }

  function clearCart() {
    commitItems([]);
  }

  async function login(email: string) {
    const res = await authenticateCustomerByEmail(email);
    if (res.success && res.session?.user) {
      setUser(res.session.user);
      try {
        window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(res.session.user));
      } catch {
        /* storage indisponível */
      }
      return { success: true };
    }
    return { success: false, message: res.message || "Falha na autenticação do cliente." };
  }

  function logout() {
    setUser(null);
    setCurrentAddress(null);
    setCurrentUf(null);
    setPriceTable(null);
    setPricingStatus("UNAUTHENTICATED");
    setPricingMessage("Você saiu da conta. Preços desativados.");
    // Invalidação imediata de preços no carrinho; preserva produtos e quantidades
    const unpriced = applyRegionalPrices(currentItems.current, null);
    commitItems(unpriced);
    try {
      window.localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    } catch {
      /* storage indisponível */
    }
  }

  function selectAddress(index: number) {
    if (!user || !user.addresses[index]) return;
    const updatedUser = { ...user, selectedAddressIndex: index };
    setUser(updatedUser);
    try {
      window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch {
      /* storage indisponível */
    }
  }

  async function setManualUf(uf: string) {
    const cleanUf = (uf || "").trim().toUpperCase();
    if (!user) {
      // Se não autenticado, cria sessão temporária com a UF selecionada
      const tempUser: CustomerUser = {
        id: `temp-${Date.now()}`,
        name: "Cliente Demonstrativo",
        email: "cliente.demo@exemplo.com",
        addresses: [
          {
            street: "Endereço Principal",
            number: "100",
            neighborhood: "Centro",
            city: cleanUf === "SP" ? "São Paulo" : cleanUf === "PI" ? "Teresina" : "Fortaleza",
            state: cleanUf,
          },
        ],
        selectedAddressIndex: 0,
      };
      setUser(tempUser);
      return;
    }

    const updatedAddresses = [...user.addresses];
    if (updatedAddresses.length > 0) {
      updatedAddresses[0] = { ...updatedAddresses[0], state: cleanUf };
    } else {
      updatedAddresses.push({
        street: "Endereço Principal",
        number: "100",
        neighborhood: "Centro",
        city: cleanUf === "SP" ? "São Paulo" : cleanUf === "PI" ? "Teresina" : "Fortaleza",
        state: cleanUf,
      });
    }

    const updatedUser = { ...user, addresses: updatedAddresses, selectedAddressIndex: 0 };
    setUser(updatedUser);
    try {
      window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch {
      /* storage indisponível */
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        ...cartTotals(items),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        user,
        isAuthenticated: !!user,
        currentAddress,
        currentUf,
        pricingStatus,
        priceTable,
        pricingMessage,
        login,
        logout,
        selectAddress,
        setManualUf,
        setForcedStatus,
      }}
    >
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        <span key={announcement.revision}>{announcement.text}</span>
      </div>
    </CartContext.Provider>
  );
}
