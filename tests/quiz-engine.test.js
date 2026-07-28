import test from 'node:test';
import assert from 'node:assert/strict';

import { CONTEXTUAL_QUESTIONS, createEngine } from '../src/quiz-engine.js';

const profile = { name: 'Ana', level: 'alto', goal: 'competir' };

function configuredEngine(sport) {
  const engine = createEngine();
  Object.entries({ ...profile, sport, sportLabel: sport }).forEach(([field, value]) => engine.setProfileField(field, value));
  engine.start();
  return engine;
}

function complete(engine, option = 0) {
  while (engine.getCurrent() < engine.getTotal()) engine.select(option);
  return engine.result();
}

test('inicia as 11 perguntas para cada modalidade', () => {
  for (const sport of Object.keys(CONTEXTUAL_QUESTIONS)) {
    const engine = configuredEngine(sport);
    assert.equal(engine.getTotal(), 11, sport);
    assert.equal(engine.getQuestion().text.length > 0, true, sport);
    assert.equal(engine.getActive().at(-1).sportName, CONTEXTUAL_QUESTIONS[sport].sportName, sport);
  }
});

test('conclui as 11 perguntas e gera resultado consistente', () => {
  const engine = configuredEngine('futebol');
  const first = complete(engine);
  const second = engine.result();
  assert.equal(engine.getCurrent(), 11);
  assert.equal(first.prof.name, second.prof.name);
  assert.deepEqual(first.dims, second.dims);
  assert.equal('waLink' in first, false);
});

test('voltar e responder de novo substitui a pontuação, sem acumulá-la', () => {
  const changed = configuredEngine('corrida');
  changed.select(0);
  changed.select(0);
  changed.back();
  changed.select(1);
  const changedResult = complete(changed, 0);
  const expected = configuredEngine('corrida');
  expected.select(0);
  expected.select(1);
  const expectedResult = complete(expected, 0);
  assert.deepEqual(changedResult.dims, expectedResult.dims);
});

test('reinicia e permite uma segunda jornada independente', () => {
  const engine = configuredEngine('tenis');
  complete(engine, 0);
  engine.resetState();
  Object.entries({ ...profile, sport: 'luta', sportLabel: 'luta' }).forEach(([field, value]) => engine.setProfileField(field, value));
  engine.start();
  const result = complete(engine, 1);
  assert.equal(engine.getTotal(), 11);
  assert.equal(engine.getActive().at(-1).sportName, CONTEXTUAL_QUESTIONS.luta.sportName);
  assert.equal(result.dims.length, 6);
});
