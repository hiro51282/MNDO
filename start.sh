#!/bin/bash

# MNDO MindMap Editor 起動スクリプト
# 使用方法: ./start.sh [オプション]
# オプション:
#   --no-ai      : AIアシスタント機能を無効化
#   --no-mcp     : MCPサーバーを起動しない
#   --clean      : 起動前にクリーンアップを実行
#   --help       : ヘルプを表示

set -e  # エラー時に停止

# アプリケーション固有の環境変数プレフィックス
APP_PREFIX="MNDO_"
TEMP_DIR="/tmp/mndo"

# 色付きログ関数
log_info() {
    echo -e "\033[32m[INFO]\033[0m $1"
}

log_warn() {
    echo -e "\033[33m[WARN]\033[0m $1"
}

log_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

log_success() {
    echo -e "\033[36m[SUCCESS]\033[0m $1"
}

# ヘルプ表示
show_help() {
    echo "MNDO MindMap Editor 起動スクリプト"
    echo ""
    echo "使用方法: $0 [オプション]"
    echo ""
    echo "オプション:"
    echo "  --no-ai       AIアシスタント機能を無効化"
    echo "  --no-mcp      MCPサーバーを起動しない"
    echo "  --clean       起動前にクリーンアップを実行"
    echo "  --help        このヘルプを表示"
    echo ""
    echo "例:"
    echo "  $0              # 全機能で起動"
    echo "  $0 --no-ai      # AI機能なしで起動"
    echo "  $0 --no-mcp     # MCPサーバーなしで起動"
    echo "  $0 --no-ai --no-mcp  # 基本機能のみで起動"
    echo "  $0 --clean      # クリーンアップ後に起動"
}

# クリーンアップ関数
cleanup_environment() {
    log_info "環境のクリーンアップを実行しています..."
    
    # 既存のMNDOプロセスを停止
    local mndo_pids=$(pgrep -f "mndo" 2>/dev/null || true)
    if [[ -n "$mndo_pids" ]]; then
        log_warn "既存のMNDOプロセスを停止中..."
        kill $mndo_pids 2>/dev/null || true
        sleep 2
        # 強制終了
        kill -9 $mndo_pids 2>/dev/null || true
    fi
    
    # ポートの解放確認
    for port in 3001 5173 5174; do
        local port_pid=$(lsof -ti:$port 2>/dev/null || true)
        if [[ -n "$port_pid" ]]; then
            log_warn "ポート $port を使用中のプロセスを停止中..."
            kill $port_pid 2>/dev/null || true
            sleep 1
            kill -9 $port_pid 2>/dev/null || true
        fi
    done
    
    # 一時ディレクトリのクリーンアップ
    if [[ -d "$TEMP_DIR" ]]; then
        log_info "一時ディレクトリをクリーンアップ中..."
        rm -rf "$TEMP_DIR"
    fi
    
    # ロックファイルの削除
    local lock_files=(
        "/tmp/mndo.lock"
        "/tmp/mndo-server.lock"
        "/tmp/mndo-frontend.lock"
    )
    
    for lock_file in "${lock_files[@]}"; do
        if [[ -f "$lock_file" ]]; then
            log_info "ロックファイルを削除中: $lock_file"
            rm -f "$lock_file"
        fi
    done
    
    log_success "クリーンアップが完了しました"
}

# 環境変数の設定
setup_environment() {
    log_info "環境変数を設定しています..."
    
    # アプリケーション固有の環境変数を設定
    export MNDO_APP_NAME="MindMap Editor"
    export MNDO_VERSION="1.0.0"
    export MNDO_START_TIME=$(date +%s)
    export MNDO_TEMP_DIR="$TEMP_DIR"
    export MNDO_LOG_LEVEL="info"
    
    # フロントエンド用環境変数
    export VITE_ENABLE_AI="$ENABLE_AI"
    export VITE_ENABLE_MCP="$ENABLE_MCP"
    export VITE_PORT="5173"
    export VITE_MCP_SERVER_URL="http://localhost:3001"
    
    # MCPサーバー用環境変数
    export MNDO_SERVER_PORT="3001"
    export MNDO_SERVER_LOG_LEVEL="info"
    export MNDO_SERVER_CORS_ORIGIN="http://localhost:5173"
    
    # 一時ディレクトリの作成
    mkdir -p "$TEMP_DIR"
    
    # 環境変数をファイルに保存（後でクリーンアップ用）
    env | grep "^${APP_PREFIX}" > "$TEMP_DIR/env_backup" 2>/dev/null || true
    env | grep "^VITE_" >> "$TEMP_DIR/env_backup" 2>/dev/null || true
    
    log_success "環境変数の設定が完了しました"
}

# 環境変数のクリーンアップ
cleanup_environment_vars() {
    log_info "環境変数をクリーンアップしています..."
    
    # バックアップファイルから環境変数を削除
    if [[ -f "$TEMP_DIR/env_backup" ]]; then
        while IFS= read -r line; do
            if [[ -n "$line" ]]; then
                local var_name=$(echo "$line" | cut -d'=' -f1)
                unset "$var_name" 2>/dev/null || true
            fi
        done < "$TEMP_DIR/env_backup"
    fi
    
    # 一時ディレクトリの削除
    if [[ -d "$TEMP_DIR" ]]; then
        rm -rf "$TEMP_DIR"
    fi
    
    log_success "環境変数のクリーンアップが完了しました"
}

# オプション解析
ENABLE_AI=true
ENABLE_MCP=true
CLEAN_START=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-ai)
            ENABLE_AI=false
            shift
            ;;
        --no-mcp)
            ENABLE_MCP=false
            shift
            ;;
        --clean)
            CLEAN_START=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            log_error "不明なオプション: $1"
            show_help
            exit 1
            ;;
    esac
done

# スクリプト開始
log_info "MNDO MindMap Editor を起動しています..."

# クリーンアップが必要な場合
if [[ "$CLEAN_START" == "true" ]]; then
    cleanup_environment
fi

# プロジェクトディレクトリの確認
if [[ ! -f "package.json" ]]; then
    log_error "package.json が見つかりません。正しいプロジェクトディレクトリで実行してください。"
    exit 1
fi

# Node.js の確認
if ! command -v node &> /dev/null; then
    log_error "Node.js がインストールされていません。"
    exit 1
fi

NODE_VERSION=$(node --version)
log_info "Node.js バージョン: $NODE_VERSION"

# npm の確認
if ! command -v npm &> /dev/null; then
    log_error "npm がインストールされていません。"
    exit 1
fi

# 依存関係のインストール確認
if [[ ! -d "node_modules" ]]; then
    log_warn "node_modules が見つかりません。依存関係をインストールしています..."
    npm install
fi

# フロントエンドの依存関係確認
if [[ ! -d "src" ]]; then
    log_error "src ディレクトリが見つかりません。"
    exit 1
fi

# 環境変数の設定
setup_environment

# フロントエンドの環境変数ファイル設定
log_info "フロントエンドの環境変数ファイルを設定しています..."
cat > .env << EOF
# MNDO MindMap Editor 環境変数

# AI機能の有効/無効 (true/false)
VITE_ENABLE_AI=$ENABLE_AI

# MCPサーバー機能の有効/無効 (true/false)
VITE_ENABLE_MCP=$ENABLE_MCP

# 開発サーバーのポート
VITE_PORT=5173

# MCPサーバーのURL
VITE_MCP_SERVER_URL=http://localhost:3001
EOF

log_info "AI機能: $ENABLE_AI"
log_info "MCP機能: $ENABLE_MCP"

# MCPサーバーの設定
if [[ "$ENABLE_MCP" == "true" ]]; then
    if [[ ! -d "server" ]]; then
        log_error "server ディレクトリが見つかりません。"
        exit 1
    fi
    
    if [[ ! -f "server/package.json" ]]; then
        log_error "server/package.json が見つかりません。"
        exit 1
    fi
    
    # MCPサーバーの依存関係確認
    if [[ ! -d "server/node_modules" ]]; then
        log_warn "MCPサーバーの依存関係をインストールしています..."
        cd server
        npm install
        cd ..
    fi
    
    # MCPサーバーの環境変数設定
    if [[ ! -f "server/.env" ]]; then
        log_warn "MCPサーバーの環境変数ファイルを作成しています..."
        cp server/.env.example server/.env 2>/dev/null || {
            cat > server/.env << EOF
# MCP Server Configuration
PORT=3001

# OpenAI Configuration
# OPENAI_API_KEY=your_openai_api_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
EOF
        }
    fi
fi

# ポートの使用状況確認
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # ポートは使用中
    else
        return 1  # ポートは空いている
    fi
}

# プロセス管理
declare -A PIDS

# クリーンアップ関数
cleanup() {
    log_info "プロセスを終了しています..."
    
    # プロセスの停止
    for name in "${!PIDS[@]}"; do
        if [[ -n "${PIDS[$name]}" ]]; then
            log_info "$name を終了中..."
            kill "${PIDS[$name]}" 2>/dev/null || true
        fi
    done
    
    # 環境変数のクリーンアップ
    cleanup_environment_vars
    
    # ロックファイルの削除
    rm -f /tmp/mndo.lock /tmp/mndo-server.lock /tmp/mndo-frontend.lock 2>/dev/null || true
    
    exit 0
}

# シグナルハンドラー設定
trap cleanup SIGINT SIGTERM

# ロックファイルの作成
echo $$ > /tmp/mndo.lock

# MCPサーバー起動
if [[ "$ENABLE_MCP" == "true" ]]; then
    if check_port 3001; then
        log_warn "ポート 3001 は既に使用中です。MCPサーバーは起動しません。"
    else
        log_info "MCPサーバーを起動しています..."
        echo $$ > /tmp/mndo-server.lock
        cd server
        node src/index.js &
        PIDS["MCP_SERVER"]=$!
        cd ..
        sleep 2
        
        # MCPサーバーの起動確認
        if check_port 3001; then
            log_success "MCPサーバーが起動しました (http://localhost:3001)"
        else
            log_error "MCPサーバーの起動に失敗しました。"
            cleanup
        fi
    fi
else
    log_info "MCPサーバーは無効化されています。"
fi

# フロントエンド起動
if check_port 5173; then
    log_warn "ポート 5173 は既に使用中です。別のポートで起動します。"
fi

log_info "フロントエンドを起動しています..."
echo $$ > /tmp/mndo-frontend.lock
npm run dev &
PIDS["FRONTEND"]=$!

# フロントエンドの起動確認
sleep 3
if check_port 5173; then
    log_success "フロントエンドが起動しました (http://localhost:5173)"
elif check_port 5174; then
    log_success "フロントエンドが起動しました (http://localhost:5174)"
else
    log_error "フロントエンドの起動に失敗しました。"
    cleanup
fi

# 起動完了メッセージ
echo ""
log_success "MNDO MindMap Editor の起動が完了しました！"
echo ""
echo "🌐 フロントエンド: http://localhost:5173 (または 5174)"
if [[ "$ENABLE_MCP" == "true" ]]; then
    echo "🤖 MCPサーバー: http://localhost:3001"
fi
echo ""
if [[ "$ENABLE_AI" == "false" ]]; then
    echo "⚠️  AIアシスタント機能は無効化されています"
fi
if [[ "$ENABLE_MCP" == "false" ]]; then
    echo "⚠️  MCPサーバーは無効化されています"
fi
echo ""
echo "終了するには Ctrl+C を押してください"
echo ""

# プロセス監視
while true; do
    for name in "${!PIDS[@]}"; do
        if ! kill -0 "${PIDS[$name]}" 2>/dev/null; then
            log_error "$name が予期せず終了しました。"
            cleanup
        fi
    done
    sleep 5
done 