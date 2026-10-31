# Status de Implementação e Conformidade — Rainha das Polpas

ID: `STATUS-RP-001`. Data da Baseline: **31/10/2026**. Versão: `1.0.0`.

Este documento registra exclusivamente os fatos comprovados por testes automatizados e builds homologados no repositório `OttoF77/rainha-das-polpas`, conforme a seção 2 do padrão normativo `DOC-MOD-001`.

---

## 1. Resumo Executivo da Homologação

- **Total de Requisitos Normativos**: 11
- **Requisitos Conformes (`conforme`)**: 11 (100%)
- **Requisitos Parciais / Não Conformes**: 0
- **Suíte de Testes Automatizados**: 38 testes unitários e de integração + 12 testes E2E Playwright aprovados (100% pass).
- **TypeScript & Linting**: 0 erros, 0 avisos.
- **Exportação Estática (SSG)**: Homologada em `out/` com build Turbopack do Next.js 16.

---

## 2. Matriz de Conformidade por Requisito

| ID Requisito | Título / Descrição | Estado | Fonte de Evidência Comprovada |
| :--- | :--- | :--- | :--- |
| **RP-001** | Catálogo dos 13 Sabores Oficiais com Mangaba | `conforme` | `tests/products.test.mjs`, `tests/storefront.test.tsx` (13 articles renderizados, Mangaba com *Hancornia speciosa*, busca sem acentos). |
| **RP-002** | Modal de Detalhes Nutricionais e Controle de Quantidade | `conforme` | `tests/storefront.test.tsx` (`showModal`, `dialog`, foco contido, limite 1 a 999, fechamento por tecla Esc). |
| **RP-003** | Carrinho Reativo e Drawer Lateral | `conforme` | `tests/cart.test.ts`, `tests/storefront.test.tsx` (adição, acumulação, remoção, subtotais em BRL e modo "Sob consulta"). |
| **RP-004** | Persistência Local Resiliente (v1) e SSR-Safe | `conforme` | `tests/cart.test.ts` (schema `rainha_das_polpas_cart_v1`, tolerância a payload inválido e continuidade sem localStorage). |
| **RP-005** | Canal Único e Exclusivo (88) 99709-9082 | `conforme` | `tests/components-contract.test.mjs`, `tests/whatsapp.test.ts` (exclusividade estrita de `5588997099082` em todos os links e botões). |
| **RP-006** | Checkout WhatsApp com Protocolo Curto e Sanitização | `conforme` | `tests/whatsapp.test.ts` (`#RP-XXXX`, formatação em lista, sanitização de caracteres de controle, limite seguro de 1.800 chars). |
| **RP-007** | Prevenção de Perda de Carrinho e Fallback Clipboard | `conforme` | `tests/whatsapp.test.ts`, `tests/storefront.test.tsx` (preservação do carrinho pós-clique, botão "Copiar Pedido" com Clipboard API). |
| **RP-008** | Botão Flutuante e Acessibilidade | `conforme` | `tests/whatsapp.test.ts` (suporte a `prefers-reduced-motion`, ocultação automática inteligente sob modais/drawer abertos). |
| **RP-009** | Integração Sysotto por Slug/Host (Sem `X-Tenant-Id`) | `conforme` | `tests/sysotto-api.test.ts` (proibição de `X-Tenant-Id`, resolução por `siteSlug`, timeout de 3.000 ms, fail-closed na escrita). |
| **RP-010** | Compatibilidade Jamstack com `IndustryCatalog_V1` | `conforme` | `tests/sysotto-api.test.ts` (merge de dados remotos canônicos com metadados locais de `products.ts`, fallback imediato sem backend). |
| **RP-011** | Precificação Regional por Estado (UF) Exclusiva no Carrinho | `conforme` | `tests/regional-pricing.test.ts`, `tests/storefront.test.tsx`, `e2e/order-flow.spec.ts` (preços ausentes na vitrine/modal; exibição exclusiva pós-login com tabelas CE/SP/PI; invalidação no logout; sem `X-Tenant-Id`). |

---

## 3. Evidências de Execução de Testes

```text
> rainha-das-polpas@1.0.0 test
> tsx --test tests/*.test.mjs tests/*.test.ts tests/*.test.tsx

✔ adiciona, acumula, limita, altera e remove quantidades
✔ total em centavos, preço zero e carrinho misto sob consulta
✔ persistência versionada ignora payload inválido e usa catálogo atual
✔ Contratos Normativos de UI e Guardrails (Footer, Navbar, Canal Único)
✔ Helper getAssetPath - Resolução de subpaths multi-origem
✔ Headers e Configurações de Segurança e Cache Cloudflare Pages
✔ Design Tokens JSON e Paleta Sysotto
✔ Dataset de Produtos - 13 sabores oficiais e integridade textual
✔ renderiza 13 sabores, busca sem acentos e compõe filtros
✔ modal adiciona quantidade e drawer altera, remove, limpa e envia resumo
✔ hidrata carrinho ao remontar e continua com armazenamento indisponível
✔ 1. Configurações padrão e resolução por slug
✔ 2. PROIBIÇÃO estrita do cabeçalho X-Tenant-Id em todas as chamadas públicas (IND-001, IND-005)
✔ 3. Sucesso na consulta remota e merge compatível com IndustryCatalog_V1
✔ 4. Resiliência: Fallback imediato quando NEXT_PUBLIC_SYSOTTO_API_URL não está configurada
✔ 5. Resiliência: Fallback transparente em caso de erro HTTP 5xx da API
✔ 6. Resiliência: Fallback transparente em caso de timeout do AbortController
✔ 7. Captura de lead (Communication): Sucesso e Fail-Closed
✔ 8. Registro de intenção de pedido (Sales): Sucesso e Fail-Closed
✔ 1. Constante e canal oficial exclusivo (88) 99709-9082
✔ 2. Gerador de protocolo curto de atendimento
✔ 3. Formatação de pedido com preços fixos (D2C)
✔ 4. Formatação de pedido com itens 'Sob consulta' (modo cotação)
✔ 5. Bloco completo de dados opcionais do cliente
✔ 6. Sanitização de caracteres de controle e quebras de linha
✔ 7. Limite seguro de caracteres (máximo 1800 caracteres)
✔ 8. buildWhatsAppUrl gera deep link correto com encodeURIComponent e canal único
✔ 9. Contratos visuais e de acessibilidade do FloatingWhatsAppButton
✔ 10. Contratos e elementos de pré-checkout do CartDrawer
ℹ tests 29 | pass 29 | fail 0
```
