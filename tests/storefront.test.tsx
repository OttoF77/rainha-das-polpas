import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { registerHooks } from "node:module";
// Image optimization is verified by the production build; DOM tests use an img adapter.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === "next/image") return { url: new URL("./image-adapter.mjs", import.meta.url).href, shortCircuit: true };
  return nextResolve(specifier, context);
} });
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });
Object.assign(globalThis, { React, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, HTMLDialogElement: dom.window.HTMLDialogElement, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); this.querySelector<HTMLElement>("button")?.focus(); };
dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
const { render, screen, fireEvent, cleanup } = await import("@testing-library/react");
const { CartProvider } = await import("../src/contexts/CartContext");
const { useCart } = await import("../src/hooks/useCart");
const { ProductGrid } = await import("../src/components/ProductGrid");
const { CartDrawer } = await import("../src/components/CartDrawer");
const { Navbar } = await import("../src/components/Navbar");
const { PRODUCTS } = await import("../src/data/products");
const { CART_STORAGE_KEY } = await import("../src/lib/cart");
afterEach(() => { cleanup(); window.localStorage.clear(); });
function Harness({ unpriced = false }: { unpriced?: boolean }) {
  const cart = useCart();
  const [open, setOpen] = React.useState(false);
  return <><Navbar cartCount={cart.totalItems} onOpenCart={() => setOpen(true)} /><ProductGrid onAddToCart={cart.addItem} />
    {unpriced && <button onClick={() => cart.addItem({ ...PRODUCTS[1], precoUnitario: undefined })}>Adicionar sem preço</button>}
    {open && <CartDrawer onClose={() => setOpen(false)} />}</>;
}
test("renderiza 13 sabores, busca sem acentos e compõe filtros", () => {
  render(<ProductGrid />);
  assert.equal(screen.getAllByRole("article").length, 13);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "  MANGABA " } });
  assert.equal(screen.getAllByRole("article").length, 1);
  assert.ok(screen.getByRole("heading", { name: "Polpa de Mangaba" }));
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "caja" } });
  assert.ok(screen.getByRole("heading", { name: "Polpa de Cajá" }));
  fireEvent.click(screen.getByRole("button", { name: "Ricas em Vitamina C" }));
  assert.equal(screen.queryAllByRole("article").length, 0);
  assert.ok(screen.getByText(/Nenhum sabor encontrado/));
});
test("modal adiciona quantidade e drawer altera, remove, limpa e envia resumo", () => {
  render(<CartProvider><Harness unpriced /></CartProvider>);
  const trigger = screen.getByRole("button", { name: "Ver benefícios nutricionais de Polpa de Mangaba" });
  trigger.focus(); fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog");
  assert.equal(dialog.getAttribute("aria-labelledby"), "modal-product-title");
  assert.ok(screen.getByRole("table"));
  fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "2.5" } });
  assert.equal((screen.getByRole("button", { name: "Adicionar ao Carrinho" }) as HTMLButtonElement).disabled, true);
  fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "3" } });
  fireEvent.click(screen.getByRole("button", { name: "Adicionar ao Carrinho" }));
  assert.equal(document.activeElement, trigger);
  assert.equal(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY)!).items[0].quantity, 3);
  assert.match(document.querySelector('[aria-live="polite"]')!.textContent!, /3 unidade/);
  fireEvent.click(screen.getByRole("button", { name: "Adicionar sem preço" }));
  fireEvent.click(screen.getByRole("button", { name: "Carrinho de compras com 4 itens" }));
  assert.ok(screen.getByText("Total estimado: Sob consulta"));
  fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "Ana" } });
  const link = screen.getByRole("link", { name: "Enviar Pedido pelo WhatsApp" });
  assert.match(decodeURIComponent(link.getAttribute("href")!), /Nome: Ana/);
  fireEvent.click(screen.getByRole("button", { name: "Remover Polpa de Acerola" }));
  fireEvent.click(screen.getByRole("button", { name: "Diminuir quantidade de Polpa de Mangaba" }));
  assert.match(screen.getByText(/Total estimado:/).textContent!, /33,00/);
  fireEvent.click(screen.getByRole("button", { name: "Aumentar quantidade de Polpa de Mangaba" }));
  assert.match(screen.getByText(/Total estimado:/).textContent!, /49,50/);
  fireEvent.click(screen.getByRole("button", { name: "Limpar carrinho" }));
  assert.ok(screen.getByText(/Seu carrinho está vazio/));
  fireEvent(screen.getByRole("dialog"), new dom.window.Event("cancel", { bubbles: false, cancelable: true }));
  assert.equal(screen.queryByRole("dialog"), null);
});
test("hidrata carrinho ao remontar e continua com armazenamento indisponível", () => {
  const view = render(<CartProvider><Harness /></CartProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Adicionar Polpa de Abacaxi ao carrinho" }));
  view.unmount();
  render(<CartProvider><Harness /></CartProvider>);
  assert.ok(screen.getByRole("button", { name: "Carrinho de compras com 1 itens" }));
  cleanup();
  const original = Object.getOwnPropertyDescriptor(window, "localStorage")!;
  Object.defineProperty(window, "localStorage", { configurable: true, get() { throw new Error("blocked"); } });
  try {
    render(<CartProvider><Harness /></CartProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Adicionar Polpa de Abacaxi ao carrinho" }));
    assert.ok(screen.getByRole("button", { name: "Carrinho de compras com 1 itens" }));
  } finally { Object.defineProperty(window, "localStorage", original); }
});
