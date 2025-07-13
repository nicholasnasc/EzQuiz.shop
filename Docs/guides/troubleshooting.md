# 🛠️ Troubleshooting - EzQuiz.shop

## 📋 Visão Geral

Este guia abrange soluções para os problemas mais comuns do EzQuiz.shop, desde instalação até produção, incluindo debugging e análise de logs.

---

## 🚨 Problemas de Instalação

### Erro: "Cannot find module"

**Sintomas:**
```bash
Error: Cannot find module 'express'
Error: Cannot find module 'dotenv'
```

**Soluções:**
```bash
# 1. Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# 2. Verificar Node.js version
node --version  # Deve ser 18+
npm --version   # Deve ser 8+

# 3. Limpar cache npm
npm cache clean --force

# 4. Instalar específicamente
npm install express dotenv ejs express-session
```

---

### Erro: "Permission denied"

**Sintomas:**
```bash
EACCES: permission denied, mkdir '/usr/local/lib/node_modules'
```

**Soluções:**
```bash
# Linux/Mac - Configurar npm global prefix
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Windows - Executar como administrador
# Abrir PowerShell como administrador
npm install -g npm@latest

# Alternativa: usar yarn
npm install -g yarn
yarn install
```

---

### Erro: "Port 8080 already in use"

**Sintomas:**
```bash
Error: listen EADDRINUSE: address already in use :::8080
```

**Soluções:**
```bash
# 1. Encontrar processo usando a porta
# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr 8080
taskkill /PID <PID> /F

# 2. Usar porta diferente
PORT=3000 npm start

# 3. Configurar porta dinâmica
const PORT = process.env.PORT || 8080;
```

---

## 🔐 Problemas de Autenticação

### Login Admin Não Funciona

**Sintomas:**
- "Credenciais inválidas" mesmo com credenciais corretas
- Redirecionamento infinito
- Sessão não persiste

**Debugging:**
```javascript
// Adicionar logs em app.js
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { 
    username, 
    password: password ? '***' : 'empty',
    envUsername: process.env.ADMIN_USERNAME,
    envPassword: process.env.ADMIN_PASSWORD ? '***' : 'empty'
  });
  
  // ... resto do código
});
```

**Soluções:**
```bash
# 1. Verificar arquivo .env
cat .env
# Deve conter:
# ADMIN_USERNAME=admin
# ADMIN_PASSWORD=quiz2025admin

# 2. Verificar se dotenv está carregando
node -e "require('dotenv').config(); console.log(process.env.ADMIN_USERNAME)"

# 3. Recriar arquivo .env
cp .env.example .env
# Editar com suas credenciais

# 4. Verificar encoding do arquivo
file .env  # Deve ser UTF-8
```

---

### Sessão Expira Muito Rápido

**Sintomas:**
- Logout automático
- Perda de progresso no quiz

**Soluções:**
```javascript
// Aumentar timeout da sessão
app.use(session({
  secret: process.env.ADMIN_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    secure: false // true apenas em HTTPS
  }
}));
```

---

## 📊 Problemas de Quiz

### Quiz Não Carrega Perguntas

**Sintomas:**
- Página em branco
- Erro 500
- "Erro ao carregar dados do quiz"

**Debugging:**
```javascript
// Verificar arquivo JSON
function loadQuizData() {
  try {
    console.log('Tentando carregar:', path.join(__dirname, 'data', 'quiz-config.json'));
    const data = fs.readFileSync(path.join(__dirname, 'data', 'quiz-config.json'), 'utf8');
    console.log('Arquivo carregado, tamanho:', data.length);
    
    const parsed = JSON.parse(data);
    console.log('JSON parseado, perguntas:', parsed.quiz.questions.length);
    
    return parsed;
  } catch (error) {
    console.error('Erro detalhado:', error);
    return null;
  }
}
```

**Soluções:**
```bash
# 1. Verificar se arquivo existe
ls -la data/quiz-config.json

# 2. Verificar sintaxe JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('data/quiz-config.json', 'utf8')))"

# 3. Validar JSON online
# Copiar conteúdo para https://jsonlint.com

# 4. Recriar arquivo padrão
cp data/quiz-config.example.json data/quiz-config.json
```

---

### Respostas Não São Salvas

**Sintomas:**
- Quiz reinicia do início
- Progresso perdido
- Erro no POST /quiz

**Debugging:**
```javascript
// Adicionar logs detalhados
app.post('/quiz', (req, res) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  console.log('Request body:', req.body);
  
  const { answer, questionId } = req.body;
  console.log('Processing:', { answer, questionId, type: typeof answer });
  
  // Verificar se sessão existe
  if (!req.session.answers) {
    console.log('Criando nova sessão answers');
    req.session.answers = {};
  }
  
  // ... resto do código
});
```

**Soluções:**
```javascript
// 1. Verificar middleware de sessão
app.use(session({
  secret: process.env.ADMIN_SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: true,  // Importante!
  cookie: { secure: false } // false para development
}));

// 2. Verificar parser de body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Inicializar sessão corretamente
app.get('/', (req, res) => {
  req.session.currentQuestion = 1;
  req.session.answers = {};
  console.log('Session initialized:', req.sessionID);
  // ... resto
});
```

---

## 📂 Problemas de Arquivo

### Erro: "Cannot write file"

**Sintomas:**
- Admin não salva configurações
- "Falha ao salvar quiz"
- EACCES ou EPERM errors

**Soluções:**
```bash
# 1. Verificar permissões
ls -la data/
chmod 755 data/
chmod 644 data/quiz-config.json

# 2. Verificar owner (Linux/Mac)
sudo chown -R $USER:$USER data/

# 3. Verificar espaço em disco
df -h

# 4. Criar pasta se não existir
mkdir -p data
mkdir -p data/backups
```

**Código defensivo:**
```javascript
function saveQuizData(data) {
  try {
    // Verificar se pasta existe
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Backup antes de salvar
    const backupPath = path.join(dataDir, 'backups', `quiz-config-${Date.now()}.json`);
    if (fs.existsSync(path.join(dataDir, 'quiz-config.json'))) {
      fs.copyFileSync(
        path.join(dataDir, 'quiz-config.json'),
        backupPath
      );
    }
    
    // Salvar novo arquivo
    fs.writeFileSync(
      path.join(dataDir, 'quiz-config.json'), 
      JSON.stringify(data, null, 2),
      'utf8'
    );
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar:', error);
    return false;
  }
}
```

---

## 🎨 Problemas de Interface

### CSS Não Carrega

**Sintomas:**
- Página sem estilo
- Layout quebrado
- 404 para arquivos CSS

**Soluções:**
```javascript
// 1. Verificar middleware de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 2. Verificar estrutura de pastas
// public/
//   css/
//     styles.css
//   js/
//     script.js

// 3. Verificar links no EJS
<link rel="stylesheet" href="/css/styles.css">
<script src="/js/script.js"></script>
```

**Debug de arquivos estáticos:**
```javascript
// Middleware de debug
app.use('/public', (req, res, next) => {
  console.log('Static file request:', req.url);
  next();
}, express.static('public'));
```

---

### JavaScript Não Executa

**Sintomas:**
- Interações não funcionam
- Erros no console
- Botões não respondem

**Debugging:**
```javascript
// Adicionar logs no script.js
console.log('Script carregado');

// Verificar se DOM está pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM pronto');
  
  // Verificar elementos
  const nextBtn = document.querySelector('.btn-next');
  console.log('Botão next:', nextBtn);
  
  if (!nextBtn) {
    console.error('Botão next não encontrado!');
  }
});
```

**Soluções:**
```html
<!-- Verificar ordem de scripts -->
<script src="/js/script.js"></script>

<!-- Verificar erros no console -->
<!-- F12 > Console tab -->

<!-- Usar defer se necessário -->
<script src="/js/script.js" defer></script>
```

---

## 🚀 Problemas de Deploy

### Heroku: Application Error

**Sintomas:**
- "Application error" na página
- H10 error nos logs
- App não inicia

**Debug:**
```bash
# Ver logs detalhados
heroku logs --tail

# Verificar configurações
heroku config

# Verificar Procfile
cat Procfile
# Deve conter: web: node app.js
```

**Soluções:**
```json
// package.json
{
  "scripts": {
    "start": "node app.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

```javascript
// app.js - Porta dinâmica
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### Docker: Container Won't Start

**Sintomas:**
- Container para imediatamente
- "Exited with code 1"
- Cannot find module errors

**Debug:**
```bash
# Ver logs do container
docker logs container_name

# Executar shell no container
docker run -it image_name /bin/sh

# Verificar estrutura
docker run -it image_name ls -la /app
```

**Soluções:**
```dockerfile
# Dockerfile correto
FROM node:18-alpine
WORKDIR /app

# Copiar package files primeiro
COPY package*.json ./
RUN npm ci --only=production

# Copiar resto dos arquivos
COPY . .

# Criar pasta de dados
RUN mkdir -p data

EXPOSE 8080
CMD ["npm", "start"]
```

---

## 📱 Problemas Mobile

### Layout Quebrado no Mobile

**Sintomas:**
- Elementos sobrepostos
- Texto muito pequeno
- Botões não clicáveis

**Soluções CSS:**
```css
/* Viewport meta tag obrigatório */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Media queries responsivas */
@media (max-width: 768px) {
  .quiz-container {
    padding: 1rem;
    margin: 0;
  }
  
  .quiz-option {
    font-size: 16px; /* Evita zoom no iOS */
    padding: 1rem;
    margin: 0.5rem 0;
  }
  
  .btn-next {
    width: 100%;
    padding: 1rem;
    font-size: 18px;
  }
}

/* Touch targets mínimos */
.clickable {
  min-height: 44px; /* Apple guidelines */
  min-width: 44px;
}
```

---

### PWA Não Instala

**Sintomas:**
- "Adicionar à tela inicial" não aparece
- Service worker não registra
- Manifest inválido

**Debug:**
```javascript
// Verificar service worker
navigator.serviceWorker.register('/sw.js')
  .then(registration => {
    console.log('SW registrado:', registration);
  })
  .catch(error => {
    console.error('Erro SW:', error);
  });
```

**Soluções:**
```json
// manifest.json válido
{
  "name": "EzQuiz.shop",
  "short_name": "EzQuiz",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/assets/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🔍 Ferramentas de Debug

### 1. Logs Detalhados

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
```

### 2. Debug Mode

```bash
# Ativar debug detalhado
DEBUG=ezquiz:* npm start

# Ou no código
process.env.DEBUG = 'ezquiz:*';
```

### 3. Health Check Endpoint

```javascript
app.get('/debug', (req, res) => {
  const debug = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      hasAdminUser: !!process.env.ADMIN_USERNAME,
      hasAdminPass: !!process.env.ADMIN_PASSWORD
    },
    files: {
      quizConfig: fs.existsSync('./data/quiz-config.json'),
      publicFiles: fs.readdirSync('./public')
    },
    session: {
      sessionId: req.sessionID,
      hasAnswers: !!req.session.answers,
      currentQuestion: req.session.currentQuestion
    }
  };
  
  res.json(debug);
});
```

---

## 📊 Análise de Performance

### Problemas de Lentidão

**Identificação:**
```javascript
// Middleware de timing
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${duration}ms`);
    
    if (duration > 1000) {
      console.warn(`Slow request: ${req.url} took ${duration}ms`);
    }
  });
  
  next();
});
```

**Soluções:**
```javascript
// Cache de arquivo JSON
let cachedQuizData = null;
let cacheTimestamp = 0;

function loadQuizData() {
  const now = Date.now();
  
  // Cache por 5 minutos
  if (cachedQuizData && (now - cacheTimestamp < 5 * 60 * 1000)) {
    return cachedQuizData;
  }
  
  try {
    const data = fs.readFileSync('./data/quiz-config.json', 'utf8');
    cachedQuizData = JSON.parse(data);
    cacheTimestamp = now;
    return cachedQuizData;
  } catch (error) {
    console.error('Erro ao carregar quiz:', error);
    return cachedQuizData; // Retorna cache antigo se possível
  }
}
```

---

## 🆘 Checklist de Emergência

### Sistema Fora do Ar

**1. Verificações Básicas (1 min)**
```bash
# Servidor respondendo?
curl -I http://localhost:8080

# Processo rodando?
ps aux | grep node

# Logs recentes
tail -50 logs/error.log
```

**2. Restart Rápido (2 min)**
```bash
# PM2
pm2 restart ezquiz

# Docker
docker-compose restart

# Systemd
sudo systemctl restart ezquiz
```

**3. Rollback (5 min)**
```bash
# Git
git log --oneline -5
git checkout HEAD~1

# Docker
docker-compose down
docker pull previous_image
docker-compose up -d
```

### Quiz Parou de Funcionar

**1. Verificar Arquivo JSON**
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('data/quiz-config.json')))"
```

**2. Restaurar Backup**
```bash
cp data/backups/quiz-config-latest.json data/quiz-config.json
```

**3. Recrear Padrão**
```bash
curl -o data/quiz-config.json https://raw.githubusercontent.com/repo/main/data/quiz-config.example.json
```

---

## 📞 Quando Procurar Ajuda

### Problemas que Requerem Suporte

1. **Corrupção de dados persistente**
2. **Falhas de segurança**
3. **Performance degradação > 50%**
4. **Erros não documentados**

### Informações para Incluir

```bash
# Script de diagnóstico
#!/bin/bash
echo "=== EzQuiz Diagnostic Report ==="
echo "Date: $(date)"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "OS: $(uname -a)"
echo ""
echo "=== Environment ==="
printenv | grep -E "(NODE|PORT|ADMIN)" | sed 's/PASSWORD=.*/PASSWORD=***/'
echo ""
echo "=== Files ==="
ls -la data/
echo ""
echo "=== Logs (last 20 lines) ==="
tail -20 logs/error.log 2>/dev/null || echo "No error log found"
```

---

<div align="center">
  
  **Problemas Resolvidos! 🛠️**
  
  [← Deploy](deployment.md) • [Documentação Principal](../README.md) • [Contribuir →](../CONTRIBUTING.md)
  
</div>
