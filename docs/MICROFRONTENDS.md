# Guia de Microfrontends

## 🎯 Arquitetura Implementada

O **mfe-root** agora está configurado como orquestrador Single SPA que carrega e gerencia todos os microfrontends dinamicamente.

### Estrutura de Orquestração

```
┌─────────────────────────────────────────────────┐
│           MFE Root (Orquestrador)               │
│         http://localhost:5173                   │
│                                                 │
│  - Registra e gerencia MFEs via Single SPA      │
│  - Roteamento entre aplicações                  │
│  - Container principal da aplicação             │
└────────────┬───────────┬────────────────────────┘
             │           │             
    ┌────────▼───┐  ┌────▼──────┐  ┌─────────────┐
    │ MFE Shell  │  │ Call      │  │ Call Center │
    │ :5174      │  │ Center    │  │ Legacy      │
    │            │  │ :5175     │  │ :5176       │
    │- Global    │  │- UI Nova  │  │- UI Antiga  │
    │  State     │  │           │  │             │
    └────────────┘  └───────────┘  └─────────────┘
```

## 🚀 Como Rodar em Desenvolvimento

### Opção 1: Rodar Tudo Manualmente

Você precisa rodar cada MFE em um terminal separado:

#### Terminal 1 - MFE Root (Orquestrador)
```bash
yarn workspace @call-center-platform/mfe-root dev
# Roda em http://localhost:5173
```

#### Terminal 2 - MFE Shell (Estado Global)
```bash
yarn workspace @call-center-platform/mfe-shell dev
# Roda em http://localhost:5174
```

#### Terminal 3 - MFE Call Center (Nova Interface)
```bash
yarn workspace @call-center-platform/mfe-call-center dev
# Roda em http://localhost:5175
```

#### Terminal 4 - MFE Call Center Legacy (Interface Antiga)
```bash
yarn workspace @call-center-platform/mfe-call-center-legacy dev
# Roda em http://localhost:5176
```

### Opção 2: Rodar com Concurrently (Recomendado)

Instale o concurrently no root:

```bash
yarn add -D -W concurrently
```

Adicione ao `package.json` root:

```json
"scripts": {
  "dev:all": "concurrently \"yarn workspace @call-center-platform/mfe-root dev\" \"yarn workspace @call-center-platform/mfe-shell dev\" \"yarn workspace @call-center-platform/mfe-call-center dev\" \"yarn workspace @call-center-platform/mfe-call-center-legacy dev\"",
}
```

Então rode:

```bash
yarn dev:all
```

## 📍 Rotas e Navegação

| Rota | MFE Ativo | Descrição |
|------|-----------|-----------|
| `/` | mfe-shell + mfe-call-center | Página principal com call center novo |
| `/call-center` | mfe-shell + mfe-call-center | Interface nova de atendimento |
| `/legacy` | mfe-shell + mfe-call-center-legacy | Interface antiga (deprecated) |

**Nota:** O `mfe-shell` está **sempre ativo** em todas as rotas pois gerencia o estado global.

## 🔧 Configurações dos MFEs

### Portas de Desenvolvimento

| MFE | Porta | URL |
|-----|-------|-----|
| mfe-root | 5173 | http://localhost:5173 |
| mfe-shell | 5174 | http://localhost:5174 |
| mfe-call-center | 5175 | http://localhost:5175 |
| mfe-call-center-legacy | 5176 | http://localhost:5176 |

### CORS e Headers

Todos os MFEs estão configurados com:
- `cors: true`
- `Access-Control-Allow-Origin: *`

Isso permite que o root carregue os MFEs dinamicamente.

## 📦 Estrutura de Arquivos Chave

### MFE Root (Orquestrador)

```
apps/mfe-root/
├── index.html          # SystemJS + Import Maps
├── src/
│   ├── main.tsx        # Entry point, importa root-config
│   ├── root-config.ts  # Registra todos os MFEs no Single SPA
│   └── App.tsx         # Container com áreas de montagem
└── vite.config.ts      # Config: porta 5173, CORS
```

### MFE Children (Shell, Call Center, Legacy)

```
apps/mfe-*/
├── src/
│   ├── index.ts        # Exporta lifecycles (bootstrap, mount, unmount)
│   └── App.tsx         # Componente do MFE
└── vite.config.ts      # Config: build como lib, porta específica, CORS
```

## 🎨 Customização

### Adicionar Novo MFE

1. **Criar estrutura do MFE:**
   ```bash
   mkdir apps/mfe-novo
   # Copiar package.json, tsconfig.json de outro MFE
   # Criar src/index.ts e src/App.tsx
   ```

2. **Registrar no root-config.ts:**
   ```typescript
   registerApplication({
     name: '@call-center-platform/mfe-novo',
     app: loadMFE('@call-center-platform/mfe-novo', 'http://localhost:5177'),
     activeWhen: '/novo',
     customProps: {
       domElement: '#mfe-novo',
     },
   });
   ```

3. **Adicionar área de montagem no App.tsx:**
   ```tsx
   <div id="mfe-novo"></div>
   ```

4. **Configurar porta no vite.config.ts do novo MFE:**
   ```typescript
   server: {
     port: 5177, // Nova porta única
     cors: true,
   }
   ```

### Modificar Condições de Ativação

Edite o `activeWhen` em [root-config.ts](../apps/mfe-root/src/root-config.ts):

```typescript
// Único caminho
activeWhen: '/dashboard'

// Múltiplos caminhos
activeWhen: ['/dashboard', '/admin']

// Função customizada
activeWhen: (location) => location.pathname.startsWith('/admin')
```

## 🐛 Troubleshooting

### MFE não carrega

1. **Verifique se todos os servidores estão rodando:**
   ```bash
   # Deve retornar 200 para cada
   curl http://localhost:5173
   curl http://localhost:5174
   curl http://localhost:5175
   curl http://localhost:5176
   ```

2. **Verifique o console do browser:**
   - Deve mostrar: `🚀 Single SPA Root Config initialized`
   - Deve listar os 3 MFEs registrados

3. **Verifique CORS:**
   - Abra DevTools → Network
   - Procure por erros de CORS
   - Certifique-se de que todos os MFEs têm `cors: true` no vite.config

### Erro "System is not defined"

- Verifique se o SystemJS está carregado no [index.html](../apps/mfe-root/index.html)
- Deve ter as 3 tags script do SystemJS antes do seu código

### MFE duplicado na tela

- Verifique se há apenas UMA div com cada ID no App.tsx
- IDs devem ser únicos: `#mfe-shell`, `#mfe-call-center`, `#mfe-call-center-legacy`

## 🔮 Próximos Passos

- [ ] Implementar roteamento interno em cada MFE (React Router)
- [ ] Adicionar autenticação e guards de rota
- [ ] Configurar deploy independente de cada MFE
- [ ] Implementar lazy loading otimizado
- [ ] Adicionar error boundaries globais
- [ ] Configurar Module Federation como alternativa

## 📚 Recursos

- [Single SPA Docs](https://single-spa.js.org/)
- [SystemJS Docs](https://github.com/systemjs/systemjs)
- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
