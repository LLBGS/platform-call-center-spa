# 👨‍💻 Guia de Desenvolvimento

## Setup Inicial

### 1. Clonar e instalar
```bash
cd /home/goliraworkspace/pocs/aplicacao/frontend
yarn install
```

### 2. Verificar workspace setup
```bash
yarn workspaces list
```

## 🛠️ Desenvolvimento Diário

### Rodar MFE em desenvolvimento
```bash
# MFE Root (entry point)
yarn workspace @call-center-platform/mfe-root dev

# MFE Specific
yarn workspace @call-center-platform/mfe-shell dev
yarn workspace @call-center-platform/mfe-call-center dev
```

### Buildar uma app específica
```bash
yarn workspace @call-center-platform/mfe-root build
```

### Rodar testes
```bash
# Todos os testes
yarn test

# Watch mode (recomendado durante dev)
yarn test:watch

# Teste específico
yarn workspace @call-center-platform/shared-ui test

# UI mode (visual)
yarn workspace @call-center-platform/mfe-root test:ui
```

### Linting & Formatting
```bash
# Lint tudo
yarn lint

# Lint específico
yarn workspace @call-center-platform/shared-ui lint

# Format com Prettier
yarn prettier --write "apps/**/*.{ts,tsx}" "packages/**/*.{ts,tsx}"
```

## 📂 Criando um Novo Componente Compartilhado

### 1. Criar arquivo em shared-ui
```bash
touch packages/shared-ui/src/Card.tsx
```

### 2. Implementar componente
```typescript
// packages/shared-ui/src/Card.tsx
import React from 'react';

export interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => (
  <div className={`card ${className || ''}`}>
    <h3>{title}</h3>
    <div>{children}</div>
  </div>
);
```

### 3. Exportar em index
```typescript
// packages/shared-ui/src/index.ts
export { Button } from './Button';
export { Card } from './Card'; // ADD THIS

export type { CardProps } from './Card';
```

### 4. Usar em qualquer MFE
```typescript
// apps/mfe-call-center/src/App.tsx
import { Card } from '@call-center-platform/shared-ui';

export const App = () => (
  <Card title="Calls">
    {/* content */}
  </Card>
);
```

## 📝 Criando um Novo Tipo Compartilhado

### 1. Adicionar em shared-types
```typescript
// packages/shared-types/src/index.ts
export interface Agent {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
}
```

### 2. Usar em qualquer lugar
```typescript
import type { Agent } from '@call-center-platform/shared-types';

const agent: Agent = {
  id: '123',
  name: 'João',
  status: 'available',
};
```

## 🔗 Acessar Global State (MFE Shell)

### 1. Em qualquer MFE
```typescript
import { useGlobalStore } from '@call-center-platform/mfe-shell';

export const MyComponent = () => {
  const { isDarkMode, currentUser, toggleDarkMode } = useGlobalStore();
  
  return (
    <div>
      <p>User: {currentUser?.name}</p>
      <button onClick={toggleDarkMode}>
        {isDarkMode ? 'Light' : 'Dark'}
      </button>
    </div>
  );
};
```

## 🧪 Escrevendo Testes

### Teste unitário
```typescript
// packages/shared-utils/src/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './index';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-03-05');
    expect(formatDate(date)).toBe('05/03/2024');
  });
});
```

### Teste de componente
```typescript
// packages/shared-ui/src/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## 🐛 Debugging

### VSCode Debug Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach to Chrome",
      "port": 9222,
      "pathMapping": {
        "/": "${workspaceFolder}/",
        "/src": "${workspaceFolder}/apps/mfe-root/src"
      }
    }
  ]
}
```

### Debugar Vitest
```bash
node --inspect-brk ./node_modules/.bin/vitest run
```

## ✅ Checklist antes de Commit

- [ ] Código formatado: `yarn prettier --write .`
- [ ] Lint passando: `yarn lint`
- [ ] TypeScript ok: `yarn type-check`
- [ ] Testes passando: `yarn test`
- [ ] Build funciona: `yarn build`

## 🚫 Erros Comuns

### Error: Cannot find module '@call-center-platform/...'
**Causa**: Workspace não linkado  
**Solução**: `yarn install` na raiz

### Error: React not found
**Causa**: MFE precisa de React como peer dep  
**Solução**: Adicione `react` e `react-dom` em `devDependencies`

### Module build failed
**Causa**: TypeScript error  
**Solução**: `yarn type-check` para ver erros específicos

### Circular dependency
**Causa**: Dois packages importam um do outro  
**Solução**: Refatore para quebrar ciclo, use shared-types como intermediário

## 📚 Arquivos Importantes

- `/package.json` - Configuração raiz e workspace
- `/tsconfig.json` - TypeScript config base
- `/.eslintrc.json` - ESLint rules
- `/.prettierrc` - Prettier config
- `/vitest.config.ts` - Vitest config
- `/ARCHITECTURE.md` - Documentação de arquitetura

## 🔄 Workflow Recomendado

1. **Criar branch**: `git checkout -b feature/my-feature`
2. **Desenvolver**: Usar `yarn dev` de forma interativa
3. **Testar**: `yarn test:watch`
4. **Validar**: `yarn lint && yarn type-check`
5. **Build**: `yarn build` para garantir
6. **Commit**: Com mensagem descritiva
7. **PR**: Contra `main` ou `develop`

## 📦 Versioning Packages Compartilhados

Usar Semver:
- **MAJOR**: Breaking changes (0.1.0 → 1.0.0)
- **MINOR**: Features (1.0.0 → 1.1.0)
- **PATCH**: Bugfixes (1.1.0 → 1.1.1)

Atualizar `version` em `package.json` de packages compartilhados.

## 🚀 Deploy

### Development
```bash
yarn build
# Servir dist/ com seu servidor
```

### Production
```bash
yarn build
# CI/CD pipeline publica bundles
```
