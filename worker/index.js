const MAX_BODY_BYTES = 100_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function headers(origin) {
  return {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': origin,
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    Vary: 'Origin',
  };
}

function json(origin, body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headers(origin) });
}

function allowedOrigin(origin, publicOrigin) {
  return origin === publicOrigin || origin === 'http://localhost:8000' || origin === 'http://127.0.0.1:8000';
}

function recoveryCode() {
  const value = crypto.randomUUID().replaceAll('-', '').slice(0, 16).toUpperCase();
  return value.match(/.{4}/g).join('-');
}

function validPayload(payload) {
  return payload
    && payload.schemaVersion === 1
    && typeof payload.athleteName === 'string'
    && payload.athleteName.trim().length > 0
    && payload.athleteName.length <= 120
    && typeof payload.sportLabel === 'string'
    && payload.sportLabel.length <= 120
    && Array.isArray(payload.answers)
    && payload.answers.length === 11
    && Array.isArray(payload.factors)
    && payload.factors.length === 6
    && typeof payload.prof?.name === 'string';
}

async function saveSubmission(request, env, origin) {
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > MAX_BODY_BYTES) return json(origin, { error: 'Payload muito grande.' }, 413);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rate = await env.SUBMISSION_RATE_LIMITER.limit({ key: ip });
  if (!rate.success) return json(origin, { error: 'Muitas tentativas. Aguarde um minuto.' }, 429);

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    return json(origin, { error: 'Payload muito grande.' }, 413);
  }

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return json(origin, { error: 'JSON inválido.' }, 400);
  }

  if (!UUID.test(body?.submissionId || '') || !validPayload(body?.payload)) {
    return json(origin, { error: 'Resultado inválido.' }, 400);
  }

  const existing = await env.DB.prepare(
    'SELECT recovery_code FROM submissions WHERE id = ?1 LIMIT 1',
  ).bind(body.submissionId).first('recovery_code');
  if (existing) return json(origin, { recoveryCode: existing });

  const code = recoveryCode();
  await env.DB.prepare(
    `INSERT INTO submissions
      (id, recovery_code, athlete_name, sport, schema_version, payload)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
  ).bind(
    body.submissionId,
    code,
    body.payload.athleteName.trim(),
    body.payload.sportLabel,
    body.payload.schemaVersion,
    JSON.stringify(body.payload),
  ).run();

  console.log(JSON.stringify({ event: 'submission_saved' }));
  return json(origin, { recoveryCode: code }, 201);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') {
      return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const origin = request.headers.get('Origin') || '';
    if (!allowedOrigin(origin, env.PUBLIC_ORIGIN)) return Response.json({ error: 'Origem não permitida.' }, { status: 403 });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headers(origin) });
    if (url.pathname !== '/submissions') return json(origin, { error: 'Não encontrado.' }, 404);
    if (request.method !== 'POST') return json(origin, { error: 'Método não permitido.' }, 405);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) {
      return json(origin, { error: 'Content-Type deve ser application/json.' }, 415);
    }

    try {
      return await saveSubmission(request, env, origin);
    } catch (error) {
      console.error(JSON.stringify({
        event: 'submission_error',
        error: error instanceof Error ? error.message : String(error),
      }));
      return json(origin, { error: 'Não foi possível salvar o resultado.' }, 500);
    }
  },
};

export { allowedOrigin, recoveryCode, validPayload };
