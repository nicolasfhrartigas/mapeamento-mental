import test from 'node:test';
import assert from 'node:assert/strict';

import { createAnalytics } from '../src/analytics.js';

function browserHarness({
  hostname = 'example.com',
  pathname = '/src/mobile.dc.html',
  search = '?a_url=%2F%3Futm_source%3Dinstagram&a_ref=https%3A%2F%2Finstagram.com%2F',
} = {}) {
  const scripts = [];
  const window = {
    location: { hostname, pathname, search },
    umami: null,
  };
  const document = {
    createElement: () => ({
      attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
    }),
    head: {
      appendChild(script) { scripts.push(script); },
    },
  };
  return { window, document, scripts };
}

test('envia pageview e evento com URL/referrer da landing e tag da tela', () => {
  const app = browserHarness();
  const analytics = createAnalytics({
    browserWindow: app.window,
    browserDocument: app.document,
    websiteId: '00000000-0000-4000-8000-000000000000',
  });

  analytics.track('quiz-iniciado', { esporte: 'corrida' });
  assert.equal(app.scripts.length, 1);
  assert.equal(app.scripts[0].attributes['data-auto-track'], 'false');
  assert.equal(app.scripts[0].attributes['data-tag'], 'mobile');

  const payloads = [];
  app.window.umami = {
    track(build) {
      payloads.push(build({
        website: 'site-id',
        url: '/src/mobile.dc.html',
        referrer: 'https://example.com/',
      }));
    },
  };
  app.scripts[0].onload();

  assert.deepEqual(payloads, [
    {
      website: 'site-id',
      url: '/?utm_source=instagram',
      referrer: 'https://instagram.com/',
    },
    {
      website: 'site-id',
      url: '/?utm_source=instagram',
      referrer: 'https://instagram.com/',
      name: 'quiz-iniciado',
      data: { view: 'mobile', esporte: 'corrida' },
    },
  ]);
});

test('não carrega o tracker em ambiente local', () => {
  const app = browserHarness({ hostname: 'localhost' });
  const analytics = createAnalytics({
    browserWindow: app.window,
    browserDocument: app.document,
    websiteId: '00000000-0000-4000-8000-000000000000',
  });

  analytics.track('quiz-iniciado');
  assert.equal(app.scripts.length, 0);
});
