import { systemInstruction } from './cv-context.mjs';

const json = (status, data) => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

export async function handleChat(request, { env = process.env, fetchImpl = fetch } = {}) {
  if (request.method !== 'POST') return json(405, { error: 'Método no permitido.' });
  // El chat funciona desde el mismo sitio, sin habilitar CORS para otros sitios.
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json(403, { error: 'Origen no permitido.' });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json(415, { error: 'Envía una solicitud JSON.' });
  let body;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 24000) return json(413, { error: 'La conversación es demasiado larga. Inicia un nuevo chat.' });
    body = JSON.parse(raw);
  } catch { return json(400, { error: 'Solicitud inválida.' }); }
  const messages = body?.messages;
  if (body?.task) return json(400, { error: 'Tipo de consulta no permitido.' });
  if (!Array.isArray(messages) || !messages.length || messages.length > 12 || messages.some((m, i) =>
    !m || m.role !== (i % 2 === 0 ? 'user' : 'model') || typeof m.text !== 'string' || !m.text.trim() || m.text.length > 1800
  ) || messages.at(-1).role !== 'user') return json(400, { error: 'Conversación inválida. Usa mensajes de hasta 1800 caracteres.' });
  if (!env.GEMINI_API_KEY?.trim()) return json(503, { error: 'El asistente todavía no está disponible. Puedes contactar a Zahir en andres_prog1@outlook.com.' });
  const model = env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  if (!/^[a-zA-Z0-9.-]+$/.test(model)) return json(503, { error: 'El asistente no está disponible en este momento.' });
  try {
    const response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      signal: AbortSignal.timeout(25000),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: messages.map(m => ({ role: m.role, parts: [{ text: m.text.trim() }] })),
        generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
      })
    });
    if (!response.ok) return json(response.status === 429 ? 429 : 502, { error: response.status === 429
      ? 'El asistente está recibiendo muchas consultas. Intenta nuevamente en un momento.'
      : 'No se pudo obtener una respuesta. Intenta nuevamente o contacta a Zahir por correo.' });
    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.filter(p => !p.thought && typeof p.text === 'string').map(p => p.text).join('\n').trim();
    if (!answer) return json(502, { error: 'No se pudo responder a esa consulta. Prueba una pregunta sobre el CV.' });
    return json(200, { answer: answer.slice(0, 1800) });
  } catch { return json(504, { error: 'La respuesta tardó demasiado o hubo un problema de conexión. Intenta nuevamente.' }); }
}
