import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('mobile reduz a tela inicial em telas baixas para caber sem cortar o CTA', async () => {
  const source = await readFile('src/mobile.dc.html', 'utf8');

  assert.match(source, /mainClass: s\.screen === 'question' \? 'mobile-question-main' : s\.screen === 'intro' \? 'mobile-intro-main'/);
  assert.match(source, /class="mobile-intro-step"/);
  assert.match(source, /class="mobile-intro-stats"/);
  assert.match(source, /@media \(max-height: 740px\)[\s\S]*\.mobile-intro-main[\s\S]*padding: 20px 20px 24px !important/);
  assert.match(source, /@media \(max-height: 740px\)[\s\S]*\.mobile-intro-title[\s\S]*font-size: 34px !important/);
});

test('mobile esconde o disclaimer da intro em qualquer altura de tela, não só nas baixas', async () => {
  const source = await readFile('src/mobile.dc.html', 'utf8');

  assert.match(source, /\.mobile-intro-fine \{\s*display: none\s*\}/);
  assert.doesNotMatch(
    source,
    /@media \(max-height: 740px\)[\s\S]*\.mobile-intro-fine/,
  );
});
