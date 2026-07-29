// Analytics (Umami Cloud). Sem cookie, sem banner de consentimento.
//
// O quiz roda num iframe. O index.html repassa a URL e o referrer reais do
// documento pai por query string (?a_url / ?a_ref), e este módulo os aplica a
// pageviews e eventos. Assim o painel não registra "/src/web.dc.html" nem cria
// self-referrals falsos.

// Website ID de nicolasfhrartigas.github.io no Umami Cloud.
const WEBSITE_ID = 'ed84c13c-92e0-4515-bf9c-06a475afc769';
const SCRIPT_URL = 'https://cloud.umami.is/script.js';
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', ''];

/**
 * Cria uma instância do tracker. As dependências opcionais permitem testar a
 * integração sem carregar o script externo nem depender de um DOM real.
 */
export function createAnalytics({
  browserWindow = typeof window !== 'undefined' ? window : null,
  browserDocument = typeof document !== 'undefined' ? document : null,
  websiteId = WEBSITE_ID,
  scriptUrl = SCRIPT_URL,
} = {}) {
  const browser = Boolean(browserWindow && browserDocument);
  const loc = browser
    ? browserWindow.location
    : { search: '', pathname: '', hostname: '' };
  const params = new URLSearchParams(loc.search);
  const view = /mobile/.test(loc.pathname) ? 'mobile' : 'web';
  const pageUrl = params.get('a_url') || loc.pathname + loc.search;
  const pageReferrer = params.get('a_ref') || '';
  const enabled =
    browser &&
    Boolean(websiteId) &&
    websiteId.indexOf('COLE-AQUI') === -1 &&
    LOCAL_HOSTS.indexOf(loc.hostname) === -1;

  let queue = [];
  let ready = false;

  function send(payload) {
    if (!browserWindow.umami) return;
    try {
      // A função recebe as propriedades padrão produzidas pelo tracker e troca
      // somente a atribuição que o iframe tornaria incorreta.
      browserWindow.umami.track(props => ({
        ...props,
        url: pageUrl,
        referrer: pageReferrer,
        ...payload,
      }));
    } catch {
      // Analytics nunca pode interromper a jornada do quiz.
    }
  }

  function push(payload) {
    if (!enabled) return;
    if (ready) send(payload);
    else queue.push(payload);
  }

  function track(name, data) {
    push({ name, data: { view, ...(data || {}) } });
  }

  function init() {
    if (!enabled) return;

    const script = browserDocument.createElement('script');
    script.src = scriptUrl;
    script.defer = true;
    script.setAttribute('data-website-id', websiteId);
    // O pageview automático enxergaria o endereço interno do iframe.
    script.setAttribute('data-auto-track', 'false');
    // Tags são válidas também para pageviews e permitem filtrar web/mobile.
    script.setAttribute('data-tag', view);
    script.onload = () => {
      ready = true;
      const pending = queue;
      queue = [];
      pending.forEach(send);
    };
    script.onerror = () => { queue = []; };
    browserDocument.head.appendChild(script);

    // Pageview não recebe `data`: no Umami, propriedades customizadas exigem
    // um evento nomeado. A segmentação da tela fica na tag acima.
    push({});
  }

  init();
  return { track };
}

const analytics = createAnalytics();

/** Registra um evento com a propriedade `view` (web/mobile). */
export function track(name, data) {
  analytics.track(name, data);
}
