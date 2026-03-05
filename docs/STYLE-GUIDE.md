# 🎨 Guia de Estilos

Padrões de design, componentes reutilizáveis e convenções visuais.

---

## 🎯 Paleta de Cores

### Cores Primárias

```css
--color-primary: #007AFF;      /* Azul - Ações principais */
--color-secondary: #5856D6;    /* Roxo - Ações secundárias */
--color-success: #34C759;      /* Verde - Sucesso */
--color-warning: #FF9500;      /* Laranja - Aviso */
--color-danger: #FF3B30;       /* Vermelho - Erro/Riscos */
--color-info: #00C7BE;         /* Ciano - Informações */
```

### Cores Neutras

```css
--color-white: #FFFFFF;
--color-light: #F7F7F7;
--color-gray-100: #F5F5F5;
--color-gray-200: #EEEEEE;
--color-gray-300: #E0E0E0;
--color-gray-400: #9E9E9E;
--color-gray-500: #757575;
--color-gray-600: #616161;
--color-gray-700: #424242;
--color-dark: #212121;
--color-black: #000000;
```

### Modo Escuro (Dark Mode)

```css
--color-dark-bg: #121212;
--color-dark-surface: #1E1E1E;
--color-dark-text: #E0E0E0;
--color-dark-text-secondary: #B0B0B0;
```

### Exemplo de Uso

```typescript
// Usar variáveis CSS
const Button = styled.button`
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056CC;
  }

  &:disabled {
    background-color: var(--color-gray-300);
    cursor: not-allowed;
  }
`;
```

---

## 📏 Tipografia

### Família de Fontes

```css
/* Sistema font stack */
--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: "Monaco", "Courier New", monospace;
```

### Tamanhos de Fonte

| Uso | Tamanho | Line Height | Weight |
|-----|---------|------------|--------|
| **Display** | 2.5rem | 1.2 | Bold (700) |
| **Heading 1** | 2rem | 1.3 | Bold (700) |
| **Heading 2** | 1.5rem | 1.3 | Bold (700) |
| **Heading 3** | 1.25rem | 1.4 | Semibold (600) |
| **Body** | 1rem | 1.5 | Regular (400) |
| **Small** | 0.875rem | 1.5 | Regular (400) |
| **Tiny** | 0.75rem | 1.5 | Regular (400) |

### Exemplo

```typescript
// styles/typography.ts
export const typography = {
  h1: css`
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.3;
  `,
  h2: css`
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.3;
  `,
  body: css`
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  `,
};
```

---

## 🔲 Espaçamento (Spacing Scale)

```css
--spacing-0: 0;
--spacing-1: 0.25rem;      /* 4px */
--spacing-2: 0.5rem;       /* 8px */
--spacing-3: 0.75rem;      /* 12px */
--spacing-4: 1rem;         /* 16px */
--spacing-6: 1.5rem;       /* 24px */
--spacing-8: 2rem;         /* 32px */
--spacing-12: 3rem;        /* 48px */
--spacing-16: 4rem;        /* 64px */
```

**Use múltiplos de 4px (ou 8px) para consistência.**

### Exemplo

```typescript
export const Container = styled.div`
  padding: var(--spacing-6);      /* 24px */
  margin-bottom: var(--spacing-8); /* 32px */
  gap: var(--spacing-4);          /* 16px */
`;
```

---

## 🔘 Componentes Base

### Button

```typescript
interface ButtonProps {
  /** Variante visual */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Tamanho */
  size?: 'sm' | 'md' | 'lg';
  /** Estado desabilitado */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Conteúdo */
  children: React.ReactNode;
  /** Callback */
  onClick?: () => void;
}

// Sizes
Normal:  12px padding vertical, 24px horizontal, 16px font
Small:   8px padding vertical,  16px horizontal, 14px font
Large:   16px padding vertical, 32px horizontal, 18px font
```

### Input

```typescript
interface InputProps {
  /** Tipo de input */
  type?: 'text' | 'email' | 'password' | 'number';
  /** Label */
  label?: string;
  /** Placeholder */
  placeholder?: string;
  /** Erro */
  error?: string;
  /** Desabilitado */
  disabled?: boolean;
  /** Callback */
  onChange?: (value: string) => void;
}

// Altura padrão: 40px (2.5rem)
// Padding: 8px 12px
// Border: 1px solid var(--color-gray-300)
// Border-radius: 4px
```

### Card

```typescript
interface CardProps {
  /** Título */
  title?: string;
  /** Conteúdo */
  children: React.ReactNode;
  /** Padding customizado */
  padding?: 'sm' | 'md' | 'lg';
}

// Padding padrão: 24px
// Border-radius: 8px
// Background: var(--color-white)
// Box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12)
```

---

## 🎬 Animações e Transições

### Duração Padrão

```css
--transition-fast: 150ms;       /* Hover, focus */
--transition-normal: 300ms;     /* Estado, modal */
--transition-slow: 500ms;       /* Entrada, saída */

--easing-in: cubic-bezier(0.4, 0, 1, 1);
--easing-out: cubic-bezier(0, 0, 0.2, 1);
--easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Exemplo

```typescript
const Button = styled.button`
  transition: background-color var(--transition-fast) var(--easing-in-out);

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const Modal = styled.div`
  animation: slideIn var(--transition-normal) var(--easing-out);

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
```

---

## 📱 Responsividade

### Breakpoints

```css
--breakpoint-sm: 576px;     /* Celular pequeno */
--breakpoint-md: 768px;     /* Tablet */
--breakpoint-lg: 992px;     /* Desktop */
--breakpoint-xl: 1200px;    /* Wide */
--breakpoint-2xl: 1400px;   /* Ultra wide */
```

### Mobile First

```typescript
const Container = styled.div`
  /* Mobile por padrão */
  display: flex;
  flex-direction: column;
  width: 100%;

  /* Tablet+ */
  @media (min-width: var(--breakpoint-md)) {
    flex-direction: row;
    gap: 2rem;
  }

  /* Desktop+ */
  @media (min-width: var(--breakpoint-lg)) {
    gap: 3rem;
  }
`;
```

---

## ♿ Acessibilidade

### Contrastes de Cor

- **WCAG AA**: 4.5:1 para texto normal
- **WCAG AAA**: 7:1 para texto normal
- **Teste**: Use ferramentas como WebAIM Contrast Checker

### Exemplo

```typescript
// ✅ Suficiente contraste
background: var(--color-white);
color: var(--color-dark);         // Contraste 21:1 ✅

// ❌ Contraste insuficiente
background: var(--color-light);
color: var(--color-gray-300);     // Contraste ~2:1 ❌
```

### Focus States

```typescript
export const Button = styled.button`
  /* Sempre forneça focus visível */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Ou */
  &:focus {
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }
`;
```

### Texto Alternativo

```typescript
// ✅ Imagens com alt
<img src="user.jpg" alt="Avatar de João Silva" />

// ✅ Ícones com aria-label
<button aria-label="Deletar item">
  <TrashIcon />
</button>

// ❌ Alt vaga
<img src="img.jpg" alt="imagem" />
```

---

## 🌙 Modo Escuro

### Implementação

```typescript
// styles/themes.ts
export const lightTheme = {
  bg: 'var(--color-white)',
  text: 'var(--color-dark)',
  border: 'var(--color-gray-300)',
};

export const darkTheme = {
  bg: 'var(--color-dark-bg)',
  text: 'var(--color-dark-text)',
  border: 'var(--color-gray-700)',
};

// Usar em componente
export const Container = styled.div<{ isDarkMode: boolean }>`
  background: ${(props) =>
    props.isDarkMode ? darkTheme.bg : lightTheme.bg};
  color: ${(props) =>
    props.isDarkMode ? darkTheme.text : lightTheme.text};
`;
```

### CSS Variables (Recomendado)

```css
:root {
  /* Light mode (padrão) */
  --bg: var(--color-white);
  --text: var(--color-dark);
  --border: var(--color-gray-300);
}

:root[data-theme="dark"] {
  /* Dark mode */
  --bg: var(--color-dark-bg);
  --text: var(--color-dark-text);
  --border: var(--color-gray-700);
}
```

```typescript
// Usar direto
export const Button = styled.button`
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
`;
```

---

## 📋 Checklist de Design

- [ ] Cores usam paleta definida
- [ ] Espaçamento usa scale (múltiplos de 4px)
- [ ] Tipografia segue guia
- [ ] Responsividade testada
- [ ] Contraste está OK (WebAIM)
- [ ] Focus states estão visíveis
- [ ] Animations são suaves (não muito rápidas)
- [ ] Dark mode funciona
- [ ] Componentes são reutilizáveis

---

## 📚 Recursos

- [Material Design](https://material.io/design) - Referência
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Font Scale Calculator](https://www.modularscale.com/)
- [Spacing.io](https://spacing.io/)

---

**Mantenha a consistência visual! 🎨**
