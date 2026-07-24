# Revisão do feedback e do PDF: limites educativos e texto implementável

**Escopo.** Esta nota revisa o conteúdo hoje exibido em `index.html` à luz da matriz decidida no ticket 01 e da Q11 decidida no ticket 02. Os perfis, a estrutura visual e o CTA permanecem; muda a promessa do texto. O resultado organiza respostas situadas de hoje — não mede escalas, não estima risco clínico e não prevê a trajetória do atleta.

## Decisão editorial

Usar nomes de perfil como linguagem editorial, sempre acompanhados por este enunciado, na tela e no PDF:

> **Este resultado organiza tendências que apareceram nas suas respostas de hoje. Ele é educativo, não é diagnóstico nem avaliação psicológica formal, e não define quem você é.**

Trocar formulações categóricas por observações condicionais:

| Evitar | Usar |
| --- | --- |
| “você é/tem”, “seu sistema”, “sua trajetória” | “nas suas respostas apareceu…”, “nesta situação você descreveu…”, “pode valer observar…” |
| “vai levar a”, “prediz”, “a trajetória mais comum é”, “resulta em abandono/colapso/burnout” | “isso pode merecer atenção se estiver se repetindo ou trazendo sofrimento/prejuízo” |
| “ponto de ruptura”, “alto risco”, “perfil mais associado”, “padrão-ouro”, “menos comum” | remover; o quiz não tem validade preditiva, norma ou prevalência |
| “só/raramente”, “todos”, “a única forma”, promessas de desempenho | proposta concreta e opcional: “experimente observar…”, “se fizer sentido, converse com…” |

Essa contenção é necessária porque os itens são cenários de escolha forçada, não preservam a estrutura, precisão, normas ou validade preditiva de Sport-MPS-2, AIMS, PFAI, ACSI-28 ou SMS-II. A matriz também determina que ambiguidade não vira déficit e que fatores sem evidência ficam indeterminados. [Base teórica do ticket 01](./01-base-teorica-das-perguntas-fixas.md#por-que-as-interpretações-são-deliberadamente-cautelosas); [decisão de matriz](./01-decisao-matriz-e-algoritmo.md#limites-de-texto).

## Fatores mentais: o que trocar

Os atuais textos `DIM_INSIGHTS` chamam percentuais editoriais de “boa autorregulação”, “motivação intrínseca forte”, “perfeccionismo elevado” e “rede de suporte ativa”. Isso extrapola: uma alternativa isolada não classifica uma regulação motivacional, uma identidade ou um tipo de apoio; apoio técnico/informacional tampouco equivale a apoio emocional. [Pelletier et al., 2013](https://doi.org/10.1016/j.psychsport.2012.12.002); [Rees & Hardy, 2000](https://doi.org/10.1123/TSP.14.4.327).

Implementar as regras abaixo tanto nos cards da tela quanto no PDF. O percentual pode servir internamente à seleção editorial, mas não deve aparecer como medida psicológica nem receber rótulos clínicos.

| Fator atual | Nome/alcance apresentado ao atleta | Texto por evidência direta | Texto quando não há evidência suficiente |
| --- | --- | --- | --- |
| `perf` | **Processamento do erro e padrões** | “Nas suas respostas, apareceram maneiras de lidar com erro e com a própria régua de desempenho. Pode valer observar o que ajuda a transformar revisão em ajuste, sem transformar um resultado em julgamento pessoal.” | “As respostas não trazem evidência suficiente para concluir como você lida com erro e padrões. Vale observar isso em treinos e competições.” |
| `motiv` | **O que sustenta sua prática hoje** | “Apareceram pistas sobre o que sustenta sua prática neste momento. Pode valer notar como interesse pessoal, metas, reconhecimento e rotina participam dessa escolha.” | “As respostas não permitem concluir o que mais sustenta sua prática hoje.” |
| `reg` | **Estratégias sob pressão** | “Você descreveu recursos ou dificuldades em momentos de demanda. Observe quais sinais e estratégias ajudam você a escolher a próxima ação.” | “Não há evidência suficiente, neste resultado, para resumir suas estratégias sob pressão.” |
| `medo` | **Relação com a possibilidade de falhar** | “Suas respostas indicaram como a possibilidade de falhar entra em decisões de exposição e preparo. Pode valer diferenciar cuidado estratégico de afastamento por receio.” | “As respostas não distinguem com clareza como a possibilidade de falhar entra nas suas decisões.” |
| `ident` | **Lugar do esporte entre outras áreas da vida** | “Apareceram pistas sobre como o esporte se articula com outras áreas da sua vida. Pode valer observar onde há flexibilidade e onde o equilíbrio fica mais difícil.” | “As respostas não trazem evidência suficiente sobre a integração do esporte a outras áreas da vida.” |
| `sup` | **Apoio que você mobiliza** | “Você descreveu formas de buscar ou usar apoio. Pode valer identificar de que tipo de apoio precisa em cada situação: técnico, prático, emocional ou de estima.” | “As respostas não permitem resumir a disponibilidade ou o uso de apoio.” |

Para evidência direta de atenção (`0` no denominador), usar “tema para observar”, nunca “comprometido”, “alto/baixo”, “déficit”, “subutilizado” ou “sozinho”. Para `—`, mostrar somente a variante “evidência insuficiente”. Isso aplica a regra `2/1/0/—` e evita que a ausência de dado seja apresentada como fraqueza. [Decisão de matriz](./01-decisao-matriz-e-algoritmo.md#decisão-de-pontuação); [Gotwals & Dunn, 2009](https://doi.org/10.1080/10913670902812663); [Brewer, 1993](https://doi.org/10.1111/j.1467-6494.1993.tb00284.x).

## Perfis, forças, atenção e desenvolvimento

1. **Preservar os oito nomes e a composição visual atual**, mas abrir cada narrativa com “Este perfil é uma forma educativa de organizar as respostas de hoje; ele não descreve uma identidade fixa.” Nenhum perfil pode ser escolhido por Q11 ou por uma resposta ambígua; a pergunta contextual apenas acrescenta evidência limitada, conforme a decisão 01.
2. **Reescrever todos os parágrafos de `narrative`, `forces`, `vulns`, `developments` e `cta`** para se ater a ações/relatos que a matriz realmente captura. Não atribuir sono, relações, lesões, intensidade, talento, “potencial”, adesão, isolamento persistente ou desempenho futuro sem pergunta direta.
3. **Manter “O que joga a seu favor” e “O que merece atenção”**, com títulos descritivos e condicionais. Exemplos: “Usar o erro como informação”, “Ter uma referência de processo”, “Explorar a pressão que acompanha o resultado”, “Ampliar a conversa sobre o que pesa”. Não chamar qualquer resposta de “autonomia genuína”, “base mental equilibrada”, “risco de esgotamento” ou “alto suporte qualificado”.
4. **Substituir a seção inteira “O que tende a acontecer se nada mudar” / “Risco Futuro Sem Intervenção”** por **“O que pode valer observar agora”**. Ela deve conter no máximo dois convites ligados a evidência direta ou a `flag`, por exemplo: “Quando um erro acontece, o que você faz depois dele?”; “Em quais situações o resultado imediato passa a decidir sua próxima ação?” Não projetar burnout, abandono, platô, “colapsos”, sofrimento ou subdesempenho.
5. **Desenvolvimento não é prescrição ou garantia.** Priorizar experimentos pequenos e observáveis (“anotar uma referência de processo”, “levar uma pergunta concreta a alguém de confiança”, “conversar com a equipe de saúde sobre o plano de recuperação”), sem prometer que isso aumenta rendimento ou resolve o padrão. Em lesão, respeitar o plano de recuperação e encaminhar à equipe de saúde; o quiz não autoriza retorno nem avalia gravidade.

A distinção entre preocupação com erros e padrões pessoais não permite tratar exigência alta como problema; identidade central no esporte também não é patologia por si só. Autorregulação é situada, envolvendo planejamento, execução, monitoramento e reflexão, e não um traço imutável. [Gotwals & Dunn, 2009](https://doi.org/10.1080/10913670902812663); [Brewer, 1993](https://doi.org/10.1111/j.1467-6494.1993.tb00284.x); [Zimmerman, 2000](https://doi.org/10.1016/B978-012109890-2/50031-7); [Smith et al., 1995](https://doi.org/10.1123/jsep.17.4.379).

## PDF

### Seção contextual obrigatória

Adicionar, após os fatores e antes da leitura editorial do perfil, a seção **“Ponto de atenção da sua modalidade”** definida no ticket 02. Ela recebe, nesta ordem:

1. o gancho da modalidade/categoria;
2. o bloco pronto da alternativa A/B/C/D escolhida;
3. a `flag` contextual, somente como convite de observação;
4. a frase: “Esta resposta descreve a situação escolhida hoje, não uma qualidade fixa.”

Não mostrar bibliografia, nomes de escalas, pontuação, porcentagem, “alto/baixo”, nem inferir suporte emocional da comunicação de tarefa. A alternativa C continua indeterminada; a B não é medo do fracasso; Q11 informa no máximo `reg` e, quando o contexto permitir interlocução, `sup`. Usar literalmente os blocos aprovados no [ticket 02](./02-pergunta-contextual-e-pdf.md#texto-do-pdf-seção-ponto-de-atenção-da-sua-modalidade).

### Limpeza do conteúdo atual

| Trecho atual | Alteração requerida |
| --- | --- |
| `Fatores Mentais Rastreados`: `p2/100 · PONTO FORTE/EM CONSTRUÇÃO/PONTO DE ATENÇÃO` | Retirar o número e usar os estados de evidência acima. Os limiares são convenção editorial, não ponto de corte clínico. |
| `Leitura do Perfil`, `Forças Identificadas`, `Áreas de Atenção`, CTA | Aplicar a redação condicional desta nota; não dizer que o perfil causa, explica ou prediz desempenho, sofrimento ou carreira. |
| `Risco Futuro Sem Intervenção` / “PROJEÇÃO DE PADRÃO” | Remover e inserir “O que pode valer observar agora”. |
| Anexo: “Suas respostas abaixo já são metade de uma boa triagem.” | Trocar por: “Guarde este registro se quiser retomar suas respostas em uma conversa ou acompanhar o que muda com o tempo.” O PDF não faz triagem clínica. |
| Avisos inicial e final | Manter e harmonizar com o enunciado editorial. Acrescentar: “Se alguma situação estiver causando sofrimento importante ou prejudicando sua vida, procure apoio profissional.” Para risco imediato, orientar serviços locais de urgência. |

O consenso do COI requer leitura biopsicossocial e diferencia traços de adaptações problemáticas; por isso sofrimento significativo pede encaminhamento, não interpretação pelo quiz. [Reardon et al., 2019](https://doi.org/10.1136/bjsports-2019-100715). A decisão de não exibir bibliografia para o atleta já é requisito do ticket 03; as fontes ficam nesta documentação de implementação.

## Critérios de aceite para implementação

- Nenhum texto de resultado/PDF diagnostica, mede instrumento validado, prevê burnout/abandono/platô, promete desempenho ou estabelece causalidade.
- Cada fator pode ficar explicitamente indeterminado; Q11 não decide perfil nem converte afastamento/ambiguidade em déficit.
- Nomes de perfis, estrutura visual e CTA permanecem, mas “risco/projeção futura” é trocado por observação presente baseada em respostas/flags.
- O PDF inclui exatamente uma seção contextual da modalidade, sem bibliografia visível, escores ou jargão psicométrico.
- Lesão, sofrimento importante, alimentação ou desejo de se machucar acionam orientação de apoio profissional/urgência, sem conselho clínico individual.

## Fontes usadas

- Conteúdo atual: [`index.html`](../../../../index.html), especialmente `PROFILES`, `DIM_INSIGHTS`, `showResult()` e `downloadPDF()`.
- Decisões deste esforço: [matriz e algoritmo](./01-decisao-matriz-e-algoritmo.md) e [Q11/PDF](./02-pergunta-contextual-e-pdf.md).
- Mapa local de construtos: [`pesquisa.txt`](../../../../pesquisa.txt). Ele foi confrontado com as fontes primárias já registradas na [base teórica do ticket 01](./01-base-teorica-das-perguntas-fixas.md): Gotwals & Dunn (Sport-MPS-2), Brewer (AIMS), Pelletier et al. (SMS-II), Conroy et al. (PFAI), Smith et al. (ACSI-28), Zimmerman (autorregulação), Rees & Hardy (apoio social) e Reardon et al. (consenso COI).
