"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/cart";
import { formatWhatsAppOrderMessage, buildWhatsAppUrl, generateOrderProtocol } from "@/lib/whatsapp";
import { Modal } from "./Modal";
import { CartItem } from "./CartItem";

export function CartDrawer({ onClose }: { onClose: () => void }) {
  const {
    items,
    totalItems,
    estimatedTotal,
    hasUnpricedItems,
    clearCart,
    user,
    isAuthenticated,
    currentAddress,
    currentUf,
    pricingStatus,
    priceTable,
    pricingMessage,
    login,
    logout,
    setManualUf,
  } = useCart();

  const [name, setName] = useState(user?.name || "");
  const [deliveryMode, setDeliveryMode] = useState<"Entrega" | "Retirada" | "">("");
  const [location, setLocation] = useState(
    currentAddress ? `${currentAddress.neighborhood ? currentAddress.neighborhood + ", " : ""}${currentAddress.city} - ${currentUf}` : ""
  );
  const [paymentMethod, setPaymentMethod] = useState<"Pix" | "Cartão" | "Dinheiro" | "">("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [protocol] = useState(() => generateOrderProtocol());

  // Estado para formulário de login no Drawer
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleLoginSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await login(loginEmail);
      if (!res.success) {
        setLoginError(res.message || "Erro ao identificar cliente.");
      } else {
        setLoginEmail("");
      }
    } finally {
      setIsLoggingIn(false);
    }
  }

  const isPricingActive = pricingStatus === "ACTIVE" && !!priceTable && !hasUnpricedItems;

  const message = formatWhatsAppOrderMessage({
    items,
    totalItems,
    estimatedTotal,
    hasUnpricedItems: !isPricingActive,
    protocol,
    name: name || user?.name,
    deliveryMode,
    location,
    paymentMethod,
    notes,
    regionalTable: isPricingActive && priceTable ? {
      state: priceTable.state,
      stateName: priceTable.stateName,
      includesRegionalFreight: priceTable.includesRegionalFreight,
    } : undefined,
  });

  const whatsappUrl = buildWhatsAppUrl(message);

  const handleCopyOrder = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Modal labelId="cart-title" onClose={onClose} drawer>
      <header className="flex items-center justify-between gap-3 border-b p-5 bg-white">
        <div>
          <h2 id="cart-title" className="text-xl font-bold text-sysotto-navy-dark">
            Seu Pedido ({totalItems})
          </h2>
          <p className="text-xs text-gray-500">
            {isAuthenticated
              ? `Cliente: ${user?.name} (${currentUf || "Sem UF"})`
              : "Preços calculados pela região de entrega"}
          </p>
        </div>
        <button
          type="button"
          className="touch-target rounded-lg p-2 text-gray-500 hover:text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-fern-green"
          aria-label="Fechar carrinho"
          onClick={onClose}
        >
          ✕
        </button>
      </header>

      {/* Painel de Identificação e Tabela Regional */}
      <section className="bg-gray-50/90 border-b border-gray-200 p-4">
        {!isAuthenticated ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-amber-600 font-bold text-sm">ℹ</span>
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  Preços por estado liberados após identificação
                </p>
                <p className="text-xs text-gray-600">
                  Entre na sua conta para aplicar a tabela com o frete regional correspondente.
                </p>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Seu e-mail cadastrado"
                className="order-input text-xs flex-1 py-1.5 px-3"
                aria-label="E-mail do cliente cadastrado"
              />
              <button
                type="submit"
                disabled={isLoggingIn}
                className="px-3 py-1.5 bg-sysotto-navy-dark hover:bg-sysotto-navy-light text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoggingIn ? "..." : "Entrar"}
              </button>
            </form>
            {loginError && <p className="text-xs text-red-600">{loginError}</p>}

            {/* Atalhos para testes e demonstração */}
            <div className="pt-2 border-t border-gray-200">
              <span className="block text-2xs uppercase tracking-wider text-gray-500 font-bold mb-1.5">
                Simular cliente cadastrado:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => login("maria.ce@exemplo.com")}
                  className="px-2 py-1 text-2xs font-semibold bg-white border border-gray-300 rounded-md hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                >
                  Ceará (CE)
                </button>
                <button
                  type="button"
                  onClick={() => login("carlos.sp@exemplo.com")}
                  className="px-2 py-1 text-2xs font-semibold bg-white border border-gray-300 rounded-md hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                >
                  São Paulo (SP)
                </button>
                <button
                  type="button"
                  onClick={() => login("rafael.pi@exemplo.com")}
                  className="px-2 py-1 text-2xs font-semibold bg-white border border-gray-300 rounded-md hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                >
                  Piauí (PI)
                </button>
                <button
                  type="button"
                  onClick={() => login("lucas.pendente@exemplo.com")}
                  className="px-2 py-1 text-2xs font-semibold bg-white border border-gray-300 rounded-md hover:bg-amber-50 hover:border-amber-300 transition-colors"
                >
                  Sem Endereço
                </button>
                <button
                  type="button"
                  onClick={() => login("joana.am@exemplo.com")}
                  className="px-2 py-1 text-2xs font-semibold bg-white border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  Amazonas (AM)
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-sysotto-navy-dark">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500 ml-1.5">({user?.email})</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-semibold text-red-700 hover:underline"
              >
                Sair da conta
              </button>
            </div>

            {/* Indicação Clara da Tabela Regional e Status */}
            {pricingStatus === "ACTIVE" && priceTable && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-emerald-900">
                    Tabela Regional: {priceTable.stateName} ({priceTable.state})
                  </span>
                  <span className="block text-2xs text-emerald-700">
                    {priceTable.notes || "Frete regional/interestadual incluso"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setManualUf(currentUf === "CE" ? "SP" : "CE")}
                    className="text-2xs font-bold px-2 py-1 bg-white border border-emerald-300 rounded text-emerald-900 hover:bg-emerald-100"
                    aria-label={`Alternar p/ ${currentUf === "CE" ? "SP" : "CE"}`}
                  >
                    Alternar p/ {currentUf === "CE" ? "SP" : "CE"}
                  </button>
                </div>
              </div>
            )}

            {pricingStatus === "NO_ADDRESS" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900">
                <span className="font-bold block">Atenção: Endereço sem UF cadastrada</span>
                <span>Complete seu endereço com o estado de entrega para liberar os preços vigentes.</span>
              </div>
            )}

            {pricingStatus === "UNSUPPORTED_REGION" && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-xs text-rose-900">
                <span className="font-bold block">Região não atendida ({currentUf})</span>
                <span>{pricingMessage || "No momento não atendemos entregas para este estado. Consulte nosso atendimento."}</span>
              </div>
            )}

            {pricingStatus === "PRICING_UNAVAILABLE" && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-xs text-rose-900">
                <span className="font-bold block">Tabela indisponível</span>
                <span>{pricingMessage || "Erro ao consultar tabela de preços. Os valores serão informados pelo atendimento."}</span>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {items.length === 0 ? (
          <p className="py-12 text-center text-gray-600">
            Seu carrinho está vazio. Adicione sabores para montar seu pedido!
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </ul>

            <fieldset className="space-y-4 pt-2 border-t border-gray-200">
              <legend className="font-bold text-gray-800">Dados do pedido</legend>

              <label className="block text-sm font-medium text-gray-700">
                Nome
                <input
                  className="order-input mt-1"
                  autoComplete="name"
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome completo"
                />
              </label>

              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Modalidade (Entrega ou Retirada)
                </span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMode"
                      value="Entrega"
                      checked={deliveryMode === "Entrega"}
                      onChange={(event) => setDeliveryMode(event.target.value as "Entrega")}
                      className="text-fern-green focus:ring-fern-green"
                    />
                    Entrega
                  </label>
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMode"
                      value="Retirada"
                      checked={deliveryMode === "Retirada"}
                      onChange={(event) => setDeliveryMode(event.target.value as "Retirada")}
                      className="text-fern-green focus:ring-fern-green"
                    />
                    Retirada
                  </label>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Bairro/Cidade
                <input
                  className="order-input mt-1"
                  maxLength={120}
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Bairro ou endereço para entrega"
                />
              </label>

              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Forma de Pagamento
                </span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Pix"
                      checked={paymentMethod === "Pix"}
                      onChange={(event) => setPaymentMethod(event.target.value as "Pix")}
                      className="text-fern-green focus:ring-fern-green"
                    />
                    Pix
                  </label>
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cartão"
                      checked={paymentMethod === "Cartão"}
                      onChange={(event) => setPaymentMethod(event.target.value as "Cartão")}
                      className="text-fern-green focus:ring-fern-green"
                    />
                    Cartão
                  </label>
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Dinheiro"
                      checked={paymentMethod === "Dinheiro"}
                      onChange={(event) => setPaymentMethod(event.target.value as "Dinheiro")}
                      className="text-fern-green focus:ring-fern-green"
                    />
                    Dinheiro
                  </label>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Observações
                <textarea
                  className="order-input mt-1"
                  rows={3}
                  maxLength={300}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Instruções de entrega ou ponto de referência"
                />
              </label>
            </fieldset>
          </>
        )}
      </div>

      {items.length > 0 && (
        <footer className="p-5 border-t bg-gray-50 space-y-3">
          <div aria-live="polite">
            <p className="text-sm text-gray-600">{totalItems} pacotes/unidades</p>
            <p className="font-bold text-lg text-sysotto-navy-dark">
              Total estimado:{" "}
              {isPricingActive && estimatedTotal !== undefined
                ? formatMoney(estimatedTotal)
                : "Sob consulta"}
            </p>
            {isPricingActive && priceTable ? (
              <p className="text-xs text-emerald-800 font-semibold">
                ✓ Tabela aplicada: {priceTable.stateName} ({priceTable.state})
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                {!isAuthenticated
                  ? "Identifique sua região de entrega para visualizar preços e totais."
                  : pricingMessage || "Preços sob consulta para o estado selecionado."}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <a
              className="touch-target w-full rounded-xl bg-fern-green hover:bg-forest-green text-white font-bold p-3 text-center flex items-center justify-center gap-2 transition-colors shadow-xs focus:outline-hidden focus:ring-2 focus:ring-fern-green focus:ring-offset-2"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Finalizar Pedido no WhatsApp"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.13 4.12 13.54 4.12 11.91C4.12 7.37 7.82 3.67 12.05 3.67Z" />
              </svg>
              <span>Finalizar Pedido no WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleCopyOrder}
              className="touch-target w-full rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-sysotto-navy-dark font-medium p-2.5 text-sm transition-colors text-center"
              aria-label="Copiar resumo do pedido"
            >
              {copied ? "✓ Pedido copiado com sucesso!" : "Copiar Pedido"}
            </button>
          </div>

          <div className="flex justify-between items-center pt-1">
            <button
              type="button"
              onClick={clearCart}
              className="touch-target text-red-700 text-sm hover:underline"
            >
              Limpar carrinho
            </button>
          </div>
        </footer>
      )}
    </Modal>
  );
}
