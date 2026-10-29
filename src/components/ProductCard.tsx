import Image from "next/image";
import { Product } from "@/data/products";
import { getAssetPath } from "@/lib/assets";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  const formattedPrice = product.precoUnitario
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.precoUnitario)
    : "Sob consulta";

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-amber-50/40">
        <Image
          src={getAssetPath(product.imagemTemporaria)}
          alt={product.nome}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="inline-block bg-white/95 backdrop-blur-xs text-fruit-salad font-bold text-xs px-2.5 py-1 rounded-full shadow-xs border border-emerald-100">
            100% Natural
          </span>
          {product.tags.includes("Tesouro Regional") && (
            <span className="inline-block bg-harvest-gold text-sysotto-navy-dark font-bold text-xs px-2.5 py-1 rounded-full shadow-xs">
              Regional
            </span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl font-bold text-sysotto-navy-dark group-hover:text-fruit-salad transition-colors">
              {product.nome}
            </h3>
          </div>
          <p className="text-xs italic text-sysotto-navy-light/60 mt-0.5">
            {product.nomeCientifico}
          </p>
          <p className="text-xs font-medium text-emerald-800 bg-emerald-50 inline-block px-2 py-0.5 rounded-md mt-2">
            {product.unidadePadrao}
          </p>

          <p className="text-sm text-sysotto-navy-light/75 line-clamp-2 mt-3 leading-relaxed">
            {product.descricaoCurta}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-sysotto-navy-light/60 font-medium">Preço sugerido:</span>
            <span className="text-lg font-black text-sysotto-navy-dark">
              {formattedPrice}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelect(product)}
              className="w-full inline-flex items-center justify-center px-3 py-2.5 rounded-xl text-xs font-semibold text-sysotto-navy-dark bg-gray-100 hover:bg-gray-200 transition-colors touch-target focus:outline-hidden focus:ring-2 focus:ring-fruit-salad"
              aria-label={`Ver benefícios nutricionais de ${product.nome}`}
            >
              Benefícios
            </button>

            {onAddToCart ? (
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-fruit-salad hover:bg-fern-green shadow-xs transition-colors touch-target focus:outline-hidden focus:ring-2 focus:ring-fruit-salad"
                aria-label={`Adicionar ${product.nome} ao carrinho`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Adicionar</span>
              </button>
            ) : (
              <a
                href={`https://wa.me/5588997099082?text=${encodeURIComponent(`Olá! Gostaria de pedir ${product.nome} (${product.unidadePadrao}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-whatsapp hover:bg-whatsapp-hover shadow-xs transition-colors touch-target"
              >
                Pedir
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
