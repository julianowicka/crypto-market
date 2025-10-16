#!/bin/bash

# Crypto Market - VPS Management Script

set -e

APP_NAME="crypto-market"
APP_DIR="/opt/apps/${APP_NAME}"
DOMAIN="cryptomarket.julianowicka.dev"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

show_usage() {
    echo "Crypto Market VPS Management Script"
    echo "==================================="
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  status      - Show application status"
    echo "  logs        - Show application logs"
    echo "  restart     - Restart application"
    echo "  stop        - Stop application"
    echo "  start       - Start application"
    echo "  update      - Update application from git"
    echo "  backup      - Create backup"
    echo "  restore     - Restore from backup"
    echo "  health      - Check application health"
    echo "  test        - Test application endpoints"
    echo "  clean       - Clean up old containers and images"
    echo "  monitor     - Monitor application in real-time"
    echo ""
}

check_app_dir() {
    if [ ! -d "$APP_DIR" ]; then
        error "Application directory not found: $APP_DIR"
        error "Please run deploy-vps.sh first"
        exit 1
    fi
}

show_status() {
    log "Application Status:"
    echo "=================="
    
    cd "$APP_DIR"
    
    echo "Application: $APP_NAME"
    echo "Domain: $DOMAIN"
    echo "Directory: $APP_DIR"
    echo ""
    
    echo "Container Status:"
    docker-compose ps
    
    echo ""
    echo "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" $(docker-compose ps -q)
}

show_logs() {
    log "Showing application logs (press Ctrl+C to exit)..."
    cd "$APP_DIR"
    docker-compose logs -f
}

restart_app() {
    log "Restarting application..."
    cd "$APP_DIR"
    docker-compose restart
    success "Application restarted"
}

stop_app() {
    log "Stopping application..."
    cd "$APP_DIR"
    docker-compose down
    success "Application stopped"
}

start_app() {
    log "Starting application..."
    cd "$APP_DIR"
    docker-compose up -d
    success "Application started"
}

update_app() {
    log "Updating application..."
    cd "$APP_DIR"
    
    git pull origin main
    
    docker-compose build --no-cache
    docker-compose up -d
    
    success "Application updated"
}

create_backup() {
    log "Creating backup..."
    
    local backup_timestamp=$(date +'%Y%m%d_%H%M%S')
    local backup_path="/opt/backups/${APP_NAME}/${backup_timestamp}"
    
    sudo mkdir -p "$backup_path"
    sudo cp -r "$APP_DIR"/* "$backup_path/"
    sudo chown -R $USER:$USER "$backup_path"
    
    success "Backup created at: $backup_path"
}

restore_backup() {
    log "Available backups:"
    ls -la "/opt/backups/${APP_NAME}/" 2>/dev/null || {
        error "No backups found"
        exit 1
    }
    
    echo ""
    read -p "Enter backup timestamp to restore: " backup_timestamp
    
    local backup_path="/opt/backups/${APP_NAME}/${backup_timestamp}"
    
    if [ ! -d "$backup_path" ]; then
        error "Backup not found: $backup_path"
        exit 1
    fi
    
    log "Restoring from backup: $backup_path"
    
    cd "$APP_DIR"
    docker-compose down
    
    sudo cp -r "$backup_path"/* "$APP_DIR/"
    sudo chown -R $USER:$USER "$APP_DIR"
    
    docker-compose up -d
    
    success "Application restored from backup"
}

check_health() {
    log "Checking application health..."
    
    cd "$APP_DIR"
    
    if docker-compose ps | grep -q "healthy"; then
        success "Container health check passed"
    else
        error "Container health check failed"
        return 1
    fi
    
    if curl -f -s "http://localhost:3000" > /dev/null; then
        success "HTTP endpoint check passed"
    else
        error "HTTP endpoint check failed"
        return 1
    fi
    
    if curl -f -s "https://$DOMAIN" > /dev/null; then
        success "Domain check passed: https://$DOMAIN"
    else
        warning "Domain check failed - check DNS/SSL configuration"
    fi
}

test_endpoints() {
    log "Testing application endpoints..."
    
    local endpoints=(
        "http://localhost:3000"
        "https://$DOMAIN"
    )
    
    for endpoint in "${endpoints[@]}"; do
        log "Testing: $endpoint"
        if curl -f -s -I "$endpoint" | head -1; then
            success "✓ $endpoint is responding"
        else
            error "✗ $endpoint is not responding"
        fi
    done
}

cleanup() {
    log "Cleaning up old containers and images..."
    
    cd "$APP_DIR"
    
    docker-compose rm -f
    
    docker image prune -f
    
    docker volume prune -f
    
    success "Cleanup completed"
}

monitor() {
    log "Starting real-time monitoring (press Ctrl+C to exit)..."
    
    cd "$APP_DIR"
    
    # Show initial status
    show_status
    
    echo ""
    log "Monitoring containers (updates every 5 seconds)..."
    
    while true; do
        clear
        echo "Crypto Market - Real-time Monitor"
        echo "================================="
        echo "Last updated: $(date)"
        echo ""
        
        docker-compose ps
        
        echo ""
        echo "Resource Usage:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" $(docker-compose ps -q)
        
        echo ""
        echo "Recent Logs (last 10 lines):"
        docker-compose logs --tail=10
        
        sleep 5
    done
}

main() {
    check_app_dir
    
    case "${1:-}" in
        status)
            show_status
            ;;
        logs)
            show_logs
            ;;
        restart)
            restart_app
            ;;
        stop)
            stop_app
            ;;
        start)
            start_app
            ;;
        update)
            update_app
            ;;
        backup)
            create_backup
            ;;
        restore)
            restore_backup
            ;;
        health)
            check_health
            ;;
        test)
            test_endpoints
            ;;
        clean)
            cleanup
            ;;
        monitor)
            monitor
            ;;
        *)
            show_usage
            exit 1
            ;;
    esac
}

main "$@"
