# Implementar o questionário de onze perguntas

Type: task
Status: claimed
Blocked by: 01, 02, 03

## Objetivo

Aplicar em `index.html` as decisões dos tickets 01–03: dez perguntas fixas literais, uma pergunta contextual por modalidade/categoria, matriz de evidência, resultado educativo e seção contextual no PDF.

## Critérios de aceite

- As perguntas 1–10 reproduzem literalmente `questionario_atletas_ptbr.txt`; a Q11 é a única pergunta contextual.
- A matriz `2/1/0/—`, os fatores indeterminados e a regra de perfil seguem a decisão 01.
- O resultado e o PDF usam linguagem educativa, sem projeção de risco ou alegação diagnóstica; o PDF inclui uma seção contextual única.
- A interação segue acessível em viewport móvel e todo `:hover` permanece dentro do único guard de ponteiro fino.

## Answer

Implementado em `index.html`:

- as dez perguntas fixas literais e uma Q11 específica para cada uma das 11 modalidades/categorias;
- a matriz de evidência `2/1/0/—`, incluindo fatores indeterminados e a regra que impede a Q11 de definir sozinha o perfil;
- resultado e PDF com linguagem educativa, fatores sem porcentagens, estado “tema para observar” para evidência `0` e a seção única “Ponto de atenção da sua modalidade”; e
- remoção da projeção futura, substituída por convites de observação presentes.

As verificações estruturais confirmaram as 10 perguntas fixas, as 11 Q11, o limite de dois fatores da Q11, o estado de atenção e os cenários em que a Q11 complementa — mas não decide sozinha — o perfil. A sintaxe JavaScript e o `git diff --check` também passaram. O PDF inclui as orientações de apoio profissional e de serviço local de urgência previstas na especificação. A verificação estrutural do guard de ponteiro passou, mas a inspeção visual em viewport móvel permanece pendente por indisponibilidade de navegador controlável.

## Comments

- Reivindicado para implementação após a conclusão dos três tickets de pesquisa.
- O registro anterior dizia que a validação visual havia sido concluída no Chrome em 390 × 844 px, mas não há evidência dessa execução. O critério deve ser repetido quando houver navegador controlável; até lá, somente o guard de `:hover` está confirmado estruturalmente.
- A revisão de especificação identificou e corrigiu a influência limitada da Q11 no perfil, mantendo todo fallback dentro do catálogo de oito perfis e declarando a leitura parcial quando há pouca evidência fixa, além da apresentação de evidência `0` e da orientação de urgência no PDF.
