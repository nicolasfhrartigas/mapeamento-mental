const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const indexPath = path.join(__dirname, '..', 'index.html');
const source = fs.readFileSync(indexPath, 'utf8');
const dataStart = source.indexOf('    const FIXED_QUESTIONS = [');
const dataEnd = source.indexOf('    const FIXED_FLAG_PROMPTS = {');
const contextualReadingStart = source.indexOf('    function contextualReading() {');
const contextualReadingEnd = source.indexOf('    // ══════════════════════════════════════════\n    //  ESTADO GLOBAL', contextualReadingStart);
const startQuestionsStart = source.indexOf('    function startQuestions() {');
const startQuestionsEnd = source.indexOf('    function renderQuestion() {', startQuestionsStart);

assert.notEqual(dataStart, -1, 'question data must exist');
assert.notEqual(dataEnd, -1, 'question data must end before fixed flag prompts');
assert.notEqual(contextualReadingStart, -1, 'contextualReading must exist');
assert.notEqual(contextualReadingEnd, -1, 'contextualReading must end before global state');
assert.notEqual(startQuestionsStart, -1, 'startQuestions must exist');
assert.notEqual(startQuestionsEnd, -1, 'startQuestions must end before renderQuestion');

const dataContext = {};
vm.runInNewContext(
  `${source.slice(dataStart, dataEnd)}\nglobalThis.questionData = { FIXED_QUESTIONS, CONTEXTUAL_QUESTIONS, CONTEXTUAL_PDF_TEXT };`,
  dataContext,
);

const { FIXED_QUESTIONS, CONTEXTUAL_QUESTIONS } = dataContext.questionData;
const plain = value => JSON.parse(JSON.stringify(value));
const otherCategories = {
  coletivos: { sportName: 'Esportes Coletivos', hasTaskSupport: true, hook: 'Na mudança de plano coletivo, você descreveu como torna sua função e a informação compartilhada mais claras.', text: 'Quando a equipe precisa mudar o plano no meio da partida, como você ajuda a alinhar a próxima sequência?', options: ['Defino minha tarefa imediata dentro do novo plano e a executo de forma clara.', 'Priorizo uma ação individual para mostrar que estou bem, mesmo sem relação com o ajuste do grupo.', 'Espero os outros decidirem e sigo no automático, sem checar a nova função.', 'Confirmo uma instrução objetiva com quem coordena a jogada e comunico o que observei.'] },
  resistencia: { sportName: 'Esporte de Resistência', hasTaskSupport: false, hook: 'No esforço prolongado, você mostrou como usa um critério prévio para adaptar a tarefa sem transformar uma sensação isolada em veredito.', text: 'Em um esforço longo, um sinal inicial indica que o plano precisa ser adaptado. Como decide a continuação?', options: ['Uso faixas de esforço e marcos definidos antes para fazer um ajuste gradual.', 'Tento compensar logo o tempo perdido ou sigo o ritmo de outra pessoa sem voltar ao meu critério.', 'Ignoro todos os sinais até terminar, para não ter de decidir durante o esforço.', 'Aplico o critério pré-definido de ajuste ou de interrupção segura e deixo a revisão detalhada para depois.'] },
  luta: { sportName: 'Esportes de Luta', hasTaskSupport: true, hook: 'Entre rounds, você descreveu como transforma a leitura do adversário em um ajuste técnico limitado e verificável.', text: 'No intervalo, o adversário neutralizou uma sequência que costuma funcionar. Como você volta para o próximo round?', options: ['Escolho uma instrução técnica para testar e volto com esse único foco.', 'Entro querendo recuperar tudo na força ou provar que a sequência ainda funciona.', 'Desconsidero a leitura do round e repito no automático, sem verificar o que mudou.', 'Troco uma observação curta com o corner e confirmo o sinal técnico acordado para a volta.'] },
  raquetes: { sportName: 'Esportes de Raquete', hasTaskSupport: false, hook: 'Na leitura do padrão de troca, você indicou como transforma uma sequência em uma hipótese tática para testar.', text: 'Durante uma sequência de pontos, o adversário passa a explorar o mesmo padrão. Como você prepara a próxima decisão?', options: ['Elejo uma resposta tática específica e observo se ela muda o padrão nos próximos pontos.', 'Tento encerrar a troca rapidamente em toda bola para compensar o que já aconteceu.', 'Deixo de observar o padrão e sigo só pela urgência de não errar.', 'No intervalo permitido, confirmo uma leitura objetiva com dupla/equipe, quando houver, ou com meu registro de jogo.'] },
  habilidades_mira: { sportName: 'Esportes de Habilidades e Mira', hasTaskSupport: false, hook: 'Na série de precisão, você descreveu como usa a rotina e um critério de revisão em vez de responder só ao resultado imediato.', text: 'Uma série fica mais dispersa do que o seu padrão. Como você escolhe a próxima tentativa?', options: ['Retomo a rotina pré-execução e um único sinal técnico controlável antes da próxima tentativa.', 'Mudo vários detalhes de uma vez para recuperar o placar imediatamente.', 'Evito conferir o padrão e acelero as tentativas para acabar logo a série.', 'Aplico o critério de pausa/revisão acordado para a sessão e registro o que mudou.'] },
  e_sports: { sportName: 'E-sports', hasTaskSupport: false, hook: 'No ajuste entre rodadas, apareceu como você transforma informação do jogo em chamada curta, função clara e revisão posterior.', text: 'Uma rodada revela uma estratégia que a equipe não esperava. Como você participa do ajuste da próxima rodada?', options: ['Comunico uma informação verificável e executo uma função clara no ajuste combinado.', 'Tento recuperar a rodada sozinho ou tomo decisões pelo placar/KDA, sem alinhar o time.', 'Paro de comunicar ou sigo o plano antigo sem checar a informação nova.', 'Uso a janela permitida para confirmar uma chamada curta, prioridades e responsabilidades antes de retomar.'] },
};

const runtime = {};
vm.runInNewContext(
  `${source.slice(dataStart, dataEnd)}
  const elements = { 'setup-error': { style: {} }, athleteName: { value: 'Ana' } };
  const $ = id => elements[id];
  let profile = { name: '', sport: '', sportLabel: '', level: 'competitivo', goal: 'performance' };
  let scores = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
  let evidenceMax = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
  let fixedScores = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
  let fixedEvidenceMax = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
  let attentionEvidence = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
  let fixedAttentionEvidence = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
  let answers = {};
  let current = 0;
  let ACTIVE = [];
  function goTo() {}
  function renderQuestion() {}
  ${source.slice(contextualReadingStart, contextualReadingEnd)}
  ${source.slice(startQuestionsStart, startQuestionsEnd)}
  globalThis.startFor = sport => {
    profile.sport = sport;
    profile.sportLabel = CONTEXTUAL_QUESTIONS[sport].sportName;
    startQuestions();
    return { active: ACTIVE, answers };
  };
  globalThis.contextualFor = (sport, answerIndex) => {
    const { active } = globalThis.startFor(sport);
    answers[FIXED_QUESTIONS.length] = answerIndex;
    return contextualReading();
  };`,
  runtime,
);

test('each alternative category has only its approved Q11 and evidence matrix', () => {
  assert.equal(FIXED_QUESTIONS.length, 10);

  for (const [sport, expected] of Object.entries(otherCategories)) {
    const contextual = CONTEXTUAL_QUESTIONS[sport];
    assert.ok(contextual, `${sport} must have a contextual question`);
    assert.equal(contextual.sportName, expected.sportName);
    assert.equal(contextual.hook, expected.hook, `${sport}: approved PDF hook`);
    assert.equal(contextual.text, expected.text, `${sport}: approved Q11 text`);
    assert.equal(contextual.opts.length, 4);
    assert.deepEqual(plain(contextual.opts.map(option => option.text)), expected.options, `${sport}: approved Q11 options`);
    assert.deepEqual(plain(contextual.opts[0].d), { reg: 2 }, `${sport}: option A`);
    assert.deepEqual(plain(contextual.opts[1].d), { reg: 0 }, `${sport}: option B`);
    assert.equal(contextual.opts[1].flag, 'resultado/compensação', `${sport}: option B flag`);
    assert.deepEqual(plain(contextual.opts[2].d), {}, `${sport}: option C adds no evidence`);
    assert.equal(contextual.opts[2].flag, 'afastamento da informação', `${sport}: option C flag`);
    assert.deepEqual(
      plain(contextual.opts[3].d),
      expected.hasTaskSupport ? { reg: 1, sup: 1 } : { reg: 1 },
      `${sport}: option D only adds task support where the context has an interlocutor`,
    );
  }
});

test('alternative selection starts an isolated eleven-question journey and names its category in the PDF', () => {
  for (const [sport, expected] of Object.entries(otherCategories)) {
    const { active, answers } = runtime.startFor(sport);
    assert.equal(active.length, 11, `${sport}: exactly eleven questions`);
    assert.equal(active.at(-1).sportName, expected.sportName, `${sport}: no generic fallback`);
    assert.deepEqual(plain(answers), {}, `${sport}: prior answers do not leak`);

    const expectedBlocks = ['referência de processo', 'urgência de compensar', 'não mostra com clareza', 'observação objetiva'];
    for (const [answerIndex, expectedBlock] of expectedBlocks.entries()) {
      const reading = runtime.contextualFor(sport, answerIndex);
      assert.equal(reading.hook, expected.hook, `${sport}: approved PDF hook`);
      assert.match(reading.text, new RegExp(expected.sportName.replace(/[/.]/g, '\\$&')),
        `${sport}: PDF names the selected category`);
      assert.match(reading.text, new RegExp(expectedBlock), `${sport}: PDF block for option ${answerIndex + 1}`);
      assert.equal(reading.flag, answerIndex === 1 ? 'resultado/compensação' : answerIndex === 2 ? 'afastamento da informação' : undefined,
        `${sport}: PDF flag for option ${answerIndex + 1}`);
      if (answerIndex === 1) assert.match(reading.flagInvitation, /resultado|compensação/i,
        `${sport}: compensation flag includes its contextual invitation`);
      if (answerIndex === 2) assert.match(reading.flagInvitation, /informação/i,
        `${sport}: information-distancing flag includes its contextual invitation`);
      assert.equal(reading.safeguard, '', `${sport}: no bodybuilding-only safeguard`);
    }
  }
});

test('the alternative-category picker keeps its controls independent from direct sports', () => {
  const values = [...source.matchAll(/class="sport-other-result" data-value="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(values, Object.keys(otherCategories));
  assert.match(source, /sportOtherResults\.querySelectorAll\('\.sport-other-result'\)\.forEach\(c => c\.classList\.remove\('selected'\)\)/);
  assert.match(source, /document\.querySelectorAll\('\.chip\[data-group="sport"\]'\)\.forEach\(c => c\.classList\.remove\('selected'\)\)/);
  assert.match(source, /closeSportOther\(\);\s+sportOtherResults\.querySelectorAll\('\.sport-other-result'\)\.forEach\(c => c\.classList\.remove\('selected'\)\);\s+sportOtherToggle\.classList\.remove\('selected'\)/);
  assert.match(source, /sportOtherToggle\.classList\.add\('selected'\)/);
  assert.match(source, /closeSportOther\(\);/);
});
