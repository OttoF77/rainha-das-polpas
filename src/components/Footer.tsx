"use client";

import { useState } from "react";
import Image from "next/image";
import { getAssetPath } from "@/lib/assets";

export function Footer() {
  const [lgpdModalOpen, setLgpdModalOpen] = useState(false);

  return (
    <footer id="contato" className="bg-sysotto-navy-dark text-white pt-16 pb-12 border-t border-sysotto-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border border-harvest-gold/50 bg-white">
                <Image
                  src={getAssetPath("/images/logo.png")}
                  alt="Logomarca Rainha das Polpas"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Rainha das Polpas
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              O sabor puro da fruta colhida no ponto certo, 100% natural e sem adição de conservantes. Direto para sua mesa com toda a segurança alimentar.
            </p>
          </div>

          {/* Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-harvest-gold">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#produtos" className="hover:text-white transition-colors">
                  Catálogo de Sabores
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLgpdModalOpen(true)}
                  className="text-left hover:text-white transition-colors cursor-pointer text-gray-300"
                >
                  Política de Privacidade & LGPD
                </button>
              </li>
            </ul>
          </div>

          {/* Atendimento & Canal Único */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-harvest-gold">
              Canal de Atendimento
            </h4>
            <p className="text-sm text-gray-300">
              Faça pedidos, cotações e tire dúvidas diretamente com nossa equipe:
            </p>
            <div className="pt-1">
              <a
                href="https://wa.me/5588997099082?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20o%20atendimento%20da%20Rainha%20das%20Polpas."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors"
                aria-label="Ligar ou enviar mensagem no WhatsApp (88) 99709-9082"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.13 4.12 13.54 4.12 11.91C4.12 7.37 7.82 3.67 12.05 3.67Z" />
                </svg>
                <span>(88) 99709-9082</span>
              </a>
              <span className="block text-xs text-gray-400 mt-1">Atendimento de Segunda a Sábado</span>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-harvest-gold">
              Conecte-se Conosco
            </h4>
            <p className="text-sm text-gray-300">
              Acompanhe novidades, safras sazonais e receitas saudáveis:
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors touch-target"
                aria-label="Perfil do Instagram"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors touch-target"
                aria-label="Página do Facebook"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://wa.me/5588997099082"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-whatsapp/20 hover:bg-whatsapp/40 text-emerald-300 flex items-center justify-center transition-colors touch-target"
                aria-label="Canal do WhatsApp"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.13 4.12 13.54 4.12 11.91C4.12 7.37 7.82 3.67 12.05 3.67Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Mandatory Copyright Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p className="text-center sm:text-left">
            © 2026 Rainha das Polpas. Todos os direitos reservados. Desenvolvido por{" "}
            <a
              href="https://sysotto.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sysotto-cyan hover:underline font-semibold"
            >
              Sysotto Softwares
            </a>
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setLgpdModalOpen(true)}
              className="hover:text-gray-200 transition-colors underline cursor-pointer"
            >
              Privacidade e Cookies
            </button>
            <span className="text-gray-600">|</span>
            <span>Ceará, Brasil</span>
          </div>
        </div>
      </div>

      {/* Simplified LGPD Privacy Modal */}
      {lgpdModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setLgpdModalOpen(false)}
        >
          <div
            className="bg-white text-sysotto-navy-dark max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold">Privacidade & Conformidade LGPD</h3>
              <button
                type="button"
                onClick={() => setLgpdModalOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-900"
                aria-label="Fechar modal de privacidade"
              >
                ✕
              </button>
            </div>
            <div className="text-sm space-y-3 max-h-64 overflow-y-auto text-gray-700">
              <p>
                A <strong>Rainha das Polpas</strong> valoriza a segurança e a transparência no tratamento dos seus dados conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
              </p>
              <p>
                Este site funciona como catálogo estático e não compartilha informações pessoais com terceiros. Ao clicar em links de contato, você será direcionado ao aplicativo WhatsApp para atendimento individualizado e direto.
              </p>
              <p>
                Para solicitar informações sobre eventuais registros ou atualizações de dados de entrega, entre em contato pelo nosso canal oficial: <strong>(88) 99709-9082</strong>.
              </p>
            </div>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setLgpdModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-fruit-salad text-white font-bold text-xs hover:bg-fern-green transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
