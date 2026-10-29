"use client";

import { useState } from "react";
import Image from "next/image";
import { getAssetPath } from "@/lib/assets";

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Sobre Nós", href: "#sobre" },
    { label: "Produtos", href: "#produtos" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#inicio"
            className="flex items-center gap-3 touch-target focus:outline-hidden focus:ring-2 focus:ring-fruit-salad rounded-lg p-1"
            aria-label="Rainha das Polpas - Página Inicial"
          >
            <div className="relative w-12 h-12 overflow-hidden rounded-full shadow-xs border border-harvest-gold/40">
              <Image
                src={getAssetPath("/images/logo.png")}
                alt="Logomarca Rainha das Polpas"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-sysotto-navy-dark leading-tight">
                Rainha das Polpas
              </span>
              <span className="text-xs font-medium text-fruit-salad tracking-wide uppercase">
                100% Fruta Natural
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-sysotto-navy-light hover:text-fruit-salad transition-colors touch-target py-2 focus:outline-hidden focus:ring-2 focus:ring-fruit-salad rounded-md"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions: Cart + WhatsApp Direct + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Quick WhatsApp button on desktop */}
            <a
              href="https://wa.me/5588997099082?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido%20de%20polpas."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors touch-target"
              aria-label="Falar no WhatsApp (88) 99709-9082"
            >
              <svg className="w-4 h-4 fill-whatsapp" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.13 4.12 13.54 4.12 11.91C4.12 7.37 7.82 3.67 12.05 3.67Z" />
              </svg>
              <span>(88) 99709-9082</span>
            </a>

            {/* Cart Icon Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full text-sysotto-navy-dark hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-fruit-salad transition-colors touch-target"
              aria-label={`Carrinho de compras com ${cartCount} itens`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span key={cartCount} className="cart-badge absolute -top-1 -right-1 bg-fruit-salad text-white text-xs font-bold min-w-5 px-1 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-sysotto-navy-dark hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-fruit-salad touch-target"
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2" aria-label="Menu móvel">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-md text-base font-medium text-sysotto-navy-dark hover:bg-gray-50 hover:text-fruit-salad transition-colors touch-target justify-start"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <a
                href="https://wa.me/5588997099082?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido%20de%20polpas."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-bold bg-fruit-salad text-white hover:bg-fern-green transition-colors touch-target shadow-xs"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.13 4.12 13.54 4.12 11.91C4.12 7.37 7.82 3.67 12.05 3.67Z" />
                </svg>
                <span>Pedir no WhatsApp (88) 99709-9082</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
