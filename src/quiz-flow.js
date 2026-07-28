// Fluxo compartilhado entre as telas web e mobile. O módulo não conhece
// componentes nem estilos: cada tela fornece as pequenas diferenças de UI.

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

export function createQuizFlow({ engine, getState, setState, top, scrollToRef, onAnswer, scrollOnQuestionChange = false }) {
  let outsideTarget = null;
  let outsideHandler = null;

  const currentState = () => getState();
  const clearMissing = (field) => {
    const state = currentState();
    if (!state.missing.length) return;
    const missing = state.missing.filter(item => item !== field);
    setState({ missing, setupError: missing.length > 0 });
  };

  return {
    clearMissing,
    pick(field, item) {
      if (field === 'sport') {
        engine.setProfileField('sport', item.value);
        engine.setProfileField('sportLabel', item.label);
        setState({ sport: item.value, sportLabel: item.label, sportOpen: false });
      } else {
        engine.setProfileField(field, item.value);
        setState({ [field]: item.value });
      }
      clearMissing(field);
    },
    start() {
      const state = currentState();
      const missing = ['name', 'sport', 'level', 'goal'].filter(field => !String(state[field] || '').trim());
      if (missing.length) {
        setState({ setupError: true, missing });
        scrollToRef(missing[0]);
        return false;
      }
      engine.setProfileField('name', state.name.trim());
      engine.start();
      setState({ setupError: false, missing: [], screen: 'question', tick: state.tick + 1 });
      top();
      return true;
    },
    answer(index) {
      const done = engine.select(index);
      if (done) {
        setState({ screen: 'result', result: engine.result(), animate: false, factorsLoading: true, resultOpen: false });
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
        top();
        return false;
      }
      engine.back();
      setState({ tick: currentState().tick + 1 });
      if (scrollOnQuestionChange) top();
      return true;
    },
    restart() {
      engine.resetState();
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
