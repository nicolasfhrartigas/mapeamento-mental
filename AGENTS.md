# mapeamento-mental

Landing page single-file (`index.html`) do teste "tipo mental do atleta". Sem build step, sem framework — HTML/CSS/JS puro, hospedado como página estática (GitHub Pages). Todo o app vive em `index.html`; `questionario_atletas_ptbr.txt` é conteúdo de referência das perguntas, não é lido em runtime.

## Convenções que já foram violadas antes — não regredir

### 1. Todo `:hover` de elemento interativo vai dentro de `@media (hover: hover) and (pointer: fine)`

Em telas touch não existe `mouseleave`, então um `:hover` fora desse guard "gruda" no elemento depois do toque — ele fica com aparência de selecionado/hover até o usuário tocar em outro lugar. Isso já foi corrigido uma vez (commit que adicionou o guard) e depois **regrediu silenciosamente** num rewrite de tema/paleta que reescreveu o `<style>` inteiro e recriou os seletores sem o wrapper.

Regra prática:
- Existe **um único** bloco `@media (hover: hover) and (pointer: fine) { ... }` no `<style>` do `index.html`. Todo `:hover` de chip, botão, item de lista clicável, etc. deve estar dentro dele.
- Antes de terminar qualquer edição de CSS neste arquivo, rode:
  ```
  grep -n "@media\|:hover" index.html
  ```
  Se aparecer alguma linha com `:hover` que não esteja indentada dentro do bloco `@media (hover: hover)...`, é regressão — mover para dentro do bloco.
- Isso vale mesmo para elementos novos (ex.: um dropdown de busca adicionado depois já nasceu com dois `:hover` soltos, fora do bloco, reintroduzindo o bug).
- **Não** use `:hover` para o único indicador de estado "selecionado" (isso já é tratado por classes como `.chip.selected`, `.sport-result.active`) — hover é só feedback visual de passar o mouse, e só existe onde há mouse de verdade.

### 2. Rewrites grandes de `<style>` (troca de paleta/tema) são o ponto onde regressões multiplataforma entram

Quando pedirem para trocar cores/tema/fontes do zero, é fácil recriar seletores por cima do que existia e perder guards como o acima (que não são óbvios lendo o resultado final — só aparecem comparando com o histórico). Depois de um rewrite de `<style>`:
- Rode o grep do item 1.
- Compare a lista de seletores `:hover`/`:focus`/`:active` antes e depois do rewrite (`git diff` ou `git log -p -- index.html` em busca de `@media (hover`) para garantir que nenhum guard foi perdido.

### 3. Testar em viewport mobile antes de dar como pronto

Não há suíte de testes neste projeto. Para qualquer mudança em `index.html` que toque em elementos clicáveis/toques (chips, botões, dropdowns, formulários), abra em viewport mobile (DevTools device mode ou dispositivo real) e confirme:
- Nenhum elemento fica "grudado" em estado hover depois de tocar.
- Áreas de toque (`sport-search-arrow` e afins) continuam clicáveis sem sobrepor outros elementos.
