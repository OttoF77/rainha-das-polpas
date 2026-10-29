"use client";
export function ProductSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <div className="max-w-lg mx-auto"><label htmlFor="product-search" className="block text-sm font-semibold">Buscar sabor</label><input id="product-search" type="search" className="order-input" placeholder="Ex.: mangaba, cajá, maracujá…" value={value} onChange={event => onChange(event.target.value)} /></div>;
}
