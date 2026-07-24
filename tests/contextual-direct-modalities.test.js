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

assert.notEqual(dataStart, -1, 'FIXED_QUESTIONS must exist');
assert.notEqual(dataEnd, -1, 'FIXED_FLAG_PROMPTS must exist');
assert.notEqual(contextualReadingStart, -1, 'contextualReading must exist');
assert.notEqual(contextualReadingEnd, -1, 'contextualReading must end before global state');
assert.notEqual(startQuestionsStart, -1, 'startQuestions must exist');
assert.notEqual(startQuestionsEnd, -1, 'startQuestions must end before renderQuestion');

const context = {};
vm.runInNewContext(
  `${source.slice(dataStart, dataEnd)}\nglobalThis.questionData = { FIXED_QUESTIONS, CONTEXTUAL_QUESTIONS, CONTEXTUAL_PDF_TEXT };`,
  context,
);

const { FIXED_QUESTIONS, CONTEXTUAL_QUESTIONS, CONTEXTUAL_PDF_TEXT } = context.questionData;
const plain = value => JSON.parse(JSON.stringify(value));
const directSports = {
  futebol: { sportName: 'Futebol', hasTaskSupport: true },
  corrida: { sportName: 'Corrida / Atletismo', hasTaskSupport: false },
  volei: { sportName: 'Vôlei', hasTaskSupport: true },
  tenis: { sportName: 'Tênis', hasTaskSupport: false },
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

test('each direct modality is ten fixed questions plus its approved Q11', () => {
  assert.equal(FIXED_QUESTIONS.length, 10);
  assert.ok(FIXED_QUESTIONS.every(question => question.fixed));

  for (const [sport, expected] of Object.entries(directSports)) {
    const contextual = CONTEXTUAL_QUESTIONS[sport];
    assert.ok(contextual, `${sport} must have a contextual question`);
    assert.equal(contextual.sportName, expected.sportName);
    assert.match(contextual.label, /^Pergunta contextual/);
    assert.ok(contextual.hook);
    assert.equal(contextual.opts.length, 4);
  }
});

test('direct-modalities Q11 evidence follows the approved process, flag, and task-support matrix', () => {
  for (const [sport, expected] of Object.entries(directSports)) {
    const options = CONTEXTUAL_QUESTIONS[sport].opts;

    assert.deepEqual(plain(options[0].d), { reg: 2 }, `${sport}: option A`);
    assert.deepEqual(plain(options[1].d), { reg: 0 }, `${sport}: option B`);
    assert.equal(options[1].flag, 'resultado/compensação', `${sport}: option B flag`);
    assert.deepEqual(plain(options[2].d), {}, `${sport}: option C must not add evidence`);
    assert.equal(options[2].flag, 'afastamento da informação', `${sport}: option C flag`);
    assert.deepEqual(
      plain(options[3].d),
      expected.hasTaskSupport ? { reg: 1, sup: 1 } : { reg: 1 },
      `${sport}: option D must only add task support when the context permits it`,
    );
  }
});

test('a new selection creates its own journey and contextual PDF reading', () => {
  for (const [sport, expected] of Object.entries(directSports)) {
    const { active, answers } = runtime.startFor(sport);
    assert.equal(active.length, 11, `${sport}: exactly eleven questions`);
    assert.equal(active.at(-1).sportName, expected.sportName, `${sport}: only its Q11`);
    assert.deepEqual(plain(answers), {}, `${sport}: no answers leak from a prior selection`);

    const reading = runtime.contextualFor(sport, 3);
    assert.equal(reading.hook, CONTEXTUAL_QUESTIONS[sport].hook, `${sport}: PDF hook`);
    assert.match(reading.text, new RegExp(expected.sportName.replace(/[/.]/g, '\\$&')),
      `${sport}: PDF text names the selected modality`);
    assert.equal(reading.safeguard, '', `${sport}: no unrelated safeguard`);

    const compensation = runtime.contextualFor(sport, 1);
    assert.match(compensation.flagInvitation, /resultado|compensação/i,
      `${sport}: the compensation flag has a visible contextual invitation`);
    const distancing = runtime.contextualFor(sport, 2);
    assert.match(distancing.flagInvitation, /informação/i,
      `${sport}: the information-distancing flag has a visible contextual invitation`);
  }

  assert.equal(Object.keys(CONTEXTUAL_PDF_TEXT).length, 4);
});
