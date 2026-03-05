# 📝 Convenção de Commits

Seguimos a especificação **Conventional Commits** para manter histórico limpo e automatizar changelogs.

---

## 📋 Formato

```
<tipo>(<escopo>): <descrição>

<corpo>

<rodapé>
```

### Partes

| Parte | Obrigatório | Descrição |
|-------|-------------|-----------|
| `<tipo>` | ✅ Sim | Tipo de mudança |
| `<escopo>` | ⚠️ Recomendado | Qual arquivo/componente |
| `<descrição>` | ✅ Sim | Descrição breve (imperativo) |
| `<corpo>` | ❌ Opcional | Detalhes adicionais |
| `<rodapé>` | ❌ Opcional | Referências e breaking changes |

---

## 🎯 Tipos de Commit

| Tipo | Uso | Exemplo |
|------|-----|---------|
| **feat** | Nova feature | `feat(shell): adiciona toggle de tema` |
| **fix** | Correção de bug | `fix(shared-ui): corrige espaçamento de Button` |
| **docs** | Documentação | `docs(README): atualiza instrções de setup` |
| **style** | Formatação/estilos (sem lógica) | `style(shared-ui): ajusta indentação` |
| **refactor** | Refatoração sem mudança de comportamento | `refactor(store): simplifica globalStore` |
| **perf** | Melhoria de performance | `perf(mfe-root): otimiza carregamento de MFEs` |
| **test** | Adiciona/altera testes | `test(shared-utils): cria testes para formatDate` |
| **chore** | Build, CI, dependências | `chore: atualiza dependencies` |
| **ci** | Configuração de CI/CD | `ci: configura GitHub Actions` |

---

## 📦 Escopos Comuns

Escopos sugeridos por package:

### Apps
```
mfe-root
mfe-shell
mfe-call-center
mfe-call-center-legacy
```

### Packages
```
shared-ui
shared-utils
shared-types
```

### Root
```
workspace
config
deps
```

---

## ✅ Exemplos Válidos

### Feature Simples
```
feat(shared-ui): adiciona componente Card
```

### Feature com Detalhes
```
feat(mfe-call-center): implementa filtro de ligações

Adiciona filtro por status e data na tela de ligações.
Inclui validação de datas e resetar filtros.

Closes #123
```

### Bug Fix
```
fix(shared-ui): corrige padding em Button

Botão estava com padding assimétrico em mobile.
Ajustado para usar rem units.

Fixes #456
```

### Documentação
```
docs(ARCHITECTURE): explica padrão de microfrontends
```

### Refatoração
```
refactor(store): extrai lógica de feature toggles

Move feature toggle logic para hook separado.
Facilita reutilização em outros componentes.
```

### Performance
```
perf(mfe-root): aplica lazy loading nos MFEs

MFEs são carregados sob demanda em vez de inicialmente.
Carregamento inicial ~40% mais rápido.
```

### Teste
```
test(shared-utils): adiciona cobertura para formatDate

Testes para diferentes locales e edge cases.
Coverage aumenta de 60% para 95%.
```

### Dependências
```
chore: atualiza React para 18.2.0
```

### Breaking Change
```
feat(shared-types)!: renomeia User para UserAccount

BREAKING CHANGE: User foi renomeado para UserAccount.
Todos os imports devem ser atualizados.
```

---

## 🚫 Exemplos Inválidos

❌ `adiciona novo componente` - Falta tipo
❌ `Feat: add button` - Tipo com maiúscula
❌ `feat: Adds a new button component` - Maiúscula na descrição
❌ `feat(utils,ui): ...` - Múltiplos escopos (use parentesco)
❌ `feature: ...` - Tipo deve ser "feat", não "feature"
❌ `fix bug in thing` - Falta escopo e tipo
❌ `feat: ADICIONA COMPONENTE` - Tudo maiúsculo

---

## 📝 Escrevendo Descrições

### Descrição Breve (Linha 1)

- **Imperativo**: "adiciona" (não "adicionado" ou "adicionar")
- **Sem ponto** final
- **Minúscula** no início
- **Menos de 50 caracteres**
- **Sem detalhes excessivos**

```
✅ feat(ui): adiciona componente de loading
❌ feat(ui): adiciona um novo componente de loading spinner com animações
❌ feat(ui): Adiciona componente.
❌ feat(ui): adicionado componente
```

### Corpo (Linhas 3+)

Explicação sobre o **porquê** da mudança:

```
feat(mfe-call-center): implementa busca de ligações

Adiciona campo de busca na tela de ligações.
Busca por número do cliente, agente ou data.

Usa debounce de 300ms para evitar muitas requisições.
Inclui validação de entrada com regex.
```

### Rodapé

Referências a issues e breaking changes:

```
feat(shell): integra Firebase

Refs #100
Closes #200
Related-To: #300

BREAKING CHANGE: useGlobalStore agora é um hook
Atualize imports: 
  - Antes: import { useGlobalStore } from './store'
  - Depois: import { useGlobalStore } from '@call-center-platform/mfe-shell'
```

---

## 🔗 Tipos de Rodapé

### Issues

```
Closes #123          # Fecha a issue
Closes #123, #456    # Múltiplas issues
Fixes #789           # Similar a Closes

Refs #100            # Apenas referencia
Related-To #200      # Related
See #300             # Outro tipo
```

### Breaking Changes

```
BREAKING CHANGE: descrição da mudança
```

Isso marca como versão major no changelog.

---

## 🧑‍💻 Dicas Práticas

### 1. Use Editor para Corpo Longo

```bash
git commit  # Abre editor, permite quebra de linha
```

### 2. Amend Last Commit

```bash
git commit --amend  # Altere últim commit
git commit --amend --no-edit  # Apenas adiciona mudanças
```

### 3. Interactive Rebase

```bash
git rebase -i HEAD~3  # Edite últimos 3 commits
```

### 4. Commit Hook (Opcional)

Instale husky para validar commits:

```bash
npm install husky -D
npx husky install
npx husky add .husky/commit-msg 'node scripts/validate-commit.js'
```

---

## 🔄 Workflow Prático

```bash
# 1. Crie branch
git checkout -b feat/novo-componente

# 2. Faça mudanças
# ... editar arquivos ...

# 3. Stage mudanças
git add .

# 4. Commit com mensagem clara
git commit -m "feat(shared-ui): adiciona novo componente Button

Componente Button reutilizável com variants.
Suporta sizes, colors, disabled state.

Closes #42"

# 5. Push
git push origin feat/novo-componente

# 6. Abra PR com resumo claro
```

---

## 💡 Regra de Ouro

> **A mensagem de commit deve completar esta frase:**
> 
> "Se aplicado, este commit irá [SUA MENSAGEM]"
> 
> ✅ "Se aplicado, este commit irá **adicionar novo componente Button**"
> ❌ "Se aplicado, este commit irá **adicionado novo componente Button**"

---

## 🔍 Verificar Histórico

```bash
# Ver commits
git log --oneline

# Ver commits de uma branch
git log feature/sua-feature

# Ver commits com scope
git log --grep="feat(shared-ui)"

# Ver commits recentes de um arquivo
git log -p packages/shared-ui/src/Button.tsx
```

---

## 📚 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/) - Especificação oficial
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)
- [commitlint](https://commitlint.js.org/) - Valida commits

---

## ❓ FAQ

**P: Posso usar escopos aninhados?**
A: Não. Use apenas um escopo principal.

**P: E se cometer um erro?**
A: Use `git commit --amend` para corrigir antes de push.

**P: Preciso de maiúscula?**
A: Não. Use minúscula na descrição (exceto nomes próprios).

**P: Breaking change é automaticamente detected?**
A: Sim. Qualquer commit com `!` ou `BREAKING CHANGE:` é detecção automática.

---

**Obrigado por manter o histórico limpo! 🚀**
