"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { validQuantity } from "@/lib/cart";
import Image from "next/image";
import { Product } from "@/data/products";
import { getAssetPath } from "@/lib/assets";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState("1");
  const canAdd = validQuantity(Number(quantity));

  const formattedPrice = product.precoUnitario !== undefined
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.precoUnitario)
    : "Sob consulta";

  return (
    <Modal labelId="modal-product-title" onClose={onClose}>
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 text-sysotto-navy-dark hover:bg-gray-100 transition-colors shadow-xs touch-target focus:outline-hidden focus:ring-2 focus:ring-fruit-salad"
          aria-label="Fechar detalhes da polpa"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Image Header */}
        <div className="relative aspect-16/9 w-full bg-amber-50">
          <Image
            src={getAssetPath(product.imagemTemporaria)}
            alt={product.nome}
            fill
            sizes="500px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-harvest-gold">
              Ficha Nutricional
            </span>
            <h3 id="modal-product-title" className="text-2xl font-black text-white leading-tight">
              {product.nome}
            </h3>
            <p className="text-xs italic text-white/80">{product.nomeCientifico}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <h4 className="text-xs font-bold text-sysotto-navy-light uppercase tracking-wider mb-1">
              Sobre a Fruta & Sabor
            </h4>
            <p className="text-sm text-sysotto-navy-dark leading-relaxed">
              {product.descricaoCurta}
            </p>
          </div>

          {/* Health Benefits List */}
          <div>
            <h4 className="text-xs font-bold text-sysotto-navy-light uppercase tracking-wider mb-2">
              Principais Benefícios à Saúde
            </h4>
            <ul className="space-y-2">
              {product.beneficios.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-sysotto-navy-dark/90">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-fruit-salad text-xs font-black shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <table className="w-full text-sm text-left">
            <caption className="text-left font-bold mb-2">Informações nutricionais</caption>
            <tbody>{["Valor energético", "Carboidratos", "Proteínas", "Gorduras totais", "Fibras alimentares", "Sódio"].map(label => <tr key={label} className="border-b"><th scope="row" className="py-2 font-medium">{label}</th><td>Consultar rótulo</td></tr>)}</tbody>
          </table>
          <p className="text-xs">Os valores por porção ainda não foram informados pelo fabricante. Consulte o rótulo da embalagem.</p>
          <div><h4 className="font-bold">Conservação</h4><p className="text-sm">Mantenha congelado e siga a temperatura, a validade e as instruções indicadas no rótulo da embalagem. Não recongele após descongelar.</p></div>
          <label className="block text-sm font-bold">Quantidade
            <input type="number" min={1} max={999} step={1} value={quantity} onChange={event => setQuantity(event.target.value)} className="order-input" aria-invalid={!canAdd} aria-describedby="quantity-help" />
          </label>
          <p id="quantity-help" className="text-xs">Escolha de 1 a 999 pacotes inteiros.</p>
          {/* Presentation & Packaging */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
            <div>
              <span className="block text-xs font-medium text-sysotto-navy-light/70">Embalagem padrão:</span>
              <span className="text-sm font-bold text-sysotto-navy-dark">{product.unidadePadrao}</span>
            </div>
            <div className="text-right">
              <span className="block text-xs font-medium text-sysotto-navy-light/70">Preço:</span>
              <span className="text-lg font-black text-fruit-salad">{formattedPrice}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/60 flex items-center gap-3">
          {onAddToCart && (
            <button
              type="button"
              disabled={!canAdd}
              onClick={() => {
                onAddToCart(product, Number(quantity));
                onClose();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-fruit-salad hover:bg-fern-green transition-colors touch-target shadow-xs"
            >
              Adicionar ao Carrinho
            </button>
          )}

          <a
            href={`https://wa.me/5588997099082?text=${encodeURIComponent(`Olá! Gostaria de tirar dúvidas ou pedir ${product.nome}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-whatsapp hover:bg-whatsapp-hover transition-colors touch-target shadow-xs"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </Modal>
  );
}
