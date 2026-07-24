# mapeamento-mental

Landing page do teste "qual é o seu tipo mental como atleta?", de Nicolas Artigas (psicólogo do esporte). Ferramenta **educativa**: 10 perguntas fixas + 1 pergunta contextual da modalidade, resultado na tela e PDF para download.

Tudo vive em `index.html` — HTML, CSS e JS num arquivo só. **Sem build, sem dependências locais, sem testes.** Para rodar, abra o arquivo no navegador (ou `python3 -m http.server` na pasta, se precisar de origem HTTP).

Únicas dependências externas: jsPDF por CDN (`<script>` no `<head>`) e Google Fonts por `@import` no topo do `<style>`.

## Mapa do arquivo

Os números de linha envelhecem — procure pelo símbolo. A ordem é estável.

| Região | Onde | O que é |
|---|---|---|
| `<style>` | ~16–784 | Tokens em `:root`, depois telas na ordem em que aparecem |
| Bloco `@media (hover: hover)` | ~715 | **Todos** os `:hover` do arquivo, sem exceção — ver regra abaixo |
| 4 telas | ~798–900 | `#s-intro`, `#s-setup`, `#s-question`, `#s-result` |
| `DIMS` | ~906 | Os 6 fatores e seus nomes de exibição |
| `PROFILES` | ~919 | Os 8 perfis do catálogo (7 pares + `equilibrado`) |
| `FIXED_QUESTIONS` | ~994 | As 10 perguntas fixas |
| `CONTEXTUAL_QUESTIONS` | ~1057 | A pergunta 11, uma por modalidade (11 chaves) |
| `DIM_INSIGHTS` | ~1082 | Texto de cada fator, nas variantes `known` / `unknown` |
| `CONTEXTUAL_PDF_TEXT`, `CONTEXTUAL_FLAG_INVITATIONS`, `FIXED_FLAG_PROMPTS` | ~1091–1113 | Textos derivados das flags das respostas |
| Estado global | ~1142 | `profile`, `scores`, `evidenceMax`, `fixedEvidenceMax`, `answers`, `current`, `ACTIVE` |
| Jornada | `startQuestions` → `renderQuestion` → `selectAnswer` / `goBack` | ~1234–1290 |
| Algoritmo | `summarizeFactor`, `factorSummary`, `selectProfile` | ~1296–1333 |
| Saídas | `showResult` (tela) e `downloadPDF` (jsPDF, desenho manual) | ~1335 e ~1404 |

## Como o resultado é calculado

1. Cada opção tem `d: { fator: pontos }`. `applyAnswer` soma `pontos` em `scores` e sempre `+2` em `evidenceMax` — só perguntas com `fixed: true` também alimentam `fixedEvidenceMax`.
2. `summarizeFactor` devolve `known` (houve evidência?) e `percent` (`scores / evidenceMax`). `d: {}` não gera evidência nenhuma: o fator fica `unknown`.
3. `selectProfile` ordena os fatores do menor `percent` para o maior e casa os **dois mais baixos** com um par do catálogo. Sem pelo menos 2 fatores com evidência nas perguntas *fixas*, devolve um perfil `partial` — a pergunta contextual sozinha nunca escolhe um perfil.
4. `showResult` e `downloadPDF` consomem o mesmo `factorSummary`. **Se mudar o texto de um, mude do outro** — eles já divergiram antes.

## Regras que já foram violadas neste arquivo

**Todo `:hover` de elemento interativo fica dentro do único bloco `@media (hover: hover) and (pointer: fine)`.** Em tela touch não existe `mouseleave`: um `:hover` fora do bloco "gruda" depois do toque e o elemento fica com cara de selecionado. Isso já regrediu duas vezes, sempre em reescrita grande do `<style>`. Antes de fechar qualquer edição de CSS:

```
grep -n ":hover" index.html
```

Toda linha que aparecer tem que estar indentada dentro daquele bloco. Estado "selecionado" é `.chip.selected`, nunca `:hover`.

**Testar em viewport mobile antes de dar como pronto.** Não há suíte automatizada. Para mudanças em elementos clicáveis, confira em device mode que nada fica grudado em hover e que nenhuma área de toque se sobrepõe.

**O catálogo tem acoplamentos estruturais.** `selectProfile` percorre `Object.values(PROFILES)` lendo `item.factors.length` — todo perfil precisa do campo `factors`, inclusive o `equilibrado`, que não é um par.
