const { systemInstruction } = require('./_knowledge.js');

const rateLimit = new Map();
const LIMIT_PER_MIN = 12;
const LIMIT_PER_DAY = 80;

function checkRateLimit(ip) {
  const now = Date.now();
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { minTokens: LIMIT_PER_MIN, dayTokens: LIMIT_PER_DAY, lastMin: now, lastDay: now });
  }
  const record = rateLimit.get(ip);

  if (now - record.lastMin > 60000) { record.minTokens = LIMIT_PER_MIN; record.lastMin = now; }
  if (now - record.lastDay > 86400000) { record.dayTokens = LIMIT_PER_DAY; record.lastDay = now; }

  if (record.minTokens <= 0 || record.dayTokens <= 0) return false;
  record.minTokens--; record.dayTokens--;
  return true;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const origin = req.headers.origin || req.headers.referer || '';
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsEnv.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const host = (req.headers.host || '').toLowerCase();

  let originAllowed = true;
  if (origin) {
    try {
      const originUrl = new URL(origin);
      const originHost = originUrl.host.toLowerCase();
      originAllowed = (
        !originHost ||
        originHost === host ||
        originHost.endsWith('.vercel.app') ||
        originHost.includes('localhost') ||
        originHost.includes('127.0.0.1') ||
        allowedOrigins.length === 0 ||
        allowedOrigins.some(o => o.includes(originHost))
      );
    } catch (e) {
      originAllowed = true;
    }
  }

  if (!originAllowed) {
    console.warn(`Origin blocked: ${origin} (host: ${host})`);
    return res.status(403).json({ error: 'Origem não autorizada.' });
  }

  const rawIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown';
  const ip = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : 'unknown';
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Muitas mensagens. Aguarde um momento.' });

  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) {
      return res.status(400).json({ error: 'Array de mensagens inválido.' });
    }

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'user') return res.status(400).json({ error: 'A última mensagem deve ser do usuário.' });

    const geminiMessages = [];
    for (const msg of messages) {
      if (typeof msg.content !== 'string' || !msg.content.trim()) return res.status(400).json({ error: 'Conteúdo de mensagem inválido.' });
      if (msg.content.length > 600) return res.status(400).json({ error: 'Mensagem muito longa (máx 600 caracteres).' });
      geminiMessages.push({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content.trim() }] });
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
    if (!apiKey) {
      console.error('GEMINI_API_KEY não foi configurada nas variáveis de ambiente da Vercel.');
      return res.status(500).json({ error: 'GEMINI_API_KEY não configurada na Vercel. Adicione a chave nas Configurações do Projeto.' });
    }

    const modelsToTry = [
      (process.env.GEMINI_MODEL || '').trim(),
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-2.5-flash'
    ].filter(Boolean);

    // Remove duplicatas mantendo a ordem
    const uniqueModels = [...new Set(modelsToTry)];

    let replyText = null;
    let lastError = null;

    const requestBody = {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: geminiMessages,
      generationConfig: { temperature: 0.4, maxOutputTokens: 500 }
    };

    for (const model of uniqueModels) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000);

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) break; // Sucesso!
        } else {
          const errText = await response.text();
          console.warn(`Tentativa com modelo ${model} falhou: ${response.status} - ${errText}`);
          lastError = `${response.status}: ${errText}`;
          // Se for erro de chave inválida, não adianta tentar outros modelos
          if (response.status === 400 && errText.includes('API_KEY_INVALID')) {
            return res.status(400).json({ error: 'A chave GEMINI_API_KEY informada é inválida. Verifique a chave no Google AI Studio.' });
          }
        }
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        lastError = fetchErr.message;
      }
    }

    if (!replyText) {
      console.error('Nenhum modelo respondeu com sucesso. Último erro:', lastError);
      return res.status(502).json({ error: 'Não foi possível gerar a resposta no Gemini. ' + (lastError || '') });
    }

    return res.status(200).json({ reply: replyText.trim() });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(error.name === 'AbortError' ? 504 : 500).json({ error: 'Erro interno no servidor: ' + error.message });
  }
};
