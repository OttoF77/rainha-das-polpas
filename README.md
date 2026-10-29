# Rainha das Polpas - Frontend Oficial

Website institucional e catálogo digital de polpas de frutas da **Rainha das Polpas**, desenvolvido com a tecnologia e design system da **Sysotto Softwares**.

## 🚀 Tecnologias

- **Framework**: Next.js 16 (App Router, Static Export Jamstack)
- **UI & Estilização**: React 19, Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Linguagem**: TypeScript 5 (Strict Mode)
- **Qualidade & Testes**: ESLint 9, Node Native Test Runner
- **CI**: GitHub Actions para validar código e gerar artefato estático

## 🎨 Catálogo Oficial (13 Sabores)

1. Abacaxi (*Ananas comosus*)
2. Acerola (*Malpighia emarginata*)
3. Cajá (*Spondias mombin*)
4. Caju (*Anacardium occidentale*)
5. Goiaba (*Psidium guajava*)
6. Graviola (*Annona muricata*)
7. Manga (*Mangifera indica*)
8. Mangaba (*Hancornia speciosa*)
9. Maracujá (*Passiflora edulis*)
10. Morango (*Fragaria x ananassa*)
11. Seriguela (*Spondias purpurea*)
12. Tamarindo (*Tamarindus indica*)
13. Uva (*Vitis vinifera*)

## 📞 Canal de Atendimento

- **WhatsApp Oficial Exclusivo**: (88) 99709-9082
- **Link Direto**: [Conversar no WhatsApp](https://wa.me/5588997099082)

## 📦 Scripts Disponíveis

```bash
# Instalação das dependências
npm install

# Execução em ambiente de desenvolvimento
npm run dev

# Verificação estática de tipos
npm run typecheck

# Lint de código
npm run lint

# Execução dos testes unitários
npm test

# Build estático para revisão e integração
npm run build
```

## Publicação na Sysotto

O endereço público previsto é `https://sites.sysotto.com/rainhadaspolpas/`, conforme o ADR 002 da Sysotto (emenda de 31/08/2026). Sites de inquilinos usam caminhos sob `sites.sysotto.com`, com resolução do slug pelo publicador compartilhado.

Este repositório mantém o frontend independente e seu artefato de revisão. O workflow executa TypeScript, lint, testes e build com `NEXT_PUBLIC_BASE_PATH=/rainhadaspolpas`; o artefato `static-out` não é publicado automaticamente. O sucesso da CI não confirma publicação nem integração com o SiteBuilder.

A disponibilização em produção depende de cadastrar o site e seu slug no publicador Sysotto, validar os entitlements e integrar o layout/conteúdo ao fluxo compartilhado de publicação. Essa integração ainda não está implementada neste repositório.

Não são necessários secrets `CLOUDFLARE_API_TOKEN` ou `CLOUDFLARE_ACCOUNT_ID` neste repositório para essa CI. Não associe `sites.sysotto.com` a um projeto Pages exclusivo deste cliente: o host é compartilhado pelos sites dos inquilinos. DNS, TLS, autenticação e roteamento permanecem sob a infraestrutura central da Sysotto.

Para reproduzir o build de revisão:

```bash
NEXT_PUBLIC_SITE_URL=https://sites.sysotto.com/rainhadaspolpas NEXT_PUBLIC_BASE_PATH=/rainhadaspolpas npm run build
```

## 🛡️ Conformidade & Copyright

© 2026 Rainha das Polpas. Todos os direitos reservados. Desenvolvido por [Sysotto Softwares](https://sysotto.com).
