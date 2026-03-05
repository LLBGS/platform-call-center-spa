# 📦 Guia de Onboarding - Criar Novo MFE

Este guia descreve o processo completo para criar e integrar um novo Microfrontend (MFE) à arquitetura.

## Visão Geral

Um novo MFE deve ser:
- Um repositório Git **independente**
- Uma aplicação **React + TypeScript** com **Vite**
- Configurado com **single-spa** para integração
- Publicado em **GitHub Packages** (para reutilização)

**Tempo estimado**: 15-20 minutos

---

## Pré-requisitos

✅ Acesso ao repositório de `shared-packages` (para instalar `shared-ui`, `shared-utils`, `shared-types`)  
✅ Acesso ao repositório `mfe-root` (para adicionar nas variáveis de ambiente)  
✅ Node.js 18+ e npm 8+ instalados  
✅ GitHub Personal Access Token (para publicar em GitHub Packages)

---

## Passo 1: Usar Template de Novo MFE

### Opção A: Via GitHub Template Repository (Recomendado)

1. **Acesse o repositório template:**
   ```
   https://github.com/seu-org/mfe-template
   ```

2. **Clique em "Use this template" → "Create a new repository"**

3. **Nomeie o repositório** seguindo o padrão:
   ```
   mfe-{nome-modulo}
   ```
   
   Exemplos:
   - `mfe-analytics`
   - `mfe-user-management`
   - `mfe-reporting`
   - `mfe-resources`

4. **Escolha visibilidade**: Private (recomendado para privado)

5. **Clone o novo repositório:**
   ```bash
   git clone https://github.com/seu-org/mfe-{nome-modulo}.git
   cd mfe-{nome-modulo}
   ```

### Opção B: Clonar MFE Existente (Alternativa)

Se preferir usar um MFE já configurado como base:

```bash
# Clone um MFE existente
git clone https://github.com/seu-org/mfe-call-center.git mfe-{nome-modulo}
cd mfe-{nome-modulo}

# Remova o histórico git
rm -rf .git

# Inicialize novo repositório
git init
git add .
git commit -m "Initial commit from mfe-call-center template"
```

### Opção C: Criar Manualmente

Veja a seção [Estrutura Manual](#estrutura-manual) no final deste documento.

---

## Passo 2: Configurar o Novo MFE

### 2.1 Atualizar `package.json`

```json
{
  "name": "@call-center-platform/mfe-{nome-modulo}",
  "version": "1.0.0",
  "description": "Descrição do seu novo MFE",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "dependencies": {
    "@call-center-platform/shared-ui": "^1.0.0",
    "@call-center-platform/shared-utils": "^1.0.0",
    "@call-center-platform/shared-types": "^1.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "single-spa-react": "^5.1.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}
```

### 2.2 Atualizar `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5177,  // ⚠️ MUDANÇA IMPORTANTE: Use porta única para seu MFE!
    strictPort: true,
    cors: true,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: '@call-center-platform/mfe-{nome-modulo}',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'single-spa'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'single-spa': 'singleSpa',
        },
      },
    },
  },
});
```

⚠️ **Importante**: Escolha uma **porta de dev server única** para seu MFE que não conflite com outros:
- mfe-shell: 5174
- mfe-call-center: 5175
- mfe-call-center-legacy: 5176
- Seu novo MFE: 5177+ (ajuste conforme necessário)

### 2.3 Atualizar `src/index.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: App,
  errorBoundary(error: Error, errorInfo: unknown, props: unknown) {
    console.error('Erro no MFE novo-modulo:', error);
    return <div>Erro ao carregar novo-modulo</div>;
  },
  domElementGetter: () => document.getElementById('mfe-novo-modulo')!,
});

export const { bootstrap, mount, unmount } = lifecycles;
```

### 2.4 Criar `src/App.tsx`

```typescript
import React from 'react';
import { Button } from '@call-center-platform/shared-ui';

export const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎉 Novo MFE - {Nome Modulo}</h2>
      <p>Bem-vindo ao novo microfrontend!</p>
      <Button>Clique aqui</Button>
    </div>
  );
};

export default App;
```

### 2.5 Atualizar `.env.template`

```bash
# Porta de desenvolvimento
VITE_PORT=5177

# URLs de APIs (se necessário)
# VITE_API_URL=http://localhost:3000

# Feature flags
# VITE_FEATURE_EXPERIMENTAL=false
```

---

## Passo 3: Testar Localmente

### 3.1 Instalar e Rodar o MFE

```bash
npm install
npm run dev
```

Você deve ver:
```
VITE v4.4.0
➜  Local: http://localhost:5177/src/index.tsx
```

### 3.2 Instalar Dependências de Packages Compartilhados

Se os packages compartilhados estão em desenvolvimento local, configure o `package.json` temporariamente:

```json
{
  "@call-center-platform/shared-ui": "file:../shared-packages/packages/shared-ui",
  "@call-center-platform/shared-utils": "file:../shared-packages/packages/shared-utils",
  "@call-center-platform/shared-types": "file:../shared-packages/packages/shared-types"
}
```

Depois:
```bash
npm install
```

---

## Passo 4: Integrar ao mfe-root

### 4.1 Adicionar Container DOM

No repositório `mfe-root`, edite `src/App.tsx` e adicione:

```typescript
{/* MFE Novo Modulo */}
<div id="mfe-novo-modulo"></div>
```

### 4.2 Configurar Variáveis de Ambiente

No repositório `mfe-root`, edite `.env.local` e adicione:

```env
# Seu novo MFE
VITE_MFE_NOVO_MODULO_URL=http://localhost:5177
VITE_MFE_NOVO_MODULO_PORT=5177
VITE_MFE_NOVO_MODULO_PATH=/novo-modulo
VITE_MFE_NOVO_MODULO_DOM_ELEMENT=mfe-novo-modulo
VITE_MFE_NOVO_MODULO_ENABLED=true
```

### 4.3 Testar Integração

1. **Terminal 1 - Root:**
   ```bash
   cd mfe-root
   npm run dev
   ```

2. **Terminal 2 - Shell:**
   ```bash
   cd mfe-shell
   npm run dev
   ```

3. **Terminal 3 - Novo MFE:**
   ```bash
   cd mfe-novo-modulo
   npm run dev
   ```

4. **Abra no navegador:**
   ```
   http://localhost:5173/novo-modulo
   ```

Se tudo funcionar, você verá o novo MFE renderizado! 🎉

---

## Passo 5: Publicar em GitHub Packages

### 5.1 Configurar `.npmrc`

```bash
cp ../.npmrc.template .npmrc
# Edite .npmrc e adicione seu token
```

Conteúdo do `.npmrc`:
```
@call-center-platform:registry=https://npm.pkg.github.com
npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

### 5.2 Versionar e Publicar

```bash
# Atualizar versão
npm version patch  # ou minor/major

# Build
npm run build

# Publicar
npm publish
```

Se bem-sucedido, o pacote estará disponível em:
```
https://github.com/seu-org/packages/@call-center-platform/mfe-novo-modulo
```

---

## Passo 6: Atualizar Todos os MFEs

Agora que seu novo MFE está publicado, todos podem consumir versões publicadas:

```json
{
  "@call-center-platform/mfe-novo-modulo": "^1.0.0"
}
```

---

## Troubleshooting

### ❌ Erro: "Cannot find module '@call-center-platform/shared-ui'"

**Solução**: Verifique se os packages compartilhados estão publicados ou use `file:` paths localmente.

```bash
# Verificar disponibilidade
npm view @call-center-platform/shared-ui

# Se não existe, configure sem versão publicada
# Edite package.json temporariamente para usar file paths
```

### ❌ Erro: "Port already in use"

**Solução**: Escolha uma porta diferente em `vite.config.ts` e atualize `mfe-root/.env.local`

```typescript
server: {
  port: 5178,  // Use uma porta não utilizada
},
```

### ❌ MFE não aparece na aplicação

**Verificação:**
1. Verifique console do navegador (F12) para erros
2. Confirme que a div container existe em `App.tsx`
3. Verifique variáveis `.env.local` no `mfe-root`
4. Verifique que `activeWhen` path está correto

```typescript
// Exemplo: Para ativar em /novo-modulo
VITE_MFE_NOVO_MODULO_PATH=/novo-modulo
```

---

## Estrutura Manual

Se preferir criar manualmente, aqui está a estrutura mínima:

```
mfe-novo-modulo/
├── src/
│   ├── index.tsx         # Entry point com ciclos de vida single-spa
│   ├── App.tsx           # Componente raiz
│   └── main.css          # Estilos (opcional)
├── .env.template         # Template de configuração
├── .gitignore
├── package.json          # Com dependências corretas
├── tsconfig.json         # Extends raiz
├── vite.config.ts        # Configuração build library
└── README.md
```

Para cada arquivo, use como referência:
- **mfe-call-center** para padrão de MFE simples
- **mfe-shell** para MFE com gerenciamento de estado
- **SETUP.md** na raiz para referências gerais

---

## Próximos Passos

✅ Seu novo MFE está criado e integrado!

**Agora você pode:**

1. **Adicionar features** específicas do seu MFE
2. **Consumir componentes** de `shared-ui`
3. **Usar types** de `shared-types`
4. **Compartilhar utilitários** via `shared-utils`
5. **Criar novos componentes** que outros MFEs possam consumir

**Para mais informações:**
- 📖 [docs/MICROFRONTENDS.md](../MICROFRONTENDS.md) - Arquitetura geral
- 📖 [docs/ARCHITECTURE.md](../ARCHITECTURE.md) - Decisões arquiteturais
- 📖 [docs/DEVELOPMENT.md](../DEVELOPMENT.md) - Workflow de desenvolvimento

---

**Dúvidas?** Consulte a documentação ou abra uma issue no repositório!
