import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function protectedHoverOffsets(css) {
  const start = css.indexOf('@media (hover: hover) and (pointer: fine)');
  assert.notEqual(start, -1, 'media query de hover ausente');
  const open = css.indexOf('{', start);
  let depth = 0;
  for (let index = open; index < css.length; index++) {
    if (css[index] === '{') depth++;
    if (css[index] === '}' && --depth === 0) return [start, index];
  }
  throw new Error('media query de hover sem fechamento');
}

for (const file of ['src/web.dc.html', 'src/mobile.dc.html']) {
  test(`${file}: hover interativo está protegido para touch`, async () => {
    const css = await readFile(file, 'utf8');
    const [start, end] = protectedHoverOffsets(css);
    for (const match of css.matchAll(/[^\n{}]+:hover[^\n{]*\{/g)) {
      assert.ok(match.index >= start && match.index <= end, `${match[0].trim()} fora do media query`);
    }
  });
}
