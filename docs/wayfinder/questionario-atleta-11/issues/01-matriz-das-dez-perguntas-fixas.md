# Definir a matriz de pontuação das dez perguntas fixas

Type: research
Status: resolved
Blocked by: none

## Question

Como cada alternativa das dez perguntas de `questionario_atletas_ptbr.txt` deve alimentar os fatores mentais e a seleção dos perfis existentes, sem alterar a literalidade do texto nem apresentar o resultado como instrumento validado?

A resolução deve produzir uma matriz auditável pergunta × alternativa × fator, relacionar cada eixo aos construtos em `pesquisa.txt`, identificar incompatibilidades com o algoritmo atual e propor regras determinísticas para preservar o catálogo de perfis.

## Answer

As perguntas do TXT permanecem literais e passam a usar uma matriz de evidência `2/1/0/—`: apenas respostas diretamente interpretáveis entram no numerador e no denominador; respostas ambíguas geram, quando necessário, uma flag textual, sem virar déficit. O percentual por fator é calculado somente sobre evidência selecionada, e fatores sem evidência ficam indeterminados. A regra de perfis preserva o catálogo atual, explicita desempates e impede que ausência de evidência produza “A Mente Calibrada”. A pergunta 11 poderá complementar até dois fatores, mas não decidir um perfil sozinha.

Detalhes implementáveis: [decisão da matriz e algoritmo](../research/01-decisao-matriz-e-algoritmo.md). Fundamentação e citações: [base teórica](../research/01-base-teorica-das-perguntas-fixas.md).
