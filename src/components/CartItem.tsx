"use client";

import Image from "next/image";
import { getAssetPath } from "@/lib/assets";
import { formatMoney, type CartItem as CartItemModel } from "@/lib/cart";
import { useCart } from "@/hooks/useCart";

export function CartItem({ item }: { item: CartItemModel }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <li className="rounded-xl border border-gray-200 p-3 space-y-3 bg-white shadow-2xs">
      <div className="flex gap-3 items-center">
        <Image
          src={getAssetPath(item.image)}
          alt={item.name}
          width={64}
          height={64}
          className="rounded-lg object-cover h-16 w-16 bg-amber-50"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sysotto-navy-dark truncate">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.unit}</p>
          <div className="mt-1">
            {item.subtotal !== undefined && item.unitPrice !== undefined ? (
              <p className="text-sm font-bold text-sysotto-navy-dark">
                {formatMoney(item.subtotal)}{" "}
                <span className="text-xs font-normal text-gray-500">
                  ({formatMoney(item.unitPrice)}/un)
                </span>
              </p>
            ) : (
              <span className="inline-block text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                Sob consulta
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        <button
          type="button"
          className="touch-target rounded-lg border border-gray-300 w-8 h-8 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-fruit-salad"
          aria-label={`Diminuir quantidade de ${item.name}`}
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
        >
          −
        </button>
        <output
          aria-label={`Quantidade de ${item.name}`}
          className="min-w-8 text-center font-semibold text-sysotto-navy-dark"
        >
          {item.quantity}
        </output>
        <button
          type="button"
          className="touch-target rounded-lg border border-gray-300 w-8 h-8 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 focus:outline-hidden focus:ring-2 focus:ring-fruit-salad"
          disabled={item.quantity >= 999}
          aria-label={`Aumentar quantidade de ${item.name}`}
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
        >
          +
        </button>
        <button
          type="button"
          className="touch-target ml-auto text-xs font-semibold text-red-600 hover:text-red-800 hover:underline"
          aria-label={`Remover ${item.name}`}
          onClick={() => removeItem(item.productId)}
        >
          Remover
        </button>
      </div>
    </li>
  );
}
