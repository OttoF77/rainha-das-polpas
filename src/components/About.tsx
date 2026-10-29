import Image from "next/image";
import { getAssetPath } from "@/lib/assets";

export function About() {
  return (
    <section id="sobre" className="py-20 lg:py-28 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Production & Heritage Image */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative mx-auto max-w-lg">
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-50">
                <Image
                  src={getAssetPath("/images/about_production.jpg")}
                  alt="Processamento e seleção de frutas tropicais"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>

              {/* Stat callout */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/60">
                  <span className="block text-2xl font-black text-amber-900">100%</span>
                  <span className="text-xs font-semibold text-amber-800">Fruta Natural e Pura</span>
                </div>
                <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/60">
                  <span className="block text-2xl font-black text-emerald-900">0%</span>
                  <span className="text-xs font-semibold text-emerald-800">Conservantes Artificiais</span>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative & Values */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-harvest-gold/20 text-sysotto-navy-dark text-xs font-bold uppercase tracking-wider">
              Nossa História & Tradição
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sysotto-navy-dark tracking-tight">
              Quem Somos
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-sysotto-navy-light/80 leading-relaxed font-normal">
              <p>
                A <strong className="font-semibold text-sysotto-navy-dark">Rainha das Polpas</strong> nasceu com o propósito de aproximar você do verdadeiro sabor das frutas do Brasil e do Nordeste. Trabalhamos diariamente com frutas rigorosamente colhidas no ponto ideal de maturação para garantir o máximo de sabor, aroma e nutrientes.
              </p>
              <p>
                Nosso processo de despolpamento segue os mais altos padrões de higiene e controle alimentar. As polpas são congeladas rapidamente para manter intactas as propriedades benéficas, vitaminas essenciais e fibras de cada fruta, sem necessidade de adição de água, corantes ou conservantes químicos.
              </p>
              <p>
                Mais do que polpas, entregamos saúde, praticidade e aquele gostinho afetivo das frutas regionais — de clássicos universais como Acerola e Morango a tesouros da caatinga e cerrado como <strong className="text-sysotto-navy-dark font-medium">Mangaba, Cajá e Seriguela</strong>.
              </p>
            </div>

            {/* Quality Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-fruit-salad flex items-center justify-center font-bold mb-2">
                  ✓
                </div>
                <h3 className="font-bold text-sm text-sysotto-navy-dark">Origem Garantida</h3>
                <p className="text-xs text-sysotto-navy-light/70 mt-1">Frutas selecionadas direto de produtores regionais parceiros.</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-fruit-salad flex items-center justify-center font-bold mb-2">
                  ✓
                </div>
                <h3 className="font-bold text-sm text-sysotto-navy-dark">Praticidade Real</h3>
                <p className="text-xs text-sysotto-navy-light/70 mt-1">Porções fracionadas ideais para sucos, smoothies e sobremesas.</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-fruit-salad flex items-center justify-center font-bold mb-2">
                  ✓
                </div>
                <h3 className="font-bold text-sm text-sysotto-navy-dark">Entrega Rápida</h3>
                <p className="text-xs text-sysotto-navy-light/70 mt-1">Atendimento ágil pelo WhatsApp para sua residência ou negócio.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
