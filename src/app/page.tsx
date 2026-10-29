"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ProductsGrid } from "@/components/ProductsGrid";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Product } from "@/data/products";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleClearCart = () => setCart([]);

  const formatCartForWhatsApp = () => {
    if (cart.length === 0) return "";
    let message = "Olá! Gostaria de fazer o seguinte pedido de polpas na Rainha das Polpas:\n\n";
    let totalEst = 0;
    cart.forEach((item, index) => {
      const price = item.product.precoUnitario || 0;
      const subtotal = price * item.quantity;
      totalEst += subtotal;
      message += `${index + 1}. *${item.product.nome}* (${item.product.unidadePadrao}) - Qtd: ${item.quantity}`;
      if (price > 0) {
        message += ` (R$ ${subtotal.toFixed(2)})`;
      }
      message += "\n";
    });

    if (totalEst > 0) {
      message += `\n*Total Estimado:* R$ ${totalEst.toFixed(2)}`;
    }
    message += "\n\nPoderia confirmar a disponibilidade para entrega?";
    return encodeURIComponent(message);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="flex-1">
        <Hero />
        <About />
        <ProductsGrid onAddToCart={handleAddToCart} />
      </main>

      <Footer />
      <FloatingWhatsApp />

      {/* Cart Drawer / Slide-over */}
      {cartOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-fruit-salad" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="font-bold text-lg text-sysotto-navy-dark">
                  Seu Pedido ({totalCartCount} {totalCartCount === 1 ? "item" : "itens"})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 touch-target"
                aria-label="Fechar carrinho"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <span className="text-4xl">🛒</span>
                  <p className="text-sm font-medium text-gray-600">Seu carrinho está vazio.</p>
                  <p className="text-xs text-gray-400">Adicione sabores para montar seu pedido personalizado!</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-2xs gap-3"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-sysotto-navy-dark">{item.product.nome}</h4>
                      <span className="text-xs text-gray-500">{item.product.unidadePadrao}</span>
                      {item.product.precoUnitario && (
                        <p className="text-xs font-semibold text-fruit-salad">
                          R$ {(item.product.precoUnitario * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.product.id, -1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 touch-target"
                        aria-label={`Diminuir quantidade de ${item.product.nome}`}
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.product.id, 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 touch-target"
                        aria-label={`Aumentar quantidade de ${item.product.nome}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-gray-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    Limpar carrinho
                  </button>
                  <span className="text-xs text-gray-500">Canal: (88) 99709-9082</span>
                </div>

                <a
                  href={`https://wa.me/5588997099082?text=${formatCartForWhatsApp()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-whatsapp hover:bg-whatsapp-hover shadow-md transition-colors touch-target"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.13 4.12 13.54 4.12 11.91C4.12 7.37 7.82 3.67 12.05 3.67Z" />
                  </svg>
                  <span>Enviar Pedido pelo WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
