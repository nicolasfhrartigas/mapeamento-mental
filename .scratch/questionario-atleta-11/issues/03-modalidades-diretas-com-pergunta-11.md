# 03 — Estender a pergunta 11 às modalidades diretas

**What to build:** Uma pessoa que selecionar Futebol, Corrida/Atletismo, Vôlei ou Tênis recebe a mesma jornada educativa de onze perguntas, terminando na pergunta contextual específica de sua modalidade e no trecho correspondente do PDF.

**Blocked by:** 02 — Publicar a jornada de Fisiculturismo com feedback educativo.

**Status:** resolved

- [x] Cada uma das quatro modalidades diretas apresenta suas dez perguntas fixas literais e somente a respectiva Q11 aprovada.
- [x] As alternativas contextuais acumulam evidência e flags exatamente como decidido, sem inferir suporte emocional a partir de comunicação de tarefa.
- [x] O PDF de cada modalidade apresenta o gancho e o bloco da alternativa selecionada, sem bibliografia visível, escores ou jargão psicométrico.
- [x] Trocar de modalidade antes de iniciar o questionário não deixa dados, rótulos ou pergunta contextual da seleção anterior.

## Answer

As jornadas de Futebol, Corrida/Atletismo, Vôlei e Tênis já são compostas no
início do questionário por `FIXED_QUESTIONS` mais exclusivamente a Q11 da
modalidade selecionada. As Q11 conservam a matriz aprovada: referência de
processo (`reg:2`), resultado/compensação (`reg:0` e flag), afastamento da
informação (somente flag) e alinhamento verificável (`reg:1`, com `sup:1`
apenas em Futebol e Vôlei). O PDF usa o gancho e o bloco associados à resposta
contextual, sem expor bibliografia ou escores.

Foi adicionada a cobertura em `tests/contextual-direct-modalities.test.js`,
que valida as quatro composições, a matriz e o isolamento da seleção antes do
início. Verificações executadas: `node --test`, sintaxe do teste e do script
da página, `git diff --check` e inspeção do único guard de `:hover`. A
automação de navegador não estava disponível neste ambiente para a inspeção
visual em viewport mobile.
