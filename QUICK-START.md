# ⚡ Quick Start - MFEs em Repositórios Independentes

**Arquivo breve de início rápido.** Para documentação completa, consulte [DOCUMENTATION-GUIDE.md](DOCUMENTATION-GUIDE.md)

---

## 🎯 3 Caminhos

### 1️⃣ Entender o Sistema (5 min)

```bash
# Leia nesta ordem:
1. IMPLEMENTATION-SUMMARY.md
2. docs/SYSTEM-DIAGRAM.md
```

**Resultado:** Você entenderá como o sistema dinâmico funciona.

---

### 2️⃣ Criar Novo MFE (30 min)

1. **Leia o guia:**
   ```bash
   cat docs/MFE-ONBOARDING.md
   ```

2. **Clone o template:**
   ```bash
   cp -r mfe-template mfe-seu-nome
   cd mfe-seu-nome
   # Edite package.json, vite.config.ts (porta única)
   npm install
   npm run dev  # Roda em http://localhost:5177
   ```

3. **Configure no root:**
   ```bash
   # Em mfe-root/.env.local:
   VITE_MFE_SEU_NOME_URL=http://localhost:5177
   VITE_MFE_SEU_NOME_PATH=/seu-nome
   VITE_MFE_SEU_NOME_DOM_ELEMENT=mfe-seu-nome
   VITE_MFE_SEU_NOME_ENABLED=true
   
   # Em mfe-root/src/App.tsx:
   <div id="mfe-seu-nome"></div>
   ```

4. **Abra no navegador:**
   ```
   http://localhost:5173/seu-nome
   ```

✅ **Pronto/home/goliraworkspace/pocs/aplicacao/frontend/apps/mfe-root && npx -y typescript --noEmit 2>&1 | head -100* Seu MFE novo integrado sem código.

---

### 3️⃣ Migrar para Repos Independentes (Fase 1)

1. **Leia o plano:**
   ```bash
   cat docs/REPOSITORY-SEPARATION.md
   ```

2. **Crie os repositórios vazios no GitHub:**
   - `mfe-root`
   - `mfe-shell`
   - `mfe-call-center`
   - `mfe-call-center-legacy`
   - `shared-packages`

3. **Execute a Fase 1 do plano**
   - Tempo: 4-6 horas
   - Tarefas: Separar diretórios, configurar workspaces

---

## 📦 Setup Local Rápido

Clonar root + shell + MFEs específicos automaticamente:

```bash
chmod +x setup-workspace.sh

# Clonar com shell + 2 mfes
./setup-workspace.sh \
  --mfes mfe-call-center,mfe-analytics \
  --shared-packages

# Resultado:
# mfe-root/
# ├── .env.local (criado)
# ├── mfe-shell/
# ├── shared-packages/
# └── mfes/
#     ├── mfe-call-center/
#     └── mfe-analytics/
```

---

## 🚀 Desenvolvimento Local

Terminal 1 - Root:
```bash
cd mfe-root
npm run dev
```

Terminal 2 - Shell:
```bash
cd mfe-shell
npm run dev
```

Terminal 3 - MFE:
```bash
cd mfes/mfe-call-center
npm run dev
```

**Abrir simultaneamente:** http://localhost:5173

---

## 📁 Arquivos Importantes

```
├── IMPLEMENTATION-SUMMARY.md ⭐ LER PRIMEIRO
├── DOCUMENTATION-GUIDE.md ⭐ NAVEGAR ISSO
├── QUICK-START.md (este arquivo)
├── setup-workspace.sh ← EXECUTAR PARA SETUP
├── .npmrc.template ← GitHub Packages
├── mfe-template/ ← USE PARA NOVO MFE
└── docs/
    ├── MFE-ONBOARDING.md ← NOVO MFE
    ├── REPOSITORY-SEPARATION.md ← MIGRAÇÃO
    └── SYSTEM-DIAGRAM.md ← ENTENDER
```

---

## 💡 5 Conceitos-Chave

1. **Sistema Dinâmico:** `.env.local` → `mfe-registry.config.ts` → `root-config.ts`
2. **GitHub Packages:** Publica packages compartilhados e versiona
3. **Single-SPA:** Orquestra load/mount/unmount de MFEs por rota
4. **Template:** Estrutura pronta para novo MFE (copiar e preencher)
5. **Setup Script:** Automatiza clone + instalação + configuração

---

## ✅ Quick Checklist

- [ ] Leia `IMPLEMENTATION-SUMMARY.md`
- [ ] Leia `docs/SYSTEM-DIAGRAM.md`
- [ ] Execute `./setup-workspace.sh`
- [ ] Abra `http://localhost:5173`
- [ ] Navegue entre rota `/` e `/legacy`
- [ ] Veja MFEs diferentes carregando

---

## 🎯 Próxima Ação

**Escolha:**

- ❓ Entender o sistema → [DOCUMENTATION-GUIDE.md](DOCUMENTATION-GUIDE.md)
- 🔧 Criar novo MFE → [docs/MFE-ONBOARDING.md](docs/MFE-ONBOARDING.md)
- 🚀 Migrar repos → [docs/REPOSITORY-SEPARATION.md](docs/REPOSITORY-SEPARATION.md)
- ⚙️ Setup local → `./setup-workspace.sh --help`

---

**Tempo gasto: 5 minutos lendo. Pronto/home/goliraworkspace/pocs/aplicacao/frontend/apps/mfe-root && npx -y typescript --noEmit 2>&1 | head -100* ⚡
