"use client";

import { useState } from "react";
import { PRODUCTS, Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";

interface ProductsGridProps {
  onAddToCart?: (product: Product) => void;
}

export function ProductsGrid({ onAddToCart }: ProductsGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("todos");

  const filterOptions = [
    { id: "todos", label: "Todos os 13 Sabores" },
    { id: "vitamina-c", label: "Ricas em Vitamina C" },
    { id: "regional", label: "Típicas do Nordeste" },
    { id: "digestivo", label: "Digestivas & Funcionais" },
  ];

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeFilter === "vitamina-c") {
      return (
        product.tags.includes("Rico em Vitamina C") ||
        product.tags.includes("Super Vitamina C") ||
        product.tags.includes("Rica em Vitamina C")
      );
    }
    if (activeFilter === "regional") {
      return (
        product.tags.includes("Regional") ||
        product.tags.includes("Nordeste") ||
        product.tags.includes("Tradição Nordestina") ||
        product.tags.includes("Tesouro Regional")
      );
    }
    if (activeFilter === "digestivo") {
      return (
        product.tags.includes("Digestivo") ||
        product.tags.includes("Calmante Natural") ||
        product.tags.includes("Funcional") ||
        product.tags.includes("Rica em Fibras")
      );
    }
    return true;
  });

  return (
    <section id="produtos" className="py-20 lg:py-28 bg-amber-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            Catálogo Oficial de Frutas
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sysotto-navy-dark tracking-tight">
            Nossos Produtos
          </h2>
          <p className="text-base sm:text-lg text-sysotto-navy-light/80 leading-relaxed font-normal">
            Conheça nossa linha completa de polpas 100% naturais ultracongeladas.
            Pacotes de 1kg contendo 10 porções individuais de 100g, prontas para bater.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4" role="tablist">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all touch-target focus:outline-hidden focus:ring-2 focus:ring-fruit-salad ${
                  activeFilter === filter.id
                    ? "bg-fruit-salad text-white shadow-xs"
                    : "bg-white text-sysotto-navy-dark border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Modal */}
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      </div>
    </section>
  );
}
