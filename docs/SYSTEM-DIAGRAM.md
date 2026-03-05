# 📊 Diagrama: Sistema de Configuração Dinâmica de MFEs

## Fluxo de Carregamento

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DESENVOLVEDOR                                   │
│                                                                          │
│  1) Preenche .env.local no mfe-root com configuração de MFEs:          │
│     ┌──────────────────────────────────────────────────────────────┐   │
│     │ VITE_MFE_SHELL_URL=http://localhost:5174                 │   │
│     │ VITE_MFE_SHELL_PATH=/                                    │   │
│     │ VITE_MFE_SHELL_DOM_ELEMENT=mfe-shell                    │   │
│     │                                                            │   │
│     │ VITE_MFE_CALL_CENTER_URL=http://localhost:5175          │   │
│     │ VITE_MFE_CALL_CENTER_PATH=/call-center                  │   │
│     │ VITE_MFE_CALL_CENTER_DOM_ELEMENT=mfe-call-center        │   │
│     │                                                            │   │
│     │ VITE_MFE_NOVO_MODULO_URL=http://localhost:5177          │   │
│     │ VITE_MFE_NOVO_MODULO_PATH=/novo-modulo                  │   │
│     │ VITE_MFE_NOVO_MODULO_DOM_ELEMENT=mfe-novo-modulo        │   │
│     └──────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  2) npm run dev (no mfe-root, mfe-shell, mfes...)                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     MFES ROOT (main.tsx)                                │
│                                                                          │
│  import React from 'react'                                             │
│  import App from './App'                                               │
│  import './root-config'  ← Carrega o registro de MFEs                  │
│                                                                          │
│  ReactDOM.createRoot(...).render(<App />)                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│               MFE REGISTRY CONFIG (mfe-registry.config.ts)              │
│                                                                          │
│  export function loadMFEConfigFromEnv()                                │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │ 1) Procura por variáveis VITE_MFE_*                           │   │
│  │    ├─ Encontra: VITE_MFE_SHELL_*                              │   │
│  │    ├─ Encontra: VITE_MFE_CALL_CENTER_*                        │   │
│  │    └─ Encontra: VITE_MFE_NOVO_MODULO_*                        │   │
│  │                                                                 │   │
│  │ 2) Valida que cada MFE tem:                                   │   │
│  │    ├─ URL (necessário)                                        │   │
│  │    ├─ PATH (necessário)                                       │   │
│  │    ├─ DOM_ELEMENT (necessário)                                │   │
│  │    └─ ENABLED (opcional, default=true)                        │   │
│  │                                                                 │   │
│  │ 3) Retorna catálogo:                                          │   │
│  │    {                                                           │   │
│  │      '@call-center-platform/mfe-shell': {                    │   │
│  │        name: '...',                                           │   │
│  │        url: 'http://localhost:5174',                          │   │
│  │        path: '/',                                             │   │
│  │        domElement: 'mfe-shell',                               │   │
│  │        enabled: true,                                         │   │
│  │        alwaysActive: true                                     │   │
│  │      },                                                        │   │
│  │      '@call-center-platform/mfe-call-center': { ... },       │   │
│  │      '@call-center-platform/mfe-novo-modulo': { ... }        │   │
│  │    }                                                           │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  export function logMFERegistry()  ← Imprime configurações              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    ROOT CONFIG (root-config.ts)                          │
│                                                                          │
│  // Carregar configurações dinâmicas                                   │
│  const mfeConfigs = loadMFEConfigFromEnv()                             │
│                                                                          │
│  // Para cada MFE configurado:                                         │
│  Object.values(mfeConfigs).forEach((config) => {                       │
│    if (!config.enabled) return;  ← Pula se desabilitado               │
│                                                                          │
│    registerApplication({                                               │
│      name: '@call-center-platform/mfe-shell',                         │
│      app: loadMFE(...),  ← Carrega do Vite em dev, SystemJS em prod  │
│      activeWhen: createActiveWhenFunction('/')  ← Sempre ativo        │
│    });                                                                  │
│                                                                          │
│    registerApplication({                                               │
│      name: '@call-center-platform/mfe-call-center',                   │
│      app: loadMFE(...),                                                │
│      activeWhen: createActiveWhenFunction('/call-center')             │
│    });                                                                  │
│                                                                          │
│    // ... e assim para novo-modulo                                      │
│  });                                                                    │
│                                                                          │
│  start({ urlRerouteOnly: true });  ← Inicia single-spa               │
│                                                                          │
│  logMFERegistry(mfeConfigs);  ← Imprime no console                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         SINGLE SPA REGISTRY                             │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ App: '@call-center-platform/mfe-shell'                      │     │
│  │ Active When: Always (any route)                             │     │
│  │ Status: Mounted ✓                                           │     │
│  │ Container: #mfe-shell                                       │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ App: '@call-center-platform/mfe-call-center'                │     │
│  │ Active When: pathname starts with /call-center              │     │
│  │ Status: Mounted ✓ (when user navigates to /)               │     │
│  │ Container: #mfe-call-center                                 │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ App: '@call-center-platform/mfe-novo-modulo'                │     │
│  │ Active When: pathname starts with /novo-modulo              │     │
│  │ Status: Mounted ✓ (when user navigates to /novo-modulo)    │     │
│  │ Container: #mfe-novo-modulo                                 │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    APP.TSX (Containers DOM)                             │
│                                                                          │
│  <div id="mfe-shell"></div>         ← Single-spa monta aqui           │
│  <div id="mfe-call-center"></div>   ← Single-spa monta aqui           │
│  <div id="mfe-novo-modulo"></div>   ← Single-spa monta aqui           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                  NAVEGAÇÃO - USER CLICA EM LINK                         │
│                                                                          │
│  URL: http://localhost:5173/novo-modulo                                │
│                                                               ↓          │
│  Single-spa: "/novo-modulo" matches "VITE_MFE_NOVO_MODULO_PATH"       │
│                                               ↓                         │
│  Carrega: http://localhost:5177/src/index.tsx (dev)                    │
│           ou System.import('...') (produção)                            │
│                                               ↓                         │
│  Renderiza em: <div id="mfe-novo-modulo"></div>                       │
│                                                                          │
│  Resultado: MFE novo-modulo está visível! 🎉                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Comparação: Antes vs Depois

### ❌ ANTES (Hardcoded)

```typescript
// root-config.ts
const DEV_URLS = {
  shell: 'http://localhost:5174',
  callCenter: 'http://localhost:5175',
  callCenterLegacy: 'http://localhost:5176',
};

registerApplication('@call-center-platform/mfe-shell', ...); 
registerApplication('@call-center-platform/mfe-call-center', ...);
registerApplication('@call-center-platform/mfe-call-center-legacy', ...);

// ❌ Para adicionar novo MFE:
// 1. Criar novo repositório
// 2. Modificar root-config.ts
// 3. Adicionar container em App.tsx
// 4. Commitar + deploy
// ⏱️ Tempo: 30-40 minutos
```

### ✅ DEPOIS (Dinâmico)

```typescript
// .env.local (no mfe-root)
VITE_MFE_NOVO_MODULO_URL=http://localhost:5177
VITE_MFE_NOVO_MODULO_PATH=/novo-modulo
VITE_MFE_NOVO_MODULO_DOM_ELEMENT=mfe-novo-modulo
VITE_MFE_NOVO_MODULO_ENABLED=true

// root-config.ts (automático)
const mfeConfigs = loadMFEConfigFromEnv();
Object.values(mfeConfigs).forEach(config => {
  registerApplication({...});
});

// ✅ Para adicionar novo MFE:
// 1. Criar novo repositório
// 2. Editar .env.local (4 linhas)
// 3. Adicionar container em App.tsx (1 linha)
// 4. ✓ Pronto!
// ⏱️ Tempo: 2-3 minutos
```

---

## Exemplo Prático: Adicionar MFE "Analytics"

### Passo 1: Evitar Antes
```
1. Criar novo repo: mfe-analytics
2. Setup: npm install, package.json, vite.config.ts, src/index.tsx
3. Editar root-config.ts:
   const DEV_URLS = {
     shell: '...',
     callCenter: '...',
     callCenterLegacy: '...',
     analytics: 'http://localhost:5177'  ← ADICIONADO
   };
   registerApplication('@call-center-platform/mfe-analytics', ...);
4. Editar App.tsx:
   <div id="mfe-analytics"></div>  ← ADICIONADO
5. Commitar
6. Deploy
⏱️ 40 minutos
```

### Passo 2: Depois
```
1. Criar novo repo: mfe-analytics
2. Setup: npm install, package.json, vite.config.ts, src/index.tsx
3. Editar .env.local (APENAS):
   VITE_MFE_ANALYTICS_URL=http://localhost:5177
   VITE_MFE_ANALYTICS_PATH=/analytics
   VITE_MFE_ANALYTICS_DOM_ELEMENT=mfe-analytics
   VITE_MFE_ANALYTICS_ENABLED=true
4. Editar App.tsx (1 linha):
   <div id="mfe-analytics"></div>
5. ✓ Pronto!
⏱️ 3 minutos!
```

---

## Output no Console

Quando `npm run dev` no mfe-root:

```
═══════════════════════════════════════════════════════════════
🔧 MFE REGISTRY - Microfrontends Registrados
═══════════════════════════════════════════════════════════════
⭐ @call-center-platform/mfe-shell
   URL:        http://localhost:5174
   Rota:       /
   DOM:        #mfe-shell
   Sempre Ativo: Sim

📦 @call-center-platform/mfe-call-center
   URL:        http://localhost:5175
   Rota:       /call-center
   DOM:        #mfe-call-center
   Sempre Ativo: Não

📦 @call-center-platform/mfe-novo-modulo
   URL:        http://localhost:5177
   Rota:       /novo-modulo
   DOM:        #mfe-novo-modulo
   Sempre Ativo: Não

Total de MFEs: 3
═══════════════════════════════════════════════════════════════
```

---

## Estrutura Final de Arquivos

```
mfe-root/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── root-config.ts          ← Versão dinâmica (atualizado)
│   ├── mfe-registry.config.ts  ← NOVO: Lê configuração
│   └── index.html
├── .env.template               ← NOVO: Template de config
├── .npmrc.template             ← NOVO: Template GitHub Packages
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Benefícios Técnicos

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Código Duplicado** | ❌ MFE hard-codado n root-config | ✅ Lido dinamicamente do .env |
| **Escalabilidade** | ❌ Limitada a poucos MFEs | ✅ Suporta N MFEs |
| **Integração** | ❌ Requer recompile | ✅ Sem rebuild necessário |
| **Type Safety** | ✅ Types em root-config | ✅ Mesmo nível com validação |
| **DevEx** | ❌ Modificar código | ✅ Apenas editar variáveis |
| **CI/CD** | ❌ Root precisa saber de toda MFE | ✅ Root agnóstico |

---

## Conclusão

Sistema simples mas poderoso:
- **Entrada**: variáveis de ambiente (`.env`)
- **Processamento**: `mfe-registry.config.ts` lê e valida
- **Saída**: `root-config.ts` registra dinamicamente

**Resultado**: Adicionar MFE novo é configuração, não código! 🚀
