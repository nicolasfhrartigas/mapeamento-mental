// Motor do mapeamento — dados, cálculo e PDF extraídos verbatim de index.html
// (nicolasfhrartigas/mapeamento-mental). Nenhum texto ou pontuação foi alterado.

import { generatePdfReport } from './pdf-report.js';

    const DIMS = {
      perf: 'Processamento do erro e padrões',
      motiv: 'O que sustenta sua prática hoje',
      reg: 'Estratégias sob pressão',
      medo: 'Relação com a possibilidade de falhar',
      ident: 'Lugar do esporte entre outras áreas da vida',
      sup: 'Apoio que você mobiliza',
    };

    // ══════════════════════════════════════════
    //  8 TIPOS MENTAIS
    //  Nome de impacto · Subtítulo explicativo
    // ══════════════════════════════════════════
    const PROFILES = {
      'medo+perf': {
        factors: ['medo', 'perf'], type: 'PERFIL MENTAL · PADRÃO ATUAL', name: 'O Perfeccionista em Chamas', subtitle: 'Quando erro, padrão e exposição ganham muito peso',
        essence: 'Um modo educativo de organizar respostas sobre erro, exigência e a possibilidade de falhar.',
        observations: ['Depois de um erro, qual informação ajuda a escolher a próxima ação?', 'Em quais situações a possibilidade de falhar muda sua disposição de se expor?'],
        cta: 'Se fizer sentido, leve uma situação concreta para conversar com alguém de confiança ou com um profissional.'
      },
      'motiv+sup': {
        factors: ['motiv', 'sup'], type: 'PERFIL MENTAL · PADRÃO ATUAL', name: 'O Navegador sem Bússola', subtitle: 'Quando propósito e conversa sobre o esporte pedem espaço',
        essence: 'Um retrato educativo de respostas sobre o que sustenta a prática e o apoio mobilizado.',
        observations: ['O que sustenta sua prática nesta fase?', 'Com quem você poderia compartilhar uma pergunta concreta sobre o esporte?'],
        cta: 'Se fizer sentido, converse sobre uma situação específica com alguém de confiança ou com um profissional.'
      },
      'reg+sup': {
        factors: ['reg', 'sup'], type: 'PERFIL MENTAL · PADRÃO ATUAL', name: 'O Atleta Pressão Constante', subtitle: 'Quando situações de demanda e apoio merecem observação',
        essence: 'Um retrato educativo de como você descreveu situações de pressão e uso de apoio.',
        observations: ['Que sinal simples ajuda a escolher a próxima ação sob pressão?', 'Que tipo de apoio seria útil nessa situação: técnico, prático, emocional ou de estima?'],
        cta: 'Se o peso dessas situações estiver se repetindo ou trazendo sofrimento, procure apoio profissional.'
      },
      'ident+motiv': {
        factors: ['ident', 'motiv'], type: 'PERFIL MENTAL · PADRÃO ATUAL', name: 'O Atleta em Travessia', subtitle: 'Quando prática e outras áreas da vida entram na conversa',
        essence: 'Um retrato educativo de respostas sobre prática, rotina e outras áreas da vida.',
        observations: ['Onde o esporte encontra espaço entre as outras áreas da sua vida hoje?', 'O que faz sua prática ter sentido nesta fase?'],
        cta: 'Se fizer sentido, use esse registro como ponto de partida para uma conversa de apoio.'
      },
      'perf+reg': {
        factors: ['perf', 'reg'], type: 'PERFIL MENTAL · PADRÃO ATUAL', name: 'O Motor Sem Freio', subtitle: 'Quando padrão de desempenho e pressão se cruzam',
        essence: 'Um retrato educativo de como erro, padrão e situações de demanda apareceram nas respostas.',
        observations: ['Qual é o único ponto controlável que você consegue observar depois de um erro?', 'O que muda quando você escolhe um sinal de processo em vez de revisar tudo?'],
        cta: 'Se essas situações estiverem trazendo sofrimento ou prejuízo fora do esporte, procure apoio profissional.'
      },
      equilibrado: {
        factors: ['perf', 'motiv', 'reg', 'medo', 'ident', 'sup'], type: 'PERFIL MENTAL · PADRÃO ATUAL', name: 'A Mente Calibrada', subtitle: 'Quando há evidência direta nos seis fatores acompanhados',
        essence: 'Um resumo educativo de respostas funcionais nas situações perguntadas, não um padrão-ouro.',
        observations: ['Que estratégia situada você gostaria de entender melhor ao longo das próximas semanas?'],
        cta: 'Se fizer sentido, compartilhe uma situação concreta em uma conversa de acompanhamento.'
      },
      'ident+medo': {
        factors: ['ident', 'medo'], type: 'PERFIL MENTAL · PADRÃO ATUAL', name: 'O Gigante Contido', subtitle: 'Quando exposição e lugar do esporte pedem observação',
        essence: 'Um retrato educativo de respostas sobre falha, exposição e outras áreas da vida.',
        observations: ['O que ajuda a diferenciar cuidado estratégico de afastamento por receio?', 'Quais outras áreas seguem presentes quando o esporte exige muito?'],
        cta: 'Se fizer sentido, converse sobre uma situação específica com alguém de confiança ou com um profissional.'
      },
      'medo+reg': {
        factors: ['medo', 'reg'], type: 'PERFIL MENTAL · PADRÃO ATUAL', name: 'O Atleta de Dois Tempos', subtitle: 'Quando falha e demanda se encontram na próxima ação',
        essence: 'Um retrato educativo de respostas sobre possibilidade de falhar e situações de pressão.',
        observations: ['Que sinal da tarefa ajuda a voltar ao presente quando o momento pesa?', 'Em que situações a possibilidade de falhar muda sua próxima decisão?'],
        cta: 'Se o sofrimento estiver persistente, trazendo isolamento ou prejuízo fora do esporte, procure apoio profissional.'
      },
    };

    // Textos dos cartões da última página da main, preservados apenas no PDF.
    const PDF_PROFILE_FIELDS = {
      'O Perfeccionista em Chamas': {
        forces: [
          { title: 'Comprometimento real com o processo', text: 'Você raramente relaxa o padrão. Isso produz um nível de dedicação que separa atletas medianos de atletas consistentes.' },
          { title: 'Capacidade de análise apurada', text: 'Você enxerga erros e pontos de melhora com precisão. Quando bem direcionada, essa habilidade é um recurso real de evolução técnica.' },
        ],
        vulns: [
          { title: 'Difícil desligar depois de errar', text: 'O ciclo de autocrítica consome energia que deveria ir para a recuperação e afeta o desempenho nos treinos seguintes.' },
          { title: 'Tendência a evitar exposição de risco', text: 'O medo de falhar publicamente pode fazer você adiar competições, categorias ou desafios que seriam decisivos para o crescimento.' },
        ],
      },
      'O Navegador sem Bússola': {
        forces: [
          { title: 'Honestidade consigo mesmo', text: 'Questionar o porquê do que faz é uma forma de integridade. Quando direcionada, essa disposição produz comprometimento genuíno, não apenas execução automática.' },
          { title: 'Consciência do custo-benefício', text: 'Você não se entrega cegamente. Isso pode ser um recurso real quando usado para tomar decisões mais alinhadas, não para evitar o desconforto necessário.' },
        ],
        vulns: [
          { title: 'Motivação sem ancoragem interna', text: 'Sem uma razão clara vinda de dentro, o engajamento passa a depender de resultados, clima e validação externa, todos instáveis e fora do seu controle.' },
          { title: 'Processamento solitário das dificuldades', text: 'Lidar com dúvidas e fases difíceis sem apoio externo amplifica o peso de cada obstáculo e reduz a perspectiva necessária para atravessá-los.' },
        ],
      },
      'O Atleta Pressão Constante': {
        forces: [
          { title: 'Alta capacidade de tolerar pressão', text: 'Você consegue funcionar em condições que quebrariam outros atletas. Essa resistência é real. O problema é quando ela substitui o processamento em vez de complementá-lo.' },
          { title: 'Independência funcional', text: 'Você não precisa de validação constante para continuar. Esse traço, combinado com suporte seletivo, produz uma autonomia atlética genuína.' },
        ],
        vulns: [
          { title: 'Emoções vazando para o desempenho', text: 'Sem ferramentas deliberadas de controle emocional, estados intensos tendem a afetar o foco, a tomada de decisão e a execução técnica nos momentos que mais importam.' },
          { title: 'Apoio subutilizado', text: 'A tendência de processar tudo internamente impede o acesso a perspectivas externas que reduziriam o peso de situações que parecem maiores do que são.' },
        ],
      },
      'O Atleta em Travessia': {
        forces: [
          { title: 'Abertura genuína para redefinição', text: 'A fluidez que pode parecer instabilidade é também abertura para construir uma relação com o esporte mais autêntica e sustentável do que antes.' },
          { title: 'Identidade não depende só do esporte', text: 'Você tem vida fora da prática. Isso é um fator protetivo real, especialmente em lesões, pausas ou transições de fase competitiva.' },
        ],
        vulns: [
          { title: 'Propósito esportivo pouco claro agora', text: 'Sem uma razão interna clara, os dias difíceis não têm ancoragem, e a tentação de ceder é maior exatamente quando a persistência seria mais valiosa.' },
          { title: 'Motivação oscilando com os resultados', text: 'Quando a identificação com o esporte é baixa, o engajamento sobe com bons resultados e cai com maus, criando uma instabilidade que prejudica a consistência do processo.' },
        ],
      },
      'O Motor Sem Freio': {
        forces: [
          { title: 'Intensidade competitiva real', text: 'Sua capacidade de mobilizar energia e foco em momentos decisivos é genuína. Quando regulada, essa intensidade é um diferencial concreto de performance.' },
          { title: 'Comprometimento com o processo', text: 'Você não foge do esforço. Mesmo nos dias difíceis, há uma parte que insiste em aparecer e entregar. Isso é raro.' },
        ],
        vulns: [
          { title: 'Ciclo de autoataque e desestabilização', text: 'A combinação de autocobrança intensa com dificuldade de regular emoções cria um ciclo que se retroalimenta e drena energia que deveria ir para a performance.' },
          { title: 'Risco de esgotamento silencioso', text: 'O padrão de alta entrega com alto custo interno tende a ser invisível até atingir um ponto de ruptura, que muitas vezes coincide com competições ou momentos de maior pressão.' },
        ],
      },
      'A Mente Calibrada': {
        forces: [
          { title: 'Base mental equilibrada', text: 'Você tem funcionamento funcional nas principais dimensões da mente esportiva. Essa base é o que permite consistência, não apenas picos isolados.' },
          { title: 'Aprende com as fases difíceis', text: 'Sua relação com erros e fracassos está calibrada de forma que permite extrair aprendizado sem se paralisar. É um diferencial real no longo prazo.' },
        ],
        vulns: [
          { title: 'Risco de acomodação', text: 'Quando o sistema funciona, a tendência é não investir no desenvolvimento. As dimensões sutis que fazem diferença no alto nível raramente aparecem sozinhas.' },
          { title: 'Refinamento avançado ainda disponível', text: 'Há ganhos reais disponíveis nas habilidades mais sofisticadas: rotinas de alta performance, gestão de pressão em momentos decisivos e identidade atlética em transições.' },
        ],
      },
      'O Gigante Contido': {
        forces: [
          { title: 'Comprometimento genuíno com o esporte', text: 'A intensidade do medo de falhar é proporcional ao quanto você se importa. Esse nível de comprometimento, redirecionado, é um recurso real.' },
          { title: 'Leitura aguçada do ambiente', text: 'Você percebe expectativas, dinâmicas e pressões com precisão. Desacoplada do medo de julgamento, essa habilidade vira inteligência situacional real.' },
        ],
        vulns: [
          { title: 'Evitação de exposição de alto risco', text: 'O medo de falhar publicamente limita a participação em competições, categorias ou desafios que seriam decisivos para o crescimento.' },
          { title: 'Identidade ameaçada pelo resultado', text: 'Quando quem você é está muito ligado ao esporte, cada resultado negativo toca além do desempenho: toca em quem você é. Isso aumenta o custo emocional de cada exposição.' },
        ],
      },
      'O Atleta de Dois Tempos': {
        forces: [
          { title: 'Alta sensibilidade ao contexto', text: 'Você captura nuances do ambiente competitivo com precisão. Regulada, essa sensibilidade é um recurso de leitura e adaptação que atletas menos sensíveis não têm.' },
          { title: 'Consciência dos próprios padrões', text: 'O fato de que você percebe a dificuldade já é um passo importante. Atletas que não se veem nunca trabalham o padrão. Consciência é o ponto de partida.' },
        ],
        vulns: [
          { title: 'Travamento nos momentos decisivos', text: 'Nos momentos de maior importância, o estado interno pode comprometer execução técnica, foco e tomada de decisão, independentemente do nível de preparo físico.' },
          { title: 'Antecipação do fracasso antes de acontecer', text: 'O medo ativa um processamento antecipatório negativo que aumenta a tensão antes da performance, tornando o ciclo de desestabilização mais intenso e mais precoce.' },
        ],
      },
    };

    const FIXED_QUESTIONS = [
      {
        text: 'Você erra uma execução simples no treino, algo que normalmente acerta sem pensar. O que acontece na sua cabeça logo depois?', opts: [
          { text: 'O resto do treino fica contaminado. Você continua, mas a cabeça volta naquele erro.', d: { perf: 0, reg: 0 } },
          { text: 'Irrita na hora, você xinga baixinho, e nas séries seguintes já passou.', d: { perf: 1, reg: 1 } },
          { text: 'Você registra o que causou, corrige na repetição seguinte e segue.', d: { perf: 2, reg: 2 } },
          { text: 'Nem entra no radar. Errar num treino não é assunto.', d: { perf: 1 } },
        ]
      },
      {
        text: 'Se alguém te perguntasse, sem julgamento nenhum, qual é o motivo real de você continuar treinando, o que você responderia?', context: 'Não existe resposta certa aqui. A honestidade é o que torna o resultado preciso.', opts: [
          { text: 'Sem o esporte, você não saberia bem o que sobra de você.', d: { ident: 0, motiv: 0 } },
          { text: 'A superação em si. Você treinaria mesmo que ninguém soubesse.', d: { motiv: 2 } },
          { text: 'O reconhecimento pesa. Ser visto como atleta faz parte do que te move.', d: { motiv: 1 }, flag: 'validação externa' },
          { text: 'Hoje é mais hábito do que escolha. Parar seria pior do que continuar.', d: { motiv: 0 } },
        ]
      },
      {
        text: 'Momento decisivo: última série, ponto de partida, prova principal, gente olhando. Como seu corpo e sua cabeça reagem?', opts: [
          { text: 'A tensão vira foco. Você costuma render mais quando o momento pesa.', d: { reg: 2, medo: 1 } },
          { text: 'A cabeça acelera, o corpo trava um pouco, e sai abaixo do que você treinou.', d: { reg: 0 }, flag: 'travamento sob pressão' },
          { text: 'Você tem um jeito próprio de se acalmar, com respiração, uma frase, um ritual. E funciona.', d: { reg: 2 } },
          { text: 'Você diminui o peso do momento. Convencer-se de que não importa tanto é o que te mantém funcional.', d: {}, flag: 'estratégia a entender' },
        ]
      },
      {
        text: 'Véspera de uma competição importante. Você imagina o cenário de fracassar. Qual pensamento aparece com mais força?', opts: [
          { text: 'O que mais pesa é como as pessoas vão te olhar depois.', d: { medo: 0 }, flag: 'avaliação social' },
          { text: 'Bate a sensação de que todo o trabalho até aqui não provou nada.', d: { medo: 0 }, flag: 'autoestima contingente' },
          { text: 'Vai doer, mas você já sabe que aquilo vira informação para a semana seguinte.', d: { medo: 2, reg: 1 } },
          { text: 'Você não vai até lá. Pensar em perder antes da hora só atrapalha.', d: {}, flag: 'evitação/supressão a entender' },
        ]
      },
      {
        text: 'Uma lesão te tira do esporte por três meses. Sem exceção, sem antecipar o prazo. Qual seria sua reação mais provável?', opts: [
          { text: 'Seria o tipo de pausa que mexe com a base. Sem a rotina, você não sabe direito quem é.', d: { ident: 0 } },
          { text: 'Frustrante, mas você redirecionaria o tempo para o que andou adiando.', d: { ident: 2, reg: 1 } },
          { text: 'Você transformaria a recuperação em projeto, fisioterapia no limite para voltar antes.', d: {}, flag: 'pressa de retorno' },
          { text: 'Continuaria por perto: acompanhando treino, mantendo o vínculo com o grupo.', d: { sup: 1 } },
        ]
      },
      {
        text: 'Treino sólido, dentro do planejado, mas longe de perfeito. Como você avalia esse desempenho?', opts: [
          { text: 'Se não chegou perto do ideal, não conta muito.', d: { perf: 0 } },
          { text: 'Você reconhece que bateu o planejado e fica satisfeito com isso.', d: { perf: 2 } },
          { text: 'Fica a dúvida se foi suficiente e se os outros estão fazendo mais.', d: { perf: 0 }, flag: 'comparação e dúvida' },
          { text: 'Cumpriu o combinado, tá bom. Você não costuma revisar muito além disso.', d: { perf: 1 } },
        ]
      },
      {
        text: 'Sequência ruim: semanas de resultado estagnado, nada saindo como deveria. Como você costuma atravessar essa fase?', opts: [
          { text: 'Você fecha. Não é assunto para dividir, resolve treinando mais.', d: { sup: 0, reg: 0 } },
          { text: 'Você fala com quem confia. Não para resolver, mas para não carregar sozinho.', d: { sup: 2 } },
          { text: 'Você busca a comissão técnica: revisar vídeo, ajustar plano. O lado técnico primeiro.', d: { sup: 2, reg: 1 } },
          { text: 'Você reduz o contato com o ambiente até a fase passar.', d: { sup: 0 }, flag: 'afastamento' },
        ]
      },
      {
        text: 'Pensando nos últimos meses: como o esporte tem convivido com o resto da sua vida, família, amigos, trabalho, estudos?', opts: [
          { text: 'Já custou presenças importantes e algumas relações. O treino não se negocia.', d: { ident: 0, reg: 0 } },
          { text: 'Atropela às vezes, mas você reorganiza depois para compensar quem importa.', d: { ident: 1, reg: 1 } },
          { text: 'O horário de treino é sagrado, mas o resto tem espaço garantido.', d: { ident: 2, reg: 1 } },
          { text: 'O treino é a primeira coisa que cai quando aparece outra coisa.', d: { ident: 1 } },
        ]
      },
      {
        text: 'Já aconteceu de você não entrar numa competição, num confronto direto ou num teste por causa de como poderia sair dali?', opts: [
          { text: 'Já deixou de entrar em disputas onde a chance de aparecer mal era grande.', d: { medo: 0 } },
          { text: 'Já aconteceu de achar um motivo para não ir e depois perceber que o motivo era outro.', d: { medo: 0 }, flag: 'justificativa/evitação percebida' },
          { text: 'Você prefere perder tentando a ficar com a dúvida. Raramente recua por isso.', d: { medo: 2 } },
          { text: 'Você recua quando a leitura objetiva mostra que não compensa e consegue distinguir isso do medo.', d: { medo: 1 } },
        ]
      },
      {
        text: 'Quando o esporte pesa emocionalmente, cobrança, insegurança, frustração, com quem você realmente fala sobre isso?', opts: [
          { text: 'Com ninguém. Quem está fora não entenderia mesmo.', d: { sup: 0 } },
          { text: 'Tem o pessoal do treino, mas a conversa fica no técnico. Essa parte não entra.', d: { sup: 1 }, flag: 'apoio principalmente técnico' },
          { text: 'Tem gente que te sustenta independente de resultado família, parceiro(a), profissional.', d: { sup: 2 } },
          { text: 'Só com quem vive o mesmo. Quem não treina não tem repertório para entender.', d: { sup: 1 }, flag: 'rede restrita ao esporte' },
        ]
      },
    ].map(question => ({ ...question, fixed: true }));

    const CONTEXTUAL_QUESTIONS = {
      fisiculturismo: {
        sportName: 'Fisiculturismo', hook: 'Na avaliação física/apresentação, você descreveu como transforma uma impressão pontual em decisão de processo.', text: 'Em uma semana de avaliação, uma foto, medida ou apresentação isolada parece diferente do esperado. Como você decide o próximo passo?', opts: [
          { text: 'Comparo com os registros e o plano do período; escolho um único ponto a acompanhar antes de mudar algo.', d: { reg: 2 } }, { text: 'Mudo a rotina na hora para compensar o que vi ou porque alguém parece melhor.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Paro de olhar ou registrar para não ter de lidar com isso.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'Levo a observação concreta para o critério já combinado com a equipe de saúde/técnica, antes de alterar o plano.', d: { reg: 1, sup: 1 } }]
      },
      futebol: {
        sportName: 'Futebol', hook: 'No ajuste tático em campo, apareceu a forma como você volta a uma função observável e coordena a próxima ação.', text: 'Quando o plano do time deixa de funcionar porque o adversário mudou a marcação, como você entra na próxima sequência de jogo?', opts: [
          { text: 'Escolho uma referência da minha função para a próxima ação e volto a oferecê-la ao time.', d: { reg: 2 } }, { text: 'Tento resolver sozinho e acelerar a jogada para recuperar o que o time perdeu.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Evito pedir a bola ou me prendo ao que estava combinado antes, sem atualizar a leitura.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'Uso uma comunicação curta, combinada com o grupo, para confirmar a função e a mudança necessária.', d: { reg: 1, sup: 1 } }]
      },
      corrida: {
        sportName: 'Corrida / Atletismo', hook: 'Na calibração de ritmo, suas respostas mostram como você converte sinais da prova em um ajuste observável.', text: 'Em uma prova, calor, terreno ou sensação de esforço mostram que o ritmo planejado não cabe naquele dia. Como você recalibra?', opts: [
          { text: 'Volto à faixa de esforço/ritmo definida para a prova e ajusto por trechos, não por um minuto isolado.', d: { reg: 2 } }, { text: 'Forço o ritmo original ou sigo alguém para não “perder” a prova cedo.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Deixo de olhar para qualquer sinal e espero o fim para descobrir o que acontece.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'Uso os marcos permitidos e o plano prévio para registrar a mudança e revisar depois com a equipe.', d: { reg: 1 } }]
      },
      volei: {
        sportName: 'Vôlei', hook: 'No ajuste de rotação, você indicou como organiza seu papel e a troca de informação imediatamente utilizável.', text: 'Quando uma rotação ou combinação não está encaixando no set, como você participa do ajuste para o próximo rally?', opts: [
          { text: 'Volto a uma responsabilidade simples da minha posição e executo o combinado no próximo rally.', d: { reg: 2 } }, { text: 'Tento uma solução de alto risco para compensar o placar de uma vez.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Fico sem comunicar e espero que outra pessoa resolva a desorganização.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'Dou ou peço uma informação curta e objetiva — cobertura, chamada ou ajuste de posição — antes do saque.', d: { reg: 1, sup: 1 } }]
      },
      tenis: {
        sportName: 'Tênis', hook: 'No changeover, suas respostas sugerem a maneira como você reduz uma leitura ampla a uma intenção tática testável.', text: 'No changeover, você percebe que um padrão de jogo não está rendendo. Como escolhe o foco do próximo game?', opts: [
          { text: 'Escolho uma intenção tática simples a testar por alguns pontos e observo o efeito.', d: { reg: 2 } }, { text: 'Troco tudo pelo placar ou tento encerrar cada ponto de uma vez.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Evito rever o padrão e só tento “bater mais forte” sem uma referência.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'Uso o que é permitido no torneio para confirmar uma observação objetiva e manter um foco por vez.', d: { reg: 1 } }]
      },
      coletivos: {
        sportName: 'Esportes Coletivos', hook: 'Na mudança de plano coletivo, você descreveu como torna sua função e a informação compartilhada mais claras.', text: 'Quando a equipe precisa mudar o plano no meio da partida, como você ajuda a alinhar a próxima sequência?', opts: [
          { text: 'Defino minha tarefa imediata dentro do novo plano e a executo de forma clara.', d: { reg: 2 } }, { text: 'Priorizo uma ação individual para mostrar que estou bem, mesmo sem relação com o ajuste do grupo.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Espero os outros decidirem e sigo no automático, sem checar a nova função.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'Confirmo uma instrução objetiva com quem coordena a jogada e comunico o que observei.', d: { reg: 1, sup: 1 } }]
      },
      resistencia: {
        sportName: 'Esporte de Resistência', hook: 'No esforço prolongado, você mostrou como usa um critério prévio para adaptar a tarefa sem transformar uma sensação isolada em veredito.', text: 'Em um esforço longo, um sinal inicial indica que o plano precisa ser adaptado. Como decide a continuação?', opts: [
          { text: 'Uso faixas de esforço e marcos definidos antes para fazer um ajuste gradual.', d: { reg: 2 } }, { text: 'Tento compensar logo o tempo perdido ou sigo o ritmo de outra pessoa sem voltar ao meu critério.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Ignoro todos os sinais até terminar, para não ter de decidir durante o esforço.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'Aplico o critério pré-definido de ajuste ou de interrupção segura e deixo a revisão detalhada para depois.', d: { reg: 1 } }]
      },
      luta: {
        sportName: 'Esportes de Luta', hook: 'Entre rounds, você descreveu como transforma a leitura do adversário em um ajuste técnico limitado e verificável.', text: 'No intervalo, o adversário neutralizou uma sequência que costuma funcionar. Como você volta para o próximo round?', opts: [
          { text: 'Escolho uma instrução técnica para testar e volto com esse único foco.', d: { reg: 2 } }, { text: 'Entro querendo recuperar tudo na força ou provar que a sequência ainda funciona.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Desconsidero a leitura do round e repito no automático, sem verificar o que mudou.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'Troco uma observação curta com o corner e confirmo o sinal técnico acordado para a volta.', d: { reg: 1, sup: 1 } }]
      },
      raquetes: {
        sportName: 'Esportes de Raquete', hook: 'Na leitura do padrão de troca, você indicou como transforma uma sequência em uma hipótese tática para testar.', text: 'Durante uma sequência de pontos, o adversário passa a explorar o mesmo padrão. Como você prepara a próxima decisão?', opts: [
          { text: 'Elejo uma resposta tática específica e observo se ela muda o padrão nos próximos pontos.', d: { reg: 2 } }, { text: 'Tento encerrar a troca rapidamente em toda bola para compensar o que já aconteceu.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Deixo de observar o padrão e sigo só pela urgência de não errar.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'No intervalo permitido, confirmo uma leitura objetiva com dupla/equipe, quando houver, ou com meu registro de jogo.', d: { reg: 1 } }]
      },
      habilidades_mira: {
        sportName: 'Esportes de Habilidades e Mira', hook: 'Na série de precisão, você descreveu como usa a rotina e um critério de revisão em vez de responder só ao resultado imediato.', text: 'Uma série fica mais dispersa do que o seu padrão. Como você escolhe a próxima tentativa?', opts: [
          { text: 'Retomo a rotina pré-execução e um único sinal técnico controlável antes da próxima tentativa.', d: { reg: 2 } }, { text: 'Mudo vários detalhes de uma vez para recuperar o placar imediatamente.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Evito conferir o padrão e acelero as tentativas para acabar logo a série.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'Aplico o critério de pausa/revisão acordado para a sessão e registro o que mudou.', d: { reg: 1 } }]
      },
      e_sports: {
        sportName: 'E-sports', hook: 'No ajuste entre rodadas, apareceu como você transforma informação do jogo em chamada curta, função clara e revisão posterior.', text: 'Uma rodada revela uma estratégia que a equipe não esperava. Como você participa do ajuste da próxima rodada?', opts: [
          { text: 'Comunico uma informação verificável e executo uma função clara no ajuste combinado.', d: { reg: 2 } }, { text: 'Tento recuperar a rodada sozinho ou tomo decisões pelo placar/KDA, sem alinhar o time.', d: { reg: 0 }, flag: 'resultado/compensação' }, { text: 'Paro de comunicar ou sigo o plano antigo sem checar a informação nova.', d: { reg: 0 }, flag: 'afastamento da informação' }, { text: 'Uso a janela permitida para confirmar uma chamada curta, prioridades e responsabilidades antes de retomar.', d: { reg: 1 } }]
      },
    };

    const DIM_INSIGHTS = {
      perf: { known: 'Nas suas respostas, apareceram maneiras de lidar com erro e com a própria régua de desempenho. Pode valer observar o que ajuda a transformar revisão em ajuste, sem transformar um resultado em julgamento pessoal.', unknown: 'As respostas não trazem evidência suficiente para concluir como você lida com erro e padrões. Vale observar isso em treinos e competições.' },
      motiv: { known: 'Apareceram pistas sobre o que sustenta sua prática neste momento. Pode valer notar como interesse pessoal, metas, reconhecimento e rotina participam dessa escolha.', unknown: 'As respostas não permitem concluir o que mais sustenta sua prática hoje.' },
      reg: { known: 'Você descreveu recursos ou dificuldades em momentos de demanda. Observe quais sinais e estratégias ajudam você a escolher a próxima ação.', unknown: 'Não há evidência suficiente, neste resultado, para resumir suas estratégias sob pressão.' },
      medo: { known: 'Suas respostas indicaram como a possibilidade de falhar entra em decisões de exposição e preparo. Pode valer diferenciar cuidado estratégico de afastamento por receio.', unknown: 'As respostas não distinguem com clareza como a possibilidade de falhar entra nas suas decisões.' },
      ident: { known: 'Apareceram pistas sobre como o esporte se articula com outras áreas da sua vida. Pode valer observar onde há flexibilidade e onde o equilíbrio fica mais difícil.', unknown: 'As respostas não trazem evidência suficiente sobre a integração do esporte a outras áreas da vida.' },
      sup: { known: 'Você descreveu formas de buscar ou usar apoio. Pode valer identificar de que tipo de apoio precisa em cada situação: técnico, prático, emocional ou de estima.', unknown: 'As respostas não permitem resumir a disponibilidade ou o uso de apoio.' },
    };

    const CONTEXTUAL_PDF_TEXT = {
      'resultado/compensação': 'No seu contexto de {modalidade}, o resultado imediato ou a urgência de compensar parece ganhar espaço na decisão. Pode valer experimentar definir, antes da situação, uma referência controlável para a próxima ação e só então revisar o resultado. A ideia não é reduzir sua ambição, e sim separar o que você consegue executar agora do que o placar ainda não mostra.',
      'afastamento da informação': 'No seu contexto de {modalidade}, sua resposta não mostra com clareza se se afastar da informação é uma pausa que ajuda ou se deixa o ajuste para depois. Observe, sem se julgar, o que acontece quando você volta a olhar para um sinal simples da tarefa: isso facilita uma escolha mais clara ou aumenta o peso do momento?',
      process: 'No seu contexto de {modalidade}, você descreveu voltar a uma referência de processo antes de decidir a próxima ação. Isso pode ser uma base útil para observar o que funciona: mantenha o sinal simples, confira o efeito ao longo de mais de uma situação e ajuste com calma quando os dados não confirmarem o plano.',
      alignment: 'No seu contexto de {modalidade}, você descreveu usar uma observação objetiva, um critério combinado ou uma comunicação curta para retomar a tarefa. Pode valer deixar esse sinal explícito antes de competir: o que cada pessoa observa, quando ele é usado e qual é a próxima ação possível. Isso mantém o foco na tarefa, não em provar algo pelo resultado.',
    };

    const CONTEXTUAL_FLAG_INVITATIONS = {
      'resultado/compensação': 'Convite de observação: antes de tentar compensar o resultado, nomeie um critério simples da tarefa que possa orientar a próxima decisão.',
      'afastamento da informação': 'Convite de observação: ao retomar a situação, escolha uma informação simples para verificar se a pausa ajudou ou apenas adiou o ajuste.',
    };

    const FIXED_FLAG_PROMPTS = {
      'validação externa': 'Em quais situações reconhecimento ou comparação externa passam a guiar sua escolha?',
      'travamento sob pressão': 'O que ajuda a voltar a um sinal simples da tarefa quando o momento pesa?',
      'avaliação social': 'Como a expectativa de julgamento entra na leitura que você faz da situação?',
      'autoestima contingente': 'O que muda quando o resultado parece dizer mais do que a situação realmente mostra?',
      'pressa de retorno': 'Em uma pausa ou lesão, pode valer respeitar o plano de recuperação e conversar com a equipe de saúde antes de decidir o próximo passo.',
      'comparação e dúvida': 'Que informação da sua própria tarefa ajuda antes de comparar com outras pessoas?',
      afastamento: 'O que uma conversa curta e concreta poderia tornar mais claro nessa fase?',
      'justificativa/evitação percebida': 'Como diferenciar uma decisão estratégica de um afastamento por receio?',
    };

export { DIMS, PROFILES, PDF_PROFILE_FIELDS, FIXED_QUESTIONS, CONTEXTUAL_QUESTIONS, DIM_INSIGHTS, CONTEXTUAL_PDF_TEXT, CONTEXTUAL_FLAG_INVITATIONS, FIXED_FLAG_PROMPTS };

export function createEngine() {
    let profile = { name: '', sport: '', sportLabel: '', level: '', goal: '' };
    let scores = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
    let evidenceMax = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
    let fixedEvidenceMax = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
    let answers = {};
    let current = 0;
    let resolvedProfile = null;
    let ACTIVE = [];

    const levelLabels = { iniciante: 'Iniciante / Amador', intermediario: 'Intermediário', alto: 'Alto Rendimento' };
    const goalLabels = { competir: 'Competir e vencer', consistencia: 'Manter consistência', superar: 'Superar meus limites', 'bem-estar': 'Cuidar do processo' };

    // A pontuação 0 ainda é uma resposta registrada e recebe uma marca mínima.
    // Ausência de evidência é exibida como texto, nunca como uma barra cinza curta.
    const MIN_VISIBLE_FACTOR_PERCENTAGE = 4;
    function displayFactorPercentage(summary) {
      if (!summary.known) return 0;
      return Math.max(MIN_VISIBLE_FACTOR_PERCENTAGE, Math.round(summary.percent * 100));
    }

    function capitalizeFirstLetter(value) {
      const text = String(value || '').trim();
      return text ? text[0].toLocaleUpperCase('pt-BR') + text.slice(1) : '';
    }

    function removeEmoji(value) {
      return String(value || '')
        .replace(/\p{Regional_Indicator}{1,2}/gu, '')
        .replace(/\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F|\u200D|\p{Extended_Pictographic})*/gu, '')
        .replace(/[\uFE0E\uFE0F\u200D\u20E3]/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    function currentObservations(prof) {
      const flags = FIXED_QUESTIONS.map((question, index) => answers[index] === undefined ? '' : question.opts[answers[index]].flag)
        .filter(Boolean)
        .map(flag => FIXED_FLAG_PROMPTS[flag])
        .filter(Boolean);
      return [...new Set(flags.concat(prof.observations))].slice(0, 2);
    }

    function contextualReading() {
      const question = ACTIVE[FIXED_QUESTIONS.length];
      const answer = question && answers[FIXED_QUESTIONS.length] !== undefined ? question.opts[answers[FIXED_QUESTIONS.length]] : null;
      if (!question || !answer) return null;
      const textKey = answer.flag || (answers[FIXED_QUESTIONS.length] === 0 ? 'process' : 'alignment');
      const text = CONTEXTUAL_PDF_TEXT[textKey].replace('{modalidade}', question.sportName);
      const safeguard = profile.sport === 'fisiculturismo' && (answer.flag === 'resultado/compensação' || answer.flag === 'afastamento da informação')
        ? 'Se avaliações de corpo, comida, peso ou treino estiverem causando sofrimento, culpa persistente ou pressão para ignorar cuidados, converse com um profissional de saúde qualificado e com sua equipe; este questionário não orienta mudanças de dieta, treino ou retorno.'
        : '';
      return {
        hook: question.hook,
        text,
        flagInvitation: answer.flag ? CONTEXTUAL_FLAG_INVITATIONS[answer.flag] : '',
        safeguard,
      };
    }

    function applyAnswer(q, opt, direction) {
      Object.entries(opt.d).forEach(([d, p]) => {
        scores[d] += p * direction;
        evidenceMax[d] += 2 * direction;
        if (q.fixed) fixedEvidenceMax[d] += 2 * direction;
      });
    }

    const FACTOR_ORDER = ['perf', 'motiv', 'reg', 'medo', 'ident', 'sup'];
    function summarizeFactor(points, maximum, d) {
      const known = maximum[d] > 0;
      return { known, percent: known ? points[d] / maximum[d] : null };
    }

    function factorSummary(d) {
      return summarizeFactor(scores, evidenceMax, d);
    }

    function selectProfile() {
      const fixedKnown = FACTOR_ORDER.filter(d => fixedEvidenceMax[d] > 0);
      const fixedKnownCount = fixedKnown.length;
      const known = FACTOR_ORDER
        .filter(d => evidenceMax[d] > 0)
        .map(d => ({ d, percent: summarizeFactor(scores, evidenceMax, d).percent }))
        .sort((a, b) => a.percent - b.percent || FACTOR_ORDER.indexOf(a.d) - FACTOR_ORDER.indexOf(b.d));
      const pairProfiles = Object.values(PROFILES).filter(item => item.factors.length === 2);
      const partialProfile = (base, reason) => ({ ...base, partial: true, partialReason: reason });
      const fallbackFactor = known.find(item => fixedEvidenceMax[item.d] > 0)?.d;
      const catalogFallback = pairProfiles.find(item => item.factors.includes(fallbackFactor)) || pairProfiles[0];
      if (fixedKnownCount >= 2 && known.length === 6 && known.every(item => item.percent >= .5)) return PROFILES.equilibrado;
      if (fixedKnownCount >= 2 && known.length >= 2) {
        const pair = known.slice(0, 2).map(item => item.d);
        const exact = pairProfiles.find(item => item.factors.every(factor => pair.includes(factor)));
        if (exact) return exact;
        const candidates = pairProfiles
          .filter(item => item.factors.every(factor => evidenceMax[factor] > 0))
          .sort((a, b) => {
            const score = item => item.factors.reduce((sum, factor) => sum + summarizeFactor(scores, evidenceMax, factor).percent, 0);
            return score(a) - score(b) || FACTOR_ORDER.indexOf(a.factors[0]) - FACTOR_ORDER.indexOf(b.factors[0]);
          });
        if (candidates.length) return candidates[0];
      }
      if (fixedKnown.length === 1) {
        return partialProfile(catalogFallback, 'Há pouca evidência direta nas perguntas fixas, então o retrato é parcial.');
      }
      return partialProfile(catalogFallback, 'As respostas fixas não sustentam um dos pares editoriais completos, então o retrato é parcial.');
    }

    // Monta um retrato plano do estado atual — o pdf-report.js não lê nada
    // além disso, então mudanças no motor do quiz nunca quebram o layout do PDF.
    function buildReportData() {
      const prof = resolvedProfile;
      const contextual = contextualReading();
      const slug = (profile.name || 'atleta').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'atleta';
      return {
        prof,
        profileFields: PDF_PROFILE_FIELDS[prof?.name] || prof,
        athleteName: capitalizeFirstLetter(profile.name) || 'Atleta',
        dateStr: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
        sportLabel: removeEmoji(profile.sportLabel || profile.sport || ''),
        levelLabel: levelLabels[profile.level],
        goalLabel: goalLabels[profile.goal],
        contextual,
        factors: FACTOR_ORDER.map(key => {
          const summary = factorSummary(key);
          return {
            name: DIMS[key],
            known: summary.known,
            percent: displayFactorPercentage(summary),
            insight: DIM_INSIGHTS[key][summary.known ? 'known' : 'unknown'],
          };
        }),
        observations: prof ? currentObservations(prof) : [],
        answers: ACTIVE.map((q, i) => ({
          question: `${i + 1}. ${q.text}`,
          response: `R: ${(answers[i] !== undefined) ? q.opts[answers[i]].text : '—'}`,
        })),
        filenameSlug: slug,
      };
    }

    function downloadPDF() {
      generatePdfReport(buildReportData());
    }

  function resetState() {
    profile = { name: '', sport: '', sportLabel: '', level: '', goal: '' };
    scores = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
    evidenceMax = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
    fixedEvidenceMax = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
    answers = {}; current = 0; resolvedProfile = null; ACTIVE = [];
  }

  function start() {
    ACTIVE = FIXED_QUESTIONS.concat(CONTEXTUAL_QUESTIONS[profile.sport]);
    current = 0;
    scores = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
    evidenceMax = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
    fixedEvidenceMax = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
    answers = {};
  }

  function select(idx) {
    const q = ACTIVE[current];
    if (answers[current] !== undefined) applyAnswer(q, q.opts[answers[current]], -1);
    answers[current] = idx;
    applyAnswer(q, q.opts[idx], 1);
    current++;
    return current >= ACTIVE.length;
  }

  function back() {
    if (current === 0) return false;
    if (answers[current - 1] !== undefined) {
      applyAnswer(ACTIVE[current - 1], ACTIVE[current - 1].opts[answers[current - 1]], -1);
      delete answers[current - 1];
    }
    current--;
    return true;
  }

  function result() {
    const prof = selectProfile();
    resolvedProfile = prof;
    const waText = `Oi Nicolas! Concluí o mapeamento educativo de autoconhecimento com 11 perguntas. Minha leitura de hoje foi "${prof.name}". Quero entender melhor o resultado e como funciona o acompanhamento. | ${profile.name}`;
    const dims = FACTOR_ORDER.map(key => {
      const summary = factorSummary(key);
      return {
        key,
        name: DIMS[key],
        known: summary.known,
        percent: Math.round((summary.percent || 0) * 100),
        visible: displayFactorPercentage(summary),
        insight: DIM_INSIGHTS[key][summary.known ? 'known' : 'unknown'],
      };
    });
    return { prof, dims, waLink: `https://wa.me/5544988433895?text=${encodeURIComponent(waText)}` };
  }

  return {
    profile,
    setProfileField(field, value) { profile[field] = value; },
    getProfile: () => profile,
    getActive: () => ACTIVE,
    getCurrent: () => current,
    getQuestion: () => ACTIVE[current],
    getTotal: () => ACTIVE.length,
    start, select, back, result, downloadPDF, resetState,
  };
}
