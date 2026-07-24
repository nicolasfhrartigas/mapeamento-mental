# 05 — Validar jornadas e saídas contextualizadas

**What to build:** Todas as pessoas usuárias recebem uma jornada consistente de onze perguntas e uma saída educativa correta, independentemente de escolherem uma modalidade direta ou uma categoria alternativa.

Type: task

**Blocked by:** 03 — Estender a pergunta 11 às modalidades diretas; 04 — Atender categorias alternativas com pergunta 11.

**Status:** resolved

- [x] As onze rotas de modalidade/categoria são verificadas: cada uma contém as dez perguntas fixas literais, uma única Q11 correta e nenhum resquício do questionário anterior.
- [x] Casos sintéticos cobrem evidência completa, fatores indeterminados, resposta contextual ambígua, alteração de resposta e a regra que impede Q11 de decidir o perfil.
- [x] As telas e PDFs são revisados contra os limites educativos: sem diagnóstico, previsão, causalidade, promessa de desempenho, escore exibido ou linguagem de triagem.
- [x] Metadados e mensagens auxiliares refletem onze perguntas e a ferramenta educativa de autoconhecimento.
- [x] Em viewport mobile, os controles continuam tocáveis e nenhum `:hover` interativo fica fora do único guard de ponteiro fino.

## Answer

Adicionada a cobertura `tests/contextual-journey-validation.test.js`, que valida as 11
jornadas contra as 10 perguntas literais do TXT, a Q11 específica e o reinício limpo
entre seleções. Os casos sintéticos cobrem evidência completa, fator indeterminado,
alternativa contextual ambígua, alteração de resposta e a impossibilidade de a Q11
escolher um perfil sozinha.

Também foram removidos os dados legados, não utilizados, que ainda continham linguagem
de projeção de risco. A cobertura passa a impedir o retorno de projeção futura, de
escore exposto e de qualquer `:hover` fora do único guard de ponteiro fino.

A seleção de perfil usa exclusivamente a evidência das dez perguntas fixas; a Q11
continua enriquecendo os fatores e sua leitura aparece agora tanto na tela de resultado
quanto no PDF. As mensagens de WhatsApp e compartilhamento também passaram a declarar
o mapeamento educativo de autoconhecimento com 11 perguntas.

Verificações executadas: `node --test` (9 testes), sintaxe do JavaScript, `git diff
--check` e `grep -n "@media\|:hover" index.html`. O navegador controlável não estava
disponível nesta sessão para repetir a inspeção visual em 390 × 844 px; os controles de
toque foram verificados estruturalmente e a alteração não modificou CSS ou handlers.
