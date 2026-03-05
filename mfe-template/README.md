# MFE {Nome}

Microfrontend {nome} da plataforma Call Center Platform.

## 📋 Descrição

[Adicione descrição clara do propósito deste MFE]

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm 8+

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

O MFE estará disponível em `http://localhost:5177/src/index.tsx`

### Build

```bash
npm run build
```

Gera bundle em `dist/`

### Testing

```bash
npm run test
```

### Linting

```bash
npm run lint
npm run type-check
```

## 📦 Integração com mfe-root

1. **Adicione a div container** em `mfe-root/src/App.tsx`:
   ```jsx
   <div id="mfe-{nome}"></div>
   ```

2. **Configure variáveis de ambiente** em `mfe-root/.env.local`:
   ```env
   VITE_MFE_{NOME}_URL=http://localhost:5177
   VITE_MFE_{NOME}_PATH=/{nome}
   VITE_MFE_{NOME}_DOM_ELEMENT=mfe-{nome}
   VITE_MFE_{NOME}_ENABLED=true
   ```

3. **Teste a integração**:
   - Inicie mfe-root: `npm run dev`
   - Inicie este MFE: `npm run dev`
   - Acesse: `http://localhost:5173/{nome}`

## 📚 Resources Compartilhados

Este MFE utiliza packages compartilhados:

- **@call-center-platform/shared-ui** — Componentes React
- **@call-center-platform/shared-utils** — Utilities
- **@call-center-platform/shared-types** — Type definitions

## 🔄 Dependências

- **react** ^18.2.0
- **react-dom** ^18.2.0
- **single-spa-react** ^5.1.2 — Integração single-spa
- **vite** ^4.4.0
- **typescript** ^5.2.0

## 📖 Documentação

Para mais informações sobre arquitetura de MFEs, veja:

- [docs/MICROFRONTENDS.md](../docs/MICROFRONTENDS.md)
- [docs/MFE-ONBOARDING.md](../docs/MFE-ONBOARDING.md)
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)

## 🤝 Contributing

1. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
2. Commit suas mudanças: `git commit -am 'Add minha feature'`
3. Push para a branch: `git push origin feature/minha-feature`
4. Abra um Pull Request

## 📄 License

Private - Call Center Platform

## 👥 Contato

Para dúvidas, entre em contato com o time de desenvolvimento.
