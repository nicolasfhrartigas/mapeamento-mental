# 02 — Publicar a jornada de Fisiculturismo com feedback educativo

**What to build:** Uma pessoa que selecionar Fisiculturismo responde às dez perguntas fixas e à sua única pergunta contextual, recebe um perfil mental como leitura educativa das respostas de hoje e pode baixar um PDF coerente com essa leitura.

Type: task
Status: resolved
Blocked by: 01 — Preparar o modelo de evidência do questionário contextual.

- [x] A jornada de Fisiculturismo contém exatamente onze perguntas: as dez fixas literais e a Q11 aprovada para avaliação física/apresentação.
- [x] O perfil é selecionado apenas por fatores com evidência suficiente; a Q11 não consegue escolher um perfil sozinha e ausência de evidência não produz “A Mente Calibrada”.
- [x] A tela conserva os nomes de perfil, a estrutura visual e o CTA, mas usa linguagem situada, não diagnóstica e sem projeções de desempenho, sofrimento ou carreira.
- [x] O PDF não mostra escores, percentuais ou rótulos clínicos e inclui uma única seção “Ponto de atenção da sua modalidade” com o gancho, a resposta contextual e a salvaguarda aplicável.

## Answer

A jornada já estava implementada no estado atual de `index.html`. A seleção de Fisiculturismo
compõe as dez perguntas fixas com a Q11 de avaliação física/apresentação, totalizando 11; a Q11
só acrescenta evidência para `reg` e, em uma alternativa de alinhamento com equipe, `sup`.
`selectProfile` exige evidência nas perguntas fixas, portanto a Q11 não escolhe um perfil sozinha
e uma ausência de evidência não gera “A Mente Calibrada”.

O resultado preserva os nomes, a estrutura e o CTA, mas apresenta leitura educativa e situada.
O PDF exibe uma única seção “Ponto de atenção da sua modalidade”, com gancho e resposta da Q11,
sem escores ou percentuais; as alternativas de compensação e afastamento em Fisiculturismo
incluem a salvaguarda para sofrimento relacionado a corpo, comida, peso ou treino.

Verificações executadas: comparação literal das dez perguntas e 40 alternativas contra o arquivo
de referência atual, sintaxe/carregamento do script no Node e oito asserções de jornada, incluindo
contagem de perguntas, limite de fatores da Q11, isolamento da Q11 na seleção de perfil e as duas
variantes da seção contextual do PDF.
