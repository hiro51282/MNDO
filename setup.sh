#!/bin/bash

# MNDO MindMap Editor セットアップスクリプト
# 使用方法: ./setup.sh [オプション]
# オプション:
#   --clean      : 既存の環境をクリーンアップしてからセットアップ
#   --dev        : 開発環境のみセットアップ（MCPサーバーなし）
#   --help       : ヘルプを表示

set -e  # エラー時に停止

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
    echo "MNDO MindMap Editor セットアップスクリプト"
    echo ""
    echo "使用方法: $0 [オプション]"
    echo ""
    echo "オプション:"
    echo "  --clean       既存の環境をクリーンアップしてからセットアップ"
    echo "  --dev         開発環境のみセットアップ（MCPサーバーなし）"
    echo "  --help        このヘルプを表示"
    echo ""
    echo "例:"
    echo "  $0              # 通常のセットアップ"
    echo "  $0 --clean      # クリーンアップ後にセットアップ"
    echo "  $0 --dev        # 開発環境のみセットアップ"
}

# オプション解析
CLEAN_SETUP=false
DEV_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --clean)
            CLEAN_SETUP=true
            shift
            ;;
        --dev)
            DEV_ONLY=true
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

# システム要件の確認
check_system_requirements() {
    log_info "システム要件を確認しています..."
    
    # Node.js の確認
    if ! command -v node &> /dev/null; then
        log_error "Node.js がインストールされていません。"
        echo "Node.js 18以上をインストールしてください:"
        echo "  https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    log_info "Node.js バージョン: $NODE_VERSION"
    
    # npm の確認
    if ! command -v npm &> /dev/null; then
        log_error "npm がインストールされていません。"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    log_info "npm バージョン: $NPM_VERSION"
    
    # Git の確認
    if ! command -v git &> /dev/null; then
        log_warn "Git がインストールされていません。バージョン管理機能が制限されます。"
    else
        log_info "Git が利用可能です"
    fi
    
    # ディスク容量の確認
    AVAILABLE_SPACE=$(df . | awk 'NR==2 {print $4}')
    if [[ $AVAILABLE_SPACE -lt 1000000 ]]; then
        log_warn "ディスク容量が不足している可能性があります（1GB以上推奨）"
    else
        log_info "ディスク容量: 十分"
    fi
    
    log_success "システム要件の確認が完了しました"
}

# 既存環境のクリーンアップ
cleanup_existing_environment() {
    log_info "既存の環境をクリーンアップしています..."
    
    # node_modules の削除
    if [[ -d "node_modules" ]]; then
        log_info "既存の node_modules を削除中..."
        rm -rf node_modules
    fi
    
    if [[ -d "server/node_modules" ]]; then
        log_info "既存の server/node_modules を削除中..."
        rm -rf server/node_modules
    fi
    
    # パッケージロックファイルの削除
    local lock_files=("package-lock.json" "server/package-lock.json" "yarn.lock" "server/yarn.lock")
    for lock_file in "${lock_files[@]}"; do
        if [[ -f "$lock_file" ]]; then
            log_info "ロックファイルを削除中: $lock_file"
            rm -f "$lock_file"
        fi
    done
    
    # 一時ファイルの削除
    local temp_dirs=(".vite" "dist" "build" "/tmp/mndo")
    for temp_dir in "${temp_dirs[@]}"; do
        if [[ -d "$temp_dir" ]]; then
            log_info "一時ディレクトリを削除中: $temp_dir"
            rm -rf "$temp_dir"
        fi
    done
    
    # 環境変数ファイルのバックアップ
    if [[ -f ".env" ]]; then
        log_info "既存の .env ファイルをバックアップ中..."
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    if [[ -f "server/.env" ]]; then
        log_info "既存の server/.env ファイルをバックアップ中..."
        cp server/.env server/.env.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    log_success "既存環境のクリーンアップが完了しました"
}

# フロントエンドのセットアップ
setup_frontend() {
    log_info "フロントエンドをセットアップしています..."
    
    # 依存関係のインストール
    log_info "フロントエンドの依存関係をインストール中..."
    npm install
    
    # 環境変数ファイルの作成
    log_info "フロントエンドの環境変数ファイルを作成中..."
    cat > .env << EOF
# MNDO MindMap Editor 環境変数

# AI機能の有効/無効 (true/false)
VITE_ENABLE_AI=true

# MCPサーバー機能の有効/無効 (true/false)
VITE_ENABLE_MCP=true

# 開発サーバーのポート
VITE_PORT=5173

# MCPサーバーのURL
VITE_MCP_SERVER_URL=http://localhost:3001
EOF
    
    log_success "フロントエンドのセットアップが完了しました"
}

# MCPサーバーのセットアップ
setup_mcp_server() {
    if [[ "$DEV_ONLY" == "true" ]]; then
        log_info "開発環境のみのセットアップのため、MCPサーバーはスキップします"
        return
    fi
    
    log_info "MCPサーバーをセットアップしています..."
    
    # server ディレクトリの確認
    if [[ ! -d "server" ]]; then
        log_error "server ディレクトリが見つかりません。"
        exit 1
    fi
    
    # 依存関係のインストール
    log_info "MCPサーバーの依存関係をインストール中..."
    cd server
    npm install
    cd ..
    
    # 環境変数ファイルの作成
    log_info "MCPサーバーの環境変数ファイルを作成中..."
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
    
    log_success "MCPサーバーのセットアップが完了しました"
}

# スクリプトファイルの権限設定
setup_scripts() {
    log_info "スクリプトファイルの権限を設定しています..."
    
    local scripts=("start.sh" "stop.sh" "setup.sh")
    for script in "${scripts[@]}"; do
        if [[ -f "$script" ]]; then
            chmod +x "$script"
            log_info "$script に実行権限を設定しました"
        fi
    done
    
    log_success "スクリプトファイルの権限設定が完了しました"
}

# セットアップの検証
verify_setup() {
    log_info "セットアップを検証しています..."
    
    # フロントエンドの検証
    if [[ ! -d "node_modules" ]]; then
        log_error "フロントエンドの依存関係がインストールされていません"
        exit 1
    fi
    
    if [[ ! -f ".env" ]]; then
        log_error "フロントエンドの環境変数ファイルが作成されていません"
        exit 1
    fi
    
    # MCPサーバーの検証
    if [[ "$DEV_ONLY" != "true" ]]; then
        if [[ ! -d "server/node_modules" ]]; then
            log_error "MCPサーバーの依存関係がインストールされていません"
            exit 1
        fi
        
        if [[ ! -f "server/.env" ]]; then
            log_error "MCPサーバーの環境変数ファイルが作成されていません"
            exit 1
        fi
    fi
    
    # スクリプトの検証
    if [[ ! -x "start.sh" ]] || [[ ! -x "stop.sh" ]]; then
        log_error "必要なスクリプトファイルに実行権限がありません"
        exit 1
    fi
    
    log_success "セットアップの検証が完了しました"
}

# セットアップ完了メッセージ
show_completion_message() {
    echo ""
    log_success "MNDO MindMap Editor のセットアップが完了しました！"
    echo ""
    echo "🚀 次のステップ:"
    echo ""
    if [[ "$DEV_ONLY" == "true" ]]; then
        echo "  開発環境のみのセットアップが完了しました"
        echo "  ./start.sh --no-mcp で起動できます"
    else
        echo "  全機能のセットアップが完了しました"
        echo "  ./start.sh で起動できます"
    fi
    echo ""
    echo "📋 利用可能なコマンド:"
    echo "  ./start.sh              # 全機能で起動"
    echo "  ./start.sh --no-ai      # AI機能なしで起動"
    echo "  ./start.sh --no-mcp     # MCPサーバーなしで起動"
    echo "  ./start.sh --clean      # クリーンアップ後に起動"
    echo "  ./stop.sh               # 完全停止"
    echo ""
    echo "🔧 設定ファイル:"
    echo "  .env                    # フロントエンド設定"
    echo "  server/.env             # MCPサーバー設定"
    echo ""
    echo "📚 ドキュメント:"
    echo "  README.md               # 詳細な使用方法"
    echo ""
}

# メイン処理
main() {
    log_info "MNDO MindMap Editor のセットアップを開始しています..."
    
    # プロジェクトディレクトリの確認
    if [[ ! -f "package.json" ]]; then
        log_error "package.json が見つかりません。正しいプロジェクトディレクトリで実行してください。"
        exit 1
    fi
    
    # システム要件の確認
    check_system_requirements
    
    # 既存環境のクリーンアップ
    if [[ "$CLEAN_SETUP" == "true" ]]; then
        cleanup_existing_environment
    fi
    
    # フロントエンドのセットアップ
    setup_frontend
    
    # MCPサーバーのセットアップ
    setup_mcp_server
    
    # スクリプトファイルの権限設定
    setup_scripts
    
    # セットアップの検証
    verify_setup
    
    # 完了メッセージ
    show_completion_message
}

# スクリプト実行
main "$@" 