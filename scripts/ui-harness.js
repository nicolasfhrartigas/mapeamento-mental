#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const artifactsDir = path.join(root, 'artifacts', 'ui');
const saveScreenshots = process.argv.includes('--screenshots');
const viewports = [
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false },
];
const officialProfiles = [
  'O Perfeccionista em Chamas', 'O Navegador sem Bússola', 'O Atleta de Dois Tempos',
  'O Atleta em Suspensão', 'O Executor em Alerta', 'A Mente Calibrada',
  'O Gigante Contido', 'O Competidor Incansável',
];
const report = {
  executedAt: new Date().toISOString(),
  browser: 'Chromium (Playwright)',
  screenshotsEnabled: saveScreenshots,
  runs: [],
  assertions: [],
  screenshots: [],
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      const requestPath = new URL(request.url, 'http://localhost').pathname;
      if (requestPath !== '/' && requestPath !== '/index.html') {
        response.writeHead(404).end('Not found');
        return;
      }
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      response.end(fs.readFileSync(path.join(root, 'index.html')));
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function addAssertion(run, name, passed, error = '') {
  const entry = { viewport: run.viewport, journey: run.journey, name, passed, error };
  run.assertions.push(entry);
  report.assertions.push(entry);
}

async function check(run, name, callback) {
  try {
    await callback();
    addAssertion(run, name, true);
  } catch (error) {
    addAssertion(run, name, false, error.message);
    throw error;
  }
}

async function assertVisibleEnabled(locator, description) {
  await assert.equal(await locator.isVisible(), true, `${description} must be visible`);
  await assert.equal(await locator.isEnabled(), true, `${description} must be enabled`);
}

async function assertInViewportAndUncovered(locator, description) {
  await locator.scrollIntoViewIfNeeded();
  const result = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const points = [
      [rect.left + rect.width / 2, rect.top + rect.height / 2],
      [rect.left + 2, rect.top + 2],
      [rect.right - 2, rect.bottom - 2],
    ];
    const inViewport = rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0
      && rect.right <= window.innerWidth && rect.bottom <= window.innerHeight;
    const covered = points.some(([x, y]) => {
      const hit = document.elementFromPoint(x, y);
      return !hit || (hit !== element && !element.contains(hit) && !hit.contains(element));
    });
    return { inViewport, covered, rect: { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left } };
  });
  assert.equal(result.inViewport, true, `${description} must fit in the viewport: ${JSON.stringify(result.rect)}`);
  assert.equal(result.covered, false, `${description} must not be covered at its actionable points`);
}

async function screenshot(page, run, stage) {
  if (!saveScreenshots) return;
  const viewportDir = path.join(artifactsDir, run.viewport);
  fs.mkdirSync(viewportDir, { recursive: true });
  const file = path.join(viewportDir, `${stage}.png`);
  await page.screenshot({ path: file, fullPage: false, animations: 'disabled' });
  const relative = path.relative(root, file);
  run.screenshots.push(relative);
  report.screenshots.push({ viewport: run.viewport, stage, path: relative });
}

async function selectSetup(page, sportButton, run) {
  await page.getByRole('button', { name: 'Começar o mapeamento →' }).click();
  await page.getByPlaceholder('Como prefere ser chamado(a)?').fill('Ana');
  const level = page.getByRole('button', { name: 'Alto Rendimento' });
  const goal = page.getByRole('button', { name: 'Competir e vencer' });
  await check(run, 'setup selection controls are visible, enabled, in viewport, and uncovered', async () => {
    for (const [control, description] of [[sportButton, 'direct sport'], [level, 'competitive level'], [goal, 'goal']]) {
      await assertVisibleEnabled(control, description);
      await assertInViewportAndUncovered(control, description);
    }
  });
  await sportButton.click();
  await level.click();
  await goal.click();
}

async function answerCurrent(page, index) {
  const options = page.locator('#qOptions .opt');
  await assert.equal(await options.count(), 4, 'every question must have four answer controls');
  const option = options.nth(index);
  await assertVisibleEnabled(option, `answer ${index + 1}`);
  await assertInViewportAndUncovered(option, `answer ${index + 1}`);
  await option.click();
}

async function completeDirectJourney(page, run) {
  await selectSetup(page, page.getByRole('button', { name: /Futebol/ }), run);
  const continueButton = page.getByRole('button', { name: /Continuar/ });
  await check(run, 'setup controls are visible, enabled, in viewport, and uncovered', async () => {
    await assertVisibleEnabled(continueButton, 'continue button');
    await assertInViewportAndUncovered(continueButton, 'continue button');
  });
  await continueButton.click();

  const answers = [2, 1, 0, 2, 1, 1, 2, 2, 2, 2, 1];
  for (let question = 0; question < answers.length; question += 1) {
    const number = page.locator('#qDim');
    await check(run, `shows Pergunta ${question + 1} de 11`, async () => {
      await assert.equal(await number.textContent(), `Pergunta ${question + 1} de 11`);
    });
    if (question === 3) await screenshot(page, run, 'pergunta-intermediaria');
    if (question === 10) await screenshot(page, run, 'pergunta-11');
    await answerCurrent(page, answers[question]);

    if (question === 2) {
      const back = page.getByRole('button', { name: '← voltar' });
      await check(run, 'back navigation is visible, enabled, in viewport, and uncovered', async () => {
        await assertVisibleEnabled(back, 'back button');
        await assertInViewportAndUncovered(back, 'back button');
      });
      await back.click();
      await check(run, 'back returns to Pergunta 3 de 11', async () => {
        await assert.equal(await number.textContent(), 'Pergunta 3 de 11');
      });
      await answerCurrent(page, 3);
    }
  }

  const profileName = page.locator('.profile-name');
  await check(run, 'result screen presents an official profile and never Leitura situada', async () => {
    await assert.equal(await page.locator('#s-result').evaluate((element) => element.classList.contains('active')), true);
    const name = (await profileName.textContent()).trim();
    assert.ok(officialProfiles.includes(name), `unexpected profile: ${name}`);
    assert.equal(await page.getByText('Leitura situada', { exact: false }).count(), 0);
  });
  await screenshot(page, run, 'resultado');
  await check(run, 'result screen omits removed contextual and reflection sections', async () => {
    for (const heading of ['Ponto de atenção da sua modalidade', 'O que joga a seu favor', 'O que merece atenção', 'O que pode valer observar agora', 'Por onde começar', 'Sobre este resultado:']) {
      await assert.equal(await page.getByText(heading, { exact: true }).count(), 0, `removed heading is visible: ${heading}`);
    }
    for (const flag of ['Evidência direta', 'Tema para observar', 'Evidência insuficiente']) {
      await assert.equal(await page.getByText(flag, { exact: true }).count(), 0, `removed factor flag is visible: ${flag}`);
    }
    const factorBars = page.locator('.dim-track');
    await assert.equal(await factorBars.count(), 6, 'each factor must display a percentage bar');
    for (let index = 0; index < await factorBars.count(); index += 1) {
      await assertVisibleEnabled(factorBars.nth(index), `factor bar ${index + 1}`);
    }
    await assert.equal(await page.getByRole('button', { name: /Compartilhar meu resultado/ }).count(), 0, 'removed share button is visible');
  });
}

async function verifyOtherSports(page, run) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Começar o mapeamento →' }).click();
  const toggle = page.locator('#sportOtherToggle');
  await check(run, 'other sports toggle is visible, enabled, in viewport, and uncovered', async () => {
    await assertVisibleEnabled(toggle, 'other sports toggle');
    await assertInViewportAndUncovered(toggle, 'other sports toggle');
  });
  await tapWithoutHoverAppearance(page, run, toggle);
  const menu = page.locator('#sportOtherResults');
  await check(run, 'other sports dropdown opens', async () => {
    await assert.equal(await menu.evaluate((element) => element.classList.contains('open')), true);
    await assertVisibleEnabled(page.getByRole('button', { name: /Esportes Coletivos/ }), 'alternative category');
  });
  await screenshot(page, run, 'outros-esportes-aberto');
  const alternative = page.getByRole('button', { name: /Esportes Coletivos/ });
  await assertInViewportAndUncovered(alternative, 'alternative category');
  await alternative.click();
  await check(run, 'other sports dropdown accepts a category and closes', async () => {
    await assert.equal(await menu.evaluate((element) => element.classList.contains('open')), false);
    await assert.match((await toggle.textContent()).replace(/\s+/g, ' ').trim(), /Esportes Coletivos/);
  });
}

async function tapWithoutHoverAppearance(page, run, locator) {
  if (run.viewport !== 'mobile') {
    await locator.click();
    return;
  }
  const before = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return [style.backgroundColor, style.borderColor, style.color, style.boxShadow, style.transform];
  });
  await locator.tap();
  await check(run, 'a real touch leaves no exclusive hover appearance on its control', async () => {
    const after = await locator.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        hoverStylesCanApply: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
        values: [style.backgroundColor, style.borderColor, style.color, style.boxShadow, style.transform],
      };
    });
    assert.equal(after.hoverStylesCanApply, false, 'touch viewport must not activate fine-pointer hover styles');
    assert.deepEqual(after.values, before, 'touch must not change the control into a hover-only appearance');
  });
}

async function assertHoverGuard(run) {
  await check(run, 'every interactive :hover selector is inside the sole fine-pointer media guard', async () => {
    const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const style = source.match(/<style>([\s\S]*?)<\/style>/)[1];
    const guards = style.match(/@media \(hover: hover\) and \(pointer: fine\) \{/g) || [];
    assert.equal(guards.length, 1, 'there must be exactly one fine-pointer hover guard');
    const guard = /@media \(hover: hover\) and \(pointer: fine\) \{([\s\S]*?)\n    \}/.exec(style);
    assert.ok(guard, 'fine-pointer hover guard must close correctly');
    const all = [...style.matchAll(/^\s*[^@\n][^{\n]*:hover[^\n]*\{/gm)].map((match) => match[0].trim());
    const guarded = [...guard[1].matchAll(/^\s*[^@\n][^{\n]*:hover[^\n]*\{/gm)].map((match) => match[0].trim());
    assert.deepEqual(all, guarded);
  });
}

async function assertPDFResultLayout(run) {
  await check(run, 'PDF result layout follows the requested order and omits removed copy', async () => {
    const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const pdf = source.slice(source.indexOf('function downloadPDF()'), source.indexOf('function restartQuiz()'));
    assert.equal(pdf.includes('NOTA IMPORTANTE'), false, 'PDF must not render the important-note box');
    assert.equal(pdf.includes("sec('Leitura do Perfil')"), false, 'PDF must not render the profile-reading section');
    assert.equal(pdf.includes('Esta resposta descreve a situação escolhida'), false, 'PDF must not render the removed contextual closing sentence');
    assert.equal(pdf.includes('EVIDÊNCIA DIRETA'), false, 'PDF must not render the direct-evidence label');
    assert.equal(pdf.includes('TEMA PARA OBSERVAR'), false, 'PDF must not render the attention-theme label');
    assert.ok(pdf.includes('factorBar(summary.percent)'), 'PDF factors must use proportional progress bars');

    const profile = pdf.indexOf('// Perfil mental: primeiro elemento do relatório.');
    const choices = pdf.indexOf("sec('Suas escolhas')");
    const contextual = pdf.indexOf("sec('Ponto de atenção da sua modalidade')");
    const factors = pdf.indexOf("sec('Fatores mentais acompanhados')");
    assert.ok(profile > -1 && choices > profile && contextual > choices && factors > contextual,
      'PDF order must be profile, athlete choices, contextual attention, then mental factors');
    assert.ok(pdf.includes('C_ORANGE.map'), 'PDF factor bars must use the orange-to-green gradient');
    assert.ok(pdf.includes('const C_GREEN = [168, 185, 145]'), 'PDF factor-bar green must use the lighter endpoint');
    assert.ok(pdf.includes('const pdfSportLabel'), 'PDF must use a dedicated sport label');
    assert.ok(pdf.includes('Extended_Pictographic'), 'PDF sport label must remove emoji characters');
  });
}

async function main() {
  fs.rmSync(artifactsDir, { recursive: true, force: true });
  fs.mkdirSync(artifactsDir, { recursive: true });
  const server = await startServer();
  const address = server.address();
  const baseURL = `http://127.0.0.1:${address.port}`;
  let browser;
  try {
    browser = await chromium.launch();
    for (const device of viewports) {
      const run = { viewport: device.name, journey: 'modalidade direta completa', assertions: [], screenshots: [] };
      report.runs.push(run);
      const context = await browser.newContext({ viewport: device.viewport, isMobile: device.isMobile, hasTouch: device.hasTouch });
      const page = await context.newPage();
      await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
      await assertPDFResultLayout(run);
      await check(run, 'initial start control is visible, enabled, in viewport, and uncovered', async () => {
        const start = page.getByRole('button', { name: 'Começar o mapeamento →' });
        await assertVisibleEnabled(start, 'start button');
        await assertInViewportAndUncovered(start, 'start button');
      });
      if (device.name === 'mobile') await screenshot(page, run, 'tela-inicial');
      await completeDirectJourney(page, run);
      await context.close();

      const alternativesRun = { viewport: device.name, journey: 'outros esportes', assertions: [], screenshots: [] };
      report.runs.push(alternativesRun);
      const alternativeContext = await browser.newContext({ viewport: device.viewport, isMobile: device.isMobile, hasTouch: device.hasTouch });
      const alternativePage = await alternativeContext.newPage();
      await alternativePage.goto(baseURL, { waitUntil: 'domcontentloaded' });
      await verifyOtherSports(alternativePage, alternativesRun);
      await alternativeContext.close();
      await assertHoverGuard(alternativesRun);
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
    report.completedAt = new Date().toISOString();
    report.passed = report.assertions.every((item) => item.passed);
    fs.writeFileSync(path.join(artifactsDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  }
  if (!report.passed) process.exitCode = 1;
  console.log(`UI harness ${report.passed ? 'passed' : 'failed'}; report: artifacts/ui/report.json`);
}

main().catch((error) => {
  report.completedAt = new Date().toISOString();
  report.passed = false;
  report.fatalError = error.stack || error.message;
  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.writeFileSync(path.join(artifactsDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.error(error);
  process.exitCode = 1;
});
