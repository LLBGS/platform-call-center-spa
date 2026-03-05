# 💻 Padrões de Código

Padrões de codificação e boas práticas para manter o código consistente e legível.

---

## 📐 Convenções Gerais

### 1. Nomenclatura

#### Arquivos e Pastas

```typescript
// ✅ Componentes React (PascalCase)
Button.tsx
UserProfile.tsx
CallCenterDashboard.tsx

// ✅ Funções/utilitários (camelCase)
formatDate.ts
calculateMetrics.ts
useGlobalStore.ts

// ✅ Interfaces/Types (PascalCase)
User.ts
CallEvent.ts
GlobalState.ts

// ✅ Pastas (kebab-case)
shared-ui/
mfe-call-center/
call-center-legacy/
```

#### Variáveis e Funções

```typescript
// ✅ Variáveis (camelCase)
const isLoading = true;
const currentUser = { name: 'João' };
const maxRetries = 3;

// ✅ Constantes (UPPER_SNAKE_CASE)
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = 'https://api.example.com';

// ✅ Booleanos com is/has/can
const isActive = true;
const hasError = false;
const canDelete = true;
```

#### Classes

```typescript
// ✅ PascalCase
class UserManager { }
class CallController { }

// ✅ Métodos privados com prefixo _
private _validateInput() { }
```

### 2. Imports

```typescript
// ✅ Organize por: externos, internos, tipos
import React, { useState, useCallback } from 'react';

import { Button, Card } from '@call-center-platform/shared-ui';
import { formatDate } from '@call-center-platform/shared-utils';

import { useGlobalStore } from '../store';
import { UserList } from './UserList';

import type { User } from '@call-center-platform/shared-types';

// ❌ Evite imports nãoorganizados
import type { User } from '@call-center-platform/shared-types';
import { Button } from '@call-center-platform/shared-ui';
import React from 'react';
import { useGlobalStore } from '../store';
```

### 3. Exports

```typescript
// ✅ Nomeado para componentes
export const Button: React.FC<ButtonProps> = (props) => { };
export type ButtonProps = { };

// ✅ Default para páginas/containers
export default UserPage;

// ❌ Evite default para componentes reutilizáveis
export default Button;  // ❌
export { Button };      // ✅
```

---

## ⚛️ React e TypeScript

### 1. Componentes

```typescript
// ✅ Componente funcional com props tipadas
export interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn-${variant}`}
  >
    {label}
  </button>
);

// ❌ Evite components sem tipos
export const Button = ({ label, onClick }) => { ... };

// ❌ Evite default exports para componentes
export default Button;  // ❌
```

### 2. Hooks

```typescript
// ✅ Use hooks customizados para lógica reutilizável
export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

// ❌ Evite lógica complexa dentro de componentes
const MyComponent = () => {
  const [size, setSize] = useState(...);
  useEffect(() => { ... }); // ❌
};

// ✅ Extraia para hook
const MyComponent = () => {
  const size = useWindowSize();
};
```

### 3. Estado Global (Zustand)

```typescript
// ✅ TypeScript completo no store
export interface GlobalState {
  isDarkMode: boolean;
  currentUser: User | null;
  featureToggles: Record<string, boolean>;
  actions: {
    toggleDarkMode: () => void;
    setCurrentUser: (user: User | null) => void;
  };
}

export const useGlobalStore = create<GlobalState>((set) => ({
  isDarkMode: false,
  currentUser: null,
  featureToggles: {},
  actions: {
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    setCurrentUser: (user) => set({ currentUser: user }),
  },
}));

// ✅ Use no componente
const MyComponent = () => {
  const { isDarkMode, toggleDarkMode } = useGlobalStore();
  
  return (
    <button onClick={() => useGlobalStore.getState().actions.toggleDarkMode()}>
      {isDarkMode ? 'Light' : 'Dark'}
    </button>
  );
};
```

### 4. Callbacks e Memoização

```typescript
// ✅ Use useCallback para callbacks memorizado
const MyComponent = ({ items }: { items: Item[] }) => {
  const handleItemClick = useCallback((item: Item) => {
    console.log('Clicked:', item);
  }, []);

  return <ItemList items={items} onItemClick={handleItemClick} />;
};

// ✅ Use useMemo para derivações custosas
const MyComponent = ({ items }: { items: Item[] }) => {
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  return <ItemList items={sortedItems} />;
};
```

---

## 🎯 Padrões de Arquitetura

### 1. Estrutura de Componente

```typescript
// ✅ Componentes estruturados
// Button.tsx
export interface ButtonProps { ... }
export const Button: React.FC<ButtonProps> = ({ ... }) => { ... };

// Button.stories.tsx (Storybook)
export const Primary = () => <Button ... />;

// Button.test.tsx
describe('Button', () => { ... });
```

### 2. Separação de Responsabilidades

```typescript
// ✅ Container (lógica) vs Presentational (UI)
// UserList.container.tsx
export const UserListContainer = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return <UserListPresentation users={users} />;
};

// UserList.presentation.tsx
interface UserListPresentationProps {
  users: User[];
}
export const UserListPresentation: React.FC<UserListPresentationProps> = ({
  users,
}) => <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
```

### 3. Types em Arquivos Separados

```typescript
// user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// useUser.ts
import type { User } from './user.types';

export const useUser = (id: string) => {
  const [user, setUser] = useState<User | null>(null);
  // ...
};
```

---

## 🧪 Testes

### 1. Padrão Testing Library

```typescript
// ✅ Test naming
describe('Button', () => {
  it('should render button with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button label="Click" onClick={onClick} />);
    user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});

// ❌ Evite testes vagos
it('works', () => {
  // ...
});

it('tests the thing', () => {
  // ...
});
```

### 2. Mocking

```typescript
// ✅ Mock modules
vi.mock('@call-center-platform/shared-utils', () => ({
  formatDate: vi.fn(() => '01/01/2024'),
}));

// ✅ Mock hooks
const useGlobalStore = vi.fn(() => ({
  isDarkMode: false,
  toggleDarkMode: vi.fn(),
}));

// ❌ Evite hardcoded values em testes
```

---

## 📝 Documentação

### 1. JSDoc

```typescript
/**
 * Formata uma data para formato brasileiro
 * @param date - Data a formatar
 * @param locale - Locale opcional (padrão: pt-BR)
 * @returns String formatada
 * @example
 * formatDate(new Date()) // "01/01/2024"
 */
export const formatDate = (date: Date, locale = 'pt-BR'): string => {
  return date.toLocaleDateString(locale);
};

/**
 * Props do componente Button
 */
export interface ButtonProps {
  /** Texto do botão */
  label: string;
  /** Função executada ao clicar */
  onClick: () => void;
  /** Variante visual */
  variant?: 'primary' | 'secondary';
  /** Se botão está desabilitado */
  disabled?: boolean;
}
```

### 2. Comentários Úteis

```typescript
// ✅ Explique o "porquê", não o "quê"
// Usamos debounce aqui porque a API tem rate limit
const debouncedSearch = debounce(searchUsers, 300);

// ❌ Comentários óbvios
// Incrementa i
i++;

// ✅ TODOs com contexto
// TODO: refatorar usando useQuery quando atualizar React Query
// Relacionado: https://github.com/issue/123
```

---

## 🚫 O Que Evitar

### 1. Anti-patterns

```typescript
// ❌ Any type
const user: any = { ... };

// ✅ Tipagem específica
interface User { ... }
const user: User = { ... };

// ❌ Nested ternaries
const result = condition1 ? value1 : condition2 ? value2 : value3;

// ✅ Considere guard clauses
if (condition1) return value1;
if (condition2) return value2;
return value3;

// ❌ Lógica complexa em templates
{items.filter((i) => i.active).map((i) => ({ ...i, price: i.price * 1.1 })).sort()}

// ✅ Extrair para variáveis
const activeItems = items.filter((i) => i.active);
const withTax = activeItems.map((i) => ({ ...i, price: i.price * 1.1 }));
const sorted = withTax.sort();
```

### 2. Performance

```typescript
// ❌ Criar funções em cada render
<Button onClick={() => handleClick(item)} />

// ✅ Usar useCallback
const handleItemClick = useCallback((item: Item) => {
  handleClick(item);
}, []);
<Button onClick={() => handleItemClick(item)} />

// ❌ Inline styles sem memoização
<div style={{ color: isDarkMode ? '#fff' : '#000' }} />

// ✅ Memoizar ou usar CSS
const textColor = useMemo(() => isDarkMode ? '#fff' : '#000', [isDarkMode]);
<div style={{ color: textColor }} />
```

---

## ✅ Checklist de Code Review

- [ ] Nomes de variáveis são claros
- [ ] Funções têm responsabilidade única
- [ ] TypeScript types são específicos (não `any`)
- [ ] Imports estão organizados
- [ ] Código está bem testado
- [ ] Sem code duplicado
- [ ] Comentários explicam "porquê"
- [ ] Sem console.log em produção
- [ ] Performance foi considerada

---

## 📚 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/reference)
- [Testing Library](https://testing-library.com/)

---

**Mantenha o código limpo! 🧹**
