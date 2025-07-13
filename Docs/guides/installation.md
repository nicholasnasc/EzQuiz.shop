# 🚀 Guia de Instalação - EzQuiz.shop

## 📋 Pré-requisitos

Antes de instalar o EzQuiz.shop, certifique-se de ter os seguintes requisitos:

### Sistema Operacional
- ✅ Windows 10/11
- ✅ macOS 10.14+
- ✅ Linux Ubuntu 18.04+

### Software Necessário
- **Node.js**: Versão 18.0 ou superior
- **npm**: Versão 8.0 ou superior (incluído com Node.js)
- **Git**: Para controle de versão
- **Editor de Código**: VS Code recomendado

### Verificando Instalações

```bash
# Verificar Node.js
node --version
# Deve retornar v18.x.x ou superior

# Verificar npm
npm --version
# Deve retornar 8.x.x ou superior

# Verificar Git
git --version
# Deve retornar git version 2.x.x
```

---

## 📦 Instalação Padrão

### Passo 1: Clone o Repositório

```bash
# Usando HTTPS
git clone https://github.com/seu-usuario/ezquiz.shop.git

# Ou usando SSH (se configurado)
git clone git@github.com:seu-usuario/ezquiz.shop.git

# Navegue para a pasta
cd ezquiz.shop
```

### Passo 2: Instale as Dependências

```bash
# Instalar todas as dependências
npm install

# Ou usando yarn (se preferir)
yarn install
```

#### 📋 Dependências Instaladas

- **express**: Framework web para Node.js
- **ejs**: Template engine
- **express-session**: Gerenciamento de sessões
- **cookie-parser**: Parser de cookies
- **dotenv**: Carregamento de variáveis de ambiente

### Passo 3: Configuração Inicial

#### Criar arquivo .env

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

#### Editar configurações

```bash
# Abra o arquivo .env no seu editor
code .env
```

**Exemplo de configuração:**

```env
# Configurações do Admin Dashboard
ADMIN_USERNAME=admin
ADMIN_PASSWORD=quiz2025admin
ADMIN_SESSION_SECRET=quiz-admin-secret-key-2025

# Configurações do Servidor
PORT=8080
NODE_ENV=development
```

#### Criar estrutura de pastas

```bash
# Criar pasta de dados (se não existir)
mkdir -p data

# Verificar se o arquivo de configuração existe
ls data/quiz-config.json
```

### Passo 4: Primeiro Teste

```bash
# Iniciar o servidor
npm start

# Ou em modo desenvolvimento
npm run dev
```

#### Verificar funcionamento

1. **Quiz Principal**: http://localhost:8080
2. **Painel Admin**: http://localhost:8080/admin/login
3. **Login Admin**: 
   - Usuário: `admin`
   - Senha: `quiz2025admin`

---

## 🔧 Instalação para Desenvolvimento

### Setup Avançado

```bash
# Clone com submódulos (se houver)
git clone --recursive https://github.com/seu-usuario/ezquiz.shop.git

# Instalar dependências de desenvolvimento
npm install --include=dev

# Configurar pre-commit hooks
npm run prepare
```

### Scripts de Desenvolvimento

```bash
# Modo desenvolvimento com watch
npm run dev

# Executar testes
npm test

# Lint do código
npm run lint

# Build para produção
npm run build
```

### Configuração do VS Code

Crie o arquivo `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "ejs": "html"
  },
  "files.associations": {
    "*.ejs": "html"
  }
}
```

### Extensões Recomendadas

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag"
  ]
}
```

---

## 🐳 Instalação com Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  ezquiz:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
      - ./.env:/app/.env
```

### Comandos Docker

```bash
# Build da imagem
docker build -t ezquiz .

# Executar container
docker run -p 8080:8080 ezquiz

# Usando docker-compose
docker-compose up -d
```

---

## 📱 Instalação Mobile (PWA)

### Configuração PWA

O EzQuiz.shop pode ser instalado como PWA em dispositivos móveis:

1. Acesse o site no navegador mobile
2. Toque no menu do navegador
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

### Manifest.json

```json
{
  "name": "EzQuiz.shop",
  "short_name": "EzQuiz",
  "description": "Sistema de Quiz Interativo",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🔍 Verificação da Instalação

### Checklist Pós-Instalação

- [ ] ✅ Servidor iniciando na porta 8080
- [ ] ✅ Quiz principal carregando
- [ ] ✅ Painel admin acessível
- [ ] ✅ Login admin funcionando
- [ ] ✅ Perguntas carregando corretamente
- [ ] ✅ Respostas sendo salvas
- [ ] ✅ Página de resultados funcionando

### Comandos de Diagnóstico

```bash
# Verificar status do servidor
curl http://localhost:8080

# Verificar API de configuração
curl http://localhost:8080/admin/login

# Verificar logs do servidor
npm run logs

# Verificar saúde do sistema
npm run health-check
```

### Logs e Debug

```bash
# Ver logs em tempo real
tail -f logs/app.log

# Debug mode
DEBUG=ezquiz:* npm start

# Verificar performance
npm run analyze
```

---

## ⚠️ Problemas Comuns

### Erro: "Port 8080 already in use"

```bash
# Encontrar processo usando a porta
lsof -i :8080

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3000 npm start
```

### Erro: "Cannot find module"

```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Permission denied"

```bash
# Ajustar permissões (Linux/Mac)
chmod +x ./scripts/*.sh

# Executar como administrador (Windows)
# Abrir terminal como administrador
```

### Arquivo .env não carregando

```bash
# Verificar se o arquivo existe
ls -la .env

# Verificar conteúdo
cat .env

# Verificar encoding (deve ser UTF-8)
file .env
```

---

## 📞 Suporte

Se você encontrar problemas durante a instalação:

1. **Consulte o [Troubleshooting](troubleshooting.md)**
2. **Verifique as [Issues no GitHub](https://github.com/seu-usuario/ezquiz.shop/issues)**
3. **Entre em contato**: suporte@ezquiz.shop

---

## ➡️ Próximos Passos

Após a instalação bem-sucedida:

1. **[Configure seu primeiro quiz](admin-questions.md)**
2. **[Personalize o visual](dev-theming.md)**
3. **[Configure o deploy](deployment.md)**

---

<div align="center">
  
  **Instalação concluída! 🎉**
  
  [← Voltar à Documentação](../README.md) • [Configuração →](../guides/admin-access.md)
  
</div>
