#!/bin/bash

# MNDO MindMap Editor 停止スクリプト

# アプリケーション固有の設定
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

# 環境変数のクリーンアップ
cleanup_environment_vars() {
    log_info "環境変数をクリーンアップしています..."
    
    # MNDO_プレフィックスの環境変数を削除
    local mndo_vars=$(env | grep "^${APP_PREFIX}" | cut -d'=' -f1)
    for var in $mndo_vars; do
        unset "$var" 2>/dev/null || true
    done
    
    # VITE_プレフィックスの環境変数を削除
    local vite_vars=$(env | grep "^VITE_" | cut -d'=' -f1)
    for var in $vite_vars; do
        unset "$var" 2>/dev/null || true
    done
    
    # バックアップファイルから環境変数を削除
    if [[ -f "$TEMP_DIR/env_backup" ]]; then
        while IFS= read -r line; do
            if [[ -n "$line" ]]; then
                local var_name=$(echo "$line" | cut -d'=' -f1)
                unset "$var_name" 2>/dev/null || true
            fi
        done < "$TEMP_DIR/env_backup"
    fi
    
    log_success "環境変数のクリーンアップが完了しました"
}

# プロセスの停止
stop_processes() {
    log_info "MNDO MindMap Editor のプロセスを停止しています..."
    
    # Vite開発サーバーの停止
    VITE_PID=$(lsof -ti:5173,5174 2>/dev/null || true)
    if [[ -n "$VITE_PID" ]]; then
        log_info "Vite開発サーバーを停止中..."
        kill $VITE_PID 2>/dev/null || true
        sleep 1
        if lsof -ti:5173,5174 >/dev/null 2>&1; then
            log_warn "Viteプロセスが残っています。強制終了します..."
            kill -9 $VITE_PID 2>/dev/null || true
        fi
        log_success "Vite開発サーバーを停止しました"
    else
        log_info "Vite開発サーバーは実行されていません"
    fi

    # MCPサーバーの停止
    MCP_PID=$(lsof -ti:3001 2>/dev/null || true)
    if [[ -n "$MCP_PID" ]]; then
        log_info "MCPサーバーを停止中..."
        kill $MCP_PID 2>/dev/null || true
        sleep 1
        if lsof -ti:3001 >/dev/null 2>&1; then
            log_warn "MCPプロセスが残っています。強制終了します..."
            kill -9 $MCP_PID 2>/dev/null || true
        fi
        log_success "MCPサーバーを停止しました"
    else
        log_info "MCPサーバーは実行されていません"
    fi

    # MNDO関連のNode.jsプロセスの停止
    NODE_PIDS=$(pgrep -f "node.*mndo" 2>/dev/null || true)
    if [[ -n "$NODE_PIDS" ]]; then
        log_warn "MNDO関連のNode.jsプロセスが見つかりました:"
        echo "$NODE_PIDS"
        log_info "これらのプロセスを停止中..."
        kill $NODE_PIDS 2>/dev/null || true
        sleep 2
        # 強制終了
        kill -9 $NODE_PIDS 2>/dev/null || true
        log_success "MNDO関連プロセスを停止しました"
    fi
    
    # npmプロセスの停止
    NPM_PIDS=$(pgrep -f "npm.*dev" 2>/dev/null || true)
    if [[ -n "$NPM_PIDS" ]]; then
        log_info "npm開発プロセスを停止中..."
        kill $NPM_PIDS 2>/dev/null || true
        sleep 1
        kill -9 $NPM_PIDS 2>/dev/null || true
        log_success "npmプロセスを停止しました"
    fi
}

# ファイル・ディレクトリのクリーンアップ
cleanup_files() {
    log_info "ファイルとディレクトリをクリーンアップしています..."
    
    # 一時ディレクトリの削除
    if [[ -d "$TEMP_DIR" ]]; then
        log_info "一時ディレクトリを削除中: $TEMP_DIR"
        rm -rf "$TEMP_DIR"
    fi
    
    # ロックファイルの削除
    local lock_files=(
        "/tmp/mndo.lock"
        "/tmp/mndo-server.lock"
        "/tmp/mndo-frontend.lock"
        "/tmp/.vite"
    )
    
    for lock_file in "${lock_files[@]}"; do
        if [[ -f "$lock_file" ]]; then
            log_info "ロックファイルを削除中: $lock_file"
            rm -f "$lock_file"
        fi
    done
    
    # ポートロックファイルの削除
    for port in 3001 5173 5174; do
        local port_lock="/tmp/.$port"
        if [[ -f "$port_lock" ]]; then
            log_info "ポートロックファイルを削除中: $port_lock"
            rm -f "$port_lock"
        fi
    done
    
    # プロジェクト固有の一時ファイル
    local project_temp_files=(
        ".vite"
        "node_modules/.vite"
        "dist"
    )
    
    for temp_file in "${project_temp_files[@]}"; do
        if [[ -e "$temp_file" ]]; then
            log_info "プロジェクト一時ファイルを削除中: $temp_file"
            rm -rf "$temp_file"
        fi
    done
    
    log_success "ファイルとディレクトリのクリーンアップが完了しました"
}

# ポートの確認
check_ports() {
    log_info "ポートの使用状況を確認しています..."
    
    local ports=(3001 5173 5174)
    local ports_in_use=()
    
    for port in "${ports[@]}"; do
        if lsof -ti:$port >/dev/null 2>&1; then
            ports_in_use+=("$port")
        fi
    done
    
    if [[ ${#ports_in_use[@]} -gt 0 ]]; then
        log_warn "以下のポートがまだ使用中です:"
        for port in "${ports_in_use[@]}"; do
            echo "  - ポート $port"
        done
        read -p "これらのポートを使用中のプロセスも停止しますか？ (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            for port in "${ports_in_use[@]}"; do
                local port_pid=$(lsof -ti:$port 2>/dev/null || true)
                if [[ -n "$port_pid" ]]; then
                    log_info "ポート $port のプロセスを停止中..."
                    kill $port_pid 2>/dev/null || true
                    sleep 1
                    kill -9 $port_pid 2>/dev/null || true
                fi
            done
            log_success "ポートの解放が完了しました"
        fi
    else
        log_success "すべてのポートが解放されています"
    fi
}

# メイン処理
main() {
    log_info "MNDO MindMap Editor の完全停止を実行しています..."
    
    # プロセスの停止
    stop_processes
    
    # 環境変数のクリーンアップ
    cleanup_environment_vars
    
    # ファイル・ディレクトリのクリーンアップ
    cleanup_files
    
    # ポートの確認
    check_ports
    
    log_success "MNDO MindMap Editor の完全停止が完了しました"
    echo ""
    echo "✅ すべてのプロセスが停止されました"
    echo "✅ 環境変数がクリーンアップされました"
    echo "✅ 一時ファイルが削除されました"
    echo "✅ ポートが解放されました"
    echo ""
}

# スクリプト実行
main "$@" 