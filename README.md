# Call Center Platform - Microfrontend Monorepo

Monorepo usando **Yarn Workspaces** para gerenciar microfrontends com **Single SPA**, **React**, **TypeScript** e **Vitest**.

## 📁 Estrutura

```
├── apps/
│   ├── mfe-root/              # App raiz - orquestração e roteamento
│   ├── mfe-shell/             # Shell - estados globais e feature toggles
│   ├── mfe-call-center/       # Nova view de atendimentos
│   └── mfe-call-center-legacy/ # View antiga (deprecated)
├── packages/
│   ├── shared-ui/             # Componentes UI compartilhados
│   ├── shared-utils/          # Utilitários e helpers
│   └── shared-types/          # Types e interfaces
└── config files               # ESLint, Prettier, TypeScript, Vitest
```

## 🚀 Quick Start

### Instalar dependências
```bash
yarn install
```

### Desenvolvimento
```bash
# Rodar MFE Root em desenvolvimento
yarn dev

# Rodar app específico
yarn workspace @call-center-platform/mfe-shell dev
```

### Build
```bash
# Build all
yarn build

# Build específico
yarn build:root
yarn build:shell
yarn build:cc
yarn build:cc-legacy
```

### Testes
```bash
# Rodar todos os testes
yarn test

# Watch mode
yarn test:watch

# UI mode
yarn workspace @call-center-platform/mfe-root test:ui
```

### Linting & Type Check
```bash
yarn lint
yarn type-check
```

## 📦 Apps

### MFE Root
- Orquestração de microfrontends
- Roteamento principal
- Build bundle da aplicação

### MFE Shell
- Gerenciador de estados globais (Zustand)
- Integração Firebase (feature toggles)
- Contexto compartilhado entre MFEs

### MFE Call Center
- Nova view para atendimentos
- Interface moderna
- Funcionalidades atualizadas

### MFE Call Center Legacy
- View antiga (será substituída)
- Mantém compatibilidade retroativa

## 📚 Shared Packages

### shared-ui
- Componentes React reutilizáveis
- Button, Modal, Card, etc.

### shared-utils
- Funções utilitárias
- formatDate, formatTime, delay, etc.

### shared-types
- TypeScript interfaces
- User, Call, FeatureToggle, etc.

## 🔧 Stack

- **Monorepo**: Yarn Workspaces
- **Microfrontends**: Single SPA
- **Framework**: React 18+
- **Linguagem**: TypeScript 5+
- **Build**: Vite
- **Testes**: Vitest
- **State**: Zustand
- **Linting**: ESLint
- **Formatting**: Prettier

## 📝 Scripts do Root

| Script | Descrição |
|--------|-----------|
| `yarn dev` | Rodar MFE Root em dev |
| `yarn build` | Build de todos os apps |
| `yarn test` | Rodar testes de todos |
| `yarn lint` | Lint todos os apps |
| `yarn type-check` | TypeScript check |
| `yarn clean` | Limpar node_modules e dist |

## 🎯 Próximos Passos

- [ ] Configurar CI/CD
- [ ] Implementar module federation avançada
- [ ] Adicionar testes de integração
- [ ] Setup Firebase feature toggles
- [ ] Documentar API compartilhada
- [ ] Implementar error boundaries
