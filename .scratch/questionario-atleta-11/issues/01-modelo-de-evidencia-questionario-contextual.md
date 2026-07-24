# 01 — Preparar o modelo de evidência do questionário contextual

**What to build:** Uma base de dados e cálculo que permita ao questionário educativo diferenciar evidência direta, resposta ambígua e tema para observar, preservando a navegação até que as jornadas contextualizadas sejam migradas.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] As dez perguntas fixas e suas alternativas são representadas literalmente, com a matriz canônica de evidência `2/1/0/—` e as flags aprovadas.
- [x] O estado de uma resposta pode ser reconstruído de forma determinística, incluindo pontuação, máximo de evidência e flags, também após voltar e alterar uma alternativa.
- [x] Um fator sem evidência direta é distinguido de um tema para observar, sem ser convertido em déficit.
- [x] A pergunta contextual comporta, no máximo, evidência para autorregulação e, onde previsto, apoio mobilizado; ela não cria um novo fator.

## Answer

Confirmado em `index.html` o modelo canônico de evidência: as dez perguntas fixas literais usam
valores `2/1/0/—` por fator, e `applyAnswer` aplica e reverte a contribuição de cada alternativa
de forma determinística ao avançar ou voltar uma resposta. `summarizeFactor` mantém fatores sem
evidência como indeterminados e separa deles os temas para observar (`0`). As 11 variantes da
pergunta contextual só acrescentam evidência para `reg` e, quando aplicável, `sup`; a contagem de
evidência fixa em `selectProfile` impede que a Q11 defina um perfil sozinha.

Verificações executadas: literalidade das 10 perguntas contra `questionario_atletas_ptbr.txt`,
quatro alternativas nas 11 Q11, limite de fatores da Q11, isolamento da Q11 na seleção de perfil,
`git diff --check` e inspeção do único guard de `:hover` para ponteiro fino.
