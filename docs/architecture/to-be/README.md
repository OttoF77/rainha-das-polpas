# Arquitetura To-Be — Rainha das Polpas

Decisão Normativa: `DESIGN-RP-001`. Fonte: `Sysotto.Docs/architecture/industry-sitebuilder-catalog-contract-v1.md`.

---

## 1. Visão de Integração Dinâmica com Ecossistema Sysotto

A arquitetura To-Be conecta o storefront diretamente à projeção pública de borda do Sysotto, mantendo o fallback estático como garantia de resiliência.

```mermaid
flowchart LR
    subgraph Storefront["Storefront (Next.js)"]
        ClientService["sysotto-api.ts (getCatalogProducts)"]
        LeadService["capturePublicLead()"]
        SalesService["recordOrderIntent()"]
    end

    subgraph SysottoPlatform["Sysotto Platform Gateway"]
        Gateway["Sysotto.Api (Public Gateway /api/v1/public/sites/:slug)"]
        Projection["SiteBuilder Snapshot / IndustryCatalog_V1"]
        CommModule["Sysotto.Communication"]
        SalesModule["Sysotto.Sales"]
    end

    ClientService -->|GET catalog (sem X-Tenant-Id)| Gateway
    LeadService -->|POST leads| Gateway
    SalesService -->|POST orders/intent| Gateway
    Gateway --> Projection
    Gateway --> CommModule
    Gateway --> SalesModule
```

## 2. Invariantes Arquiteturais To-Be
- Resolução anônima de tenant exclusivamente por `siteSlug` (`rainhadaspolpas`) ou Host.
- Falha fechada na escrita e fallback transparente na leitura para garantir 100% de disponibilidade de vendas.
- Nenhuma chave privada ou de tenant no código cliente.
