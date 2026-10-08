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
  const allowedOrigins = allowedOriginsEnv.split(',').map(s => s.trim()).filter(Boolean);
  const host = req.headers.host;

  let originAllowed = false;
  try {
    const originUrl = origin ? new URL(origin) : null;
    if (!origin || allowedOrigins.includes(origin) || (originUrl && (originUrl.host === host || originUrl.host.endsWith('.vercel.app')))) {
      originAllowed = true;
    }
  } catch (e) {}

  if (!originAllowed && origin) return res.status(403).json({ error: 'Forbidden' });

  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Too Many Requests' });

  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) {
      return res.status(400).json({ error: 'Invalid messages array.' });
    }

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'user') return res.status(400).json({ error: 'Last message must be user.' });

    const geminiMessages = [];
    for (const msg of messages) {
      if (typeof msg.content !== 'string' || !msg.content.trim()) return res.status(400).json({ error: 'Invalid content.' });
      if (msg.content.length > 600) return res.status(400).json({ error: 'Content too long.' });
      geminiMessages.push({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content.trim() }] });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Internal Server Error' });

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const requestBody = {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: geminiMessages,
      generationConfig: { temperature: 0.4, maxOutputTokens: 500 }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Gemini Error: ${response.status} - ${await response.text()}`);
      return res.status(502).json({ error: 'Não consegui me conectar agora.' });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!replyText) return res.status(500).json({ error: 'Empty response' });

    return res.status(200).json({ reply: replyText.trim() });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(error.name === 'AbortError' ? 504 : 500).json({ error: 'Erro no servidor.' });
  }
};
