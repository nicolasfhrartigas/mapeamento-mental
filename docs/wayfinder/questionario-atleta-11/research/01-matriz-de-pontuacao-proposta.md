# Matriz proposta — dez perguntas fixas

## Decisão

As dez perguntas de `questionario_atletas_ptbr.txt` entram sem alterações literais. Cada alternativa pontua de `0` a `4` apenas os fatores que ela realmente informa; `4` sempre significa uma resposta **mais funcional/adaptativa naquele fator**, e `0` uma resposta de atenção. A pontuação é uma heurística educativa: não calcula escore de instrumento validado nem estabelece diagnóstico.

## Significado operacional dos fatores

| Chave | Fator exibido | Leitura de 4 pontos |
| --- | --- | --- |
| `perf` | Perfeccionismo e autocrítica | Exigência orientada a aprendizado, sem condenação global pelo erro. |
| `motiv` | Motivação: o que te move | Engajamento autônomo e sustentável, não dependente apenas de pressão ou hábito. |
| `reg` | Autorregulação emocional | Resposta ativa e flexível à pressão, ao erro e à recuperação. |
| `medo` | Medo do fracasso | Capacidade de encarar a possibilidade de falhar sem a deixar dirigir a escolha. |
| `ident` | Identidade atlética | Esporte integrado à vida, sem exclusividade que ameace o senso de si. |
| `sup` | Suporte e rede de apoio | Acesso e uso de apoio emocional ou informacional relevante. |

## Matriz por pergunta e alternativa

Valores não listados recebem zero; não se deve atribuir a uma alternativa um fator que ela não expressa.

| Pergunta | A | B | C | D |
| --- | --- | --- | --- | --- |
| 1 — erro simples | `perf:0, reg:0` | `perf:2, reg:2` | `perf:4, reg:4` | `perf:1, reg:2` |
| 2 — motivo para treinar | `ident:0, motiv:1` | `motiv:4, ident:4` | `motiv:2, ident:2` | `motiv:0, ident:1` |
| 3 — momento decisivo | `reg:4, medo:3` | `reg:0, medo:0` | `reg:4, medo:3` | `reg:1, medo:2` |
| 4 — imaginar fracasso | `medo:0` | `medo:0, perf:0` | `medo:4, reg:3, perf:4` | `medo:2, reg:1` |
| 5 — afastamento por lesão | `ident:0` | `ident:4, reg:3` | `ident:1, perf:1, reg:1` | `ident:3, sup:3` |
| 6 — treino bom, não perfeito | `perf:0` | `perf:4` | `perf:1, medo:1` | `perf:2` |
| 7 — sequência ruim | `sup:0, reg:1, perf:1` | `sup:4, reg:3` | `sup:3, reg:4` | `sup:1, reg:1` |
| 8 — esporte e outras áreas | `ident:0, reg:1, motiv:1` | `ident:3, reg:3, motiv:3` | `ident:4, reg:4, motiv:4` | `motiv:0, reg:2` |
| 9 — evitar exposição | `medo:0` | `medo:0, reg:1` | `medo:4, reg:3` | `medo:4, reg:4` |
| 10 — falar do peso emocional | `sup:0` | `sup:2` | `sup:4` | `sup:1, ident:1` |

## Por que as alternativas não seguem a mesma ordem

As alternativas do TXT não são uma escala ordinal A–D. Em especial, na pergunta 3, A e C descrevem caminhos funcionais diferentes — interpretar a ativação como foco ou usar uma estratégia treinada — e recebem a mesma pontuação de autorregulação. Nas perguntas 1 e 6, D evita tanto a ruminação quanto a análise: é uma posição intermediária, não uma resposta funcional máxima. A implementação deve usar a matriz explícita, nunca o índice da alternativa.

## Compatibilidade com o algoritmo atual

1. Manter a soma por fator e o cálculo de máximo por alternativas presentes. Como as perguntas pontuam fatores distintos, o máximo precisa continuar sendo calculado a partir da própria matriz ativa.
2. Manter `pct = score / máximo do fator` e os nomes atuais dos oito perfis. A pontuação alta continua significando um recurso mais disponível; perfis de atenção são escolhidos a partir dos dois menores percentuais.
3. Tornar o desempate explícito, usando a ordem já implícita no código atual: `perf`, `motiv`, `reg`, `medo`, `ident`, `sup`. Isto evita depender da ordem de propriedades do objeto.
4. Preservar provisoriamente os limiares atuais (`>= 70`, `>= 40`, e perfil equilibrado se todos os fatores forem `>= 50`) como regras de apresentação, não como pontos de corte clínicos. O PDF e a tela não devem chamá-los de “alto”, “baixo” ou “risco” em sentido diagnóstico.
5. A pergunta 11 poderá acrescentar pontos a no máximo dois fatores já existentes. Ela deve usar a mesma convenção `0–4` e não introduzir uma sétima dimensão, para conservar os perfis.

## Leitura teórica resumida

- Perguntas 1 e 6 separam preocupação punitiva com o erro de uma exigência que gera aprendizado.
- Perguntas 3, 4 e 9 distinguem regulação, reavaliação e exposição deliberada de ansiedade, antecipação ameaçadora e esquiva.
- Perguntas 2, 5 e 8 avaliam a qualidade da motivação e o grau de integração — ou exclusividade — do esporte na identidade.
- Perguntas 7 e 10 diferenciam isolamento de suporte emocional e informacional utilizável.

As fontes e ressalvas metodológicas que sustentam essa tradução estão em [01-base-teorica-das-perguntas-fixas.md](./01-base-teorica-das-perguntas-fixas.md).
