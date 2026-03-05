# 📚 Índice de Documentação - Call Center Platform Frontend

Bem-vindo ao repositório **Call Center Platform**! Este é um monorepo com arquitetura de microfrontends usando **Yarn Workspaces**, **Single SPA**, **React** e **TypeScript**.

## 📖 Guias Principais

### 🚀 **Para Começar**
1. **[README.md](../README.md)** - Overview rápido e quick start
2. **[SETUP.md](SETUP.md)** - Instalação e configuração detalhada do ambiente
3. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guia prático de desenvolvimento diário

### 🏗️ **Arquitetura & Design**
4. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitetura de microfrontends
5. **[MICROFRONTENDS.md](MICROFRONTENDS.md)** - Como funcionam os MFEs
6. **[CODING-STANDARDS.md](CODING-STANDARDS.md)** - Padrões de código e convenções
7. **[STYLE-GUIDE.md](STYLE-GUIDE.md)** - Guia de estilos e UI

### 👥 **Contribuindo**
8. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guia de contribuição ao projeto
9. **[COMMIT-CONVENTION.md](COMMIT-CONVENTION.md)** - Padrão de commits

### 🆘 **Suporte**
10. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - FAQ e resolução de problemas
11. **[EXAMPLES.md](EXAMPLES.md)** - Exemplos práticos e padrões comuns

---

## 🎯 Roteiros Rápidos

### ✅ Quero começar a desenvolver
1. Leia [SETUP.md](SETUP.md) - instale as dependências
2. Leia [DEVELOPMENT.md](DEVELOPMENT.md) - aprenda os comandos básicos
3. Consulte [EXAMPLES.md](EXAMPLES.md) - veja exemplos de código

### 🏗️ Quero entender a arquitetura
1. Leia [ARCHITECTURE.md](ARCHITECTURE.md) - visão geral
2. Leia [MICROFRONTENDS.md](MICROFRONTENDS.md) - funcionamento dos MFEs
3. Consulte [STRUCTURE.txt](../STRUCTURE.txt) - estrutura de pastas

### 📝 Quero contribuir com código
1. Leia [CONTRIBUTING.md](CONTRIBUTING.md) - políticas do projeto
2. Leia [CODING-STANDARDS.md](CODING-STANDARDS.md) - padrões de código
3. Leia [COMMIT-CONVENTION.md](COMMIT-CONVENTION.md) - padrão de commits

### 🐛 Tenho um problema
1. Consulte [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - problemas comuns
2. Procure no [DEVELOPMENT.md](DEVELOPMENT.md) - comandos úteis
3. Veja [EXAMPLES.md](EXAMPLES.md) - padrões corretos

---

## 📦 Estrutura do Repositório

```
frontend/
├── docs/                          # 📚 Este diretório com toda a documentação
│   ├── INDEX.md                   # Este arquivo - guia de documentação
│   ├── README.md → ../README.md   # Overview geral
│   ├── ARCHITECTURE.md            # Padrão arquitetural
│   ├── DEVELOPMENT.md             # Desenvolvimento diário
│   ├── SETUP.md                   # Setup e instalação
│   ├── MICROFRONTENDS.md          # Funcionamento dos MFEs
│   ├── CONTRIBUTING.md            # Guia de contribuição
│   ├── COMMIT-CONVENTION.md       # Padrão de commits
│   ├── CODING-STANDARDS.md        # Padrões de código
│   ├── STYLE-GUIDE.md             # Guia de estilos
│   ├── TROUBLESHOOTING.md         # FAQ e problemas
│   └── EXAMPLES.md                # Exemplos práticos
│
├── apps/                          # 🎯 Aplicações (Microfrontends)
│   ├── mfe-root/                  # Root Orchestrator
│   ├── mfe-shell/                 # Global State & Firebase
│   ├── mfe-call-center/           # Nova UI de Call Center
│   └── mfe-call-center-legacy/    # UI antiga (deprecated)
│
├── packages/                       # 📦 Shared Code
│   ├── shared-ui/                 # Componentes React
│   ├── shared-utils/              # Funções utilitárias
│   └── shared-types/              # TypeScript types
│
├── package.json                   # Root workspace config
├── README.md                       # Overview principal
└── STRUCTURE.txt                  # Visualização de estrutura
```

---

## 🛠️ Stack Tecnológico

| Aspecto | Tecnologia |
|---------|------------|
| **Monorepo** | Yarn Workspaces |
| **Microfrontends** | Single SPA |
| **Framework** | React 18+ |
| **Linguagem** | TypeScript 5+ |
| **Build** | Vite |
| **Estado Global** | Zustand |
| **Testes** | Vitest |
| **Linting** | ESLint |
| **Formatação** | Prettier |

---

## 🚀 Comandos Essenciais

```bash
# Setup e instalação
yarn install                        # Instalar dependências

# Desenvolvimento
yarn dev                            # Rodar mfe-root em dev
yarn dev:all                        # Rodar todos os MFEs em paralelo

# Build
yarn build                          # Build de todos os packages
yarn workspace @call-center-platform/mfe-root build

# Testes
yarn test                           # Rodar todos os testes
yarn test:watch                     # Watch mode
yarn workspace @call-center-platform/shared-ui test

# Linting & Code Quality
yarn lint                           # Lint todos os packages
yarn type-check                     # TypeScript check
```

Veja mais em [DEVELOPMENT.md](DEVELOPMENT.md).

---

## 🎯 Apps & Packages

### 📱 Aplicações (apps/)

| Aplicação | Descrição | Porta Dev | Status |
|-----------|-----------|-----------|--------|
| **mfe-root** | Orquestrador e entry point | 5173 | ✅ Ativo |
| **mfe-shell** | Estado global & Firebase | 5174 | ✅ Ativo |
| **mfe-call-center** | Nova interface de atendimento | 5175 | ✅ Ativo |
| **mfe-call-center-legacy** | Interface antiga | 5176 | ⚠️ Deprecated |

### 📦 Pacotes Compartilhados (packages/)

| Pacote | Descrição | Exports |
|--------|-----------|---------|
| **shared-ui** | Componentes React | Button, Card, etc |
| **shared-utils** | Funções utilitárias | formatDate, delay, etc |
| **shared-types** | TypeScript types | User, Call, etc |

---

## 📊 Fluxo de Arquitetura

```
┌──────────────────────────────────────────────┐
│         Navegador do Usuário                  │
│       http://localhost:5173                  │
└─────────────────┬──────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │    MFE Root        │
        │   (Orquestrador)   │
        └─────────┬──────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼───┐  ┌─────▼──────┐
│ Shell  │  │Call Ctr│  │Legacy      │
│:5174   │  │:5175   │  │:5176       │
└───┬────┘  └────┬───┘  └─────┬──────┘
    │            │            │
    └────────────┴────────────┘
             │
    ┌────────▼─────────┐
    │ Shared Packages  │
    │ • shared-ui      │
    │ • shared-utils   │
    │ • shared-types   │
    └──────────────────┘
```

---

## 📞 Suporte

- **Erro de build?** → Veja [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Como fazer X?** → Veja [EXAMPLES.md](EXAMPLES.md)
- **Dúvida sobre arquitetura?** → Veja [ARCHITECTURE.md](ARCHITECTURE.md)
- **Setup do computador?** → Veja [SETUP.md](SETUP.md)

---

## 📝 Última Atualização
- **Data**: 5 de março de 2026
- **Versão**: 1.0.0
- **Status**: ✅ Em desenvolvimento

---

**Bem-vindo ao time! 🚀**
