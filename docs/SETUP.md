# 🔧 Guia de Setup e Instalação

Instruções completas para configurar o ambiente de desenvolvimento para o **Call Center Platform**.

> Se você quer apenas subir o projeto rapidamente com o minimo obrigatório, use primeiro: `docs/CONFIGURACAO-ESSENCIAL.md`.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Ferramenta | Versão Mínima | Verificar |
|-----------|----------------|----------|
| **Node.js** | 16+ (recomendado 18+) | `node --version` |
| **Yarn** | 4.0.0+ | `yarn --version` |
| **Git** | 2.0+ | `git --version` |

### ✅ Verificar Pré-requisitos

```bash
# Node.js
node --version
# v18.17.0 ✅

# Yarn
yarn --version
# 4.0.0 ✅

# Git
git --version
# git version 2.x.x ✅
```

---

## 🚀 Instalação Completa

### 1️⃣ Clonar o Repositório

```bash
git clone <repository-url>
cd frontend
```

### 2️⃣ Instalar Dependências

```bash
yarn install
```

Isso irá:
- ✅ Instalar dependências do root
- ✅ Instalar dependências de todos os workspaces (apps/ e packages/)
- ✅ Criar symlinks entre packages locais

### 3️⃣ Configurar Ambiente do `mfe-root` (Obrigatório)

```bash
cp apps/mfe-root/.env.template apps/mfe-root/.env.local
```

Sem esse arquivo, o root não consegue registrar corretamente os MFEs dinâmicos via variáveis `VITE_MFE_*`.

### 4️⃣ Verificar Setup

```bash
# Listar todos os workspaces
yarn workspaces list

# Verificar TypeScript
yarn type-check

# Verificar ESLint
yarn lint
```

### 5️⃣ Executar Primeira Vez (Opcional)

```bash
# Rodar todos os testes para validar setup
yarn test

# Ou em development mode
yarn dev
```

---

## 🎯 Configuração do VS Code

### Extensões Recomendadas

Instale estas extensões para melhor experiência:

```json
{
  "recommendations": [
    "denoland.vscode-deno",
    "ESLint.vscode-eslint",
    "esbenp.prettier-vscode",
    "react.angular-template",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

**Instalação automática:**
- Abra a Command Palette (`Ctrl+Shift+P`)
- Digite "Show Recommended Extensions"
- Clique em instalar tudo

### Configurações Recomendadas

Adicione ao seu `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "search.exclude": {
    "node_modules": true,
    "dist": true,
    "build": true
  }
}
```

### Debug Configuration

Crie `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverride": {
        "webpack:///./src/*": "${webRoot}/src/*"
      }
    }
  ]
}
```

---

## 🖥️ Configuração do Ambiente (variáveis)

### Arquivo `.env` (Opcional)

Crie na raiz do projeto:

```env
# Desenvolvimento
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=development

# Firebase (se necessário)
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_PROJECT_ID=xxx
```

**Nota:** Cada app pode ter seu próprio `.env` em `apps/mfe-*/`

---

## 🏃 Primeira Execução

### Opção 1: Apenas MFE Root

```bash
yarn dev
```

Abre em: `http://localhost:5173`

### Opção 2: Todos os MFEs (Recomendado)

```bash
yarn dev:all
```

Abre em: `http://localhost:5173`

Outros MFEs escutam em:
- Shell: `http://localhost:5174`
- Call Center: `http://localhost:5175`
- Call Center Legacy: `http://localhost:5176`

---

## 📦 Entender a Estrutura de Workspaces

```bash
# Ver todos os workspaces
yarn workspaces list

# Output:
# @call-center-platform/mfe-root
# @call-center-platform/mfe-shell
# @call-center-platform/mfe-call-center
# @call-center-platform/mfe-call-center-legacy
# @call-center-platform/shared-ui
# @call-center-platform/shared-utils
# @call-center-platform/shared-types
```

---

## 🔗 Usando Dependências Locais

Para usar um package local em outro:

```json
{
  "dependencies": {
    "@call-center-platform/shared-ui": "workspace:*",
    "@call-center-platform/shared-types": "workspace:*"
  }
}
```

O `workspace:*` automáticamente liga ao package local.

---

## 🧹 Limpeza de Cache/Reinstalação

Se encontrar problemas, limpe tudo:

```bash
# Remove node_modules e builds
yarn clean

# Remove lock files (⚠️ Cuidado!)
rm yarn.lock
rm -rf node_modules/.yarn-integrity

# Reinstalar
yarn install
```

---

## 🐳 Setup com Docker (Opcional)

Se preferir desenvolver em container:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar Yarn
RUN npm install -g yarn@4

# Copiar arquivos
COPY package.json yarn.lock ./
COPY . .

# Instalar dependências
RUN yarn install

EXPOSE 5173 5174 5175 5176

CMD ["yarn", "dev:all"]
```

**Usar Docker:**

```bash
docker build -t call-center-platform .
docker run -p 5173:5173 -p 5174:5174 -p 5175:5175 -p 5176:5176 call-center-platform
```

---

## ✅ Validação do Setup

Execute esta checklist para garantir tudo está OK:

```bash
# 1. Yarn workspaces
yarn workspaces list
# ✅ Deve listar 7 workspaces

# 2. Build
yarn build
# ✅ Não deve ter erros

# 3. Lint
yarn lint
# ✅ Não deve ter erros de ESLint

# 4. Type Check
yarn type-check
# ✅ Não deve ter erros de TypeScript

# 5. Testes
yarn test
# ✅ Testes devem passar

# 6. Dev Server
yarn dev
# ✅ Deve abrir em http://localhost:5173
```

---

## 🆘 Troubleshooting

### Erro: "Cannot find module '@call-center-platform/shared-ui'"

```bash
# Reinstale com symlinks ativos
yarn install

# Ou manualmente
yarn link @call-center-platform/shared-ui
```

### Erro: "Port 5173 already in use"

```bash
# Matar processo na porta
lsof -i :5173
kill -9 <PID>

# Ou escolher outra porta
yarn dev -- --port 5174
```

### Yarn resolve incompatibilidades

```bash
# Limpar cache de Yarn
yarn cache clean

# Reinstalar
rm -rf node_modules
yarn install
```

---

## 📚 Próximos Passos

Após setup bem-sucedido:

1. Leia [DEVELOPMENT.md](DEVELOPMENT.md) para aprender comandos do dia-a-dia
2. Consulte [EXAMPLES.md](EXAMPLES.md) para ver padrões de código
3. Veja [ARCHITECTURE.md](ARCHITECTURE.md) para entender design

---

## 📞 Ajuda

Se tiver problemas:
- Consulte [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Abra uma issue no repositório

**Sucesso no setup! 🎉**
