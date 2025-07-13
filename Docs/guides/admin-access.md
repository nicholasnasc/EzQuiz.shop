# 🔐 Guia do Painel Administrativo - EzQuiz.shop

## 📋 Visão Geral

O Painel Administrativo do EzQuiz.shop permite gerenciar completamente seu sistema de quiz sem necessidade de conhecimento técnico. Este guia abrange desde o acesso básico até funcionalidades avançadas.

---

## 🚪 Acesso ao Painel

### 1. Acessando o Login

**URL**: `http://localhost:8080/admin/login`

**Credenciais Padrão**:
- **Usuário**: `admin`
- **Senha**: `quiz2025admin`

### 2. Processo de Login

1. Acesse a URL do admin
2. Digite suas credenciais
3. Clique em "Entrar"
4. Você será redirecionado para o dashboard

### 3. Segurança do Login

- ✅ Senhas criptografadas
- ✅ Sessões com timeout
- ✅ Proteção contra força bruta
- ✅ Configuração via variáveis de ambiente

---

## 📊 Dashboard Principal

### Interface do Dashboard

O dashboard é dividido em seções principais:

#### 🎯 Configurações do Quiz
- **Título**: Nome principal do quiz
- **Descrição**: Subtítulo/descrição
- **Status**: Ativo/Inativo

#### 📝 Gerenciamento de Perguntas
- **Visualização**: Lista todas as perguntas
- **Editor Visual**: Interface amigável
- **Editor JSON**: Para usuários avançados

#### 💾 Controles de Sistema
- **Salvar**: Aplicar mudanças
- **Backup**: Exportar configurações
- **Restaurar**: Importar configurações

---

## ✏️ Editando Configurações Básicas

### Alterando Título e Descrição

1. **Localize a seção "Configurações do Quiz"**
2. **Edite o campo "Título"**:
   ```
   Exemplo: "Descubra Sua Solução Ideal"
   ```
3. **Edite a "Descrição"**:
   ```
   Exemplo: "Quiz personalizado para identificar suas necessidades"
   ```
4. **Clique em "Salvar Alterações"**

### Dicas de Configuração

- ✅ Use títulos chamativos e diretos
- ✅ Mantenha descrições concisas (máx. 100 caracteres)
- ✅ Teste diferentes versões para otimizar conversão
- ✅ Use emojis para deixar mais atrativo

---

## 📝 Gerenciando Perguntas

### Tipos de Pergunta Disponíveis

#### 1. 🎚️ Slider (Controle Deslizante)
**Uso**: Valores numéricos (peso, idade, etc.)

**Configuração**:
```json
{
  "id": 1,
  "question": "Qual seu peso atual?",
  "type": "slider",
  "style": "weight",
  "required": true,
  "options": {
    "min": 40,
    "max": 150,
    "default": 70,
    "unit": "kg",
    "step": 1
  }
}
```

**Parâmetros**:
- `min`: Valor mínimo
- `max`: Valor máximo
- `default`: Valor inicial
- `unit`: Unidade (kg, lb, anos, etc.)
- `step`: Incremento do slider

#### 2. ⚪ Single Choice (Escolha Única)
**Uso**: Uma opção entre várias

**Configuração**:
```json
{
  "id": 2,
  "question": "Qual sua faixa etária?",
  "type": "single",
  "style": "gradient",
  "required": true,
  "options": [
    {
      "text": "18-25 anos",
      "emoji": "🌟",
      "gradient": "gradient-blue"
    },
    {
      "text": "26-35 anos", 
      "emoji": "✨",
      "gradient": "gradient-green"
    }
  ]
}
```

#### 3. ☑️ Multiple Choice (Múltipla Escolha)
**Uso**: Várias opções podem ser selecionadas

**Configuração**:
```json
{
  "id": 3,
  "question": "Quais sintomas você tem?",
  "type": "multiple",
  "style": "checkbox",
  "required": true,
  "options": [
    {
      "text": "Cansaço",
      "emoji": "😰"
    },
    {
      "text": "Dor de cabeça",
      "emoji": "🤕"
    }
  ]
}
```

### 🎨 Estilos e Gradientes Disponíveis

#### Gradientes Pré-definidos
- `gradient-blue`: Azul degradê
- `gradient-green`: Verde degradê
- `gradient-purple`: Roxo degradê
- `gradient-pink`: Rosa degradê
- `gradient-orange`: Laranja degradê

#### Estilos Especiais
- `special-pink`: Destaque rosa
- `special-blue`: Destaque azul
- `weight`: Estilo para slider de peso

---

## 🎯 Editando Perguntas - Modo Visual

### 1. Visualização das Perguntas

Na aba **"📋 Visualização"**, você verá:

- **Número da pergunta**
- **Texto da pergunta**
- **Tipo da pergunta**
- **Opções disponíveis**
- **Estilos aplicados**

### 2. Interpretando a Visualização

```
┌─ Pergunta 1 ────────────── [slider] ─┐
│ Qual seu peso atual?                  │
│                                       │
│ Configuração do Slider:               │
│ Min: 40 | Max: 150 | Padrão: 70 kg   │
└───────────────────────────────────────┘
```

### 3. Planejando Mudanças

Use a visualização para:
- ✅ Conferir ordem das perguntas
- ✅ Verificar textos e emojis
- ✅ Planejar novos tipos de pergunta
- ✅ Validar fluxo do quiz

---

## ⚙️ Editor JSON Avançado

### 1. Acessando o Editor JSON

1. Clique na aba **"⚙️ Editor JSON"**
2. Você verá o código completo das perguntas
3. Edite diretamente o JSON
4. Clique em "Salvar Alterações"

### 2. Estrutura do JSON

```json
[
  {
    "id": 1,
    "question": "Texto da pergunta",
    "type": "slider|single|multiple",
    "style": "weight|gradient|checkbox|default",
    "required": true,
    "subtitle": "Texto opcional",
    "options": {
      // Configurações específicas do tipo
    }
  }
]
```

### 3. Validação Automática

O editor possui validação em tempo real:
- ✅ **Verde**: JSON válido
- ❌ **Vermelho**: Erro de sintaxe

### 4. Exemplos de Configuração

#### Pergunta com Subtitle
```json
{
  "id": 4,
  "question": "Selecione seus sintomas:",
  "subtitle": "Seja honesta, isso nos ajuda...",
  "type": "multiple",
  "style": "checkbox",
  "required": true,
  "options": [...]
}
```

#### Pergunta com Opção Especial
```json
{
  "options": [
    {
      "text": "Nunca engravidei",
      "emoji": "❌",
      "special": "special-pink"
    }
  ]
}
```

---

## 💾 Salvando e Gerenciando Dados

### 1. Sistema de Backup Automático

- Backup automático a cada salvamento
- Arquivos salvos em `data/backups/`
- Naming: `quiz-config-YYYY-MM-DD-HH-mm.json`

### 2. Processo de Salvamento

1. Edite as configurações
2. Clique em "💾 Salvar Alterações"
3. Sistema valida as informações
4. Feedback de sucesso/erro
5. Aplicação imediata das mudanças

### 3. Verificação de Integridade

Antes de salvar, o sistema verifica:
- ✅ Sintaxe JSON válida
- ✅ IDs únicos de perguntas
- ✅ Tipos de pergunta válidos
- ✅ Estrutura correta das opções

---

## 🔧 Configurações Avançadas

### 1. Editando Variáveis de Ambiente

Para alterar credenciais ou configurações:

```env
# .env
ADMIN_USERNAME=novo_usuario
ADMIN_PASSWORD=nova_senha_segura
ADMIN_SESSION_SECRET=nova_chave_secreta
PORT=3000
```

### 2. Configurações de Sessão

- **Timeout**: 1 hora de inatividade
- **Security**: Cookies HTTP-only
- **Storage**: Memória (reinicia com o servidor)

### 3. Logs de Administração

Todas as ações admin são registradas:
```
[2025-01-15 10:30:15] Admin login: admin from IP 192.168.1.100
[2025-01-15 10:32:45] Quiz config updated: 7 questions modified
[2025-01-15 10:35:12] Admin logout: session ended
```

---

## 📱 Interface Mobile

### Dashboard Responsivo

O painel admin é totalmente responsivo:

- **Mobile**: Interface adaptada para touch
- **Tablet**: Layout otimizado para telas médias
- **Desktop**: Experiência completa

### Recursos Mobile

- ✅ Editor JSON com syntax highlighting
- ✅ Navegação por abas
- ✅ Botões touch-friendly
- ✅ Validação em tempo real

---

## 🚨 Solução de Problemas

### Problemas de Login

**Erro: "Credenciais inválidas"**
```bash
# Verificar arquivo .env
cat .env | grep ADMIN

# Verificar se dotenv está carregando
console.log(process.env.ADMIN_USERNAME)
```

**Sessão expirando muito rápido**
```javascript
// Aumentar timeout no app.js
app.use(session({
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));
```

### Problemas de Salvamento

**Erro: "Falha ao salvar configurações"**
1. Verificar permissões da pasta `data/`
2. Verificar espaço em disco
3. Validar sintaxe JSON
4. Conferir logs do servidor

**JSON inválido**
1. Use o validador online: [jsonlint.com](https://jsonlint.com)
2. Verifique vírgulas e chaves
3. Confirme strings entre aspas
4. Valide estrutura das perguntas

---

## 🔐 Melhores Práticas de Segurança

### 1. Credenciais Fortes

```env
# ❌ Evite senhas fracas
ADMIN_PASSWORD=123456

# ✅ Use senhas fortes
ADMIN_PASSWORD=Qz9$mK2&nP8@vR5#
```

### 2. Alternância de Credenciais

Altere credenciais periodicamente:
```bash
# Gerar nova senha
openssl rand -base64 32

# Atualizar .env
ADMIN_PASSWORD=nova_senha_gerada
```

### 3. Acesso Restrito

- Configure firewall para porta admin
- Use VPN em produção
- Monitore logs de acesso
- Implemente 2FA se necessário

---

## 📊 Monitoramento e Analytics

### Métricas Disponíveis

- **Acessos ao Admin**: Quem e quando
- **Modificações**: Histórico de mudanças
- **Performance**: Tempo de resposta
- **Erros**: Log de problemas

### Dashboard de Métricas (Futuro)

```
📊 Painel de Controle - Últimos 30 dias

🔐 Logins Admin: 47
📝 Modificações: 12  
🎯 Quiz Completados: 1,234
⚡ Tempo Médio: 2.5 min
```

---

## ➡️ Próximos Passos

Após dominar o painel administrativo:

1. **[Criar tipos de pergunta personalizados](dev-question-types.md)**
2. **[Configurar integrações](dev-api-integration.md)**
3. **[Personalizar visual](dev-theming.md)**
4. **[Configurar analytics](analytics-setup.md)**

---

<div align="center">
  
  **Painel Admin dominado! 🎉**
  
  [← Instalação](installation.md) • [Documentação Principal](../README.md) • [Customização →](dev-theming.md)
  
</div>
