# 🔌 API Reference - EzQuiz.shop

## 📋 Visão Geral

A API do EzQuiz.shop fornece endpoints para gerenciar quizzes, processar respostas e administrar o sistema. Esta documentação abrange todos os endpoints disponíveis com exemplos práticos.

---

## 🌐 Base URL

```
Local: http://localhost:8080
Produção: https://ezquiz.shop
```

## 🔑 Autenticação

### Tipos de Autenticação

1. **Sessões de Usuário**: Para quiz e resultados
2. **Autenticação Admin**: Para painel administrativo

### Headers Necessários

```http
Content-Type: application/json
Cookie: connect.sid=session_id
```

---

## 📊 Endpoints do Quiz

### GET `/`
**Descrição**: Página inicial do quiz

**Resposta**: Renderiza a primeira pergunta do quiz

```http
GET / HTTP/1.1
Host: localhost:8080
```

**Response**:
```html
<!DOCTYPE html>
<html>
  <!-- Quiz HTML com primeira pergunta -->
</html>
```

**Session Data**:
```json
{
  "currentQuestion": 1,
  "answers": {}
}
```

---

### POST `/quiz`
**Descrição**: Processar resposta e avançar para próxima pergunta

**Parameters**:
- `answer`: Resposta do usuário (string ou array)
- `questionId`: ID da pergunta atual (number)

**Request**:
```http
POST /quiz HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

answer=70&questionId=1
```

**Response Success** (próxima pergunta):
```html
<!DOCTYPE html>
<html>
  <!-- Próxima pergunta do quiz -->
</html>
```

**Response Success** (quiz finalizado):
```http
HTTP/1.1 302 Found
Location: /resultado
```

**Session Update**:
```json
{
  "currentQuestion": 2,
  "answers": {
    "1": "70"
  }
}
```

---

### GET `/resultado`
**Descrição**: Página de resultados do quiz

**Pré-requisitos**: 
- Sessão ativa
- Todas as perguntas respondidas

**Response Success**:
```html
<!DOCTYPE html>
<html>
  <!-- Página de resultados personalizada -->
</html>
```

**Response Error** (quiz incompleto):
```http
HTTP/1.1 302 Found
Location: /
```

**Data Context**:
```javascript
{
  answers: {
    1: "70",
    2: "Entre 1 e 2 anos",
    3: "Duas gestações",
    // ... demais respostas
  },
  answersData: {
    peso: "70",
    tempoLuta: "Entre 1 e 2 anos",
    gestacoes: "Duas gestações",
    // ... dados processados
  }
}
```

---

## 🔐 Endpoints Admin

### GET `/admin/login`
**Descrição**: Página de login do administrador

**Response**:
```html
<!DOCTYPE html>
<html>
  <!-- Formulário de login admin -->
</html>
```

---

### POST `/admin/login`
**Descrição**: Autenticar administrador

**Parameters**:
- `username`: Nome de usuário
- `password`: Senha

**Request**:
```http
POST /admin/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

username=admin&password=quiz2025admin
```

**Response Success**:
```http
HTTP/1.1 302 Found
Location: /admin/dashboard
Set-Cookie: connect.sid=session_id; Path=/
```

**Response Error**:
```html
<!DOCTYPE html>
<html>
  <!-- Login page com mensagem de erro -->
</html>
```

---

### GET `/admin/dashboard`
**Descrição**: Painel administrativo principal

**Autenticação**: Requerida

**Response Success**:
```html
<!DOCTYPE html>
<html>
  <!-- Dashboard completo com configurações -->
</html>
```

**Response Unauthorized**:
```http
HTTP/1.1 302 Found
Location: /admin/login
```

**Context Data**:
```javascript
{
  quiz: {
    title: "Título do Quiz",
    description: "Descrição do Quiz",
    questions: [
      // Array com todas as perguntas
    ]
  },
  success: "mensagem_de_sucesso",
  error: "mensagem_de_erro"
}
```

---

### POST `/admin/save-quiz`
**Descrição**: Salvar configurações do quiz

**Autenticação**: Requerida

**Parameters**:
- `title`: Título do quiz
- `description`: Descrição do quiz
- `questions`: JSON string com perguntas

**Request**:
```http
POST /admin/save-quiz HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

title=Novo+Titulo&description=Nova+Descricao&questions=[...]
```

**Response Success**:
```http
HTTP/1.1 302 Found
Location: /admin/dashboard?success=Quiz+salvo+com+sucesso
```

**Response Error**:
```http
HTTP/1.1 302 Found
Location: /admin/dashboard?error=Erro+ao+salvar+quiz
```

---

### GET `/admin/logout`
**Descrição**: Deslogar administrador

**Response**:
```http
HTTP/1.1 302 Found
Location: /admin/login
Set-Cookie: connect.sid=; Expires=Thu, 01 Jan 1970 00:00:00 GMT
```

---

## 📁 Endpoints de Arquivos

### GET `/produto`
**Descrição**: Página do produto (landing page)

**Response**:
```html
<!DOCTYPE html>
<html>
  <!-- Página de produto/oferta -->
</html>
```

---

### GET `/teste`
**Descrição**: Página de teste (desenvolvimento)

**Response**:
```html
<!DOCTYPE html>
<html>
  <!-- Página de teste HTML estático -->
</html>
```

---

## 🛠️ API Interna (Data Layer)

### loadQuizData()
**Descrição**: Carregar configurações do arquivo JSON

**File**: `data/quiz-config.json`

**Return**:
```javascript
{
  quiz: {
    title: "string",
    description: "string", 
    questions: Array<Question>
  }
}
```

**Error Handling**:
```javascript
try {
  const data = loadQuizData();
} catch (error) {
  console.error('Erro ao carregar quiz:', error);
  return null;
}
```

---

### saveQuizData(data)
**Descrição**: Salvar configurações no arquivo JSON

**Parameters**:
- `data`: Objeto com configurações do quiz

**Return**: `boolean`

**Implementation**:
```javascript
function saveQuizData(data) {
  try {
    fs.writeFileSync('data/quiz-config.json', JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar:', error);
    return false;
  }
}
```

---

## 🔒 Middleware de Segurança

### requireAuth()
**Descrição**: Verificar autenticação de admin

**Implementation**:
```javascript
function requireAuth(req, res, next) {
  if (req.session.adminAuthenticated) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}
```

**Usage**:
```javascript
app.get('/admin/dashboard', requireAuth, (req, res) => {
  // Rota protegida
});
```

---

## 📊 Códigos de Status

### 200 OK
- Quiz carregado com sucesso
- Dashboard carregado
- Dados salvos

### 302 Found (Redirect)
- Login bem-sucedido → `/admin/dashboard`
- Quiz finalizado → `/resultado`
- Acesso não autorizado → `/admin/login`
- Quiz incompleto → `/`

### 404 Not Found
- Rota não encontrada
- Página renderizada com template 404

### 500 Internal Server Error
- Erro ao carregar/salvar dados
- Falha no sistema de arquivos
- Erro de parsing JSON

---

## 🎯 Estruturas de Dados

### Question Object
```typescript
interface Question {
  id: number;
  question: string;
  type: 'slider' | 'single' | 'multiple';
  style: 'weight' | 'gradient' | 'checkbox' | 'default';
  required: boolean;
  subtitle?: string;
  options: SliderOptions | ChoiceOption[];
}
```

### SliderOptions
```typescript
interface SliderOptions {
  min: number;
  max: number;
  default: number;
  unit: string;
  step: number;
}
```

### ChoiceOption
```typescript
interface ChoiceOption {
  text: string;
  emoji?: string;
  gradient?: string;
  special?: string;
}
```

### Session Data
```typescript
interface SessionData {
  currentQuestion: number;
  answers: Record<number, string | string[]>;
  adminAuthenticated?: boolean;
}
```

---

## 🔧 Exemplos de Uso

### Criar uma nova pergunta
```javascript
// POST /admin/save-quiz
const newQuestion = {
  id: 8,
  question: "Qual seu objetivo principal?",
  type: "single",
  style: "gradient",
  required: true,
  options: [
    { text: "Perder peso", emoji: "🎯", gradient: "gradient-blue" },
    { text: "Ganhar massa", emoji: "💪", gradient: "gradient-green" }
  ]
};
```

### Processar resposta múltipla
```javascript
// POST /quiz
// Para pergunta tipo "multiple"
{
  questionId: 4,
  answer: ["Me sinto cansada...", "Falta de ar..."]
}
```

### Verificar sessão admin
```javascript
// Middleware usage
app.get('/admin/secret', requireAuth, (req, res) => {
  res.json({ message: 'Acesso autorizado!' });
});
```

---

## 🐛 Debug e Logs

### Ativar Debug Mode
```bash
DEBUG=ezquiz:* npm start
```

### Logs do Sistema
```javascript
// Quiz responses
console.log('Pergunta:', currentQ, 'Resposta:', answer);

// Admin actions
console.log('Admin login:', username, 'from IP:', req.ip);

// File operations
console.log('Quiz config saved:', timestamp);
```

### Monitoramento
```javascript
// Monitor quiz completion
app.use('/resultado', (req, res, next) => {
  console.log('Quiz completed:', new Date());
  next();
});
```

---

## ⚡ Performance

### Caching Strategy
- Static files: 1 dia
- Quiz config: Memory cache
- Session data: Memory store

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5 // máximo 5 tentativas de login
});

app.use('/admin/login', adminLimiter);
```

---

## 🔄 Versionamento

### API Version
- **Atual**: v1.0
- **Compatibilidade**: Backward compatible
- **Breaking Changes**: Documentados em changelog

### Endpoints Deprecated
- Nenhum atualmente

---

<div align="center">
  
  **API Reference Completa! 🚀**
  
  [← Admin Guide](../guides/admin-access.md) • [Documentação Principal](../README.md) • [Desenvolvimento →](../guides/dev-setup.md)
  
</div>
