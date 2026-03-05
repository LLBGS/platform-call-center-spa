# 👥 Guia de Contribuição

Obrigado por querer contribuir com o **Call Center Platform**! Este documento descreve como participar do projeto de forma organizada.

---

## 📜 Código de Conduta

Este projeto segue um código de conduta para garantir um ambiente respeitoso:

- ✅ Seja respeitoso com todos
- ✅ Aceite críticas construtivas
- ✅ Foque em beneficiar a comunidade
- ❌ Comportamento abusivo não será tolerado

---

## 🚀 Como Começar

### 1. Fork e Clone

```bash
# Fork no GitHub
# Depois clone seu fork
git clone https://github.com/seu-usuario/call-center-platform.git
cd frontend

# Adicione o repo original como upstream
git remote add upstream https://github.com/original/call-center-platform.git
```

### 2. Criar Branch

Sempre crie uma branch para sua feature:

```bash
# Atualize main do upstream
git fetch upstream
git rebase upstream/main

# Crie uma branch
git checkout -b feature/sua-feature
# ou para bugfix
git checkout -b fix/seu-bugfix
```

**Convenção de nomes:**
- `feature/nomeDaFuncionalidade` - Nova funcionalidade
- `fix/nomeDoCorrecao` - Correção de bug
- `docs/nomeDocumentacao` - Apenas documentação
- `refactor/nomeDoRefactor` - Refatoração de código
- `test/nomeDosTestas` - Apenas testes

### 3. Fazer Mudanças

Edite os arquivos conforme necessário. Siga:

1. [CODING-STANDARDS.md](CODING-STANDARDS.md) - Padrões de código
2. [STYLE-GUIDE.md](STYLE-GUIDE.md) - Guia de estilos
3. [COMMIT-CONVENTION.md](COMMIT-CONVENTION.md) - Padrão de commits

### 4. Testes

Sempre adicione/atualize testes:

```bash
# Rodar testes da sua mudança
yarn workspace @call-center-platform/shared-ui test

# Watch mode durante desenvolvimento
yarn test:watch

# Coverage (opcional)
yarn test -- --coverage
```

### 5. Lint e Format

```bash
# Lint seu projeto
yarn workspace <seu-workspace> lint

# Auto-fix issues
yarn workspace <seu-workspace> lint -- --fix

# Format com Prettier
yarn prettier --write "seu-arquivo.tsx"
```

### 6. Commits

Siga o padrão de commits:

```bash
# Exemplos válidos:
git commit -m "feat: adiciona novo componente Button"
git commit -m "fix: corrige bug em globalStore"
git commit -m "docs: atualiza README"
git commit -m "refactor: melhora performance do FormField"
git commit -m "test: adiciona testes para Button.tsx"
```

Veja [COMMIT-CONVENTION.md](COMMIT-CONVENTION.md) para mais detalhes.

### 7. Push e Pull Request

```bash
# Sincronize com upstream
git fetch upstream
git rebase upstream/main

# Push para seu fork
git push origin feature/sua-feature

# Abra PR no GitHub com descrição clara
```

---

## 📋 PR Checklist

Antes de submeter um Pull Request:

- [ ] Código segue [CODING-STANDARDS.md](CODING-STANDARDS.md)
- [ ] Testes adicionados/atualizados
- [ ] Testes passam: `yarn test`
- [ ] Lint passa: `yarn lint`
- [ ] TypeScript check passa: `yarn type-check`
- [ ] Documentação atualizada
- [ ] Commits seguem convenção
- [ ] Build passa: `yarn build`

---

## 🎯 Tipos de Contribuição

### 🐛 Reportar Bugs

1. Verifique se o bug já foi reportado
2. Crie uma issue com:
   - **Título claro** do bug
   - **Passos para reproduzir**
   - **Comportamento esperado** vs **observado**
   - **Ambiente** (OS, Node version, etc)
   - **Screenshots** (se aplicável)

```markdown
## Bug: Input não responde a clicks

### Passos para reproduzir
1. Abra /call-center
2. Clique no input
3. Digite algo

### Esperado
Input deveria receber o texto

### Observado
Input não responde a nada

### Ambiente
- OS: macOS 13
- Node: 18.17.0
- Yarn: 4.0.0
```

### ✨ Sugerir Novas Features

1. Abra uma issue com título `[FEATURE]`
2. Descreva:
   - **O problema** que quer resolver
   - **Solução proposta**
   - **Alternativas** consideradas
   - **Contexto adicional**

```markdown
## [FEATURE] Adicionar tema claro

### Problema
Usuários preferem tema claro durante o dia

### Solução
Adicionar toggle de tema em globalStore

### Alternativas
- Sistema detectar preferência do SO
- Usar localStorage (será implementado depois)
```

### 📝 Melhorar Documentação

Correções de documentação são sempre bem-vindas!

```bash
git checkout -b docs/melhoria-descricao
# Edite os arquivos .md em /docs
git commit -m "docs: melhora explicação de arquitetura"
git push origin docs/melhoria-descricao
```

### ♻️ Refatoração

Refatorações devem:

1. **Não alterar comportamento** (refactor puro)
2. **Melhorar** legibilidade, performance ou manutenibilidade
3. **Ter testes passando** antes e depois
4. **Explicar o quê** foi melhorado no PR

```bash
git commit -m "refactor: simplifica useGlobalStore com hooks" 
```

---

## 🔍 Review Process

### Como seu PR será analisado

1. **CI Checks** - Build, test, lint devem passar
2. **Code Review** - Time analisa código
3. **Requested Changes** - Se houver, faça updates
4. **Approval** - Pelo menos 1 aprovação
5. **Merge** - Seu código entra no projeto!

### Como revisar PRs

Se for revisor:

- ✅ Leia o código com mente aberta
- ✅ Verifique se segue padrões
- ✅ Execute localmente se possível
- ✅ Faça comentários construtivos
- ✅ Aprove ou solicite mudanças

```markdown
# Comentário construtivo
Sugestão: usar `useCallback` aqui para evitar re-renders

// Antes
const handleClick = () => { ... }

// Depois
const handleClick = useCallback(() => { ... }, [])
```

---

## 📦 Contribuindo com um Novo Package

Se quer adicionar um novo shared package:

### 1. Copie estrutura existente

```bash
cp -r packages/shared-ui packages/seu-novo-package
cd packages/seu-novo-package
```

### 2. Atualize package.json

```json
{
  "name": "@call-center-platform/seu-novo-package",
  "version": "1.0.0",
  "description": "Descrição do seu package"
}
```

### 3. Implemente

```typescript
// packages/seu-novo-package/src/index.ts
export { Component } from './Component';
export type { ComponentProps } from './Component';
```

### 4. Exporte do root

Nenhum passo adicional! Yarn Workspaces já detecta automaticamente.

### 5. Use em outro workspace

```json
{
  "dependencies": {
    "@call-center-platform/seu-novo-package": "workspace:*"
  }
}
```

---

## 🎓 Escalas de Contribuição

### 🥉 Iniciante
- Corrigir typos na documentação
- Melhorar comentários no código
- Adicionar testes para código existente

### 🥈 Intermediário
- Criar novo componente em shared-ui
- Melhorar existente feature
- Refatorar código legado
- Documentação técnica

### 🥇 Avançado
- Arquitetura de novo MFE
- Melhorias em Single SPA
- Performance optimization
- Mentoria de novo contribuidor

---

## 💬 Comunicação

### Onde tirar dúvidas?

1. **Documentação** - Veja [INDEX.md](INDEX.md)
2. **Issues** - Procure por labels `question` ou `good-first-issue`
3. **Discussões** - Use GitHub Discussions
4. **Slack** - Ask no canal #dev

### Canais

- **#dev** - Questões técnicas
- **#frontend** - Discussão de features
- **#pull-requests** - Notificações de PRs
- **#releases** - Novas versões

---

## 🚫 O Que Não Fazer

❌ Não faça commits sem testes
❌ Não faça grandes refatorações sem discussão prévia
❌ Não misture múltiplas features em 1 PR
❌ Não ignore feedback do review
❌ Não forçe push para branches compartilhadas

---

## 🎉 Reconhecimento

Contribuidores são reconhecidos em:

1. **README.md** - Seção de contribuidores
2. **CHANGELOG** -Primeira release após contribuição
3. **Team page** - Se contribuição significativa

---

## 📚 Recursos Úteis

- [CODING-STANDARDS.md](CODING-STANDARDS.md) - Padrões
- [ARCHITECTURE.md](ARCHITECTURE.md) - Design
- [EXAMPLES.md](EXAMPLES.md) - Padrões comuns
- [Git Workflow](#) - Tips de git
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🙏 Obrigado!

Suas contribuições fazem este projeto melhor. Qualquer dúvida, abra uma issue ou pergunta!

**Happy coding! 🚀**
