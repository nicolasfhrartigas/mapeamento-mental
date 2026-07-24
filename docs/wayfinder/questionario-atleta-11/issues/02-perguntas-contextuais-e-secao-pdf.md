# Definir as perguntas contextuais e a seção personalizada do PDF

Type: research
Status: resolved
Blocked by: none

## Question

Qual pergunta única, com alternativas e efeitos de pontuação, deve ser usada como pergunta 11 para cada modalidade direta e categoria alternativa do menu; e qual texto educativo personalizado deve chegar ao PDF a partir dessa resposta?

A resolução deve cobrir Fisiculturismo, Futebol, Corrida/Atletismo, Vôlei, Tênis, Esportes Coletivos, Esporte de Resistência, Esportes de Luta, Esportes de Raquete, Esportes de Habilidades e Mira e E-sports. Deve também decidir um formato consistente de alternativas e explicitar como cada resposta compõe os fatores mentais sem duplicar indevidamente as dez perguntas fixas.

## Answer

A pergunta 11 será uma única pergunta contextual, apresentada após as dez perguntas fixas literais do TXT. Há uma versão para cada uma das cinco modalidades diretas e seis categorias alternativas: Fisiculturismo, Futebol, Corrida/Atletismo, Vôlei, Tênis, Esportes Coletivos, Esporte de Resistência, Esportes de Luta, Esportes de Raquete, Esportes de Habilidades e Mira e E-sports.

Todas usam uma situação de tarefa própria da modalidade e pedem a **próxima decisão observável**, em vez de repetir perguntas sobre erro, medo, lesão, apoio ou identidade já cobertas pelas dez fixas. As quatro alternativas seguem o mesmo desenho: (A) referência de processo, `reg:2`; (B) urgência de resultado/compensação, `reg:0` e uma *flag* textual; (C) afastamento da informação, `—` e uma *flag* textual; e (D) alinhamento verificável, `reg:1` e `sup:1` apenas nas modalidades cuja pergunta descreve interlocução de equipe ou *corner*. Só as evidências diretas entram no denominador, conforme a decisão do ticket 01. Assim, a Q11 acrescenta no máximo dois fatores e não pode decidir sozinha o perfil.

O PDF recebe uma seção curta “Ponto de atenção da sua modalidade”: gancho específico da modalidade mais um bloco correspondente à alternativa escolhida. Os textos convidam a observar um sinal controlável, um critério combinado ou a utilidade de uma pausa, sem exibir escores, bibliografia, diagnóstico, promessa de desempenho ou prescrição técnica/médica. Fisiculturismo recebe uma salvaguarda adicional quando a resposta tratar de compensar ou evitar avaliações físicas; sofrimento persistente, isolamento ou prejuízo fora do esporte deve orientar busca de apoio profissional.

A matriz completa — perguntas e alternativas literais, efeitos por alternativa, textos prontos para o PDF, fontes de contexto e limites de implementação — está em [02 — pergunta contextual e PDF](../research/02-pergunta-contextual-e-pdf.md).
