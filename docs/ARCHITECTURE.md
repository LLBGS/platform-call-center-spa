# Arquitetura do Monorepo MFE

## 📊 Visão Geral

Arquitetura de microfrontends descentralizados com orquestração centralizada via Single SPA.

```
┌─────────────────────────────────────────────────────────┐
│                    MFE Root (Entry Point)                │
│              Single SPA Orchestrator & Router             │
└──────────────┬──────────────┬──────────────┬─────────────┘
               │              │              │
       ┌───────▼──┐    ┌───────▼──┐   ┌─────▼──────┐
       │MFE Shell │    │Call      │   │Call Center │
       │(Global)  │    │Center    │   │Legacy      │
       │          │    │          │   │            │
       │- State   │    │- UI      │   │- UI        │
       │- Firebase│    │- Logic   │   │- Compat    │
       └─────┬────┘    └────┬─────┘   └─────┬──────┘
             │              │              │
       ┌─────▼──────────────▼──────────────▼────┐
       │         Shared Packages                 │
       ├─────────────────────────────────────────┤
       │ shared-ui          | shared-utils       │
       │ shared-types       | (Firebase, Utils)  │
       └─────────────────────────────────────────┘
```

## 🏗️ Camadas

### 1. **Entrada (MFE Root)**
- Ponto de entrada único da aplicação
- Orquestração de microfrontends via Single SPA
- Roteamento principal
- Carregamento dinâmico de MFEs

### 2. **Camada de Aplicação**

#### MFE Shell (Crítico)
- **Responsabilidades:**
  - Gerenciar estado global (Zustand store)
  - Integração com Firebase (feature toggles)
  - Context providers para toda a aplicação
  - Theme & internacionalização (futura)

- **Exposições Públicas:**
  ```typescript
  export { useGlobalStore } from './store/globalStore'
  export { useFeatureToggle } from './hooks/useFeatureToggle'
  export { useAuth } from './hooks/useAuth'
  ```

#### MFE Call Center
- **Responsabilidades:**
  - Nova interface de call center
  - Gerenciamento de chamadas
  - Painel de agentes

#### MFE Call Center Legacy
- **Responsabilidades:**
  - Compatibilidade com interface antiga
  - Será descontinuado

### 3. **Camada de Componentes & Utilidades (Shared Packages)**

#### shared-ui
- Componentes React reutilizáveis
- Sem lógica de negócio
- Stateless ou hooks locais apenas
- Exemplo: Button, Modal, Card, Table

#### shared-utils
- Funções puras
- Helpers e formatadores
- Integração com APIs externas
- Firebase service functions

#### shared-types
- TypeScript interfaces
- Tipos compartilhados
- Contratos de dados
- Não exporta implementações

## 🔄 Fluxo de Comunicação

```
┌──────────────────────────────────────────────────────┐
│ MFE Call Center                                      │
├──────────────────────────────────────────────────────┤
│ 1. Precisa de global state                           │
│    → Importa useGlobalStore from mfe-shell           │
│ 2. Precisa de tipo User                              │
│    → Importa User from shared-types                  │
│ 3. Precisa de Button                                 │
│    → Importa Button from shared-ui                   │
│ 4. Precisa formatDate                                │
│    → Importa formatDate from shared-utils            │
└──────────────────────────────────────────────────────┘
         ↓ Todos comunicam através de exports
┌──────────────────────────────────────────────────────┐
│ Shared Packages (DRY - Do not Repeat Yourself)       │
└──────────────────────────────────────────────────────┘
```

## 📦 Dependências Entre Packages

```
mfe-root
├── shared-utils
└── shared-types

mfe-shell
├── shared-utils
├── shared-types
└── firebase (externo)

mfe-call-center
├── shared-ui
├── shared-utils
├── shared-types
└── (acesso a mfe-shell via Single SPA props)

mfe-call-center-legacy
├── shared-ui
├── shared-utils
├── shared-types
└── (acesso a mfe-shell via Single SPA props)

shared-ui
└── react (peer dependency)

shared-utils
└── (sem dependências locais)

shared-types
└── (sem dependências)
```

## 🎯 Padrões de Integração

### 1. **Entre MFEs via Single SPA Props**
```typescript
// mfe-root registra contexto
singleSpa.registerApplication({
  name: '@call-center-platform/mfe-shell',
  app: () => System.import('@call-center-platform/mfe-shell'),
  activeWhen: '/',
  customProps: {
    globalStore: useGlobalStore,
  }
})
```

### 2. **Via Shared Packages (Recomendado)**
```typescript
// Qualquer MFE pode importar
import { useGlobalStore } from '@call-center-platform/mfe-shell'
import { Button } from '@call-center-platform/shared-ui'
import type { User } from '@call-center-platform/shared-types'
```

### 3. **Via Context & Providers**
```typescript
// mfe-shell fornece providers
<GlobalStateProvider>
  <FirebaseProvider>
    <App />
  </FirebaseProvider>
</GlobalStateProvider>
```

## 🔐 Limites de Responsabilidade

### MFE Root NÃO DEVE:
- ❌ Conter lógica de negócio
- ❌ Conter componentes UI
- ❌ Conter estado global

### MFE Shell NÃO DEVE:
- ❌ Conter componentes específicos de domínio
- ❌ Conter lógica de call center
- ❌ Ser roteado individualmente

### Shared Packages NÃO DEVEM:
- ❌ Depender de outras shared packages (evitar ciclos)
- ❌ Conter lógica específica de feature
- ❌ Conter estado global

## 📈 Escalabilidade

### Adicionar novo MFE:
1. Criar diretório em `apps/mfe-novo`
2. Copiar `package.json`, `tsconfig.json`, `vite.config.ts`
3. Criar `src/index.ts` e `src/App.tsx`
4. Registrar em `mfe-root`

### Adicionar novo shared package:
1. Criar diretório em `packages/novo-package`
2. Criar `package.json`, `tsconfig.json`
3. Adicionar ao workspace no `package.json` raiz
4. Exportar do `src/index.ts`

## 🚀 Deploy Strategy

### Monolítico (Recomendado inicialmente):
- Build tudo junto
- Deploy único bundle

### Distribuído (Futuro):
- Cada MFE com pipeline próprio
- Versioning independente
- CDN para cada app

## 📝 Convenções

- **Nomes**: `mfe-` prefix para apps, `shared-` para packages
- **Tipos**: Suffix `-Types` ou interfaces em `shared-types`
- **Exports**: Sempre use named exports em packages compartilhados
- **Versioning**: Semver para packages compartilhados
