// Fluxo compartilhado entre as telas web e mobile. O módulo não conhece
// componentes nem estilos: cada tela fornece as pequenas diferenças de UI.
//
// É também onde o funil é instrumentado (ver src/analytics.js): como as duas
// telas compartilham este fluxo, os eventos saem idênticos nas duas sem
// duplicação.

import { track } from './analytics.js';

const SUBMISSIONS_URL = 'https://mapeamento-mental-results.mapeamento-mental-psi.workers.dev/submissions';
const PENDING_KEY = 'mapeamento-mental:pending-results';

function browserStorage() {
  return typeof localStorage === 'undefined' ? null : localStorage;
}

function readPending(storage) {
  try {
    const value = JSON.parse(storage?.getItem(PENDING_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

function newSubmissionId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function sendPending(record, fetchImpl) {
  const response = await fetchImpl(SUBMISSIONS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!response.ok) throw new Error('Não foi possível salvar o resultado.');
  const data = await response.json();
  if (typeof data.recoveryCode !== 'string') throw new Error('Código de recuperação ausente.');
  return data.recoveryCode;
}

export async function saveResult(payload, {
  storage = browserStorage(), fetchImpl = globalThis.fetch, createId = newSubmissionId,
} = {}) {
  const record = { submissionId: createId(), payload };
  const pending = [...readPending(storage), record];
  try { storage?.setItem(PENDING_KEY, JSON.stringify(pending)); } catch {}
  const recoveryCode = await sendPending(record, fetchImpl);
  try {
    storage?.setItem(PENDING_KEY, JSON.stringify(readPending(storage).filter(item => item.submissionId !== record.submissionId)));
  } catch {}
  return recoveryCode;
}

export async function retryPendingResults({ storage = browserStorage(), fetchImpl = globalThis.fetch } = {}) {
  for (const record of readPending(storage)) {
    await sendPending(record, fetchImpl);
    try {
      storage?.setItem(PENDING_KEY, JSON.stringify(readPending(storage).filter(item => item.submissionId !== record.submissionId)));
    } catch {}
  }
}

export const SPORTS = [
  { value: 'fisiculturismo', label: '🏋️ Fisiculturismo' },
  { value: 'futebol', label: '⚽ Futebol' },
  { value: 'corrida', label: '🏃 Corrida / Atletismo' },
  { value: 'volei', label: '🏐 Vôlei' },
  { value: 'tenis', label: '🎾 Tênis' },
];

export const OTHER_SPORTS = [
  { value: 'coletivos', label: '⛹🏼‍♀️ Esportes Coletivos' },
  { value: 'resistencia', label: '🏊🏼‍♀️ Esporte de Resistência' },
  { value: 'luta', label: '👨🏻‍🫯‍👨🏼 Esportes de Luta' },
  { value: 'raquetes', label: '🏸 Esportes de Raquete' },
  { value: 'habilidades_mira', label: '🎯 Esportes de Habilidades e Mira' },
  { value: 'e_sports', label: '🕹️ E-sports' },
];

export const LEVELS = [
  { value: 'iniciante', label: 'Iniciante / Amador' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'alto', label: 'Alto Rendimento' },
];

export const GOALS = [
  { value: 'competir', label: 'Competir e vencer' },
  { value: 'consistencia', label: 'Manter consistência' },
  { value: 'superar', label: 'Superar meu limite' },
  { value: 'bem-estar', label: 'Cuidar do processo' },
];

const EMPTY_JOURNEY = {
  screen: 'intro', name: '', sport: '', sportLabel: '', level: '', goal: '',
  sportOpen: false, setupError: false, missing: [], result: null, animate: false,
  pdfBusy: false, factorsLoading: false, resultOpen: false, saveStatus: 'idle', saveCode: '',
};

export function createQuizFlow({
  engine,
  getState,
  setState,
  top,
  scrollToRef,
  onAnswer,
  scrollOnQuestionChange = false,
  trackEvent = track,
  storeResult = saveResult,
  retryStoredResults = retryPendingResults,
}) {
  let outsideTarget = null;
  let outsideHandler = null;

  const currentState = () => getState();
  const clearMissing = (field) => {
    const state = currentState();
    if (!state.missing.length) return;
    const missing = state.missing.filter(item => item !== field);
    setState({ missing, setupError: missing.length > 0 });
  };

  // Perguntas já contabilizadas nesta rodada. Sem isso, voltar e responder de
  // novo inflaria o funil e faria a etapa parecer ter mais gente que a anterior.
  let answered = new Set();
  let journey = 0;

  retryStoredResults().catch(() => {});

  const persistCurrentResult = () => {
    const currentJourney = journey;
    setState({ saveStatus: 'saving', saveCode: '' });
    return storeResult(engine.getReportData()).then(recoveryCode => {
      if (journey === currentJourney && currentState().screen === 'result') {
        setState({ saveStatus: 'saved', saveCode: recoveryCode });
      }
      return recoveryCode;
    }).catch(() => {
      if (journey === currentJourney && currentState().screen === 'result') setState({ saveStatus: 'failed' });
    });
  };

  return {
    clearMissing,

    /** Intro → setup: primeiro sinal de intenção, antes de qualquer dado. */
    trackSetupOpen() {
      trackEvent('setup-aberto');
    },

    /** Solicitação do PDF (o gerador captura erros internamente). */
    trackPdf() {
      trackEvent('pdf-solicitado');
    },

    pick(field, item) {
      if (field === 'sport') {
        engine.setProfileField('sport', item.value);
        engine.setProfileField('sportLabel', item.label);
        setState({ sport: item.value, sportLabel: item.label, sportOpen: false });
      } else {
        engine.setProfileField(field, item.value);
        setState({ [field]: item.value });
      }
      trackEvent('perfil-preenchido', { campo: field });
      clearMissing(field);
    },
    start() {
      const state = currentState();
      const missing = ['name', 'sport', 'level', 'goal'].filter(field => !String(state[field] || '').trim());
      if (missing.length) {
        setState({ setupError: true, missing });
        scrollToRef(missing[0]);
        trackEvent('setup-incompleto', { faltando: missing.join(',') });
        return false;
      }
      engine.setProfileField('name', state.name.trim());
      engine.start();
      journey += 1;
      answered = new Set();
      setState({ setupError: false, missing: [], screen: 'question', tick: state.tick + 1 });
      trackEvent('quiz-iniciado');
      top();
      return true;
    },
    answer(index) {
      const number = engine.getCurrent() + 1;
      const total = engine.getTotal();
      const done = engine.select(index);
      if (!answered.has(number)) {
        answered.add(number);
        // Uma etapa por pergunta é o que permite ler a curva de abandono no
        // relatório de funil do Umami.
        trackEvent('pergunta-respondida', { numero: number, total });
      }
      if (done) {
        const result = engine.result();
        setState({ screen: 'result', result, animate: false, factorsLoading: true, resultOpen: false, saveStatus: 'saving', saveCode: '' });
        trackEvent('quiz-concluido');
        persistCurrentResult();
      } else {
        setState({ tick: currentState().tick + 1 });
      }
      if (done || scrollOnQuestionChange) top();
      if (onAnswer) onAnswer(done);
      return done;
    },
    back() {
      if (engine.getCurrent() === 0) {
        setState({ screen: 'setup' });
        trackEvent('quiz-abandonado', { numero: 1, total: engine.getTotal() });
        top();
        return false;
      }
      engine.back();
      setState({ tick: currentState().tick + 1 });
      if (scrollOnQuestionChange) top();
      return true;
    },
    restart() {
      trackEvent('quiz-reiniciado');
      journey += 1;
      engine.resetState();
      answered = new Set();
      setState({ ...EMPTY_JOURNEY });
      top();
    },
    toggleOther() {
      setState({ sportOpen: !currentState().sportOpen });
    },
    retrySave() {
      return persistCurrentResult();
    },
    attachOutsideClick(target) {
      outsideTarget = target;
      outsideHandler = event => {
        const node = outsideTarget && outsideTarget.current;
        if (currentState().sportOpen && (!node || !node.contains(event.target))) setState({ sportOpen: false });
      };
      document.addEventListener('click', outsideHandler);
    },
    detachOutsideClick() {
      if (outsideHandler) document.removeEventListener('click', outsideHandler);
      outsideHandler = null;
      outsideTarget = null;
    },
  };
}
