# 🤝 Guia de Contribuição - EzQuiz.shop

Obrigado por considerar contribuir com o EzQuiz.shop! Este documento fornece diretrizes para contribuições efetivas e mantém a qualidade do projeto.

---

## 📋 Índice

1. [Como Contribuir](#-como-contribuir)
2. [Configuração do Ambiente](#-configuração-do-ambiente)
3. [Processo de Desenvolvimento](#-processo-de-desenvolvimento)
4. [Padrões de Código](#-padrões-de-código)
5. [Testes](#-testes)
6. [Pull Requests](#-pull-requests)
7. [Issues](#-issues)
8. [Código de Conduta](#-código-de-conduta)

---

## 🎯 Como Contribuir

### Tipos de Contribuição Bem-vindas

- 🐛 **Bug fixes**: Correção de problemas existentes
- ✨ **Features**: Novas funcionalidades
- 📚 **Documentação**: Melhorias na documentação
- 🎨 **UI/UX**: Melhorias visuais e de experiência
- ⚡ **Performance**: Otimizações de performance
- 🧪 **Testes**: Adição ou melhoria de testes
- 🔧 **Refactoring**: Melhorias no código sem mudanças funcionais

### Áreas que Precisam de Ajuda

- [ ] Novos tipos de pergunta (rating, date picker, etc.)
- [ ] Integrações com CRMs populares
- [ ] Temas visuais personalizáveis
- [ ] Analytics avançado
- [ ] Testes automatizados
- [ ] Internacionalização (i18n)
- [ ] Acessibilidade (a11y)

---

## 🛠️ Configuração do Ambiente

### 1. Fork e Clone

```bash
# 1. Faça fork do repositório no GitHub
# 2. Clone seu fork
git clone https://github.com/SEU_USERNAME/ezquiz.shop.git
cd ezquiz.shop

# 3. Adicione o repositório original como upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/ezquiz.shop.git
```

### 2. Instalação

```bash
# Instalar dependências
npm install

# Instalar dependências de desenvolvimento
npm install --save-dev jest supertest playwright

# Configurar ambiente
cp .env.example .env
# Editar .env com suas configurações
```

### 3. Verificar Setup

```bash
# Executar testes
npm test

# Iniciar em modo desenvolvimento
npm run dev

# Verificar lint
npm run lint

# Verificar build
npm run build
```

---

## 🔄 Processo de Desenvolvimento

### 1. Criar Branch

```bash
# Sincronizar com upstream
git fetch upstream
git checkout main
git merge upstream/main

# Criar branch para feature/bugfix
git checkout -b feature/nome-da-feature
# ou
git checkout -b bugfix/descricao-do-bug
```

### 2. Convenção de Nomes de Branch

- `feature/` - Novas funcionalidades
- `bugfix/` - Correção de bugs
- `docs/` - Mudanças na documentação
- `refactor/` - Refatoração de código
- `test/` - Adição/melhoria de testes
- `chore/` - Tarefas de manutenção

**Exemplos:**
```
feature/star-rating-question
bugfix/admin-login-session
docs/api-reference-update
refactor/quiz-data-loading
```

### 3. Desenvolvimento

```bash
# Fazer alterações
# Testar localmente
npm run dev

# Executar testes
npm test

# Verificar lint
npm run lint

# Corrigir problemas de lint
npm run lint:fix
```

### 4. Commit

```bash
# Adicionar arquivos
git add .

# Commit com mensagem descritiva
git commit -m "tipo: descrição concisa

Descrição mais detalhada se necessário.

- Item 1
- Item 2

Fixes #123"
```

---

## 📝 Padrões de Código

### 1. Convenção de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição

feat(quiz): adicionar tipo de pergunta rating
fix(admin): corrigir validação de login
docs(readme): atualizar instruções de instalação
style(css): corrigir alinhamento de botões
refactor(api): simplificar carregamento de dados
test(quiz): adicionar testes para respostas múltiplas
chore(deps): atualizar dependências
```

### 2. Estilo JavaScript

```javascript
// ✅ Bom
const loadQuizData = () => {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar quiz:', error);
    return null;
  }
};

// ❌ Evitar
function loadQuizData(){
var data=fs.readFileSync(configPath,'utf8')
return JSON.parse(data)
}
```

### 3. Estrutura de Arquivos

```
src/
├── controllers/     # Lógica de controle
├── middleware/      # Middlewares customizados
├── routes/         # Definição de rotas
├── utils/          # Funções utilitárias
├── validators/     # Validação de dados
└── config/         # Configurações
```

### 4. EJS Templates

```html
<!-- ✅ Bom -->
<div class="quiz-container">
  <% if (question.type === 'slider') { %>
    <%- include('partials/slider-question', { question }) %>
  <% } else if (question.type === 'multiple') { %>
    <%- include('partials/multiple-choice', { question }) %>
  <% } %>
</div>

<!-- ❌ Evitar -->
<div class="quiz-container">
<% if(question.type==='slider'){ %>
<div class="slider">...</div>
<% } %>
</div>
```

### 5. CSS

```css
/* ✅ Bom - BEM methodology */
.quiz-question {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.quiz-question__title {
  font-weight: 600;
  color: var(--primary-color);
}

.quiz-question__subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* ❌ Evitar */
.question {
  font-size:24px;
  margin-bottom:16px;
}
```

---

## 🧪 Testes

### 1. Estrutura de Testes

```
tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
├── e2e/           # Testes end-to-end
└── fixtures/      # Dados de teste
```

### 2. Escrevendo Testes

```javascript
// tests/unit/quiz.test.js
const { loadQuizData, validateQuestion } = require('../../src/utils/quiz');

describe('Quiz Utils', () => {
  describe('loadQuizData', () => {
    test('should load valid quiz configuration', () => {
      const data = loadQuizData();
      expect(data).toBeDefined();
      expect(data.quiz).toBeDefined();
      expect(Array.isArray(data.quiz.questions)).toBe(true);
    });
    
    test('should handle invalid file gracefully', () => {
      // Mock arquivo inexistente
      const data = loadQuizData('./invalid-path.json');
      expect(data).toBeNull();
    });
  });
  
  describe('validateQuestion', () => {
    test('should validate slider question', () => {
      const question = {
        id: 1,
        type: 'slider',
        question: 'Test question',
        options: { min: 0, max: 100 }
      };
      
      expect(validateQuestion(question)).toBe(true);
    });
  });
});
```

### 3. Testes E2E

```javascript
// tests/e2e/quiz-flow.spec.js
const { test, expect } = require('@playwright/test');

test('complete quiz flow', async ({ page }) => {
  await page.goto('/');
  
  // Primeira pergunta
  await page.locator('.weight-slider').fill('75');
  await page.locator('.btn-next').click();
  
  // Verificar navegação
  await expect(page.locator('.progress-bar')).toHaveAttribute(
    'data-progress', '28'
  );
  
  // ... continuar para todas as perguntas
  
  // Página de resultado
  await expect(page.locator('.resultado-title')).toBeVisible();
});
```

### 4. Executar Testes

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- --grep "quiz"

# Com coverage
npm run test:coverage

# E2E testes
npm run test:e2e

# Watch mode
npm run test:watch
```

---

## 🔍 Pull Requests

### 1. Antes de Submeter

**Checklist:**
- [ ] Código testado localmente
- [ ] Testes passando
- [ ] Lint sem erros
- [ ] Documentação atualizada
- [ ] Commit messages seguem convenção
- [ ] Branch atualizada com main

```bash
# Verificação final
npm run pre-commit
```

### 2. Template de PR

```markdown
## 📋 Descrição

Breve descrição das mudanças...

## 🎯 Tipo de Mudança

- [ ] 🐛 Bug fix
- [ ] ✨ Nova feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentação
- [ ] 🎨 Style/UI

## 🧪 Como Testar

1. Faça checkout da branch
2. Execute `npm install`
3. Execute `npm start`
4. Teste funcionalidade X...

## 📸 Screenshots

(Se aplicável)

## ✅ Checklist

- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Código revisado
- [ ] Breaking changes documentadas
```

### 3. Processo de Review

1. **Automatic checks**: CI/CD executa testes
2. **Code review**: Mantainers revisam código
3. **Testing**: Funcionalidade testada manualmente
4. **Approval**: PR aprovado por maintainer
5. **Merge**: Integração ao main branch

---

## 🐛 Issues

### 1. Reportando Bugs

```markdown
## 🐛 Bug Report

**Descrição:**
Descrição clara do problema...

**Para Reproduzir:**
1. Vá para '...'
2. Clique em '...'
3. Veja erro

**Comportamento Esperado:**
O que deveria acontecer...

**Screenshots:**
(Se aplicável)

**Ambiente:**
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Node.js: [version]
- EzQuiz: [version]

**Logs:**
```
Cole logs relevantes aqui
```

**Contexto Adicional:**
Qualquer informação adicional...
```

### 2. Solicitando Features

```markdown
## ✨ Feature Request

**Problema a ser Resolvido:**
Descrição do problema ou necessidade...

**Solução Proposta:**
Descrição da feature desejada...

**Alternativas Consideradas:**
Outras soluções que foram consideradas...

**Contexto Adicional:**
Screenshots, mockups, exemplos...
```

### 3. Labels

- `bug` - Problemas confirmados
- `enhancement` - Melhorias
- `feature` - Novas funcionalidades
- `documentation` - Relacionado à docs
- `good first issue` - Bom para iniciantes
- `help wanted` - Ajuda necessária
- `priority-high` - Alta prioridade
- `wontfix` - Não será implementado

---

## 🔐 Segurança

### Reportando Vulnerabilidades

**NÃO** abra issues públicas para vulnerabilidades de segurança.

📧 **Email**: security@ezquiz.shop

**Incluir:**
- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Versão afetada

---

## 📚 Documentação

### 1. Atualizando Docs

- README.md para mudanças principais
- Guides específicos para features
- API documentation para endpoints
- Comments no código para lógica complexa

### 2. Estilo da Documentação

```markdown
# 📋 Título Principal

## 🎯 Seção

### Subseção

**Negrito** para conceitos importantes
`código` para comandos e código
> Citações para observações importantes

```bash
# Blocos de código com linguagem
npm install
```

**Exemplos:**
- ✅ Fazer isso
- ❌ Evitar isso
```

---

## 👥 Código de Conduta

### Nosso Compromisso

Estamos comprometidos em tornar a participação em nosso projeto uma experiência livre de assédio para todos, independentemente de idade, tamanho do corpo, deficiência, etnia, identidade e expressão de gênero, nível de experiência, nacionalidade, aparência pessoal, raça, religião ou identidade e orientação sexual.

### Comportamentos Esperados

- Usar linguagem acolhedora e inclusiva
- Respeitar diferentes pontos de vista e experiências
- Aceitar críticas construtivas graciosamente
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros da comunidade

### Comportamentos Inaceitáveis

- Uso de linguagem ou imagens sexualizadas
- Trolling, comentários insultuosos/depreciativos
- Assédio público ou privado
- Publicar informações privadas de outros
- Outras condutas inadequadas em ambiente profissional

### Aplicação

Casos de comportamento abusivo podem ser reportados contatando a equipe do projeto em conduct@ezquiz.shop. Todas as reclamações serão analisadas e investigadas.

---

## 🎉 Reconhecimento

### Contributors

Todos os contributors são reconhecidos em:
- README.md principal
- Página de contributors no site
- Release notes

### Processo de Release

1. **Feature freeze**: Parar adição de features
2. **Testing**: Testes extensivos
3. **Documentation**: Atualizar docs
4. **Release notes**: Documentar mudanças
5. **Tag version**: Criar tag git
6. **Deploy**: Publicar release

---

## 📞 Contato

### Canais de Comunicação

- 💬 **Discord**: [Servidor EzQuiz](https://discord.gg/ezquiz)
- 📧 **Email**: contribute@ezquiz.shop
- 🐛 **Issues**: [GitHub Issues](https://github.com/owner/ezquiz.shop/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/owner/ezquiz.shop/discussions)

### Maintainers

- **@maintainer1** - Líder do projeto
- **@maintainer2** - Backend specialist
- **@maintainer3** - Frontend specialist

---

## ❓ FAQ

### Posso contribuir sem experiência?

Sim! Temos issues marcadas com `good first issue` especialmente para iniciantes. Também aceitamos contribuições de documentação, testes e reports de bugs.

### Como escolher uma issue para trabalhar?

1. Procure por `good first issue` para começar
2. Comente na issue mostrando interesse
3. Aguarde confirmação de um maintainer
4. Comece a trabalhar!

### Quanto tempo leva para um PR ser revisado?

Normalmente 2-5 dias úteis. PRs com testes e documentação são priorizados.

### Posso trabalhar em features grandes?

Para features significativas, é recomendado abrir uma issue primeiro para discussão antes de começar o desenvolvimento.

---

<div align="center">
  
  **Obrigado por contribuir! 🙏**
  
  [← Troubleshooting](guides/troubleshooting.md) • [Documentação Principal](README.md) • [Changelog →](CHANGELOG.md)
  
</div>
