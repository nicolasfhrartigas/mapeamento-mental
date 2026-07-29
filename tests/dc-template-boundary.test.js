import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

for (const file of ['src/web.dc.html', 'src/mobile.dc.html']) {
  test(`${file}: o primeiro <x-dc> do HTML bruto abre o template real`, async () => {
    const source = await readFile(file, 'utf8');
    const open = /<x-dc(?:\s[^>]*)?>/.exec(source);
    const close = source.lastIndexOf('</x-dc>');

    assert.ok(open, 'o documento precisa conter <x-dc>');
    assert.ok(close > open.index, 'o documento precisa fechar </x-dc>');

    const template = source.slice(open.index + open[0].length, close);
    assert.match(template, /^\s*<helmet>/);
  });
}
