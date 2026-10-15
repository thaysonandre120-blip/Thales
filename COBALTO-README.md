# Cobalto Assistente Virtual

## Variáveis de Ambiente Necessárias (Vercel)
- `GEMINI_API_KEY`: Chave da API do Google Gemini. Não versionar!
- `ALLOWED_ORIGINS`: Lista de origens permitidas (ex: `https://jthalespinturas.com.br`).
- `GEMINI_MODEL`: Modelo da API (ex: `gemini-2.5-flash`).

## Testes Locais
O Cobalto precisa do backend Node rodando para responder às mensagens. Você pode rodar de duas formas:

**Opção 1 (Recomendada - Sem instalar nada):**
```bash
node dev-server.js
```
Acesse `http://localhost:3000`.

**Opção 2 (Via Vercel CLI):**
```bash
npx vercel dev
```
*(Nota: Abrir direto pelo Live Server comum do VS Code não executará a rota `/api/chat`).*

## Segurança
- Rate limit (12 requisições/min) é de melhor esforço (na RAM do ambiente serverless).
- Validação XSS tratada puramente na renderização em `js/cobalto.js`.

## Troca de Provedor
Para trocar para OpenAI/Claude, edite `api/chat.js` ajustando a requisição `fetch` e a formatação do payload. Assegure a permanência da mesma resposta JSON `{ "reply": "..." }`.
