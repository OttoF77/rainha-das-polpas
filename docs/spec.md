# Especificação Normativa — Rainha das Polpas

ID: `SPEC-RP-001`. Estado: **aceito**. Módulo: `Rainha das Polpas (Storefront D2C)`.

Este documento estabelece os requisitos normativos do storefront da Rainha das Polpas. Cada requisito possui um identificador estável no padrão `RP-{NNN}` e critérios de aceite verificáveis por testes automatizados.

---

## Requisitos do Módulo

### RP-001 — Catálogo Oficial dos 13 Sabores de Polpas
O storefront DEVE exibir o catálogo dos 13 sabores oficiais da Rainha das Polpas (Abacaxi, Acerola, Cajá, Caju, Goiaba, Graviola, Manga, Mangaba, Maracujá, Morango, Seriguela, Tamarindo e Uva). O sabor Mangaba DEVE conter contextualização do cerrado/nordeste e nome científico *Hancornia speciosa*. A busca DEVE ser insensível a maiúsculas/minúsculas e acentos diacríticos. Filtros combinados por tags e benefícios DEVEM permitir refinamento instantâneo.

- **Aceite**: Testes em `tests/products.test.mjs` e `tests/storefront.test.tsx` validam a presença integral dos 13 sabores, busca sem acentos, filtragem por tags e ausência de imagens de bancos não homologados (ex: AdobeStock).
- **Referências Globais**: `DOC-MOD-001` § 2; `IND-001`.

---

### RP-002 — Modal de Detalhes Nutricionais e Controle de Quantidade
Ao acionar um produto no catálogo, o storefront DEVE abrir um modal acessível (`<dialog>` nativo ou `role="dialog"`) exibindo tabela de composição nutricional, conservação, benefícios à saúde e seletor numérico de quantidade. O seletor DEVE aceitar apenas números inteiros entre 1 e 999. O foco DEVE ser contido no modal (focus trap), permitir fechamento por tecla `Esc` e devolver o foco ao botão de abertura após o encerramento.

- **Aceite**: Teste em `tests/storefront.test.tsx` valida `showModal`, foco contido, fechamento via `cancel`/`Esc`, validação de quantidade e desabilitação em valores inválidos.
- **Referências Globais**: `SAL-002` (validação de unidades e itens).

---

### RP-003 — Carrinho de Compras Reativo e Drawer Lateral
O storefront DEVE manter um carrinho de compras reativo acessível por um Drawer lateral (`CartDrawer`). O carrinho DEVE permitir incremento, decremento e remoção unitária de produtos, com limite máximo de 999 unidades por produto. Se todos os itens possuírem preço, o subtotal e o total estimado DEVEM ser calculados em Real (`BRL`). Se houver itens sem preço (`unitPrice: undefined`), o valor total DEVE ser totalizado como `"Sob consulta"` e a quantidade de pacotes/unidades somada.

- **Aceite**: Testes em `tests/cart.test.ts` e `tests/storefront.test.tsx` comprovam adição, acumulação, limites (1 a 999), remoção, cálculo em centavos e modo cotação ("Sob consulta").
- **Referências Globais**: `SAL-002`.

---

### RP-004 — Persistência Local e Resiliência SSR
O estado do carrinho DEVE ser salvo em `localStorage` sob a chave versionada `rainha_das_polpas_cart_v1` (schema versão 1). Apenas o identificador (`productId`) e a quantidade (`quantity`) DEVEM ser persistidos, reconstruindo preços e dados descritivos a partir do catálogo canônico atual. Payloads corrompidos ou bloqueios de storage (modo anônimo restritivo) NÃO DEVEM quebrar a renderização inicial nem causar erros de hidratação (SSR-safe).

- **Aceite**: Testes em `tests/cart.test.ts` e `tests/storefront.test.tsx` validam desserialização com schema v1, tolerância a payload malformado e continuidade operacional mesmo com storage bloqueado.
- **Referências Globais**: `IND-009` (resiliência de cliente).

---

### RP-005 — Canal Único e Exclusivo de Atendimento
Toda comunicação pública por WhatsApp no site DEVE apontar única e exclusivamente para o canal oficial `(88) 99709-9082` (formato canônico internacional: `5588997099082`). É estritamente proibida a presença de qualquer outro número telefônico no código ou links de atendimento.

- **Aceite**: Testes em `tests/components-contract.test.mjs` e `tests/whatsapp.test.ts` garantem a presença do canal canônico em Navbar, Hero, Footer, Botão Flutuante e ausência de números desconhecidos.
- **Referências Globais**: `DOC-MOD-001`; `IND-005`.

---

### RP-006 — Checkout Estruturado via WhatsApp com Código de Protocolo
O encerramento do pedido no `CartDrawer` DEVE gerar uma mensagem estruturada contendo:
1. Saudação e identificador curto de referência (`#RP-XXXX`);
2. Lista numerada/bullet com quantidades, sabores, unidades (`100g`/`1kg`) e subtotais (ou "Sob consulta");
3. Resumo com total de pacotes e valor total estimado;
4. Bloco opcional de dados do cliente (Nome, Modalidade `Entrega` ou `Retirada`, Bairro/Endereço, Pagamento `Pix`, `Cartão` ou `Dinheiro`, e Observações).
A mensagem DEVE ser sanitizada contra caracteres de controle, normalizada em `\n`, ter tamanho máximo limitado a 1.800 caracteres e ser codificada com `encodeURIComponent`.

- **Aceite**: Testes em `tests/whatsapp.test.ts` validam 100% da formatação com preços, modo sob consulta, campos opcionais, sanitização de controle e limite seguro de 1.800 caracteres.
- **Referências Globais**: `SAL-002`.

---

### RP-007 — Prevenção de Perda de Carrinho e Fallback de Clipboard
Ao clicar em `"Finalizar Pedido no WhatsApp"`, os itens do carrinho NÃO DEVEM ser apagados imediatamente, permitindo que o cliente mantenha sua seleção caso feche a aba sem enviar a mensagem. O drawer DEVE oferecer um botão secundário acessível `"Copiar Pedido"` como fallback caso bloqueadores de pop-up impeçam a abertura da janela do WhatsApp.

- **Aceite**: Testes em `tests/whatsapp.test.ts` e `tests/storefront.test.tsx` comprovam a permanência dos itens e a existência do botão secundário de cópia via Clipboard API.
- **Referências Globais**: `DOC-MOD-001` (usabilidade e tolerância a falhas).

---

### RP-008 — Botão Flutuante de Atendimento e Acessibilidade
O storefront DEVE disponibilizar um botão flutuante de atendimento (`FloatingWhatsAppButton`) fixado no canto inferior direito (`z-40`). O componente DEVE respeitar a diretiva `prefers-reduced-motion` e ocultar-se automaticamente quando o `CartDrawer` ou o modal de detalhes do produto estiverem abertos, evitando sobreposição com os botões de ação em telas mobile.

- **Aceite**: Testes em `tests/components-contract.test.mjs` e `tests/whatsapp.test.ts` validam classes de movimento reduzido, ocultação sob modais e atributos `aria-label`.
- **Referências Globais**: `DOC-MOD-001`.

---

### RP-009 — Integração Segura com Sysotto e Resolução por Slug/Host (PROIBIDO `X-Tenant-Id`)
As portas de integração com o ecossistema Sysotto DEVEM realizar resolução pública anônima exclusivamente por `siteSlug` (`rainhadaspolpas`) ou Host validado. Em conformidade com `IND-001` e `IND-005`, chamadas públicas NUNCA devem enviar nem confiar em cabeçalho `X-Tenant-Id`. O cliente HTTP DEVE possuir timeout estrito de 3.000 ms via `AbortController` e comportamento fail-closed na escrita de leads e intenção de pedido.

- **Aceite**: Testes em `tests/sysotto-api.test.ts` comprovam a ausência do cabeçalho `X-Tenant-Id`, resolução por slug, timeout e fail-closed na escrita.
- **Referências Globais**: `IND-001`; `IND-005`; `IND-009`.

---

### RP-010 — Compatibilidade Jamstack com `IndustryCatalog_V1` e Fallback Gracioso
O storefront DEVE manter compatibilidade com o contrato canônico `IndustryCatalog_V1` do `Sysotto.Inventory`/`SiteBuilder`. Quando a API remota estiver configurada e disponível, o catálogo DEVE mesclar as informações remotas com os metadados nutricionais locais. Se a API estiver ausente ou indisponível, o site DEVE operar perfeitamente a partir do catálogo estático `src/data/products.ts` sem atrasar a renderização inicial.

- **Aceite**: Testes em `tests/sysotto-api.test.ts` validam merge de campos canônicos e fallback imediato sem interrupção de serviço.
- **Referências Globais**: `IND-001`; `DOC-MOD-001`.
