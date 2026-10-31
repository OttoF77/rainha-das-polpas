import { test, expect } from "@playwright/test";

test.describe("Fluxo de Compra e Checkout WhatsApp — Rainha das Polpas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("article").first()).toBeVisible();
    await page.locator('[data-hydrated="true"]').waitFor({ timeout: 5000 }).catch(() => {});
  });

  test("1. Carrega vitrine com 13 sabores e canal de atendimento oficial", async ({ page }) => {
    await expect(page).toHaveTitle(/Rainha das Polpas/);

    const articles = page.locator("article");
    await expect(articles).toHaveCount(13);

    const mangabaHeading = page.getByRole("heading", { name: "Polpa de Mangaba" });
    await expect(mangabaHeading).toBeVisible();

    const phoneLinks = page.locator('a[href*="5588997099082"]');
    await expect(phoneLinks.first()).toBeVisible();
  });

  test("2. Busca de sabores por texto insensível a acentuação", async ({ page }) => {
    const searchInput = page.getByRole("searchbox");
    await expect(async () => {
      await searchInput.fill("mangaba");
      await expect(page.locator("article")).toHaveCount(1);
    }).toPass();

    await expect(page.getByRole("heading", { name: "Polpa de Mangaba" })).toBeVisible();

    // Limpa busca
    await searchInput.fill("");
    await expect(page.locator("article")).toHaveCount(13);

    // Busca com variação sem acento
    await searchInput.fill("maracuja");
    await expect(page.getByRole("heading", { name: "Polpa de Maracujá" })).toBeVisible();
  });

  test("3. Modal de detalhes nutricionais, adição ao carrinho e atualização de badge", async ({ page }) => {
    const mangabaButton = page.getByRole("button", { name: "Ver benefícios nutricionais de Polpa de Mangaba" });
    await mangabaButton.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const quantityInput = dialog.getByRole("spinbutton");
    await quantityInput.fill("2");

    const addToCartButton = dialog.getByRole("button", { name: "Adicionar ao Carrinho" });
    await addToCartButton.click();

    await expect(dialog).not.toBeVisible();

    const cartButton = page.getByRole("button", { name: /Carrinho de compras com 2 itens/ });
    await expect(cartButton).toBeVisible();
  });

  test("4. Abertura do Drawer, pré-checkout e geração de link seguro de WhatsApp", async ({ page }) => {
    const mangabaDetail = page.getByRole("button", { name: "Ver benefícios nutricionais de Polpa de Mangaba" });
    await mangabaDetail.click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("spinbutton").fill("3");
    await dialog.getByRole("button", { name: "Adicionar ao Carrinho" }).click();

    const cartButton = page.getByRole("button", { name: /Carrinho de compras com 3 itens/ });
    await cartButton.click();

    await page.getByLabel("Nome").fill("Maria Oliveira");
    await page.getByLabel("Entrega").check();
    await page.getByLabel("Bairro/Cidade").fill("Centro");
    await page.getByLabel("Pix").check();
    await page.getByLabel("Observações").fill("Entregar no portão lateral");

    const checkoutLink = page.getByRole("link", { name: "Finalizar Pedido no WhatsApp" });
    await expect(checkoutLink).toBeVisible();

    const href = await checkoutLink.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toContain("https://wa.me/5588997099082?text=");

    const decodedMessage = decodeURIComponent(href!.split("?text=")[1]);
    expect(decodedMessage).toContain("Rainha das Polpas");
    expect(decodedMessage).toMatch(/#RP-\d{4}/);
    expect(decodedMessage).toContain("3x Polpa de Mangaba");
    expect(decodedMessage).toContain("Nome: Maria Oliveira");
    expect(decodedMessage).toContain("Modalidade: Entrega");
    expect(decodedMessage).toContain("Bairro/Endereço: Centro");
    expect(decodedMessage).toContain("Forma de pagamento: Pix");
    expect(decodedMessage).toContain("Observações: Entregar no portão lateral");

    const copyButton = page.getByRole("button", { name: /Copiar resumo do pedido|Copiar Pedido/ });
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await expect(page.getByText("✓ Pedido copiado com sucesso!")).toBeVisible();

    await expect(page.getByText("3 pacotes/unidades")).toBeVisible();
  });

  test("5. Botão flutuante de WhatsApp e não-colisão quando Drawer estiver aberto", async ({ page }) => {
    const floatingButton = page.getByRole("link", { name: /Conversar pelo WhatsApp no canal único/ });
    await expect(floatingButton).toBeVisible();

    const openCartBtn = page.getByRole("button", { name: /Carrinho de compras/ });
    await expect(async () => {
      await openCartBtn.click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 1000 });
    }).toPass();

    await expect(floatingButton).not.toBeVisible();
  });
});
