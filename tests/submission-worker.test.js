import test from 'node:test';
import assert from 'node:assert/strict';

import { allowedOrigin, recoveryCode, validPayload } from '../worker/index.js';

const payload = {
  schemaVersion: 1,
  athleteName: 'Ana',
  sportLabel: 'Corrida',
  answers: Array.from({ length: 11 }, () => ({ question: 'Pergunta', response: 'Resposta' })),
  factors: Array.from({ length: 6 }, () => ({ name: 'Fator', percent: 50 })),
  prof: { name: 'A Mente Calibrada' },
};

test('valida somente o formato mínimo do resultado esperado', () => {
  assert.equal(validPayload(payload), true);
  assert.equal(validPayload({ ...payload, answers: [] }), false);
  assert.equal(validPayload({ ...payload, athleteName: '' }), false);
});

test('gera código de recuperação aleatório e legível', () => {
  assert.match(recoveryCode(), /^[A-F0-9]{4}(?:-[A-F0-9]{4}){3}$/);
  assert.notEqual(recoveryCode(), recoveryCode());
});

test('restringe chamadas do navegador às origens do site e de desenvolvimento', () => {
  assert.equal(allowedOrigin('https://nicolasfhrartigas.github.io', 'https://nicolasfhrartigas.github.io'), true);
  assert.equal(allowedOrigin('http://localhost:8000', 'https://nicolasfhrartigas.github.io'), true);
  assert.equal(allowedOrigin('https://example.com', 'https://nicolasfhrartigas.github.io'), false);
});
