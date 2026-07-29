import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('mobile reduz a tela inicial em telas baixas para caber sem cortar o CTA', async () => {
  const source = await readFile('src/mobile.dc.html', 'utf8');

  assert.match(source, /mainClass: s\.screen === 'question' \? 'mobile-question-main' : s\.screen === 'intro' \? 'mobile-intro-main'/);
  assert.match(source, /class="mobile-intro-step"/);
  assert.match(source, /class="mobile-intro-hero"/);
  assert.match(source, /class="mobile-intro-copy"/);
  assert.match(source, /class="mobile-intro-guide"/);
  assert.match(source, /class="mobile-intro-stats"/);
  assert.match(source, /\.mobile-intro-step \{[\s\S]*flex: 1/);
  assert.match(source, /\.mobile-intro-stats \{[\s\S]*margin-top: auto/);
  assert.match(source, /@media \(max-height: 740px\)[\s\S]*\.mobile-intro-main[\s\S]*padding: 20px 20px 24px !important/);
  assert.match(source, /@media \(max-height: 740px\)[\s\S]*\.mobile-intro-title[\s\S]*font-size: 34px !important/);
});

test('mobile mantém o disclaimer no fim da intro, acessível por scroll', async () => {
  const source = await readFile('src/mobile.dc.html', 'utf8');

  assert.match(source, /\.mobile-intro-fine \{\s*display: block;\s*margin-top: 72px/);
  assert.match(source, /class="mobile-intro-stats"[\s\S]*class="mobile-intro-fine"/);
  assert.match(source, /@media \(max-height: 740px\)[\s\S]*\.mobile-intro-fine \{\s*margin-top: 56px/);
});
