# mapeamento-mental

Landing page do teste "qual é o seu tipo mental como atleta?", de Nicolas Artigas (psicólogo do esporte). Ferramenta **educativa**: 10 perguntas fixas + 1 pergunta contextual da modalidade, resultado na tela e PDF para download.

`index-original.html` — HTML, CSS e JS num arquivo só — é a versão **pré-redesign**, preservada e acessível diretamente por essa URL. Não é um fallback automático; não apague nem sobrescreva. O mapa de arquivo e o `BUGS.md` abaixo se referem a ele.

'index-original.html' é legado nao precisa ser lido, editado, modificado.

`index.html` é o roteador do redesign: detecta o dispositivo no carregamento e injeta `src/web.dc.html` ou `src/mobile.dc.html` num iframe de página inteira. Ao mergear `dev` em `main`, o GitHub Pages publicará esse novo `index.html` e, portanto, o redesign.

### Como `index.html` decide a versão

1. Detecção automática ao carregar: `mobile` se a largura ≤ 820px, ou se o ponteiro for `coarse` (touch) e a largura ≤ 1180px; `web` nos demais casos.
2. Redimensionar a janela depois não troca de versão — só um novo carregamento decide de novo.
3. Override manual via query string, persistido em `localStorage`: `?view=web`, `?view=mobile`, `?view=auto` (volta à detecção automática).
4. A escolha vira o `src` de um `<iframe>` full-page — não fetch+injeção, porque `support.js` depende de `location.pathname` do próprio documento para resolver os imports relativos (`./quiz-engine.js` etc.) e isso só funciona se o `.dc.html` carregar na sua própria URL.

Para testar localmente: `python3 -m http.server` na raiz do repo (não abre com `file://`, veja abaixo o motivo) e acesse `http://localhost:8000/index.html`.

## Redesign: `src/` (web + mobile)

O redesign vive em `src/`, como fonte editável — não em arquivos compactados:

| Arquivo | Papel |
|---|---|
| `src/web.dc.html` | Fonte da tela web/desktop (layout 2 colunas) |
| `src/mobile.dc.html` | Fonte da tela mobile |
| `src/quiz-engine.js` | Lógica: perguntas, scoring, monta os dados do relatório — igual nas duas telas |
| `src/quiz-flow.js` | Fluxo compartilhado de setup, seleção, navegação do quiz, reinício e fechamento do seletor “Outros esportes”; as diferenças de layout continuam nos HTMLs |
| `src/analytics.js` | Integração com Umami Cloud: pageviews, atribuição da landing e eventos do funil |
| `src/pdf-report.js` | Só o desenho do PDF (jsPDF); recebe os dados já prontos do `quiz-engine.js` |
| `src/support.js` | Runtime do Design Component (React/Babel via CDN + interpretador de `{{ }}`, `<sc-if>`, `<sc-for>`). **Gerado, não editar à mão** — primeira linha do arquivo diz de onde vem. |

Os `.dc.html` usam um formato declarativo (bindings `{{ var }}`, `<sc-if>`, `<sc-for>`) interpretado pelo `support.js` em runtime — não é HTML puro, não abre "funcionando 100%" só com duplo clique sem servidor (o `import()` do `quiz-engine.js` exige origem HTTP).

Dependências externas: jsPDF, React, ReactDOM e Babel por CDN, Google Fonts e,
quando o analytics está ativado, o tracker do Umami Cloud.

## Estatísticas com Umami

O tracker já está integrado às telas web e mobile, mas fica desativado enquanto
`WEBSITE_ID` em `src/analytics.js` contiver o placeholder. Para ativar:

1. No Umami Cloud, abra **Settings → Websites**, crie/edite o site e copie o
   **Website ID** (UUID).
2. Substitua `COLE-AQUI-O-WEBSITE-ID` no início de `src/analytics.js`.
3. Publique a página e confirme no DevTools que `cloud.umami.is/script.js` e a
   requisição de coleta carregam sem erro. Em `localhost`, o tracker permanece
   desativado de propósito.

Como o quiz vive em um iframe, `index.html` repassa a URL e o referrer da landing
para o tracker. Os acessos aparecem com a URL pública correta, e a tag do Umami
permite filtrar `web` e `mobile`.

Eventos disponíveis para análise de funil:

| Evento | Momento |
|---|---|
| `setup-aberto` | saída da introdução |
| `perfil-preenchido` | escolha de esporte, nível ou objetivo |
| `setup-incompleto` | tentativa de avançar com campo ausente |
| `quiz-iniciado` | início das perguntas |
| `pergunta-respondida` | primeira resposta de cada uma das 11 etapas |
| `quiz-concluido` | resultado calculado |
| `pdf-solicitado` | clique para gerar o PDF |
| `quiz-reiniciado` | reinício após o resultado |
| `quiz-abandonado` | retorno da primeira pergunta para o setup |

Nenhum nome, resposta, escolha de perfil ou perfil psicológico resultante é
enviado. Os eventos registram somente etapas da interface, campos interagidos,
número da pergunta e a variante web/mobile.

## Mapa do arquivo (`index-original.html`, versão legada)

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
rg -n ":hover" src/web.dc.html src/mobile.dc.html
```

Toda linha que aparecer tem que estar indentada dentro daquele bloco. Estado "selecionado" é `.chip.selected`, nunca `:hover`.

**Testar em viewport mobile antes de dar como pronto.** Rode `node --test tests/*.test.js`; a suíte cobre o motor, o fluxo compartilhado e a proteção de hover. Para mudanças em elementos clicáveis, também confira em device mode que nada fica grudado em hover e que nenhuma área de toque se sobrepõe.

**O catálogo tem acoplamentos estruturais.** `selectProfile` percorre `Object.values(PROFILES)` lendo `item.factors.length` — todo perfil precisa do campo `factors`, inclusive o `equilibrado`, que não é um par.
