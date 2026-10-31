# Rainha das Polpas — Documentação Técnica do Módulo

ID: `DOC-MOD-001`. Estado: **aceito**. Escopo: Vitrine virtual, catálogo interativo D2C, carrinho reativo e checkout via WhatsApp da Rainha das Polpas.

Este documento declara o propósito, arquitetura, ownership, não-responsabilidades e inventário documental conforme o padrão spec-driven `DOC-MOD-001` do Sysotto.

---

## 1. Propósito e Identificação da Unidade

- **Nome da Aplicação / Módulo**: Rainha das Polpas (Storefront D2C)
- **Repositório**: `OttoF77/rainha-das-polpas` (`/Users/otto/Documents/Projetos/NatuPolpas`)
- **Tipo da Unidade**: Frontend Jamstack (Next.js 16 SSG / React 19 / Tailwind CSS v4)
- **Domínio Público Principal**: `https://rainhadaspolpas.com.br` / `https://sites.sysotto.com/rainhadaspolpas`
- **Infraestrutura de Distribuição**: Cloudflare Pages / Edge CDN com headers de segurança estritos.

## 2. Ownership e Responsabilidades

### O que o módulo É e FAZ:
1. **Catálogo de Sabores**: Apresenta interativamente os 13 sabores oficiais de polpa 100% natural com busca instantânea, filtragem por tags e benefícios nutricionais.
2. **Carrinho Reativo**: Permite seleção de quantidades (1 a 999), persistência local segura em `localStorage` (`rainha_das_polpas_cart_v1`) e cálculo em tempo real (BRL ou Sob consulta).
3. **Checkout via Social Commerce**: Gera pedidos estruturados com código de protocolo `#RP-XXXX`, sanitização de caracteres e direcionamento exclusivo ao WhatsApp oficial `(88) 99709-9082`.
4. **Resiliência e Fallback**: Opera de forma autônoma offline/estática, com porta de entrada compatível com a API pública do Sysotto (`IndustryCatalog_V1`).

### Não-Responsabilidades (Out of Scope):
- **Gestão Canônica de Estoque**: Responsabilidade exclusiva do `Sysotto.Inventory`.
- **Processamento de Pagamento Direto com Cartão/Gateway**: Centralizado no `Sysotto.Billing` / `Sysotto.Financial`.
- **Armazenamento de Senhas ou Contas de Usuário**: Centralizado no `Sysotto.Identity`.
- **Automação de Roteirização e Cargas**: Pertence ao `Sysotto.Logistics`.

## 3. Requisitos Globais Aplicáveis

| ID Global | Nome da Norma | Aplicação na Rainha das Polpas |
| :--- | :--- | :--- |
| `DOC-MOD-001` | Especificação Global de Documentação | 5 arquivos normativos + arquitetura em `docs/`. |
| `IND-001` | Boundary da Vertical Industry | Separação entre vitrine comercial e estoque/pedidos. |
| `IND-005` | Identidade, Tenant e Isolamento | Proibição de `X-Tenant-Id` em chamadas anônimas. |
| `SAL-002` | Contratos de Itens e Pedidos | Modelagem de `CartItem` compatível com `Sysotto.Sales`. |

## 4. Índice de Documentos Disponíveis

- [`docs/spec.md`](spec.md): Requisitos normativos rastreáveis (`RP-001` a `RP-010`) com critérios de aceite verificáveis.
- [`docs/design.md`](design.md): Decisões arquiteturais, topologia Jamstack, padrões de acessibilidade e fluxos em diagramas Mermaid.
- [`docs/implementation-status.md`](implementation-status.md): Matriz de conformidade dos requisitos comprovada por suíte de testes.
- [`docs/tasks.md`](tasks.md): Backlog técnico de melhorias e tarefas pós-baseline.
- [`docs/architecture/README.md`](architecture/README.md): Índice das visões arquiteturais `as-is` e `to-be`.
