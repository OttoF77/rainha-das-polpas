# Backlog de Tarefas e Melhorias Futuras — Rainha das Polpas

ID: `TASKS-RP-001`. Estado: **ativo**. Módulo: `Rainha das Polpas (Storefront D2C)`.

Este documento registra as tarefas concluídas da baseline e o backlog técnico priorizado para as próximas fases do produto, em conformidade com o padrão `DOC-MOD-001`.

---

## 1. Baseline Concluída (Sprint 0 a Sprint 3)

- [x] **RP-001**: Catálogo completo dos 13 sabores oficiais com Mangaba regional e busca insensível a acentos. (Evidência: `tests/products.test.mjs`, `tests/storefront.test.tsx`).
- [x] **RP-002**: Modal de detalhes nutricionais acessível com foco contido e controle de quantidade inteiro 1 a 999. (Evidência: `tests/storefront.test.tsx`).
- [x] **RP-003**: Carrinho reativo com drawer lateral, cálculo híbrido de BRL / Sob consulta e atualização reativa do badge. (Evidência: `tests/cart.test.ts`, `tests/storefront.test.tsx`).
- [x] **RP-004**: Persistência local em `localStorage` com versionamento de schema v1 e hidratação segura SSR. (Evidência: `tests/cart.test.ts`).
- [x] **RP-005**: Centralização estrita no canal de comunicação oficial único `(88) 99709-9082`. (Evidência: `tests/components-contract.test.mjs`, `tests/whatsapp.test.ts`).
- [x] **RP-006**: Checkout via WhatsApp com protocolo curto `#RP-XXXX`, sanitização e limite seguro de 1.800 caracteres. (Evidência: `tests/whatsapp.test.ts`).
- [x] **RP-007**: Preservação de carrinho pós-clique e botão de fallback para cópia na área de transferência. (Evidência: `tests/whatsapp.test.ts`, `tests/storefront.test.tsx`).
- [x] **RP-008**: Botão flutuante de WhatsApp com classes de movimento reduzido e ocultação automática quando modais estiverem abertos. (Evidência: `tests/whatsapp.test.ts`).
- [x] **RP-009**: Portas de integração Sysotto tipadas por slug/host sem `X-Tenant-Id`, com timeout de 3.000 ms e fail-closed na escrita. (Evidência: `tests/sysotto-api.test.ts`).
- [x] **RP-010**: Compatibilidade de catálogo com a projeção `IndustryCatalog_V1` e fallback transparente para o dataset estático. (Evidência: `tests/sysotto-api.test.ts`).
- [x] **RP-011**: Precificação regional por estado (UF) exclusiva no carrinho após login e identificação de região (S3-04). Preços ocultos na vitrine/modal; tabelas CE/SP/PI com frete embutido; invalidação no logout; sem `X-Tenant-Id`. (Evidência: `tests/regional-pricing.test.ts`, `tests/storefront.test.tsx`, `e2e/order-flow.spec.ts`).
- [x] **DOC-MOD-001**: Baseline documental spec-driven com 5 arquivos normativos e diagramas Mermaid. (Evidência: diretório `docs/`).

---

## 2. Backlog Técnico e Evoluções Futuras (Sprint 4+)

### Prioridade P1 — Comercial & Conteúdo
- [ ] **TASK-RP-020**: Inserir fotos reais de estúdio das embalagens de 1kg e 100g para os 13 sabores, substituindo os mockups temporários.
- [ ] **TASK-RP-021**: Atualizar tabela nutricional com laudos laboratoriais oficiais fornecidos pelo responsável técnico da fábrica.
- [ ] **TASK-RP-022**: Adicionar modalidade de cotação para Atacado/Food Service (caixas de 10kg, 25kg e 50kg) com pedido mínimo diferenciado.

### Prioridade P2 — Integrações & Automação Sysotto
- [ ] **TASK-RP-030**: Conectar webhook de publicação do `Sysotto.LandingPage`/`SiteBuilder` para revalidação ISR sob demanda no Cloudflare Pages.
- [ ] **TASK-RP-031**: Enviar telemetria anônima de intenção de pedido para o `Sysotto.Sales` em background (`navigator.sendBeacon`) sem bloquear a abertura do WhatsApp.
- [ ] **TASK-RP-032**: Adicionar formulário de contato B2B conectado ao `capturePublicLead()` de `Sysotto.Communication`.

### Prioridade P3 — UX & Internacionalização
- [ ] **TASK-RP-040**: Suporte a tema escuro (Dark Mode) respeitando `prefers-color-scheme`.
- [ ] **TASK-RP-041**: Localização de interface e catálogo para Inglês e Espanhol para suporte a exportação.
