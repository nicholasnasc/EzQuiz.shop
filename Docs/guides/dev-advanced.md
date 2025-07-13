# 🎨 Guia de Customização e Desenvolvimento - EzQuiz.shop

## 📋 Visão Geral

Este guia abrange customização visual, criação de novos tipos de pergunta, integração com APIs externas e desenvolvimento avançado do EzQuiz.shop.

---

## 🎨 Customização Visual

### 1. Sistema de Cores

O EzQuiz.shop usa um sistema de cores baseado em CSS custom properties:

```css
:root {
  /* Cores Primárias */
  --primary-blue: #667eea;
  --primary-purple: #764ba2;
  --primary-green: #56ab2f;
  --primary-pink: #ee9ca7;
  
  /* Cores de Status */
  --success: #28a745;
  --error: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
  
  /* Cores Neutras */
  --white: #ffffff;
  --gray-100: #f8f9fa;
  --gray-200: #e9ecef;
  --gray-800: #343a40;
  --gray-900: #212529;
}
```

### 2. Personalizando Gradientes

#### Criar Novos Gradientes
```css
/* Adicionar em public/css/styles.css */
.gradient-sunset {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b9d 100%);
}

.gradient-ocean {
  background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
}

.gradient-forest {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}
```

#### Aplicar nos Quizzes
```json
{
  "options": [
    {
      "text": "Opção com novo gradiente",
      "emoji": "🌅",
      "gradient": "gradient-sunset"
    }
  ]
}
```

### 3. Customizando Tipografia

```css
/* Fontes Personalizadas */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Hierarquia de Títulos */
.quiz-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}

.quiz-question {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
}

.quiz-subtitle {
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.8;
}
```

### 4. Animações Personalizadas

```css
/* Animação de Entrada Personalizada */
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.quiz-question.animate-in {
  animation: slideInFromLeft 0.6s ease-out;
}

/* Hover Effects */
.quiz-option:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 🧩 Criando Novos Tipos de Pergunta

### 1. Estrutura Básica

#### Definindo o Tipo
```json
{
  "id": 8,
  "question": "Selecione sua cor favorita",
  "type": "color-picker",
  "style": "custom",
  "required": true,
  "options": {
    "colors": ["#ff0000", "#00ff00", "#0000ff"],
    "allowCustom": true
  }
}
```

#### Template EJS
```html
<!-- Em views/quiz.ejs -->
<% if (question.type === 'color-picker') { %>
  <div class="color-picker-container">
    <% question.options.colors.forEach(color => { %>
      <div class="color-option" 
           style="background-color: <%= color %>"
           onclick="selectColor('<%= color %>')">
      </div>
    <% }) %>
    
    <% if (question.options.allowCustom) { %>
      <input type="color" id="custom-color" class="custom-color-input">
    <% } %>
  </div>
<% } %>
```

#### Styling CSS
```css
.color-picker-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 1rem;
  padding: 2rem 0;
}

.color-option {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
}

.color-option:hover {
  border-color: #667eea;
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
}
```

#### JavaScript Functionality
```javascript
// Em public/js/script.js
function selectColor(color) {
  // Remover seleção anterior
  document.querySelectorAll('.color-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Selecionar cor atual
  event.target.classList.add('selected');
  
  // Salvar valor
  document.getElementById('answer-input').value = color;
  
  // Habilitar botão de próxima
  enableNextButton();
}

function enableNextButton() {
  const nextBtn = document.querySelector('.btn-next');
  nextBtn.disabled = false;
  nextBtn.classList.add('enabled');
}
```

### 2. Tipo: Range Duplo

#### Configuração JSON
```json
{
  "id": 9,
  "question": "Qual sua faixa de orçamento?",
  "type": "dual-range",
  "style": "currency",
  "required": true,
  "options": {
    "min": 0,
    "max": 1000,
    "defaultMin": 100,
    "defaultMax": 500,
    "step": 10,
    "currency": "R$"
  }
}
```

#### Template Implementation
```html
<div class="dual-range-container">
  <div class="range-values">
    <span id="min-value"><%= question.options.currency %> <%= question.options.defaultMin %></span>
    <span>até</span>
    <span id="max-value"><%= question.options.currency %> <%= question.options.defaultMax %></span>
  </div>
  
  <div class="dual-slider">
    <input type="range" 
           id="min-range"
           min="<%= question.options.min %>"
           max="<%= question.options.max %>"
           value="<%= question.options.defaultMin %>"
           step="<%= question.options.step %>">
    
    <input type="range"
           id="max-range" 
           min="<%= question.options.min %>"
           max="<%= question.options.max %>"
           value="<%= question.options.defaultMax %>"
           step="<%= question.options.step %>">
  </div>
</div>
```

### 3. Tipo: Rating Stars

#### Configuração
```json
{
  "id": 10,
  "question": "Como você avalia nossa experiência?",
  "type": "star-rating",
  "style": "interactive",
  "required": true,
  "options": {
    "maxStars": 5,
    "allowHalf": false,
    "labels": ["Péssimo", "Ruim", "Regular", "Bom", "Excelente"]
  }
}
```

#### Implementation
```html
<div class="star-rating-container">
  <div class="stars">
    <% for(let i = 1; i <= question.options.maxStars; i++) { %>
      <span class="star" data-rating="<%= i %>">⭐</span>
    <% } %>
  </div>
  
  <div class="rating-label" id="rating-label">
    Clique para avaliar
  </div>
</div>
```

---

## 🔌 Integrações com APIs

### 1. Integração com CRM

#### Enviar Leads para HubSpot
```javascript
// Em app.js
async function sendToHubSpot(userData) {
  const hubspotAPI = 'https://api.hubapi.com/contacts/v1/contact';
  
  const contactData = {
    properties: [
      { property: 'email', value: userData.email },
      { property: 'firstname', value: userData.nome },
      { property: 'quiz_peso', value: userData.peso },
      { property: 'quiz_idade', value: userData.idade }
    ]
  };
  
  try {
    const response = await fetch(hubspotAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
      },
      body: JSON.stringify(contactData)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar para HubSpot:', error);
    return false;
  }
}

// Usar após completar quiz
app.get('/resultado', async (req, res) => {
  // ... código existente ...
  
  // Enviar para CRM
  if (userData.email) {
    await sendToHubSpot(userData);
  }
  
  res.render('resultado', { answers, answersData });
});
```

### 2. Integração com Email Marketing

#### Mailchimp Integration
```javascript
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER // ex: us6
});

async function addToMailchimp(userData) {
  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID,
      {
        email_address: userData.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: userData.nome,
          PESO: userData.peso,
          IDADE: userData.idade
        },
        tags: ['quiz-completed']
      }
    );
    
    return response;
  } catch (error) {
    console.error('Erro Mailchimp:', error);
    return null;
  }
}
```

### 3. Analytics Avançado

#### Google Analytics 4
```html
<!-- Em views/layout.ejs -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
  
  // Event tracking personalizado
  function trackQuizProgress(questionNumber, totalQuestions) {
    gtag('event', 'quiz_progress', {
      'question_number': questionNumber,
      'total_questions': totalQuestions,
      'progress_percentage': (questionNumber / totalQuestions) * 100
    });
  }
  
  function trackQuizComplete(answers) {
    gtag('event', 'quiz_complete', {
      'quiz_type': 'health_assessment',
      'total_answers': Object.keys(answers).length
    });
  }
</script>
```

#### Facebook Pixel
```javascript
// Tracking de conversão
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');

// Event personalizado no resultado
fbq('track', 'CompleteQuiz', {
  content_name: 'Health Assessment Quiz',
  value: userData.peso,
  currency: 'BRL'
});
```

---

## 🚀 Otimização de Performance

### 1. Lazy Loading de Imagens

```html
<!-- Implementar em quiz.ejs -->
<img src="placeholder.jpg" 
     data-src="image-real.jpg" 
     class="lazy"
     loading="lazy"
     alt="Descrição">

<script>
// Intersection Observer para lazy loading
const images = document.querySelectorAll('.lazy');
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
</script>
```

### 2. Service Worker para Cache

```javascript
// public/sw.js
const CACHE_NAME = 'ezquiz-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/script.js',
  '/assets/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
```

### 3. Compressão de Assets

```javascript
// app.js - Middleware de compressão
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

---

## 🔄 Estado e Persistência

### 1. Salvar Progresso no LocalStorage

```javascript
// Salvar progresso do quiz
function saveQuizProgress(questionId, answer) {
  const progress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
  progress[questionId] = answer;
  progress.timestamp = Date.now();
  localStorage.setItem('quizProgress', JSON.stringify(progress));
}

// Recuperar progresso
function restoreQuizProgress() {
  const progress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
  const timestamp = progress.timestamp;
  
  // Expirar após 24 horas
  if (timestamp && (Date.now() - timestamp > 24 * 60 * 60 * 1000)) {
    localStorage.removeItem('quizProgress');
    return null;
  }
  
  return progress;
}
```

### 2. Sistema de Backup Automático

```javascript
// Backup automático de configurações
const fs = require('fs');
const path = require('path');

function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(__dirname, 'data', 'backups');
  
  // Criar pasta de backup se não existir
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }
  
  // Copiar arquivo atual
  const sourceFile = path.join(__dirname, 'data', 'quiz-config.json');
  const backupFile = path.join(backupPath, `quiz-config-${timestamp}.json`);
  
  fs.copyFileSync(sourceFile, backupFile);
  
  // Manter apenas últimos 10 backups
  const backupFiles = fs.readdirSync(backupPath)
    .filter(file => file.startsWith('quiz-config-'))
    .sort()
    .reverse();
  
  if (backupFiles.length > 10) {
    backupFiles.slice(10).forEach(file => {
      fs.unlinkSync(path.join(backupPath, file));
    });
  }
}

// Executar backup antes de salvar
function saveQuizData(data) {
  createBackup(); // Backup primeiro
  
  try {
    fs.writeFileSync(path.join(__dirname, 'data', 'quiz-config.json'), 
                     JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar:', error);
    return false;
  }
}
```

---

## 🧪 Testes e Qualidade

### 1. Testes Unitários com Jest

```javascript
// tests/quiz.test.js
const request = require('supertest');
const app = require('../app');

describe('Quiz Endpoints', () => {
  test('Should load initial quiz page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('quiz');
  });
  
  test('Should process quiz answer', async () => {
    const response = await request(app)
      .post('/quiz')
      .send({ answer: '70', questionId: 1 });
    expect(response.status).toBe(200);
  });
});

describe('Admin Endpoints', () => {
  test('Should require authentication', async () => {
    const response = await request(app).get('/admin/dashboard');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/admin/login');
  });
});
```

### 2. Testes E2E com Playwright

```javascript
// tests/e2e/quiz-flow.spec.js
const { test, expect } = require('@playwright/test');

test('Complete quiz flow', async ({ page }) => {
  // Navegar para o quiz
  await page.goto('http://localhost:8080');
  
  // Primeira pergunta - slider de peso
  await page.locator('.weight-slider').fill('75');
  await page.locator('.btn-next').click();
  
  // Segunda pergunta - múltipla escolha
  await page.locator('[data-option="Entre 1 e 2 anos"]').click();
  await page.locator('.btn-next').click();
  
  // Continue para todas as perguntas...
  
  // Verificar página de resultado
  await expect(page.locator('.resultado-container')).toBeVisible();
  await expect(page.locator('.metric-card')).toHaveCount(3);
});
```

### 3. Validação de Dados

```javascript
// utils/validation.js
function validateQuizConfig(config) {
  const errors = [];
  
  // Validar estrutura básica
  if (!config.quiz) {
    errors.push('Configuração "quiz" não encontrada');
  }
  
  if (!config.quiz.title || config.quiz.title.trim() === '') {
    errors.push('Título do quiz é obrigatório');
  }
  
  if (!Array.isArray(config.quiz.questions)) {
    errors.push('Questions deve ser um array');
  }
  
  // Validar cada pergunta
  config.quiz.questions.forEach((question, index) => {
    if (!question.id || typeof question.id !== 'number') {
      errors.push(`Pergunta ${index + 1}: ID inválido`);
    }
    
    if (!question.question || question.question.trim() === '') {
      errors.push(`Pergunta ${index + 1}: Texto obrigatório`);
    }
    
    if (!['slider', 'single', 'multiple'].includes(question.type)) {
      errors.push(`Pergunta ${index + 1}: Tipo inválido`);
    }
  });
  
  return errors;
}
```

---

## 📱 PWA (Progressive Web App)

### 1. Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'ezquiz-pwa-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/script.js',
  '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

### 2. Web App Manifest

```json
{
  "name": "EzQuiz.shop - Health Assessment",
  "short_name": "EzQuiz",
  "description": "Interactive health assessment quiz",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/assets/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["health", "lifestyle", "productivity"]
}
```

---

<div align="center">
  
  **Desenvolvimento Avançado Completo! 🚀**
  
  [← API Reference](../api/endpoints.md) • [Documentação Principal](../README.md) • [Deploy →](deployment.md)
  
</div>
