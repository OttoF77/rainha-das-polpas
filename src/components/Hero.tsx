import Image from "next/image";
import { getAssetPath } from "@/lib/assets";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-emerald-50/40 pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-harvest-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-fruit-salad/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-fruit-salad animate-pulse" />
              13 Sabores Oficiais da Região Nordeste
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-sysotto-navy-dark tracking-tight leading-[1.15]">
              O sabor puro da fruta,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fruit-salad via-emerald-600 to-harvest-gold">
                direto para sua casa.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-sysotto-navy-light/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Polpas 100% naturais, sem conservantes e com o máximo de sabor e nutrientes.
              Frutas rigorosamente selecionadas para levar saúde e praticidade para sua família.
            </p>

            {/* Badges checklist */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-sysotto-navy-dark bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200/60 shadow-2xs">
                <svg className="w-4 h-4 text-fruit-salad" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Zero Açúcar Adicionado</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-sysotto-navy-dark bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200/60 shadow-2xs">
                <svg className="w-4 h-4 text-fruit-salad" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>100% Natural Sem Conservantes</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-sysotto-navy-dark bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200/60 shadow-2xs">
                <svg className="w-4 h-4 text-fruit-salad" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Ricas em Fibras e Vitaminas</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#produtos"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white bg-fruit-salad hover:bg-fern-green shadow-md hover:shadow-lg transition-all touch-target text-base focus:outline-hidden focus:ring-2 focus:ring-fruit-salad"
              >
                Ver Cardápio de Polpas
              </a>
              <a
                href="https://wa.me/5588997099082?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido%20pelo%20WhatsApp."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sysotto-navy-dark bg-white hover:bg-emerald-50/80 border border-emerald-300 shadow-xs hover:shadow-md transition-all touch-target text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <svg className="w-5 h-5 fill-whatsapp" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.13 4.12 13.54 4.12 11.91C4.12 7.37 7.82 3.67 12.05 3.67Z" />
                </svg>
                <span>Pedir pelo WhatsApp</span>
              </a>
            </div>

            {/* Direct Channel indicator */}
            <p className="text-xs text-sysotto-navy-light/60 font-medium">
              Atendimento exclusivo e pedidos rápidos: <strong className="text-sysotto-navy-dark">(88) 99709-9082</strong>
            </p>
          </div>

          {/* Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 bg-white">
                <Image
                  src={getAssetPath("/images/about_production.jpg")}
                  alt="Seleção de frutas frescas e naturais Rainha das Polpas"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block bg-harvest-gold text-sysotto-navy-dark font-extrabold text-xs px-2.5 py-1 rounded-md mb-1 uppercase tracking-wider">
                    Sabor e Saúde
                  </span>
                  <p className="text-sm font-medium text-white/95 leading-snug">
                    Polpas puras pasteurizadas e ultracongeladas preservando sabor, cor e nutrientes.
                  </p>
                </div>
              </div>

              {/* Floating highlight card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 hidden sm:flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-fruit-salad font-black text-xl">
                  13
                </div>
                <div>
                  <h4 className="text-sm font-bold text-sysotto-navy-dark">Sabores Naturais</h4>
                  <p className="text-xs text-sysotto-navy-light/70">Incluindo Mangaba e Seriguela</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
