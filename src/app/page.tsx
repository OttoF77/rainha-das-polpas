"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ProductGrid } from "@/components/ProductGrid";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/contexts/CartContext";
import { useCart } from "@/hooks/useCart";

function Storefront() {
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems, addItem } = useCart();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  return (
    <div data-hydrated={hydrated} className="flex-1 flex flex-col">
      <Navbar cartCount={totalItems} onOpenCart={() => setCartOpen(true)} />
      <main className="flex-1">
        <Hero />
        <About />
        <ProductGrid onAddToCart={addItem} />
      </main>
      <Footer />
      {!cartOpen && <FloatingWhatsApp />}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <Storefront />
    </CartProvider>
  );
}
