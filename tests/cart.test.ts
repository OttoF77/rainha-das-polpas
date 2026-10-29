import test from "node:test";
import assert from "node:assert/strict";
import { PRODUCTS } from "../src/data/products";
import { addCartItem, updateCartQuantity, cartTotals, serializeCart, deserializeCart } from "../src/lib/cart";
const product = PRODUCTS[0];
test("adiciona, acumula, limita, altera e remove quantidades", () => {
  let items = addCartItem([], product, 2);
  items = addCartItem(items, product, 3);
  assert.equal(items[0].quantity, 5);
  for (const invalid of [-1, 0, 1.2, NaN, Infinity, 1000]) assert.deepEqual(addCartItem(items, product, invalid), items);
  items = addCartItem(items, product, 999);
  assert.equal(items[0].quantity, 999);
  for (const invalid of [-1, 1.2, NaN, Infinity, 1000]) assert.deepEqual(updateCartQuantity(items, product.id, invalid), items);
  items = updateCartQuantity(items, product.id, 2);
  assert.equal(items[0].subtotal, 28);
  assert.deepEqual(updateCartQuantity(items, product.id, 0), []);
});
test("total em centavos, preço zero e carrinho misto sob consulta", () => {
  let items = addCartItem([], { ...product, precoUnitario: 0.1 }, 3);
  assert.equal(cartTotals(items).estimatedTotal, 0.3);
  items = addCartItem(items, { ...PRODUCTS[1], precoUnitario: 0 }, 2);
  assert.equal(items[1].subtotal, 0);
  assert.equal(cartTotals(items).hasUnpricedItems, false);
  items = addCartItem(items, { ...PRODUCTS[2], precoUnitario: undefined });
  assert.deepEqual(cartTotals(items), { totalItems: 6, estimatedTotal: undefined, hasUnpricedItems: true });
});
test("persistência versionada ignora payload inválido e usa catálogo atual", () => {
  const items = addCartItem([], product, 3);
  assert.deepEqual(deserializeCart(serializeCart(items), PRODUCTS), items);
  for (const raw of [null, "{broken", "null", "[]", '{"version":2,"items":[]}', '{"version":1,"items":{}}']) assert.deepEqual(deserializeCart(raw, PRODUCTS), []);
  const raw = JSON.stringify({ version: 1, items: [null, { productId: "missing", quantity: 1 }, { productId: product.id, quantity: 0 }, { productId: product.id, quantity: 2, unitPrice: 9999 }, { productId: product.id, quantity: 2 }] });
  const result = deserializeCart(raw, [{ ...product, precoUnitario: 20 }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].subtotal, 40);
});
