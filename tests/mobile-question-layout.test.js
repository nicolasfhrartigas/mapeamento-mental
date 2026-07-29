import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('mobile reserva espaço para as quatro alternativas em telas baixas', async () => {
  const source = await readFile('src/mobile.dc.html', 'utf8');

  assert.match(source, /mainClass: s\.screen === 'question' \? 'mobile-question-main'/);
  assert.match(source, /class="mobile-question-step"/);
  assert.match(source, /class="mobile-question-option"/);
  assert.match(source, /@media \(max-height: 740px\)[\s\S]*\.mobile-question-main[\s\S]*padding: 10px 20px 12px !important/);
  assert.match(source, /@media \(max-height: 740px\)[\s\S]*\.mobile-question-option[\s\S]*padding: 9px 20px !important/);
});
