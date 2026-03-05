# Call Center Platform - Microfrontend Monorepo

[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue)](./docs)
[![Yarn](https://img.shields.io/badge/Yarn-4.0-blue)](https://yarnpkg.com)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)](#)

Monorepo usando **Yarn Workspaces** para gerenciar **microfrontends** com **Single SPA**, **React**, **TypeScript** e **Vitest**.

## 📚 Documentação Completa

Para informações detalhadas, consulte nosso **[Índice de Documentação](docs/INDEX.md)**.

### 🚀 Começando
- **[CONFIGURACAO-ESSENCIAL.md](docs/CONFIGURACAO-ESSENCIAL.md)** - Setup minimo obrigatorio (recomendado)
- **[SETUP.md](docs/SETUP.md)** - Instalação e configuração do ambiente
- **[DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Guia de desenvolvimento diário

### 🏗️ Arquitetura & Design
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Padrões e arquitetura
- **[MICROFRONTENDS.md](docs/MICROFRONTENDS.md)** - Funcionamento dos MFEs
- **[CODING-STANDARDS.md](docs/CODING-STANDARDS.md)** - Padrões de código
- **[STYLE-GUIDE.md](docs/STYLE-GUIDE.md)** - Guia de estilos

### 👥 Contribuindo
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Guia de contribuição
- **[COMMIT-CONVENTION.md](docs/COMMIT-CONVENTION.md)** - Padrão de commits

### 🆘 Suporte
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - FAQ e problemas comuns
- **[EXAMPLES.md](docs/EXAMPLES.md)** - Exemplos práticos

---

## 📁 Estrutura do Projeto

```
frontend/
├── 📚 docs/                   # Documentação completa
│   ├── INDEX.md              # Índice principal
│   ├── SETUP.md              # Setup e instalação
│   ├── DEVELOPMENT.md        # Guia de desenvolvimento
│   ├── ARCHITECTURE.md       # Arquitetura de MFEs
│   ├── MICROFRONTENDS.md     # Funcionamento dos MFEs
│   ├── CONTRIBUTING.md       # Guia de contribuição
│   ├── CODING-STANDARDS.md   # Padrões de código
│   ├── STYLE-GUIDE.md        # Guia de estilos
│   ├── COMMIT-CONVENTION.md  # Convenção de commits
│   ├── TROUBLESHOOTING.md    # FAQ e problemas
│   └── EXAMPLES.md           # Exemplos práticos
│
├── 📦 apps/                  # Microfrontends
│   ├── mfe-root/             # Orquestrador (entry point)
│   ├── mfe-shell/            # Estado global & Firebase
│   ├── mfe-call-center/      # Nova interface de atendimentos
│   └── mfe-call-center-legacy/ # Interface antiga (deprecated)
│
├── 📚 packages/              # Código compartilhado
│   ├── shared-ui/            # Componentes React
│   ├── shared-utils/         # Funções utilitárias
│   └── shared-types/         # TypeScript types
│
└── 🔧 Config files           # Configurações do projeto
```

---

## 🚀 Quick Start

### 1️⃣ Instalar Dependências

```bash
yarn install
```

### 2️⃣ Configurar Ambiente do Root

```bash
cp apps/mfe-root/.env.template apps/mfe-root/.env.local
```

Veja detalhes em [docs/CONFIGURACAO-ESSENCIAL.md](docs/CONFIGURACAO-ESSENCIAL.md).

### 3️⃣ Rodar em Desenvolvimento

```bash
# Opção A: Apenas MFE Root
yarn dev

# Opção B: Todos os MFEs em paralelo (recomendado)
yarn dev:all
```

Abre em `http://localhost:5173`

### 4️⃣ Build

```bash
# Build de todos os packages
yarn build

# Build específico
yarn build:root
yarn build:shell
yarn build:cc
```

### 5️⃣ Outros Comandos

```bash
# Testes
yarn test
yarn test:watch

# Linting
yarn lint
yarn type-check
```

---

## 📦 Stack Tecnológico

| Aspecto | Tecnologia |
|---------|------------|
| **Monorepo** | Yarn Workspaces 4.0+ |
| **Microfrontends** | Single SPA |
| **Framework Frontend** | React 18+ |
| **Linguagem** | TypeScript 5+ |
| **Build Tool** | Vite |
| **State Management** | Zustand |
| **Testing** | Vitest |
| **Code Quality** | ESLint + Prettier |

---

## 🎯 Aplicações (apps/)

### MFE Root 🌳
- **Porta**: 5173
- **Responsabilidade**: Orquestrador de MFEs
- **Conteúdo**: Single SPA setup, roteamento principal
- **Status**: ✅ Ativo

### MFE Shell 🎚️
- **Porta**: 5174
- **Responsabilidade**: Estado global, Firebase integration
- **Conteúdo**: Zustand store, feature toggles, auth
- **Status**: ✅ Ativo

### MFE Call Center 📞
- **Porta**: 5175
- **Responsabilidade**: Nova interface de atendimentos
- **Conteúdo**: Interface moderna, lógica de chamadas
- **Status**: ✅ Ativo

### MFE Call Center Legacy 📱
- **Porta**: 5176
- **Responsabilidade**: Interface antiga
- **Conteúdo**: Compatibilidade retroativa
- **Status**: ⚠️ Deprecated (será removido)

---

## 📦 Pacotes Compartilhados (packages/)

### shared-ui 🧩
Componentes React reutilizáveis. Sem lógica de negócio.
```bash
yarn workspace @call-center-platform/shared-ui add-dev <package>
```

### shared-utils 🛠️
Funções utilitárias: formatDate, delay, etc.
```bash
yarn workspace @call-center-platform/shared-utils add <package>
```

### shared-types 📋
Types e interfaces TypeScript compartilhadas.
```bash
yarn workspace @call-center-platform/shared-types add @types/<lib>
```

---

## 🔄 Fluxo de Dependências

```
Apps → Shared Packages → External Libraries
  ↓
mfe-call-center 
  ├── shared-ui
  ├── shared-utils
  ├── shared-types
  └── mfe-shell (via Single SPA)
```

**Importante**: Não há dependências circulares. Sempre flua de espeçífico para genérico.

---

## 💡 Exemplos Comuns

### Usar componente compartilhado

```typescript
import { Button } from '@call-center-platform/shared-ui';

export const MyComponent = () => (
  <Button onClick={() => console.log('Clicado!')}>
    Botão Compartilhado
  </Button>
);
```

### Usar estado global

```typescript
import { useGlobalStore } from '@call-center-platform/mfe-shell';

export const UserInfo = () => {
  const { currentUser, isDarkMode } = useGlobalStore();
  
  return <div>{currentUser?.name}</div>;
};
```

### Usar tipos compartilhados

```typescript
import type { User } from '@call-center-platform/shared-types';

const user: User = {
  id: '123',
  name: 'João',
};
```

Veja mais em [EXAMPLES.md](docs/EXAMPLES.md).

---

## 🔗 Recursos Úteis

- **[Documentação Completa](docs/INDEX.md)** - Índice de todos os documentos
- **[Configuração Essencial](docs/CONFIGURACAO-ESSENCIAL.md)** - Passo a passo objetivo
- **[Setup Detalhado](docs/SETUP.md)** - Instruções passo a passo
- **[FAQ & Troubleshooting](docs/TROUBLESHOOTING.md)** - Problemas comuns
- **[Guia de Contribuição](docs/CONTRIBUTING.md)** - Como contribuir

---

## 👥 Contribuindo

Queremos suas contribuições! Leia [CONTRIBUTING.md](docs/CONTRIBUTING.md) para:
- Como fazer fork e clonar
- Padrões de código
- Processo de Pull Request
- Critérios para aceição

---

## 📝 Changelog

**v1.0.0** (5 de março de 2026)
- ✅ Setup inicial do monorepo
- ✅ Arquitetura de MFEs com Single SPA
- ✅ Shared packages (ui, utils, types)
- ✅ State management com Zustand
- ✅ Documentação completa

---

## 📞 Suporte

- **Dúvidas?** → Consulte [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **Como fazer X?** → Veja [EXAMPLES.md](docs/EXAMPLES.md)
- **Erro de setup?** → Leia [SETUP.md](docs/SETUP.md)
- **Problema técnico?** → Abra uma issue
- **Chat com time?** → Slack #dev

---

## 📊 URLs em Desenvolvimento

| Serviço | URL | Porta |
|---------|-----|-------|
| **MFE Root** (principal) | http://localhost:5173 | 5173 |
| **MFE Shell** | http://localhost:5174 | 5174 |
| **MFE Call Center** | http://localhost:5175 | 5175 |
| **MFE Call Center Legacy** | http://localhost:5176 | 5176 |

---

## 📄 Licença

MIT - Veja LICENSE.md

---

**Bem-vindo ao projeto! 🚀** Comece em [SETUP.md](docs/SETUP.md).

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
