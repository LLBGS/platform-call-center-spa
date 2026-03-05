# 📚 Plano de Separação em Repositórios Independentes

Este documento descreve o plano completo para transformar a arquitetura monorepo atual em repositórios Git independentes, permitindo escalabilidade e flexibilidade na adição de novos MFEs.

## 📋 Visão Geral

A arquitetura será reorganizada em **5+ repositórios independentes**:

| Repositório | Tipo | Propósito | Responsabilidade |
|-------------|------|----------|------------------|
| **mfe-root** | App | Shell da aplicação | Orquestra e registra todos os MFEs |
| **mfe-shell** | MFE | Infraestrutura global | Gerencia estado global, feature flags |
| **mfe-call-center** | MFE | Funcional | Interface nova de call center |
| **mfe-call-center-legacy** | MFE | Funcional | Interface legada |
| **mfe-{novo-X}** | MFE | Funcional | Novos MFEs adicionados conforme necessário |
| **shared-packages** | Monorepo | Infraestrutura | Publicado via GitHub Packages |

---

## 🎯 Benefícios

✅ **Escalabilidade**: Adicionar novos MFEs sem afetar existentes  
✅ **Independência**: Cada MFE tem seu próprio ciclo de vida e deploy  
✅ **Versionamento**: Packages compartilhados com semantic versioning  
✅ **CI/CD Simples**: Cada repo tem sua pipeline de build/test/deploy  
✅ **Desenvolvimento Paralelo**: Múltiplos times podem trabalhar simultaneamente  

---

## 📊 Fases de Implementação

### Fase 1: Estruturar Repositórios Base (4-6 horas)

#### 1.1 Criar Repositório `shared-packages`

**Objetivo**: Monorepo central para componentes reutilizáveis

**Inclusão:**
```
shared-packages/
├── packages/
│   ├── shared-ui/        # Componentes React
│   ├── shared-types/     # Type definitions
│   └── shared-utils/     # Utilitários
├── package.json          # Workspaces
├── tsconfig.json
├── .github/workflows/
│   └── publish.yml       # GitHub Actions: build + publish
└── README.md             # Instruções para usar/publicar
```

**Tarefas:**

1. **Criar repositório vazio** `shared-packages`
   ```bash
   git init shared-packages
   cd shared-packages
   ```

2. **Mover packages de frontend/**
   ```bash
   cp -r ../frontend/packages/* ./packages/
   cp ../frontend/tsconfig.json .
   cp ../frontend/.gitignore .
   ```

3. **Atualizar `package.json` root**
   ```json
   {
     "name": "@call-center-platform/shared-packages",
     "private": true,
     "workspaces": [
       "packages/*"
     ]
   }
   ```

4. **Configurar `publishConfig` em cada package**
   ```json
   {
     "publishConfig": {
       "registry": "https://npm.pkg.github.com"
     }
   }
   ```

5. **Criar GitHub Actions** (`.github/workflows/publish.yml`)
   ```yaml
   name: Publish Packages
   on:
     push:
       branches: [main, develop]
   jobs:
     publish:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with: { node-version: 18 }
         - run: npm ci && npm run build
         - run: npm publish
           env:
             NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

6. **Fazer primeiro commit e push**
   ```bash
   git add .
   git commit -m "Initial commit: shared packages"
   git push origin main
   ```

#### 1.2 Criar Repositório `mfe-root`

**Objetivo**: Host aplicação que orquestra todos os MFEs

**Inclusão:**
```
mfe-root/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── root-config.ts         # ✨ Dinâmico (baseado em .env)
│   ├── mfe-registry.config.ts # ✨ Novo arquivo
│   └── index.html
├── .env.template              # ✨ Novo arquivo
├── .npmrc.template            # ✨ Novo arquivo
├── package.json               # Atualizar dependências
├── vite.config.ts
├── tsconfig.json
├── .github/workflows/
│   └── deploy.yml
└── README.md
```

**Tarefas:**

1. **Criar repositório vazio**
   ```bash
   git init mfe-root
   cd mfe-root
   ```

2. **Copiar e adaptar**
   ```bash
   cp -r ../frontend/apps/mfe-root/* .
   ```

3. **Atualizar `package.json`** para usar packages publicados
   ```json
   {
     "name": "mfe-root",
     "dependencies": {
       "@call-center-platform/shared-types": "^1.0.0",
       "@call-center-platform/shared-utils": "^1.0.0",
       "react": "^18.2.0",
       "single-spa": "^4.1.2"
     }
   }
   ```

4. **Configurar `.npmrc`**
   ```bash
   cp ../.npmrc.template .npmrc
   # Ajustar para suas necessidades
   ```

5. **Criar `.env.template`** (já foi criado anteriormente)

6. **Atualizar `root-config.ts`** (já foi implementado dinamicamente)

7. **Fazer primeiro commit**

#### 1.3 Criar Repositório `mfe-shell`

**Objetivo**: MFE sempre ativo que gerencia infraestrutura global

**Processo idêntico a 1.2**, mas:**
- Clonar de `apps/mfe-shell`
- Atualizar package.json com versões publicadas
- Adicionar `.env.template` para configurações locais

#### 1.4 Criar Repositórios `mfe-call-center` e `mfe-call-center-legacy`

**Processo:** Repetir para cada MFE

```bash
# Para cada MFE
git init mfe-{nome}
cd mfe-{nome}
cp -r ../frontend/apps/mfe-{nome}/* .
# ... atualizar package.json, adicionar .env.template
git add .
git commit -m "Initial commit: mfe-{nome}"
git push origin main
```

---

### Fase 2: Configurar GitHub Packages (2-3 horas)

#### 2.1 Publicar Packages Compartilhados

**Pré-requisitos:**
- GitHub Personal Access Token (PAT) com escopo `write:packages`
- `.npmrc` configurado com o token

**Passos:**

1. **Versionar packages**
   ```bash
   cd shared-packages
   npm version 1.0.0 --workspaces
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Publicar**
   ```bash
   npm publish -w packages/shared-types
   npm publish -w packages/shared-ui
   npm publish -w packages/shared-utils
   ```

4. **Verificar** no GitHub
   ```
   https://github.com/seu-org/packages
   ```

#### 2.2 Atualizar Todos os Repos MFEs

```bash
# Em cada repo de MFE
npm install @call-center-platform/shared-types@^1.0.0
npm install @call-center-platform/shared-ui@^1.0.0
npm install @call-center-platform/shared-utils@^1.0.0
npm ci && npm run build
```

---

### Fase 3: Implementar Sistema de Configuração Dinâmica (3-4 horas)

**Objetivo:** Sistema baseado em `.env` que permite registrar MFEs sem código

**Já implementado!** Você tem:

✅ [apps/mfe-root/.env.template](apps/mfe-root/.env.template)  
✅ [apps/mfe-root/src/mfe-registry.config.ts](apps/mfe-root/src/mfe-registry.config.ts)  
✅ [apps/mfe-root/src/root-config.ts](apps/mfe-root/src/root-config.ts) — Versão dinâmica  

**Como funciona:**

1. Dev copia `.env.template` para `.env.local`
2. Preenche variáveis de ambiente para cada MFE:
   ```env
   VITE_MFE_{NOME}_URL=http://localhost:PORT
   VITE_MFE_{NOME}_PATH=/route
   VITE_MFE_{NOME}_DOM_ELEMENT=div-id
   VITE_MFE_{NOME}_ENABLED=true
   ```
3. `mfe-registry.config.ts` lê `.env` e cataloga MFEs
4. `root-config.ts` injeta `registerApplication()` dinamicamente

---

### Fase 4: Setup de Desenvolvimento Local (2-3 horas)

#### 4.1 Criar Script de Configuração Automática

**Objetivo:** Automatizar clone, instalação e configuração

**Arquivo criado: `setup-workspace.sh`**

**Uso:**
```bash
./setup-workspace.sh --mfes mfe-call-center,mfe-analytics --shared-packages
```

**O que ele faz:**
1. Clone root, shell, e MFEs especificados
2. Copia `.env.template` para `.env.local`
3. Instala dependências em cada repo
4. Pronto para executar

#### 4.2 Criar Docker Compose (Opcional)

**Arquivo:** `docker-compose.yml` na raiz

```yaml
version: '3.8'
services:
  mfe-root:
    build: ./mfe-root
    ports: ['5173:5173']
    environment:
      NODE_ENV: development
    command: npm run dev

  mfe-shell:
    build: ./mfe-shell
    ports: ['5174:5174']
    environment:
      NODE_ENV: development
    command: npm run dev

  mfe-call-center:
    build: ./mfes/mfe-call-center
    ports: ['5175:5175']
    environment:
      NODE_ENV: development
    command: npm run dev
```

**Uso:**
```bash
docker-compose up
```

---

### Fase 5: Documentação e Onboarding (2 horas)

#### 5.1 Criar Guia de Onboarding

**Arquivo criado: `docs/MFE-ONBOARDING.md`**

Descreve:
- Como criar novo MFE do zero
- Como integrá-lo ao root
- Como publicar em GitHub Packages
- Troubleshooting comum

#### 5.2 Criar Documentação de Separação

**Este arquivo: `docs/REPOSITORY-SEPARATION.md`**

Descreve:
- Estrutura geral
- Fases de implementação
- Como navegar múltiplos repos
- Estratégia de versionamento

#### 5.3 Atualizar README Principal

Incluir seção "Working with Multiple Repositories":
```markdown
## 📦 Trabalhar com Múltiplos Repositórios

Este projeto usa múltiplos repositórios independentes:

- [mfe-root](../mfe-root) — Orquestrador principal
- [mfe-shell](../mfe-shell) — Infraestrutura global
- [shared-packages](../shared-packages) — Componentes compartilhados
- [MFEs adicionais](../mfes/) — Diversos MFEs funcionais

**Setup rápido:**
```bash
./setup-workspace.sh --mfes mfe-call-center --shared-packages
```

---

## 🔄 Workflow de Desenvolvimento

### Setup Inicial (One-time)

```bash
# Clone root
git clone https://github.com/seu-org/mfe-root.git
cd mfe-root

# Execute script de setup
./setup-workspace.sh --mfes mfe-call-center,mfe-analytics --shared-packages
```

Resultado:
```
mfe-root/
├── .env.local          (criado, preenchido com valores default)
├── shared-packages/    (clonado)
├── mfe-shell/          (clonado)
└── mfes/
    ├── mfe-call-center/
    └── mfe-analytics/
```

### Desenvolvimento Diário

**Terminal 1 - Root:**
```bash
cd mfe-root
npm run dev  # Roda em http://localhost:5173
```

**Terminal 2 - Shell:**
```bash
cd mfe-shell
npm run dev  # Roda em http://localhost:5174
```

**Terminal 3 - MFE específico:**
```bash
cd mfes/mfe-call-center
npm run dev  # Roda em http://localhost:5175
```

**Abrir navegador:** http://localhost:5173

Mudanças em cada repo são refletidas automaticamente (hot reload via Vite).

---

## 📌 Adicionando Novo MFE

### Passo 1: Criar repositório
```bash
# Use template GitHub ou clone MFE existente
git clone https://github.com/seu-org/mfe-template.git mfe-novo-modulo
```

### Passo 2: Integrar ao root (`.env.local`)
```env
VITE_MFE_NOVO_MODULO_URL=http://localhost:5177
VITE_MFE_NOVO_MODULO_PATH=/novo-modulo
VITE_MFE_NOVO_MODULO_DOM_ELEMENT=mfe-novo-modulo
VITE_MFE_NOVO_MODULO_ENABLED=true
```

### Passo 3: Adicionar DOM container (`src/App.tsx`)
```tsx
<div id="mfe-novo-modulo"></div>
```

### Passo 4: Executar e testar
```bash
cd mfe-novo-modulo && npm run dev
# Visitar http://localhost:5173/novo-modulo
```

**Tempo total:** ~10 minutos

---

## 🔐 Segurança e Autenticação

### GitHub Packages - Autenticação

**1. Criar PAT (Personal Access Token):**
- GitHub Settings → Developer settings → Personal access tokens
- Generate new token (classic)
- Scopes: `write:packages` (inclui read:packages)

**2. Configurar `.npmrc` local:**
```
npm.pkg.github.com/:_authToken=ghp_SeuToken
```

**3. Para CI/CD (GitHub Actions):**
- Usar `GITHUB_TOKEN` automático (não requer configuração)
- Ou usar secret customizado se necessário

**⚠️ Nunca fazer commit de tokens reais!** Use `.env.local` e `npm.pkg.github.com/:_authToken=${NPM_TOKEN}` em arquivos versionados.

---

## 📊 Versionamento de Packages

### Semantic Versioning

```
MAJOR.MINOR.PATCH
1    . 0      . 0
```

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): Novas features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Fixes, backward compatible

### Exemplo

```bash
cd shared-packages

# Patch (mudar 1.0.0 → 1.0.1)
npm version patch

# Minor (mudar 1.0.0 → 1.1.0)
npm version minor

# Major (mudar 1.0.0 → 2.0.0)
npm version major

# Publicar
npm publish
```

---

## ⚠️ Migração do Monorepo Atual

### Checklist de Migração

- [ ] **Fase 1:** Criar repositórios base (root, shell, MFEs, shared-packages)
- [ ] **Fase 2:** Publicar packages em GitHub Packages
- [ ] **Fase 3:** Configuração dinâmica implementada ✅
- [ ] **Fase 4:** Script setup-workspace.sh criado ✅
- [ ] **Fase 5:** Documentação completa ✅
- [ ] Atualizar CI/CD para múltiplos repos
- [ ] Migrar histórico git (ou fazer fresh start)
- [ ] Comunicar com time sobre nova estrutura
- [ ] Treinar desenvolvedores no novo workflow
- [ ] Depreciar monorepo antigo

### Timing

```
Semana 1: Fases 1-2 (criar repos, publicar packages)
Semana 2: Fases 3-4 (configuração e setup script)
Semana 3: Fase 5 + testes de integração
Semana 4: Comunicação, treinamento, go-live
```

---

## 📖 Documentação Relacionada

- 📘 [ARCHITECTURE.md](./ARCHITECTURE.md) — Decisões arquiteturais
- 📘 [MICROFRONTENDS.md](./MICROFRONTENDS.md) — Conceitos MFE
- 📘 [MFE-ONBOARDING.md](./MFE-ONBOARDING.md) — Guia passo-a-passo
- 📘 [DEVELOPMENT.md](./DEVELOPMENT.md) — Workflow local
- 📘 [SETUP.md](./SETUP.md) — Setup inicial

---

## 🤝 Contato e Suporte

**Dúvidas sobre separação de repos?**
- Abra uma issue neste repositório
- Consulte a documentação em `docs/`
- Entre em contato com o time de arquitetura

---

**Versão:** 1.0  
**Atualizado:** Março 2026  
**Status:** ✅ Documentação Completa
