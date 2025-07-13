# 🚀 Guia de Deploy - EzQuiz.shop

## 📋 Visão Geral

Este guia abrange todas as opções de deploy para o EzQuiz.shop, desde plataformas cloud até servidores dedicados, incluindo configurações de produção e monitoramento.

---

## ☁️ Deploy na Nuvem

### 1. Heroku (Recomendado para Iniciantes)

#### Preparação
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login na Heroku
heroku login
```

#### Configuração do Projeto
```bash
# Criar arquivo Procfile
echo "web: node app.js" > Procfile

# Verificar package.json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "engines": {
    "node": "18.x",
    "npm": "8.x"
  }
}
```

#### Deploy
```bash
# Criar app na Heroku
heroku create ezquiz-shop

# Configurar variáveis de ambiente
heroku config:set ADMIN_USERNAME=admin
heroku config:set ADMIN_PASSWORD=sua_senha_segura
heroku config:set ADMIN_SESSION_SECRET=chave_secreta_unica
heroku config:set NODE_ENV=production

# Deploy
git add .
git commit -m "Deploy inicial"
git push heroku main

# Abrir aplicação
heroku open
```

#### Configurações Avançadas Heroku
```bash
# Configurar domínio customizado
heroku domains:add ezquiz.shop
heroku domains:add www.ezquiz.shop

# SSL automático
heroku certs:auto:enable

# Logs em tempo real
heroku logs --tail

# Escalar aplicação
heroku ps:scale web=2
```

---

### 2. Vercel (Ideal para Next.js-like)

#### Configuração
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/app.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### Deploy
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
vercel env add ADMIN_SESSION_SECRET

# Deploy de produção
vercel --prod
```

---

### 3. Railway (Moderno e Simples)

#### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Deploy
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# Configurar variáveis
railway variables set ADMIN_USERNAME=admin
railway variables set ADMIN_PASSWORD=senha_segura
```

---

### 4. Digital Ocean App Platform

#### .do/app.yaml
```yaml
name: ezquiz-shop
services:
- name: web
  source_dir: /
  github:
    repo: seu-usuario/ezquiz-shop
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: ADMIN_USERNAME
    value: admin
    type: SECRET
  - key: ADMIN_PASSWORD
    type: SECRET
  - key: ADMIN_SESSION_SECRET
    type: SECRET
  routes:
  - path: /
  health_check:
    http_path: /
```

---

## 🖥️ Servidor VPS

### 1. Ubuntu 20.04 Setup

#### Preparação do Servidor
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 (Process Manager)
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y

# Configurar firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

#### Deploy da Aplicação
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/ezquiz-shop.git
cd ezquiz-shop

# Instalar dependências
npm install --production

# Configurar variáveis de ambiente
cp .env.example .env
nano .env

# Iniciar com PM2
pm2 start app.js --name "ezquiz"
pm2 startup
pm2 save
```

#### Configuração do Nginx
```nginx
# /etc/nginx/sites-available/ezquiz
server {
    listen 80;
    server_name ezquiz.shop www.ezquiz.shop;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/ezquiz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Configurar SSL
sudo certbot --nginx -d ezquiz.shop -d www.ezquiz.shop

# Renovação automática
sudo crontab -e
# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🐳 Deploy com Docker

### 1. Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runner

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S ezquiz -u 1001

WORKDIR /app

# Copiar aplicação
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Criar pasta de dados
RUN mkdir -p data && chown -R ezquiz:nodejs data

USER ezquiz

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
version: '3.8'

services:
  ezquiz:
    build: .
    ports:
      - "80:8080"
    environment:
      - NODE_ENV=production
      - ADMIN_USERNAME=${ADMIN_USERNAME}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - ADMIN_SESSION_SECRET=${ADMIN_SESSION_SECRET}
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - ezquiz
    restart: unless-stopped

networks:
  default:
    name: ezquiz-network
```

### 3. Deploy Commands

```bash
# Build e deploy
docker-compose up -d

# Logs
docker-compose logs -f

# Update
docker-compose pull
docker-compose up -d

# Backup de dados
docker-compose exec ezquiz tar -czf /tmp/backup.tar.gz /app/data
docker cp container_id:/tmp/backup.tar.gz ./backup.tar.gz
```

---

## 📊 Monitoramento e Logs

### 1. PM2 Monitoring

```bash
# Status dos processos
pm2 status

# Logs em tempo real
pm2 logs ezquiz

# Monitoring dashboard
pm2 monit

# Restart aplicação
pm2 restart ezquiz

# Configurar auto-restart
pm2 startup
```

### 2. Logs Centralizados

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ezquiz' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### 3. Health Checks

```javascript
// routes/health.js
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    version: require('./package.json').version
  };
  
  try {
    // Verificar banco de dados / arquivos
    const fs = require('fs');
    fs.accessSync('./data/quiz-config.json', fs.constants.R_OK);
    
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.status = 'ERROR';
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});
```

---

## 🔐 Segurança em Produção

### 1. Configurações de Segurança

```javascript
// app.js - Configurações de produção
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

if (process.env.NODE_ENV === 'production') {
  // Helmet para headers de segurança
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"]
      }
    }
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por IP
  });
  app.use(limiter);

  // Rate limiting específico para admin
  const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5 // máximo 5 tentativas de login
  });
  app.use('/admin/login', adminLimiter);
}
```

### 2. Variáveis de Ambiente Seguras

```bash
# .env.production
NODE_ENV=production
PORT=8080

# Credenciais fortes
ADMIN_USERNAME=admin_$(openssl rand -hex 4)
ADMIN_PASSWORD=$(openssl rand -base64 32)
ADMIN_SESSION_SECRET=$(openssl rand -base64 64)

# Configurações de sessão
SESSION_MAX_AGE=3600000
SESSION_SECURE=true
```

### 3. HTTPS Força

```javascript
// Middleware para forçar HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, 'https://' + req.get('host') + req.url);
  }
  next();
});
```

---

## 📈 Otimização de Performance

### 1. Compressão Gzip

```javascript
const compression = require('compression');

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

### 2. Cache de Assets

```javascript
// Cache de arquivos estáticos
app.use('/public', express.static('public', {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true
}));
```

### 3. Configuração Nginx para Performance

```nginx
server {
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache de assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Buffer sizes
    client_body_buffer_size 10K;
    client_header_buffer_size 1k;
    client_max_body_size 8m;
    large_client_header_buffers 2 1k;
}
```

---

## 🔄 CI/CD Pipeline

### 1. GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "ezquiz-shop"
        heroku_email: "seu-email@example.com"
```

### 2. GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t ezquiz .
    - docker tag ezquiz $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest

deploy:
  stage: deploy
  script:
    - ssh user@server "docker pull $CI_REGISTRY_IMAGE:latest"
    - ssh user@server "docker-compose up -d"
  only:
    - main
```

---

## 📱 Deploy Mobile (PWA)

### 1. Configuração PWA

```json
// public/manifest.json
{
  "name": "EzQuiz.shop Health Assessment",
  "short_name": "EzQuiz",
  "description": "Interactive health quiz for personalized recommendations",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "orientation": "portrait-primary",
  "scope": "/",
  "icons": [
    {
      "src": "/assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/assets/icons/icon-192x192.png", 
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/assets/icons/icon-512x512.png",
      "sizes": "512x512", 
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["health", "lifestyle", "medical"],
  "shortcuts": [
    {
      "name": "Iniciar Quiz",
      "short_name": "Quiz",
      "description": "Começar avaliação de saúde",
      "url": "/",
      "icons": [{ "src": "/assets/icons/quiz-icon.png", "sizes": "96x96" }]
    },
    {
      "name": "Admin",
      "short_name": "Admin", 
      "description": "Painel administrativo",
      "url": "/admin/login",
      "icons": [{ "src": "/assets/icons/admin-icon.png", "sizes": "96x96" }]
    }
  ]
}
```

### 2. Service Worker para Offline

```javascript
// public/sw.js
const CACHE_NAME = 'ezquiz-v1.0.0';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/script.js',
  '/manifest.json',
  '/assets/icons/icon-192x192.png'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback para páginas offline
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});
```

---

## 🔍 Troubleshooting Deploy

### Problemas Comuns

#### 1. Erro de Porta
```bash
# Heroku/Railway
Error: Port already in use

# Solução
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 2. Variáveis de Ambiente
```bash
# Verificar se estão carregando
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME ? '***' : 'NOT_SET'
});
```

#### 3. Arquivo data/quiz-config.json
```bash
# Criar arquivo se não existir
mkdir -p data
cp data/quiz-config.example.json data/quiz-config.json
```

#### 4. Permissões de Arquivo
```bash
# Linux/Mac
chmod 755 data/
chmod 644 data/quiz-config.json

# Verificar owner
chown -R app:app data/
```

---

## 📞 Suporte e Monitoramento

### 1. Alertas via Webhook

```javascript
// utils/alerts.js
async function sendAlert(message, level = 'info') {
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 EzQuiz Alert [${level.toUpperCase()}]: ${message}`,
          channel: '#alerts',
          username: 'EzQuiz Bot'
        })
      });
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }
}

// Usar em pontos críticos
process.on('uncaughtException', (error) => {
  sendAlert(`Uncaught Exception: ${error.message}`, 'error');
  process.exit(1);
});
```

### 2. Status Page

```javascript
// routes/status.js
app.get('/status', (req, res) => {
  const status = {
    service: 'EzQuiz.shop',
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    checks: {
      database: checkFileSystem(),
      session: checkSession(),
      admin: checkAdminAccess()
    }
  };
  
  res.json(status);
});
```

---

<div align="center">
  
  **Deploy Completo Realizado! 🎉**
  
  [← Desenvolvimento](dev-advanced.md) • [Documentação Principal](../README.md) • [Troubleshooting →](troubleshooting.md)
  
</div>
