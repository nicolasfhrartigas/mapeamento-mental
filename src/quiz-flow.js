// Fluxo compartilhado entre as telas web e mobile. O módulo não conhece
// componentes nem estilos: cada tela fornece as pequenas diferenças de UI.
//
// É também onde o funil é instrumentado (ver src/analytics.js): como as duas
// telas compartilham este fluxo, os eventos saem idênticos nas duas sem
// duplicação.

import { track } from './analytics.js';

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
  pdfBusy: false, factorsLoading: false, resultOpen: false,
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
        setState({ screen: 'result', result, animate: false, factorsLoading: true, resultOpen: false });
        trackEvent('quiz-concluido');
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
      engine.resetState();
      answered = new Set();
      setState({ ...EMPTY_JOURNEY });
      top();
    },
    toggleOther() {
      setState({ sportOpen: !currentState().sportOpen });
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
