# Arquitetura — Rainha das Polpas

ID: `ARCH-RP-001`. Padrão: `DOC-MOD-001` § 3.

Este diretório contém as visões arquiteturais do storefront Rainha das Polpas, estruturadas entre o estado comprovado em código (`as-is/`) e a evolução planejada (`to-be/`).

---

## Estrutura do Diretório

- [`as-is/README.md`](as-is/README.md): Arquitetura comprovada atualmente em produção/código, baseada em exportação estática Next.js 16, persistência local e fallback offline.
- [`to-be/README.md`](to-be/README.md): Arquitetura planejada com sincronização dinâmica contínua com a API Sysotto, telemetria de pedidos e suporte a atacado.

---

## Convenções Arquiteturais

1. **Visões As-Is**: Baseadas estritamente em código implementado e testado. Limitações e dependências temporárias são documentadas de forma transparente.
2. **Visões To-Be**: Decisões técnicas aprovadas para o futuro da plataforma, mantendo invariantes de segurança (PROIBIDO `X-Tenant-Id`) e resiliência de ponta.
3. **Diagramas**: Notação padrão Mermaid para renderização direta em navegadores e GitHub.
