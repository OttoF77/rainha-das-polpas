import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

test("Headers e Configurações de Segurança e Cache Cloudflare Pages", () => {
  const headersPath = path.join(rootDir, "public/_headers");
  assert.ok(fs.existsSync(headersPath), "public/_headers deve existir");

  const headers = fs.readFileSync(headersPath, "utf-8");
  assert.ok(headers.includes("X-Content-Type-Options: nosniff"), "Deve conter nosniff");
  assert.ok(headers.includes("X-Frame-Options: DENY"), "Deve conter X-Frame-Options: DENY");
  assert.ok(headers.includes("Strict-Transport-Security"), "Deve conter HSTS");
  assert.ok(headers.includes("https://wa.me") && headers.includes("https://api.whatsapp.com"), "CSP deve permitir WhatsApp");
  assert.ok(headers.includes("max-age=31536000"), "Cache imutável configurado");
});

test("Design Tokens JSON e Paleta Sysotto", () => {
  const tokensPath = path.join(rootDir, "design/tokens.json");
  assert.ok(fs.existsSync(tokensPath), "design/tokens.json deve existir");

  const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf-8"));
  assert.strictEqual(tokens.color.brand["harvest-gold"].$value, "#dcb071");
  assert.strictEqual(tokens.color.brand["fruit-salad"].$value, "#4b9142");
  assert.strictEqual(tokens.color.brand["asparagus"].$value, "#889d5c");
  assert.strictEqual(tokens.color.brand["fern-green"].$value, "#477341");
  assert.strictEqual(tokens.color.sysotto["navy-dark"].$value, "#112F4A");
});
