#!/bin/bash

# ============================================================================
# Setup Workspace - Configuração Automática do Ambiente de Desenvolvimento
# ============================================================================
#
# Este script automatiza o setup inicial para trabalhar com a arquitetura
# de microfrontends descentralizados.
#
# USO:
#   ./setup-workspace.sh [opções]
#
# OPÇÕES:
#   --root-url <url>          URL do repositório mfe-root (default: origin)
#   --shell-url <url>         URL do repositório mfe-shell (default: origin)
#   --mfes <mfe1,mfe2,...>    Lista de MFEs a clonar (comma-separated)
#   --shared-packages         Clonar também o repositório de packages compartilhados
#   --no-install              Apenas clonar, não instalar dependências
#   --help                    Mostrar esta mensagem
#
# EXEMPLO:
#   ./setup-workspace.sh \\
#     --mfes mfe-call-center,mfe-analytics \\
#     --shared-packages
#
# ============================================================================

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis padrão
ROOT_URL=""
SHELL_URL=""
MFES=()
CLONE_SHARED_PACKAGES=false
NO_INSTALL=false
WORKSPACE_DIR="${PWD}"
MFE_PARENT_DIR="${WORKSPACE_DIR}/mfes"
SHARED_PACKAGES_DIR="${WORKSPACE_DIR}/shared-packages"

# ============================================================================
# Funções Helper
# ============================================================================

print_header() {
  echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

show_help() {
  grep "^# " "$0" | grep -v "!/bin/bash" | sed 's/^# //' | head -30
}

# ============================================================================
# Parsing Arguments
# ============================================================================

while [[ $# -gt 0 ]]; do
  case $1 in
    --root-url)
      ROOT_URL="$2"
      shift 2
      ;;
    --shell-url)
      SHELL_URL="$2"
      shift 2
      ;;
    --mfes)
      IFS=',' read -ra MFES <<< "$2"
      shift 2
      ;;
    --shared-packages)
      CLONE_SHARED_PACKAGES=true
      shift
      ;;
    --no-install)
      NO_INSTALL=true
      shift
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      print_error "Argumento desconhecido: $1"
      show_help
      exit 1
      ;;
  esac
done

# ============================================================================
# Validações Iniciais
# ============================================================================

print_header "Setup MFE Workspace"

if ! command -v git &> /dev/null; then
  print_error "Git não está instalado. Por favor, instale Git primeiro."
  exit 1
fi

if ! command -v npm &> /dev/null; then
  print_error "npm não está instalado. Por favor, instale Node.js e npm primeiro."
  exit 1
fi

print_success "Git e npm disponíveis"
print_info "Diretório de trabalho: ${WORKSPACE_DIR}"

# ============================================================================
# Função para clonar repositório
# ============================================================================

clone_repo() {
  local repo_name=$1
  local repo_url=$2
  local target_dir=$3

  if [ -d "$target_dir" ]; then
    print_warning "${repo_name} já existe em ${target_dir}. Pulando..."
    return 0
  fi

  print_info "Clonando ${repo_name}..."
  if git clone "$repo_url" "$target_dir"; then
    print_success "${repo_name} clonado com sucesso"
    return 0
  else
    print_error "Falha ao clonar ${repo_name}"
    return 1
  fi
}

# ============================================================================
# Função para instalar dependências
# ============================================================================

install_deps() {
  local repo_name=$1
  local repo_dir=$2

  if [ "$NO_INSTALL" = true ]; then
    print_info "Pulando instalação de dependências para ${repo_name}"
    return 0
  fi

  if [ ! -f "$repo_dir/package.json" ]; then
    print_warning "package.json não encontrado em ${repo_dir}"
    return 1
  fi

  print_info "Instalando dependências de ${repo_name}..."
  (
    cd "$repo_dir"
    npm install
  )

  if [ $? -eq 0 ]; then
    print_success "Dependências instaladas para ${repo_name}"
    return 0
  else
    print_error "Falha na instalação de dependências para ${repo_name}"
    return 1
  fi
}

# ============================================================================
# Função para copiar .env.template
# ============================================================================

setup_env_file() {
  local repo_name=$1
  local repo_dir=$2

  if [ ! -f "$repo_dir/.env.template" ]; then
    print_warning ".env.template não encontrado em ${repo_dir}"
    return 1
  fi

  if [ -f "$repo_dir/.env.local" ] || [ -f "$repo_dir/.env" ]; then
    print_info ".env já existe em ${repo_dir}. Pulando..."
    return 0
  fi

  cp "$repo_dir/.env.template" "$repo_dir/.env.local"
  print_success ".env.local criado para ${repo_name}"
}

# ============================================================================
# Execução Principal
# ============================================================================

# 1. Clonar/Configurar mfe-root (obrigatório)
print_header "Passo 1: Configurando mfe-root"

if [ -z "$ROOT_URL" ]; then
  if [ -d ".git" ]; then
    ROOT_URL=$(git config --get remote.origin.url | sed 's|\.git$||')
    ROOT_URL="${ROOT_URL}/mfe-root.git"
    print_info "Usando URL derivada do remote origin: ${ROOT_URL}"
  else
    print_error "Erro: Especifique --root-url ou execute dentro do repositório root"
    exit 1
  fi
fi

# Se root-url contém último elemento, já está no root - não clonar
if [ -f "package.json" ] && grep -q "mfe-root" package.json 2>/dev/null || [ -f "src/root-config.ts" ]; then
  print_info "Já está no diretório mfe-root"
  ROOT_DIR="${WORKSPACE_DIR}"
  setup_env_file "mfe-root" "$ROOT_DIR"
else
  ROOT_DIR="${WORKSPACE_DIR}/mfe-root"
  clone_repo "mfe-root" "$ROOT_URL" "$ROOT_DIR"
  setup_env_file "mfe-root" "$ROOT_DIR"
  install_deps "mfe-root" "$ROOT_DIR"
fi

# 2. Clonar mfe-shell (obrigatório)
print_header "Passo 2: Configurando mfe-shell"

if [ -z "$SHELL_URL" ]; then
  BASE_URL=$(echo "$ROOT_URL" | sed 's|/mfe-root\.git||')
  SHELL_URL="${BASE_URL}/mfe-shell.git"
  print_info "Usando URL derivada: ${SHELL_URL}"
fi

SHELL_DIR="${WORKSPACE_DIR}/mfe-shell"
clone_repo "mfe-shell" "$SHELL_URL" "$SHELL_DIR"
setup_env_file "mfe-shell" "$SHELL_DIR"
install_deps "mfe-shell" "$SHELL_DIR"

# 3. Clonar MFEs adicionais (opcional)
if [ ${#MFES[@]} -gt 0 ]; then
  print_header "Passo 3: Configurando MFEs Adicionais"

  mkdir -p "$MFE_PARENT_DIR"

  for mfe in "${MFES[@]}"; do
    mfe=$(echo "$mfe" | xargs)  # Trim whitespace
    BASE_URL=$(echo "$ROOT_URL" | sed 's|/mfe-root\.git||')
    MFE_URL="${BASE_URL}/${mfe}.git"
    MFE_DIR="${MFE_PARENT_DIR}/${mfe}"

    clone_repo "$mfe" "$MFE_URL" "$MFE_DIR"
    setup_env_file "$mfe" "$MFE_DIR"
    install_deps "$mfe" "$MFE_DIR"
  done
else
  print_info "Nenhum MFE adicional especificado (use --mfes <lista>)"
fi

# 4. Clonar shared-packages (opcional)
if [ "$CLONE_SHARED_PACKAGES" = true ]; then
  print_header "Passo 4: Configurando Shared Packages"

  BASE_URL=$(echo "$ROOT_URL" | sed 's|/mfe-root\.git||')
  SHARED_PACKAGES_URL="${BASE_URL}/shared-packages.git"

  clone_repo "shared-packages" "$SHARED_PACKAGES_URL" "$SHARED_PACKAGES_DIR"
  setup_env_file "shared-packages" "$SHARED_PACKAGES_DIR"
  install_deps "shared-packages" "$SHARED_PACKAGES_DIR"

  print_info "Para usar packages locais, pode atualizar package.json com:"
  echo "  \"@call-center-platform/shared-ui\": \"file:../shared-packages/packages/shared-ui\","
else
  print_info "Shared packages não foi clonado (use --shared-packages)"
fi

# ============================================================================
# Resumo e Próximos Passos
# ============================================================================

print_header "Setup Concluído!"

print_success "Ambiente configurado com sucesso"

echo ""
echo "📂 Estrutura de Diretórios:"
echo "   $(basename "${WORKSPACE_DIR}")/"
echo "   ├── mfe-root/"
echo "   ├── mfe-shell/"
if [ ${#MFES[@]} -gt 0 ]; then
  echo "   ├── mfes/"
  for mfe in "${MFES[@]}"; do
    echo "   │   └── $(echo "$mfe" | xargs)/"
  done
fi
if [ "$CLONE_SHARED_PACKAGES" = true ]; then
  echo "   └── shared-packages/"
fi

echo ""
echo "🚀 Próximos Passos:"
echo ""
echo "1️⃣  Configurar variáveis de ambiente:"
echo "   cd mfe-root"
echo "   cp .env.template .env.local"
echo "   # Editar .env.local conforme necessário"
echo ""
echo "2️⃣  Iniciar desenvolvimento em terminais separados:"
echo "   Terminal 1: cd mfe-root && npm run dev"
echo "   Terminal 2: cd mfe-shell && npm run dev"

if [ ${#MFES[@]} -gt 0 ]; then
  for i in "${!MFES[@]}"; do
    mfe=$(echo "${MFES[$i]}" | xargs)
    echo "   Terminal $((i + 3)): cd mfes/${mfe} && npm run dev"
  done
fi

echo ""
echo "3️⃣  Acessar a aplicação:"
echo "   http://localhost:5173"
echo ""
echo "💡 Dica: Use um terminal multiplexor como 'tmux' ou 'screen' para gerenciar múltiplos terminais"
echo ""

print_info "Para mais informações, consulte a documentação em docs/SETUP.md"
