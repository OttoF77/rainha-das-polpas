#!/usr/bin/env bash
# ============================================================================
# run-docker.sh - Inicia o Frontend Rainha das Polpas em Contêiner Docker
# ============================================================================
# Uso:
#   ./run-docker.sh               # Builda e sobe conectado à rede Sysotto
#   ./run-docker.sh --build       # Mesmo comportamento, de forma explícita
#   ./run-docker.sh --no-build    # Sobe reutilizando a imagem existente
#   ./run-docker.sh --standalone  # Sobe sem exigir a rede externa da Sysotto
#   ./run-docker.sh --down        # Para e remove o contêiner
#   ./run-docker.sh --logs        # Acompanha os logs do contêiner
# ============================================================================

set -Eeuo pipefail

trap 'status=$?; echo ""; echo "❌ Falha ao executar operação Docker (linha ${LINENO}, código ${status})."; echo "   Consulte os detalhes acima e tente novamente."; exit "${status}"' ERR

# Navega para o diretório do script para que possa ser executado de qualquer subpasta
cd "$(dirname "$0")"

ACTION="up"
FORCE_BUILD=true
STANDALONE=false

for arg in "$@"; do
    case "$arg" in
        --build)
            FORCE_BUILD=true
            ;;
        --no-build)
            FORCE_BUILD=false
            ;;
        --standalone)
            STANDALONE=true
            ;;
        --down)
            ACTION="down"
            ;;
        --logs)
            ACTION="logs"
            ;;
        -h|--help)
            sed -n '2,11p' "$0"
            exit 0
            ;;
        *)
            echo "❌ Opção desconhecida: $arg"
            echo "   Uso: ./run-docker.sh [--build|--no-build|--standalone|--down|--logs]"
            exit 2
            ;;
    esac
done

# Verifica se Docker e Docker Compose v2 estão disponíveis
if ! command -v docker > /dev/null 2>&1; then
    echo "❌ Erro: Docker não está instalado ou não está disponível no PATH."
    exit 1
fi

if ! docker compose version > /dev/null 2>&1; then
    echo "❌ Erro: Docker Compose v2 não está disponível."
    exit 1
fi

# No macOS, inicia o Docker Desktop quando ele estiver instalado mas parado
if ! docker info > /dev/null 2>&1; then
    if [[ "$(uname -s)" == "Darwin" ]] && [[ -d "/Applications/Docker.app" ]]; then
        echo "🐳 Docker Desktop não está rodando. Iniciando..."
        open -g -a Docker

        for _ in {1..60}; do
            if docker info > /dev/null 2>&1; then
                break
            fi
            sleep 2
        done
    fi

    if ! docker info > /dev/null 2>&1; then
        echo "❌ Erro: não foi possível conectar ao Docker."
        echo "   Inicie o daemon Docker e execute novamente: ./run-docker.sh"
        exit 1
    fi
fi

# Lê variáveis opcionais do .env para validações e exibição
FRONTEND_PORT_VALUE="${FRONTEND_PORT:-3005}"
BASE_PATH_VALUE="${NEXT_PUBLIC_BASE_PATH:-}"
SYSOTTO_NETWORK_VALUE="${SYSOTTO_DOCKER_NETWORK:-sysotto_sysotto-network}"
SYSOTTO_API_UPSTREAM_VALUE="${SYSOTTO_API_UPSTREAM:-http://sysotto-backend:5036}"
SYSOTTO_API_URL_VALUE="${NEXT_PUBLIC_SYSOTTO_API_URL:-/sysotto-api}"

if [[ -f ".env" ]]; then
    read_env() {
        grep -E "^[[:space:]]*$1=" .env | tail -n 1 | cut -d'=' -f2- | tr -d '"' | tr -d "'" | xargs || true
    }
    env_port="$(read_env FRONTEND_PORT)"
    env_base_path="$(read_env NEXT_PUBLIC_BASE_PATH)"
    env_network="$(read_env SYSOTTO_DOCKER_NETWORK)"
    env_upstream="$(read_env SYSOTTO_API_UPSTREAM)"
    env_api_url="$(read_env NEXT_PUBLIC_SYSOTTO_API_URL)"

    [[ -n "$env_port" ]] && FRONTEND_PORT_VALUE="$env_port"
    if [[ -n "$env_base_path" ]]; then
        BASE_PATH_VALUE="${env_base_path%/}"
        [[ "$BASE_PATH_VALUE" != /* ]] && BASE_PATH_VALUE="/${BASE_PATH_VALUE}"
    fi
    [[ -n "$env_network" ]] && SYSOTTO_NETWORK_VALUE="$env_network"
    [[ -n "$env_upstream" ]] && SYSOTTO_API_UPSTREAM_VALUE="$env_upstream"
    [[ -n "$env_api_url" ]] && SYSOTTO_API_URL_VALUE="$env_api_url"
fi

COMPOSE_FILES=(-f docker-compose.yml)
if [[ "$STANDALONE" == "true" ]]; then
    COMPOSE_FILES+=(-f docker-compose.standalone.yml)
fi

# Valida a configuração do Compose (interpolando .env quando existir)
docker compose "${COMPOSE_FILES[@]}" config -q

if [[ "$ACTION" == "down" ]]; then
    echo "🛑 Parando contêiner do frontend Rainha das Polpas..."
    docker compose "${COMPOSE_FILES[@]}" down
    echo "✅ Contêiner parado com sucesso."
    exit 0
fi

if [[ "$ACTION" == "logs" ]]; then
    exec docker compose "${COMPOSE_FILES[@]}" logs -f
fi

if [[ "$STANDALONE" == "false" ]] && ! docker network inspect "$SYSOTTO_NETWORK_VALUE" > /dev/null 2>&1; then
    echo "❌ Rede Docker compartilhada da Sysotto não encontrada: '${SYSOTTO_NETWORK_VALUE}'."
    echo "   Suba primeiro a stack da Sysotto (ex.: ./docker-up.sh no repositório Sysotto)"
    echo "   ou execute em modo isolado: ./run-docker.sh --standalone"
    exit 1
fi

echo "🚀 Subindo o frontend Rainha das Polpas em contêiner Docker..."
echo ""

if [[ "$FORCE_BUILD" == "true" ]]; then
    docker compose "${COMPOSE_FILES[@]}" up -d --remove-orphans --wait --wait-timeout 240 --build
else
    docker compose "${COMPOSE_FILES[@]}" up -d --remove-orphans --wait --wait-timeout 240
fi

echo ""
echo "✅ Frontend iniciado com sucesso!"
docker compose "${COMPOSE_FILES[@]}" ps
echo ""
echo "🌐 URL de acesso:"
echo "   Frontend Rainha das Polpas: http://localhost:${FRONTEND_PORT_VALUE}${BASE_PATH_VALUE}/"
if [[ "$STANDALONE" == "false" ]]; then
    echo "   Rede Sysotto conectada:     ${SYSOTTO_NETWORK_VALUE}"
    echo "   API Sysotto (client/proxy): ${SYSOTTO_API_URL_VALUE} -> ${SYSOTTO_API_UPSTREAM_VALUE}"
else
    echo "   Modo isolado (--standalone): sem conexão à rede externa da Sysotto"
fi
echo ""
echo "📋 Comandos úteis:"
echo "   Acompanhar logs:  ./run-docker.sh --logs"
echo "   Parar contêiner:  ./run-docker.sh --down"
echo "   Subir sem build:  ./run-docker.sh --no-build"
echo ""
