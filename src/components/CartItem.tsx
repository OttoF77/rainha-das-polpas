"use client";
import Image from "next/image";
import { getAssetPath } from "@/lib/assets";
import { formatMoney, type CartItem as CartItemModel } from "@/lib/cart";
import { useCart } from "@/hooks/useCart";
export function CartItem({ item }: { item: CartItemModel }) {
  const { updateQuantity, removeItem } = useCart();
  return <li className="rounded-xl border border-gray-200 p-3 space-y-3">
    <div className="flex gap-3 items-center">
      <Image src={getAssetPath(item.image)} alt={item.name} width={64} height={64} className="rounded-lg object-cover h-16 w-16" />
      <div><h3 className="font-bold">{item.name}</h3><p className="text-sm">{item.unit}</p><p className="text-sm font-semibold">{item.subtotal === undefined ? "Sob consulta" : formatMoney(item.subtotal)}</p></div>
    </div>
    <div className="flex items-center gap-2">
      <button type="button" className="touch-target rounded-lg border" aria-label={`Diminuir quantidade de ${item.name}`} onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
      <output aria-label={`Quantidade de ${item.name}`} className="min-w-8 text-center">{item.quantity}</output>
      <button type="button" className="touch-target rounded-lg border disabled:opacity-40" disabled={item.quantity >= 999} aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
      <button type="button" className="touch-target ml-auto text-sm text-red-700" aria-label={`Remover ${item.name}`} onClick={() => removeItem(item.productId)}>Remover</button>
    </div>
  </li>;
}
