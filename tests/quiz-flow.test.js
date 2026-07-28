import test from 'node:test';
import assert from 'node:assert/strict';

import { createEngine } from '../src/quiz-engine.js';
import { SPORTS, createQuizFlow } from '../src/quiz-flow.js';

function harness() {
  let state = { screen: 'setup', name: '', sport: '', sportLabel: '', level: '', goal: '', sportOpen: false, missing: [], tick: 0 };
  const patches = [];
  const flow = createQuizFlow({
    engine: createEngine(), getState: () => state,
    setState: patch => { patches.push(patch); state = { ...state, ...patch }; },
    top: () => {}, scrollToRef: () => {},
  });
  return { flow, state: () => state, patches };
}

test('valida setup, seleciona modalidade e inicia o questionário', () => {
  const app = harness();
  assert.equal(app.flow.start(), false);
  assert.deepEqual(app.state().missing, ['name', 'sport', 'level', 'goal']);
  app.flow.pick('sport', SPORTS[0]);
  app.flow.pick('level', { value: 'alto' });
  app.flow.pick('goal', { value: 'competir' });
  app.state().name = 'Ana';
  assert.equal(app.flow.start(), true);
  assert.equal(app.state().screen, 'question');
});

test('fecha Outros esportes ao clicar fora e remove o listener', () => {
  const app = harness();
  const added = []; const removed = [];
  const originalDocument = globalThis.document;
  globalThis.document = {
    addEventListener: (_, handler) => added.push(handler),
    removeEventListener: (_, handler) => removed.push(handler),
  };
  const target = { current: { contains: () => false } };
  app.flow.attachOutsideClick(target);
  app.state().sportOpen = true;
  added[0]({ target: {} });
  assert.equal(app.state().sportOpen, false);
  app.flow.detachOutsideClick();
  assert.equal(removed[0], added[0]);
  globalThis.document = originalDocument;
});

test('controla responder, voltar e reiniciar a jornada compartilhada', () => {
  const app = harness();
  app.state().name = 'Ana';
  app.flow.pick('sport', SPORTS[0]);
  app.flow.pick('level', { value: 'alto' });
  app.flow.pick('goal', { value: 'competir' });
  app.flow.start();
  app.flow.answer(0);
  app.flow.answer(0);
  assert.equal(app.flow.back(), true);
  app.flow.answer(1);
  while (app.state().screen !== 'result') app.flow.answer(0);
  assert.equal(app.state().result.dims.length, 6);
  app.flow.restart();
  assert.equal(app.state().screen, 'intro');
  assert.equal(app.state().result, null);
  assert.equal(app.state().sport, '');
});
