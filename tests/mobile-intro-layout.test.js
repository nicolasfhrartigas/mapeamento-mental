import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('mobile reduz a tela inicial em telas baixas para caber sem cortar o CTA', async () => {
  const source = await readFile('src/mobile.dc.html', 'utf8');

  assert.match(source, /mainClass: s\.screen === 'question' \? 'mobile-question-main' : s\.screen === 'intro' \? 'mobile-intro-main'/);
  assert.match(source, /class="mobile-intro-step"/);
  assert.match(source, /class="mobile-intro-stats"/);
  assert.match(source, /@media \(max-height: 740px\)[\s\S]*\.mobile-intro-main[\s\S]*padding: 16px 20px 20px !important/);
  assert.match(source, /@media \(max-height: 740px\)[\s\S]*\.mobile-intro-title[\s\S]*font-size: 30px !important/);
});
