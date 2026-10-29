import type { Product } from "../data/products";
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
export function matchesProductName(product: Product, query: string): boolean {
  return normalize(product.nome).includes(normalize(query));
}
