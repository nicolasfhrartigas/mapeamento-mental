# Decisão — matriz e algoritmo das perguntas fixas

## Regra de leitura

As dez perguntas entram literalmente como estão em `questionario_atletas_ptbr.txt`. A matriz é educativa, não uma escala psicométrica: `2` representa um recurso explicitamente relatado, `1` uma resposta funcional porém contextual, `0` um tema de atenção explicitamente relatado e `—` uma resposta ambígua. Uma resposta ambígua não conta como déficit nem como recurso; só pode acionar uma *flag* textual para o PDF.

Os seis fatores existentes são preservados: `perf`, `motiv`, `reg`, `medo`, `ident` e `sup`. Em todos, mais pontos significam uma resposta mais funcional **na situação perguntada**, não uma característica estável do atleta.

## Matriz canônica

| Pergunta | A | B | C | D |
| --- | --- | --- | --- | --- |
| 1 — erro simples | `perf:0, reg:0` | `reg:1` | `perf:2, reg:2` | `—` |
| 2 — motivo para treinar | `ident:0, motiv:0` | `motiv:2` | `motiv:1` + `flag: validação externa` | `motiv:0` |
| 3 — momento decisivo | `reg:2, medo:1` | `reg:0` + `flag: travamento sob pressão` | `reg:2` | `—` + `flag: estratégia a entender` |
| 4 — imaginar fracasso | `medo:0` + `flag: avaliação social` | `medo:0` + `flag: autoestima contingente` | `medo:2, reg:1` | `—` + `flag: evitação/supressão a entender` |
| 5 — afastamento por lesão | `ident:0` | `ident:2, reg:1` | `—` + `flag: pressa de retorno` | `sup:1` |
| 6 — treino bom, não perfeito | `perf:0` | `perf:2` | `perf:0` + `flag: comparação e dúvida` | `—` |
| 7 — sequência ruim | `sup:0, reg:0` | `sup:2` | `sup:2, reg:1` | `sup:0` + `flag: afastamento` |
| 8 — esporte e outras áreas | `ident:0, reg:0` | `ident:1, reg:1` | `ident:2, reg:1` | `—` |
| 9 — evitar exposição | `medo:0` | `medo:0` + `flag: justificativa/evitação percebida` | `medo:2` | `medo:1` |
| 10 — falar do peso emocional | `sup:0` | `sup:1` + `flag: apoio principalmente técnico` | `sup:2` | `sup:1` + `flag: rede restrita ao esporte` |

## Algoritmo que preserva os perfis

1. Cada alternativa selecionada acumula `points[fator]` e `evidenceMax[fator]`. Um valor `0`, `1` ou `2` acrescenta `2` ao denominador; `—` não altera numerador nem denominador.
2. O percentual é `points / evidenceMax`. Sem evidência direta, o fator é `indeterminado`, não baixo.
3. Para escolher o perfil, ordenar somente fatores conhecidos pelo percentual; em empate usar `perf`, `motiv`, `reg`, `medo`, `ident`, `sup`.
4. Um perfil de par exige dois fatores conhecidos. “A Mente Calibrada” exige seis fatores conhecidos e todos com pelo menos 50%; ausência de evidência não pode parecer equilíbrio.
5. Em caso excepcional de apenas um fator conhecido, usar o fallback existente que contém esse fator e declarar no PDF que o retrato é parcial. Esse fluxo exige teste sintético.
6. A pergunta 11 pode acrescentar evidência a até dois desses fatores e uma *flag* contextual; ela não cria fator novo nem decide sozinha o perfil.

## Limites de texto

O resultado deve dizer “suas respostas sugerem…” e “pode valer observar…”. Não deve diagnosticar, prever burnout/abandono, afirmar causalidade, nem autorizar retorno após lesão. Os limiares existentes servem apenas como convenção editorial, não ponto de corte clínico.

## Base

As fontes, o raciocínio por item e as ressalvas metodológicas estão em [01-base-teorica-das-perguntas-fixas.md](./01-base-teorica-das-perguntas-fixas.md). A versão anterior de matriz deve ser ignorada em favor deste documento.
