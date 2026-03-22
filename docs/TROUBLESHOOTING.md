# 🆘 Troubleshooting & FAQ

Problemas comuns e soluções para o **Call Center Platform**.

---

## 🔥 Problemas Comuns

### 0. Unleash nao aplica flags no Shell

**Sintomas:**
- Flags continuam com valores locais
- Rota protegida nao muda mesmo alterando flag no Unleash

**Checklist rapido:**

```bash
# 1) Confirme variaveis do shell
cat apps/mfe-shell/.env.local | grep VITE_UNLEASH

# 2) Reinicie apenas o shell
yarn workspace @call-center-platform/mfe-shell dev
```

**Causas comuns e acao:**
- URL incorreta: use `.../api/frontend/` (Frontend API URL).
- Token incorreto: use key `FRONTEND` (nao use SERVER/CLIENT no browser).
- Chave recem criada: aguarde ate 1 minuto para ativacao.
- Unleash indisponivel: shell entra em fallback local de forma automatica.

**Diagnostico em DEV:**
- Abra o console do navegador e procure pelo aviso:
  `Unleash indisponivel. Aplicando fallback local de feature toggles.`

### 1. Porta Já em Uso

**Problema:** `Error: EADDRINUSE: address already in use :::5173`

**Solução:**

```bash
# Encontre o processo usando a porta
lsof -i :5173

# Mate o processo
kill -9 <PID>

# Ou use outra porta
yarn dev -- --port 5174
```

**Prevenção:**
- Use `yarn dev:all` com concurrently (gerencia portas automaticamente)

---

### 2. Módulo Não Encontrado

**Problema:** `Cannot find module '@call-center-platform/shared-ui'`

**Causa comum:** Workspace não foi linkado corretamente

**Solução:**

```bash
# Opção 1: Reinstale tudo
yarn clean
rm -rf node_modules
yarn install

# Opção 2: Link manual
yarn link @call-center-platform/shared-ui

# Opção 3: Verifique package.json
# Certifique que tem: workspace:* para dependências locais
cat packages/shared-ui/package.json | grep "version"
```

---

### 3. TypeScript Errors (tipo não encontrado)

**Problema:** `Cannot find type 'User'` ou similar

**Solução:**

```bash
# Rode type-check
yarn type-check

# Ou em um workspace específico
yarn workspace @call-center-platform/mfe-call-center type-check

# Verifique se o tipo está exportado
cat packages/shared-types/src/index.ts | grep "User"
```

**Se não exportado:**

```typescript
// packages/shared-types/src/index.ts
export interface User {  // ✅ Adicione export
  id: string;
  name: string;
}
```

---

### 4. ESLint/Prettier Conflitos

**Problema:** Arquivo está formatado errado ou tem erros de lint

**Solução:**

```bash
# Auto-fix ESLint e Prettier
yarn workspace <seu-workspace> lint -- --fix

# Ou manualmente
yarn prettier --write "packages/shared-ui/src/Button.tsx"

# Força reformat
yarn prettier --write "apps/**/*.{ts,tsx}" "packages/**/*.{ts,tsx}"
```

**Se ainda falhar:**

```bash
# Reinicie o Language Server
# VS Code: F1 > "TypeScript: Restart TS Server"

# Ou in Terminal:
yarn workspace <novo-workspace> cache clean
```

---

### 5. Yarn Workspace Conflicts

**Problema:** `This command is not allowed from a workspace child`

**Solução:**

```bash
# Executar comando no workspace correto
yarn workspace @call-center-platform/shared-ui install  # ❌ Errado

# Correto: use yarn na raiz
yarn install  # ✅ Instala tudo

# Depois instale pacote específico
yarn workspace @call-center-platform/shared-ui add axios  # ✅ Correto
```

---

### 6. Build Falha

**Problema:** `yarn build` falha com erro vago

**Solução passo a passo:**

```bash
# 1. Limpe cache
yarn clean

# 2. Reinstale dependências
yarn install

# 3. Type check (encontra erros TS)
yarn type-check

# 4. Lint (encontra erros de código)
yarn lint

# 5. Testes (valida comportamento)
yarn test

# 6. Agora tente build
yarn build

# 7. Se ainda falhar, build workspace específico
yarn workspace @call-center-platform/shared-ui build
```

---

### 7. Testes Falhando

**Problema:** `yarn test` falha ou testa arquivos errados

**Solução:**

```bash
# Rode testes com verbose output
yarn test -- --reporter=verbose

# Teste arquivo específico
yarn test -- Button.test.tsx

# Watch mode para debug
yarn test:watch

# UI mode (visual)
yarn workspace @call-center-platform/shared-ui test:ui
```

**Testes não encontram módulo:**

```bash
# Verifique vitest.config.ts
cat vitest.config.ts | grep -A5 "resolve"

# Adicione se faltando:
export default defineConfig({
  resolve: {
    alias: {
      '@call-center-platform/shared-ui': 
        resolve(__dirname, './packages/shared-ui/src'),
    },
  },
});
```

---

### 8. Hot Module Replacement (HMR) Não Funciona

**Problema:** Alterações não atualizam no navegador

**Solução:**

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    middlewareMode: true,
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
});
```

**Se ainda não funcionar:**

```bash
# Pare todos os servidores
Ctrl+C

# Limpe cache de build
rm -rf dist
rm -rf .vite

# Inicie novamente
yarn dev
```

---

## ❓ FAQ

### P: Como instalar nova dependência?

**A:**

```bash
# No workspace específico
yarn workspace @call-center-platform/shared-ui add lodash

# Como dev dependency
yarn workspace @call-center-platform/shared-ui add -D @types/node

# Na raiz (workspace)
yarn add -W -D eslint
```

---

### P: Como remover dependência?

**A:**

```bash
yarn workspace @call-center-platform/shared-ui remove lodash
```

---

### P: Por que dois `node_modules` ?

**A:**

Yarn Workspaces cria:
- `/node_modules/` - Raiz (compartilhado)
- `/apps/mfe-*/node_modules/` - Se houver dependências específicas (raro)

Isso é normal. Yarn otimiza automaticamente.

---

### P: Como debugar um componente?

**A:**

```typescript
// 1. Use debugger do navegador
export const MyComponent = () => {
  debugger;  // Pausa aqui no DevTools
  return <div>Hello</div>;
};

// 2. Ou adicione console.log
console.log('MyComponent render', { props });

// 3. Ou use React DevTools (extensão)
// Instale: "React Developer Tools" no Chrome/Firefox
```

---

### P: Como ver o store do Zustand?

**A:**

```typescript
// No console do navegador
store = require('@call-center-platform/mfe-shell').useGlobalStore

// Ver estado atual
store.getState()

// Ouvir mudanças
store.subscribe(console.log)

// Alterar estado
store.getState().setCurrentUser({ name: 'Pedro' })
```

---

### P: Como rodar um MFE isolado?

**A:**

```bash
# Start mfe-call-center isolado
yarn workspace @call-center-platform/mfe-call-center dev

# Abre em http://localhost:5175 (sem root orchestration)
# Útil para debug
```

---

### P: Como atualizar tipos do TypeScript?

**A:**

```bash
# Se alterou shared-types, execute:
yarn type-check

# Ou restart TS em VS Code:
# F1 > "TypeScript: Restart TS Server"
```

---

### P: Git Merge Conflicts em yarn.lock?

**A:**

```bash
# ❌ Não edite yarn.lock manualmente

# Resolva conflitos de package.json, depois:
yarn install  # Regenera yarn.lock
```

---

### P: Como usar componentes de shared-ui em um MFE?

**A:**

```typescript
// 1. Certifique que shared-ui está em dependências
cat apps/mfe-call-center/package.json | grep shared-ui

// 2. Se faltando, adicione:
yarn workspace @call-center-platform/mfe-call-center add \
  @call-center-platform/shared-ui@workspace:*

// 3. Import no MFE
import { Button } from '@call-center-platform/shared-ui';

// 4. Use
export const App = () => <Button onClick={() => {}}>Click me</Button>;
```

---

### P: Como fazer build de um MFE específico?

**A:**

```bash
# Build apenas mfe-call-center
yarn workspace @call-center-platform/mfe-call-center build

# Saída em apps/mfe-call-center/dist/
```

---

## 📊 Diagnóstico Rápido

Execute este script para diagnóstico completo:

```bash
#!/bin/bash

echo "=== Node & Yarn ==="
node --version
yarn --version

echo -e "\n=== Workspaces ==="
yarn workspaces list

echo -e "\n=== Type Check ==="
yarn type-check 2>&1 | head -20

echo -e "\n=== Lint ==="
yarn lint 2>&1 | head -20

echo -e "\n=== Dependencies ==="
yarn why @call-center-platform/shared-ui

echo -e "\n=== Disk Space ==="
du -sh node_modules
du -sh dist

# Se tudo passou, pronto para desenvolver!
echo -e "\n✅ Diagnóstico completo!"
```

---

## 🔗 Recursos Úteis

- [Yarn Documentation](https://yarnpkg.com/docs)
- [Single SPA](https://single-spa.js.org/)
- [React DevTools](https://react-devtools-tutorial.vercel.app/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Quando Pedir Ajuda

Se problema persiste:

1. ✅ Rode diagnóstico completo acima
2. ✅ Procure no [DEVELOPMENT.md](DEVELOPMENT.md)
3. ✅ Procure no [SETUP.md](SETUP.md)
4. ✅ Procure em issues do GitHub
5. 📞 Pergunte no Slack #dev

**Sempre inclua:**
- Output completo do erro
- `yarn --version` e `node --version`
- OS e navegador
- Passos para reproduzir

---

**Problemas resolvidos? 🎉**
