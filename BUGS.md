# BUGS

Problemas conhecidos em `index.html`, verificados por leitura do código. Nenhum foi corrigido ainda. Ordem: impacto no usuário primeiro, armadilhas latentes depois.

## Visíveis para o usuário

- **A leitura contextual da modalidade não aparece na tela de resultado, só no PDF.**
  - *Motivo:* regressão do commit `f6e7018` ("simplifica tela e refina PDF"), que enxugou `showResult` e removeu o bloco que renderizava `contextualReading()`. A função continua existindo e é consumida por `downloadPDF`. Havia um teste cobrindo isso, e ele falhava desde então (a suíte foi removida em `eb77e07`).
  - *Solução:* decidir o produto primeiro. Se a leitura deve voltar à tela, chamar `contextualReading()` em `showResult` e renderizar `hook`, `text`, `flagInvitation` e `safeguard` numa `result-section` antes do CTA. Se a remoção foi intencional, nada a fazer — só registrar aqui.

- **O rótulo do botão de download muda depois do primeiro PDF.**
  - *Motivo:* o botão nasce como `⤓ Baixar PDF do resultado` no HTML, mas o final de `downloadPDF` restaura o texto como `⤓ Baixar PDF do mapeamento`. Duas strings diferentes para o mesmo botão.
  - *Solução:* ler o texto original antes de trocar por `⏳ Gerando PDF…` e restaurá-lo, ou igualar as duas strings.

- **Voltar uma pergunta apaga a resposta e a tela volta em branco.**
  - *Motivo:* `goBack` faz `delete answers[current - 1]` para manter `scores` e `evidenceMax` consistentes, e `renderQuestion` não tem estado visual de opção escolhida — não existe `.opt.selected`. O usuário volta, não vê o que tinha marcado e precisa responder de novo.
  - *Solução:* parar de deletar a resposta em `goBack` (o `selectAnswer` já reverte a pontuação anterior antes de aplicar a nova) e marcar `.selected` na opção correspondente a `answers[current]` dentro de `renderQuestion`. O `:hover` novo, se houver, vai dentro do bloco `@media (hover: hover)`.

- **A barra de fator do PDF tem a ponta esquerda quadrada e a direita arredondada.**
  - *Motivo:* em `factorBar`, o degradê é desenhado com `doc.rect` (cantos retos) por cima da `roundedRect` laranja, começando exatamente em `M`. Só a ponta direita recebe uma tampa arredondada depois.
  - *Solução:* desenhar o degradê com `clip()` sobre a barra arredondada, ou aplicar a mesma tampa arredondada no início.

- **Sem internet, o download de PDF só mostra "Aguarde o carregamento e tente novamente".**
  - *Motivo:* jsPDF vem de CDN (`cdnjs.cloudflare.com`) sem fallback nem `integrity`. A guarda no topo de `downloadPDF` detecta a ausência, mas a mensagem sugere um problema temporário de carregamento, não a falta da dependência.
  - *Solução:* mínimo, ajustar a mensagem e adicionar `integrity`/`crossorigin` ao `<script>`. Ideal para uma página offline-first: hospedar o jsPDF junto do HTML.

## Armadilhas latentes (não quebram hoje)

- **Uma flag nova numa opção contextual quebra a geração do PDF.**
  - *Motivo:* `contextualReading` faz `CONTEXTUAL_PDF_TEXT[textKey].replace(...)` sem checar a chave. Hoje as únicas flags contextuais são `resultado/compensação` e `afastamento da informação`, ambas presentes no mapa. Qualquer flag nova sem a chave correspondente vira `TypeError` e cai no `catch` do `downloadPDF` como "Erro ao gerar PDF".
  - *Solução:* dar fallback (`CONTEXTUAL_PDF_TEXT[textKey] || CONTEXTUAL_PDF_TEXT.alignment`) ou validar as chaves ao carregar.

- **Remover `factors` do perfil `equilibrado` quebra a seleção de perfil.**
  - *Motivo:* `selectProfile` filtra `Object.values(PROFILES)` por `item.factors.length === 2`, então lê `.factors` de **todos** os perfis. O `equilibrado` tem os 6 fatores só para satisfazer esse acesso — o valor em si nunca é usado. Parece campo morto e não é.
  - *Solução:* trocar o filtro por `item.factors?.length === 2` e deixar um comentário no `equilibrado`.

- **`.dim-row` é gerada no HTML e não tem regra CSS.**
  - *Motivo:* o espaçamento entre fatores vem do `gap` de `.dims-grid`; a classe sobrou como gancho sem estilo.
  - *Solução:* remover a classe do template em `showResult` ou dar-lhe uma regra, para não parecer que o estilo se perdeu.

- **A captura de leads está desligada.**
  - *Motivo:* `CAPTURE_ENDPOINT` é string vazia, então `logLead` retorna logo na primeira linha. É configuração pendente, não defeito — `TRAFFIC_SRC` (`?src=`) também só é lido ali.
  - *Solução:* colar a URL do Web App do Apps Script em `CAPTURE_ENDPOINT` quando quiser ativar.
