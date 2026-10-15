const http = require('http');
const fs = require('fs');
const path = require('path');
const chatHandler = require('./api/chat.js');

// Carrega .env ou .env.local se existir
['.env.local', '.env'].forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    });
  }
});

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  // Endpoint de API do Cobalto
  if (pathname === '/api/chat') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', async () => {
      try {
        req.body = bodyStr ? JSON.parse(bodyStr) : {};
      } catch (e) {
        req.body = {};
      }

      // Mock dos métodos res.status e res.json do ambiente Vercel
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        return res;
      };

      try {
        await chatHandler(req, res);
      } catch (err) {
        console.error('Erro no handler:', err);
        if (!res.writableEnded) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
        }
      }
    });
    return;
  }

  // Arquivos Estáticos
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let filePath = path.join(__dirname, relativePath);

  // Evita Directory Traversal
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Acesso proibido');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Página não encontrada (404)');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Servidor local rodando em: http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.log(`⚠️  ATENÇÃO: GEMINI_API_KEY não configurada!`);
    console.log(`   Crie um arquivo .env.local com: GEMINI_API_KEY=sua_chave`);
    console.log(`   Obtenha gratuitamente em: https://aistudio.google.com/`);
  } else {
    console.log(`✅ GEMINI_API_KEY detectada! Cobalto pronto para responder.`);
  }
  console.log(`==================================================\n`);
});
