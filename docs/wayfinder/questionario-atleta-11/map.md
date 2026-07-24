# Mapa: Questionário do atleta com 11 perguntas contextualizadas

## Destination

Chegar a uma especificação implementável para substituir o questionário por dez perguntas fixas do arquivo de referência e uma pergunta contextual, além de recalibrar o feedback e o PDF com precisão teórica e limites educativos explícitos.

## Notes

- O rastreador deste esforço é local: `docs/wayfinder/questionario-atleta-11/`.
- Consultar `CONTEXT.md`, `pesquisa.txt`, `questionario_atletas_ptbr.txt` e o estado atual de `index.html`.
- As dez perguntas fixas são literalmente as do TXT; a pergunta contextual é sempre a pergunta 11.
- Cada modalidade direta e cada categoria alternativa recebe uma pergunta contextual única.
- Preservar os nomes dos perfis, estrutura visual do resultado e CTA existentes; recalibrar pontuação e texto quando necessário.
- O produto e o PDF são educativos, não diagnósticos ou instrumentos psicométricos validados. A base teórica orienta a precisão do texto, sem bibliografia exibida.
- A pergunta contextual entra na pontuação e recebe uma seção breve e personalizada no PDF.
- Qualquer futura alteração de elementos interativos em `index.html` deve preservar o único guard de `:hover` e incluir verificação em viewport mobile, conforme `AGENTS.md`.

## Decisions so far

<!-- As decisões fechadas apontarão para o ticket que contém seus detalhes. -->

- [Definir a matriz de pontuação das dez perguntas fixas](./issues/01-matriz-das-dez-perguntas-fixas.md) — matriz por evidência direta, fatores indeterminados quando não há dado e regra de perfil que preserva o catálogo sem tratar ambiguidade como déficit.
- [Definir as perguntas contextuais e a seção personalizada do PDF](./issues/02-perguntas-contextuais-e-secao-pdf.md) — uma Q11 por modalidade/categoria, com decisão de tarefa observável, evidência limitada a dois fatores e trecho educativo contextual no PDF.

## Not yet specified

Nenhuma neblina conhecida: o ticket 03 aberto cobre a revisão final necessária para entregar a especificação implementável.

## Out of scope

- Implementar ou publicar as mudanças em `index.html`; este mapa termina com a especificação pronta para implementação.
- Transformar o questionário em avaliação clínica, diagnóstico ou escala psicométrica validada.
