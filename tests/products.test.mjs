import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

test("Dataset de Produtos - 13 sabores oficiais e integridade textual", async () => {
  const productsFilePath = path.join(rootDir, "src/data/products.ts");
  assert.ok(fs.existsSync(productsFilePath), "src/data/products.ts deve existir");

  const content = fs.readFileSync(productsFilePath, "utf-8");

  // Lista dos 13 sabores obrigatórios
  const officialFlavors = [
    "abacaxi",
    "acerola",
    "caja",
    "caju",
    "goiaba",
    "graviola",
    "manga",
    "mangaba",
    "maracuja",
    "morango",
    "seriguela",
    "tamarindo",
    "uva",
  ];

  for (const flavor of officialFlavors) {
    assert.ok(
      content.includes(`id: "${flavor}"`),
      `O sabor obrigatório "${flavor}" deve estar presente no catálogo`
    );
  }

  // Verificação de não-truncamento de Abacaxi e Acerola
  assert.ok(
    content.includes("absorção de nutrientes essenciais"),
    "Texto de Abacaxi deve estar corrigido e completo (não truncado em 'absorção de nutri')"
  );
  assert.ok(
    content.includes("sucos revigorantes e nutritivos"),
    "Texto de Acerola deve estar corrigido e completo (não truncado em 'sucos revigorante')"
  );

  // Verificação de Mangaba
  assert.ok(
    content.includes("Hancornia speciosa"),
    "Mangaba deve conter seu nome científico oficial"
  );
  assert.ok(
    content.includes("cerrado") || content.includes("restingas"),
    "Mangaba deve ter narrativa contextualizada no cerrado/nordeste"
  );

  // Verificação de ausência de AdobeStock em todo o repositório
  const checkForbiddenString = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".next" || entry.name === "out") {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      assert.ok(
        !entry.name.toLowerCase().includes("adobestock"),
        `Nenhum arquivo pode conter 'AdobeStock' no nome: ${fullPath}`
      );
      if (entry.isDirectory()) {
        checkForbiddenString(fullPath);
      }
    }
  };

  checkForbiddenString(rootDir);
});
