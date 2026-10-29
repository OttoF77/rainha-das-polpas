import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

test("Contratos Normativos de UI e Guardrails (Footer, Navbar, Canal Único)", () => {
  const footerContent = fs.readFileSync(path.join(rootDir, "src/components/Footer.tsx"), "utf-8");
  const navbarContent = fs.readFileSync(path.join(rootDir, "src/components/Navbar.tsx"), "utf-8");
  const heroContent = fs.readFileSync(path.join(rootDir, "src/components/Hero.tsx"), "utf-8");
  const waContent = fs.readFileSync(path.join(rootDir, "src/components/FloatingWhatsApp.tsx"), "utf-8");

  // 1. Copyright obrigatório e link da Sysotto
  const expectedCopyright = "© 2026 Rainha das Polpas. Todos os direitos reservados. Desenvolvido por";
  assert.ok(
    footerContent.includes(expectedCopyright),
    `Footer deve conter o texto normativo de copyright: "${expectedCopyright}"`
  );
  assert.ok(
    footerContent.includes('href="https://sysotto.com"') && footerContent.includes('target="_blank"'),
    "Footer deve conter link seguro para https://sysotto.com"
  );
  assert.ok(
    !footerContent.includes("Delícia Natural"),
    "Marca legada Delícia Natural deve ter sido totalmente eliminada"
  );

  // 2. Canal Único (88) 99709-9082
  const expectedPhone = "(88) 99709-9082";
  const expectedWaNum = "5588997099082";
  assert.ok(footerContent.includes(expectedPhone), "Footer deve exibir telefone (88) 99709-9082");
  assert.ok(navbarContent.includes(expectedPhone), "Navbar deve exibir telefone (88) 99709-9082");
  assert.ok(heroContent.includes(expectedPhone), "Hero deve exibir telefone (88) 99709-9082");
  assert.ok(waContent.includes(expectedWaNum), "Botão flutuante deve apontar para 5588997099082");

  // 3. Ausência de links href="#" vazios sem âncora
  const checkEmptyHrefs = (fileText, fileName) => {
    const matches = fileText.match(/href=["']#["']/g);
    assert.strictEqual(
      matches,
      null,
      `${fileName} não deve possuir href="#" vazios sem âncora semântica`
    );
  };

  checkEmptyHrefs(footerContent, "Footer.tsx");
  checkEmptyHrefs(navbarContent, "Navbar.tsx");
  checkEmptyHrefs(heroContent, "Hero.tsx");
});

test("Helper getAssetPath - Resolução de subpaths multi-origem", async () => {
  const assetsModulePath = path.join(rootDir, "src/lib/assets.ts");
  const content = fs.readFileSync(assetsModulePath, "utf-8");
  assert.ok(content.includes("NEXT_PUBLIC_BASE_PATH"), "Helper deve ler NEXT_PUBLIC_BASE_PATH");
});
