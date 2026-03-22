# Configuracao Essencial do Projeto

Guia unico com todas as configuracoes necessarias para subir e validar o projeto localmente.

## 1. Pre-requisitos

Use estas versoes minimas:

- `node >= 18`
- `yarn = 4.x`
- `git >= 2.x`

Validacao rapida:

```bash
node --version
yarn --version
git --version
```

## 2. Instalar Dependencias

Na raiz do repositorio (`frontend/`):

```bash
yarn install
```

## 3. Configurar Ambiente do Root

O `mfe-root` le os MFEs por variaveis `VITE_MFE_*`.

Crie o arquivo local:

```bash
cp apps/mfe-root/.env.template apps/mfe-root/.env.local
```

Configuracao padrao esperada no `.env.local`:

- `VITE_MFE_SHELL_URL=http://localhost:5174`
- `VITE_MFE_SHELL_PATH=/`
- `VITE_MFE_SHELL_DOM_ELEMENT=mfe-shell`
- `VITE_MFE_SHELL_ENABLED=true`
- `VITE_MFE_SHELL_ALWAYS_ACTIVE=true`

- `VITE_MFE_CALL_CENTER_URL=http://localhost:5175`
- `VITE_MFE_CALL_CENTER_PATH=/call-center`
- `VITE_MFE_CALL_CENTER_DOM_ELEMENT=mfe-call-center`
- `VITE_MFE_CALL_CENTER_ENABLED=true`

- `VITE_MFE_CALL_CENTER_LEGACY_URL=http://localhost:5176`
- `VITE_MFE_CALL_CENTER_LEGACY_PATH=/legacy`
- `VITE_MFE_CALL_CENTER_LEGACY_DOM_ELEMENT=mfe-call-center-legacy`
- `VITE_MFE_CALL_CENTER_LEGACY_ENABLED=true`

## 3.1 Configurar Unleash no MFE Shell

O `mfe-shell` suporta consumo remoto de feature flags via Unleash Frontend API.

Crie o arquivo local:

```bash
cp apps/mfe-shell/.env.template apps/mfe-shell/.env.local
```

Variaveis esperadas no `.env.local` do shell:

- `VITE_UNLEASH_FRONTEND_API_URL=<URL_FRONTEND_API_UNLEASH>`
- `VITE_UNLEASH_FRONTEND_TOKEN=<TOKEN_FRONTEND_UNLEASH>`
- `VITE_UNLEASH_APP_NAME=mfe-shell`
- `VITE_UNLEASH_TIMEOUT_MS=1000`
- `VITE_UNLEASH_REFRESH_INTERVAL=15`

Notas importantes:

- Use sempre a key do tipo `FRONTEND` no browser.
- Uma key nova pode levar ate 1 minuto para ativar no Unleash.
- Se URL/token nao forem informados, o shell aplica fallback local automatico.

## 4. Subir Aplicacoes em Desenvolvimento

Opcao recomendada (tudo junto):

```bash
yarn dev:all
```

Ou individualmente:

```bash
yarn dev
yarn workspace @call-center-platform/mfe-shell dev
yarn workspace @call-center-platform/mfe-call-center dev
yarn workspace @call-center-platform/mfe-call-center-legacy dev
```

Portas padrao:

- `5173` -> `mfe-root`
- `5174` -> `mfe-shell`
- `5175` -> `mfe-call-center`
- `5176` -> `mfe-call-center-legacy`

## 5. Validar Funcionamento

Com os servidores de pe:

- `http://localhost:5173/` carrega Shell
- `http://localhost:5173/call-center` carrega Shell + Call Center
- `http://localhost:5173/legacy` carrega Shell + Legacy

## 6. Adicionar Novo MFE (Configuracao Minima)

1. Adicione variaveis no `apps/mfe-root/.env.local`:

```env
VITE_MFE_NOVO_MODULO_URL=http://localhost:5177
VITE_MFE_NOVO_MODULO_PATH=/novo-modulo
VITE_MFE_NOVO_MODULO_DOM_ELEMENT=mfe-novo-modulo
VITE_MFE_NOVO_MODULO_ENABLED=true
```

2. Adicione o container no `apps/mfe-root/src/App.tsx`:

```tsx
<div id="mfe-novo-modulo"></div>
```

3. Inicie o novo MFE na porta configurada.

## 7. Regras de Configuracao (Importante)

- O padrao reconhecido e `VITE_MFE_[NOME]_(URL|PATH|DOM_ELEMENT|ENABLED|ALWAYS_ACTIVE)`.
- O nome `NOME` usa maiusculas com `_` (ex: `CALL_CENTER_LEGACY`).
- O root converte esse nome para pacote `@call-center-platform/mfe-...` automaticamente.
- O `mfe-shell` deve ficar sempre ativo (`ALWAYS_ACTIVE=true`).

## 8. Configuracoes Tecnicas Ja Aplicadas no Projeto

- Registro dinamico de MFEs via `apps/mfe-root/src/mfe-registry.config.ts`.
- Registro do Single SPA compativel com `single-spa@4.1.2` em `apps/mfe-root/src/root-config.ts`:
  - uso da assinatura `registerApplication(name, app, activeWhen)`.
- Debug de carregamento controlado por `VITE_DEBUG_MFE_LOADING` no `.env.local`.

## 9. Troubleshooting Rapido

- Porta ocupada: `lsof -i :5173` e finalize o processo.
- MFE nao aparece:
  - confirme `*_ENABLED=true` no `.env.local`.
  - confirme `DOM_ELEMENT` igual ao `id` no `App.tsx`.
  - confirme o servidor do MFE ativo na URL configurada.
- Mudanca de `.env.local` nao refletiu:
  - reinicie o `mfe-root`.

## 10. Referencias

- Setup detalhado: `docs/SETUP.md`
- Visao da arquitetura: `docs/ARCHITECTURE.md`
- Funcionamento de MFEs: `docs/MICROFRONTENDS.md`
- Onboarding de novo MFE: `docs/MFE-ONBOARDING.md`
