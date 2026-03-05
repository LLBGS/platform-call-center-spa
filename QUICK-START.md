# Quick Start

Guia rapido para rodar o projeto com as configuracoes necessarias.

Para detalhes completos, consulte `docs/CONFIGURACAO-ESSENCIAL.md`.

## 1. Instalar dependencias

```bash
yarn install
```

## 2. Criar ambiente local do root

```bash
cp apps/mfe-root/.env.template apps/mfe-root/.env.local
```

## 3. Subir os microfrontends

Opcao recomendada:

```bash
yarn dev:all
```

## 4. Acessar no navegador

- `http://localhost:5173/`
- `http://localhost:5173/call-center`
- `http://localhost:5173/legacy`

## 5. Validar que tudo carregou

Esperado:

- Shell sempre ativo
- Call Center ativo em `/call-center`
- Legacy ativo em `/legacy`

## Configuracao minima para novo MFE

1. Adicione no `apps/mfe-root/.env.local`:

```env
VITE_MFE_NOVO_MODULO_URL=http://localhost:5177
VITE_MFE_NOVO_MODULO_PATH=/novo-modulo
VITE_MFE_NOVO_MODULO_DOM_ELEMENT=mfe-novo-modulo
VITE_MFE_NOVO_MODULO_ENABLED=true
```

2. Adicione no `apps/mfe-root/src/App.tsx`:

```tsx
<div id="mfe-novo-modulo"></div>
```

3. Rode o novo MFE e abra `http://localhost:5173/novo-modulo`.

## Links uteis

- `docs/CONFIGURACAO-ESSENCIAL.md`
- `docs/SETUP.md`
- `docs/MFE-ONBOARDING.md`
- `docs/TROUBLESHOOTING.md`
