"use client";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/cart";
import { Modal } from "./Modal";
import { CartItem } from "./CartItem";
export function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, totalItems, estimatedTotal, hasUnpricedItems, clearCart } = useCart();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const message = ["Olá! Gostaria de fazer um pedido na Rainha das Polpas:", ...items.map(item => `${item.quantity} x ${item.name} (${item.unit}): ${item.subtotal === undefined ? "Sob consulta" : formatMoney(item.subtotal)}`), `Total: ${totalItems} pacotes/unidades`, `Valor estimado: ${hasUnpricedItems ? "Sob consulta" : formatMoney(estimatedTotal ?? 0)}`, name && `Nome: ${name}`, location && `Bairro/Cidade: ${location}`, notes && `Observações: ${notes}`].filter(Boolean).join("\n");
  return <Modal labelId="cart-title" onClose={onClose} drawer>
    <header className="flex items-center justify-between gap-3 border-b p-5"><h2 id="cart-title" className="text-xl font-bold">Seu Pedido ({totalItems})</h2><button type="button" className="touch-target rounded-lg" aria-label="Fechar carrinho" onClick={onClose}>✕</button></header>
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {items.length === 0 ? <p className="py-12 text-center">Seu carrinho está vazio. Adicione sabores para montar seu pedido!</p> : <>
        <ul className="space-y-3">{items.map(item => <CartItem key={item.productId} item={item} />)}</ul>
        <fieldset className="space-y-3"><legend className="font-bold mb-3">Dados opcionais do pedido</legend>
          <label className="block text-sm">Nome<input className="order-input" autoComplete="name" maxLength={80} value={name} onChange={event => setName(event.target.value)} /></label>
          <label className="block text-sm">Bairro/Cidade<input className="order-input" maxLength={120} value={location} onChange={event => setLocation(event.target.value)} /></label>
          <label className="block text-sm">Observações<textarea className="order-input" rows={3} maxLength={300} value={notes} onChange={event => setNotes(event.target.value)} /></label>
        </fieldset>
      </>}
    </div>
    {items.length > 0 && <footer className="p-5 border-t bg-gray-50 space-y-3">
      <div aria-live="polite"><p>{totalItems} pacotes/unidades</p><p className="font-bold text-lg">Total estimado: {hasUnpricedItems ? "Sob consulta" : formatMoney(estimatedTotal ?? 0)}</p></div>
      <button type="button" onClick={clearCart} className="touch-target text-red-700 text-sm">Limpar carrinho</button>
      <a className="touch-target w-full rounded-xl bg-fern-green text-white font-bold p-3" href={`https://wa.me/5588997099082?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Enviar Pedido pelo WhatsApp</a>
    </footer>}
  </Modal>;
}
