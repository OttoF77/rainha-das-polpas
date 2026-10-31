"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/cart";
import { formatWhatsAppOrderMessage, buildWhatsAppUrl, generateOrderProtocol } from "@/lib/whatsapp";
import { Modal } from "./Modal";
import { CartItem } from "./CartItem";

export function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, totalItems, estimatedTotal, hasUnpricedItems, clearCart } = useCart();
  const [name, setName] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"Entrega" | "Retirada" | "">("");
  const [location, setLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Pix" | "Cartão" | "Dinheiro" | "">("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [protocol] = useState(() => generateOrderProtocol());

  const message = formatWhatsAppOrderMessage({
    items,
    totalItems,
    estimatedTotal,
    hasUnpricedItems,
    protocol,
    name,
    deliveryMode,
    location,
    paymentMethod,
    notes,
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
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Modal labelId="cart-title" onClose={onClose} drawer>
      <header className="flex items-center justify-between gap-3 border-b p-5">
        <h2 id="cart-title" className="text-xl font-bold">
          Seu Pedido ({totalItems})
        </h2>
        <button
          type="button"
          className="touch-target rounded-lg p-2 text-gray-500 hover:text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-fern-green"
          aria-label="Fechar carrinho"
          onClick={onClose}
        >
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {items.length === 0 ? (
          <p className="py-12 text-center text-gray-600">
            Seu carrinho está vazio. Adicione sabores para montar seu pedido!
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map(item => (
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
                  onChange={event => setName(event.target.value)}
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
                      onChange={event => setDeliveryMode(event.target.value as "Entrega")}
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
                      onChange={event => setDeliveryMode(event.target.value as "Retirada")}
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
                  onChange={event => setLocation(event.target.value)}
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
                      onChange={event => setPaymentMethod(event.target.value as "Pix")}
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
                      onChange={event => setPaymentMethod(event.target.value as "Cartão")}
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
                      onChange={event => setPaymentMethod(event.target.value as "Dinheiro")}
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
                  onChange={event => setNotes(event.target.value)}
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
              Total estimado: {hasUnpricedItems ? "Sob consulta" : formatMoney(estimatedTotal ?? 0)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <a
              className="touch-target w-full rounded-xl bg-fern-green hover:bg-forest-green text-white font-bold p-3 text-center flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-hidden focus:ring-2 focus:ring-fern-green focus:ring-offset-2"
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
