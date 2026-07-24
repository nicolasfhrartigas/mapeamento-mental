const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const indexPath = path.join(__dirname, '..', 'index.html');
const source = fs.readFileSync(indexPath, 'utf8');
const questionnaire = fs.readFileSync(path.join(__dirname, '..', 'questionario_atletas_ptbr.txt'), 'utf8');
const script = source.slice(source.indexOf('    const DIMS = {'), source.indexOf('    function showResult() {'));
const expectedSports = ['fisiculturismo', 'futebol', 'corrida', 'volei', 'tenis', 'coletivos', 'resistencia', 'luta', 'raquetes', 'habilidades_mira', 'e_sports'];
const toPlain = value => JSON.parse(JSON.stringify(value));

function createRuntime() {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, {
      id, value: '', textContent: '', innerHTML: '', style: {}, classList: { add() {}, remove() {}, toggle() {} },
      addEventListener() {}, appendChild() {}, querySelectorAll() { return []; },
    });
    return elements.get(id);
  };
  const context = {
    URLSearchParams, console,
    location: { search: '' },
    fetch() { return Promise.resolve(); },
    window: { scrollTo() {} },
    document: {
      getElementById: element,
      querySelectorAll() { return []; },
      addEventListener() {},
      createElement() { return element(`generated-${elements.size}`); },
    },
  };
  vm.runInNewContext(`${script}
    globalThis.api = {
      start: sport => { profile.sport = sport; profile.sportLabel = CONTEXTUAL_QUESTIONS[sport].sportName; profile.level = 'alto'; profile.goal = 'competir'; $('athleteName').value = 'Ana'; startQuestions(); },
      answer: index => { const question = ACTIVE[current]; answers[current] = index; applyAnswer(question, question.opts[index], 1); current += 1; },
      replaceAnswer: (questionIndex, from, to) => { applyAnswer(ACTIVE[questionIndex], ACTIVE[questionIndex].opts[from], -1); applyAnswer(ACTIVE[questionIndex], ACTIVE[questionIndex].opts[to], 1); answers[questionIndex] = to; },
      state: () => ({ active: ACTIVE, answers: { ...answers }, scores: { ...scores }, evidenceMax: { ...evidenceMax }, fixedEvidenceMax: { ...fixedEvidenceMax }, attentionEvidence: { ...attentionEvidence } }),
      profile: () => selectProfile(),
      q11OnlyProfile: (sport, answer) => {
        profile.sport = sport;
        ACTIVE = [CONTEXTUAL_QUESTIONS[sport]];
        answers = { 0: answer };
        scores = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
        evidenceMax = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
        fixedScores = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
        fixedEvidenceMax = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
        attentionEvidence = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
        fixedAttentionEvidence = { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 };
        applyAnswer(ACTIVE[0], ACTIVE[0].opts[answer], 1);
        return selectProfile();
      },
      summary: factor => factorSummary(factor),
      contextual: () => contextualReading(),
      data: () => ({ FIXED_QUESTIONS, CONTEXTUAL_QUESTIONS, CONTEXTUAL_PDF_TEXT }),
    };`, context);
  return context.api;
}

function referenceQuestions() {
  return [...questionnaire.matchAll(/^\*\*\d+\.\*\* (.+?)\n\n(?:\*.+?\*\n\n)?((?:[A-D]\) .+(?:\n|$)){4})/gm)]
    .map(([, text, options]) => ({ text, options: [...options.matchAll(/^[A-D]\) (.+)$/gm)].map(([, option]) => option) }));
}

test('all eleven selections compose only the literal fixed questions plus their approved Q11', () => {
  const api = createRuntime();
  const { FIXED_QUESTIONS, CONTEXTUAL_QUESTIONS } = api.data();
  const reference = referenceQuestions();

  assert.equal(FIXED_QUESTIONS.length, 10);
  assert.deepEqual(toPlain(FIXED_QUESTIONS.map(question => ({ text: question.text, options: question.opts.map(option => option.text) }))), reference);
  assert.deepEqual(Object.keys(CONTEXTUAL_QUESTIONS), expectedSports);

  for (const sport of expectedSports) {
    api.start(sport);
    const { active, answers } = api.state();
    assert.equal(active.length, 11, `${sport}: exactly eleven questions`);
    assert.deepEqual(toPlain(active.slice(0, 10)), toPlain(FIXED_QUESTIONS), `${sport}: fixed questions remain unchanged`);
    assert.equal(active[10], CONTEXTUAL_QUESTIONS[sport], `${sport}: only its own Q11 is appended`);
    assert.deepEqual(toPlain(answers), {}, `${sport}: a new journey starts clean`);
  }
});

test('the evidence model handles full evidence, indeterminacy, ambiguity, edits, and Q11 limits', () => {
  const complete = createRuntime();
  complete.start('futebol');
  [2, 1, 0, 2, 1, 1, 2, 2, 2, 2, 0].forEach(answer => complete.answer(answer));
  assert.equal(complete.profile().name, 'A Mente Calibrada');
  assert.ok(['process', 'alignment'].includes(complete.contextual().text.includes('referência de processo') ? 'process' : 'alignment'));

  const partial = createRuntime();
  const q11Only = partial.q11OnlyProfile('tenis', 0);
  assert.equal(q11Only.partial, true, 'Q11 cannot choose a profile on its own');

  const contextualCannotTipProfile = createRuntime();
  contextualCannotTipProfile.start('futebol');
  [3, 1, 3, 0, 2, 1, 1, 3, 0, 2].forEach(answer => contextualCannotTipProfile.answer(answer));
  const profileBeforeQ11 = contextualCannotTipProfile.profile().name;
  contextualCannotTipProfile.answer(1); // Q11: a theme for regulation to observe
  assert.equal(contextualCannotTipProfile.profile().name, profileBeforeQ11, 'Q11 cannot change a profile chosen from fixed questions');

  const ambiguous = createRuntime();
  ambiguous.start('corrida');
  for (let index = 0; index < 10; index += 1) ambiguous.answer(3);
  const before = ambiguous.state();
  ambiguous.answer(2); // Q11 option C: intentionally no evidence
  const after = ambiguous.state();
  assert.deepEqual(toPlain(after.scores), toPlain(before.scores));
  assert.deepEqual(toPlain(after.evidenceMax), toPlain(before.evidenceMax));
  assert.equal(after.attentionEvidence.reg, before.attentionEvidence.reg);
  assert.equal(ambiguous.contextual().flag, 'afastamento da informação');

  const edited = createRuntime();
  edited.start('volei');
  edited.answer(2); // Q1 option C
  edited.replaceAnswer(0, 2, 0); // then change to Q1 option A
  const state = edited.state();
  assert.deepEqual(toPlain(state.scores), { perf: 0, motiv: 0, reg: 0, medo: 0, ident: 0, sup: 0 });
  assert.deepEqual(toPlain(state.evidenceMax), { perf: 2, motiv: 0, reg: 2, medo: 0, ident: 0, sup: 0 });
  assert.deepEqual(toPlain(state.attentionEvidence), { perf: 1, motiv: 0, reg: 1, medo: 0, ident: 0, sup: 0 });
});

test('the output stays educational, names eleven questions, and preserves the touch hover guard', () => {
  assert.match(source, /10 perguntas fixas e uma pergunta contextual/);
  assert.match(source, /Pergunta \$\{current \+ 1\} de \$\{ACTIVE\.length\}/);
  assert.match(source, /Ponto de atenção da sua modalidade/);
  assert.match(source, /const contextualHtml = contextual/, 'the contextual reading is displayed on the result screen');
  assert.match(source, /mapeamento educativo de autoconhecimento com 11 perguntas/, 'share and WhatsApp messages keep the educational framing');
  assert.doesNotMatch(source, /Risco Futuro Sem Intervenção|PROJEÇÃO DE PADRÃO|futureRisk/);
  assert.doesNotMatch(source, /p\d+\/100|PONTO FORTE\/EM CONSTRUÇÃO\/PONTO DE ATENÇÃO/);

  const style = source.match(/<style>([\s\S]*?)<\/style>/)[1];
  const hoverGuard = /@media \(hover: hover\) and \(pointer: fine\) \{([\s\S]*?)\n    \}/.exec(style);
  assert.ok(hoverGuard, 'a fine-pointer hover guard exists');
  const allHovers = [...style.matchAll(/^\s*[^@\n][^{\n]*:hover[^\n]*\{/gm)].map(match => match[0].trim());
  const guardedHovers = [...hoverGuard[1].matchAll(/^\s*[^@\n][^{\n]*:hover[^\n]*\{/gm)].map(match => match[0].trim());
  assert.deepEqual(allHovers, guardedHovers, 'every hover selector is inside the one fine-pointer guard');
});
