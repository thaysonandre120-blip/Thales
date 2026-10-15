export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Lê a chave da Groq ou OpenAI da Vercel
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Chave de API não configurada na Vercel.' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Mensagem vazia.' });
  }

  // Usa Groq se a chave for da Groq, senão usa OpenAI
  const isGroq = !!process.env.GROQ_API_KEY;
  const endpoint = isGroq
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  const model = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'Você é um assistente virtual prestativo e profissional para atendimento da J. Thales Pinturas.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro na API externa:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Erro na API.' });
    }

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Erro interno na rota /api/chat:', error);
    return res.status(500).json({ error: error.message });
  }
}