#!/bin/bash

set -e

APP_NAME="crypto-market"
APP_DIR="/opt/apps/${APP_NAME}"
DOMAIN="cryptomarket.julianowicka.dev"
EMAIL="admin@julianowicka.dev"
BACKUP_DIR="/opt/backups/${APP_NAME}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
        exit 1
    fi
}

check_dependencies() {
    log "Checking dependencies..."
    
    local missing_deps=()
    
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        missing_deps+=("docker-compose")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing dependencies: ${missing_deps[*]}"
        error "Please install them before running this script"
        exit 1
    fi
    
    success "All dependencies are installed"
}

check_global_proxy() {
    log "Checking global-proxy network..."
    
    if ! docker network ls | grep -q "global-proxy"; then
        error "global-proxy network not found!"
        error "Please ensure the global nginx-proxy is running"
        exit 1
    fi
    
    success "global-proxy network is available"
}

setup_app_directory() {
    log "Setting up application directory..."
    
    if [ ! -d "$APP_DIR" ]; then
        sudo mkdir -p "$APP_DIR"
        sudo chown $USER:$USER "$APP_DIR"
        success "Created application directory: $APP_DIR"
    else
        warning "Application directory already exists: $APP_DIR"
    fi
}

backup_existing() {
    if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
        log "Creating backup of existing deployment..."
        
        local backup_timestamp=$(date +'%Y%m%d_%H%M%S')
        local backup_path="${BACKUP_DIR}/${backup_timestamp}"
        
        sudo mkdir -p "$backup_path"
        sudo cp -r "$APP_DIR"/* "$backup_path/"
        sudo chown -R $USER:$USER "$backup_path"
        
        success "Backup created at: $backup_path"
    fi
}

deploy_files() {
    log "Deploying application files..."
    
    cp -r . "$APP_DIR/"
    
    if [ -f "vps.env" ]; then
        cp vps.env "$APP_DIR/.env"
        success "Environment file copied"
    else
        warning "vps.env file not found, you may need to create .env manually"
    fi
    
    success "Application files deployed"
}

deploy_containers() {
    log "Building and starting containers..."
    
    cd "$APP_DIR"
    
    if docker-compose ps | grep -q "Up"; then
        log "Stopping existing containers..."
        docker-compose down
    fi
    
    log "Building new image..."
    docker-compose build --no-cache
    
    log "Starting containers..."
    docker-compose up -d
    
    success "Containers started successfully"
}

wait_for_health() {
    log "Waiting for application to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep -q "healthy"; then
            success "Application is healthy!"
            return 0
        fi
        
        log "Attempt $attempt/$max_attempts - waiting for health check..."
        sleep 10
        ((attempt++))
    done
    
    error "Application failed to become healthy within expected time"
    return 1
}

test_application() {
    log "Testing application..."
    
    if curl -f -s "http://localhost:3000" > /dev/null; then
        success "Local application test passed"
    else
        error "Local application test failed"
        return 1
    fi
    
    if curl -f -s "https://$DOMAIN" > /dev/null; then
        success "Domain test passed: https://$DOMAIN"
    else
        warning "Domain test failed - check DNS configuration"
    fi
}

show_status() {
    log "Deployment Status:"
    echo "=================="
    
    echo "Application: $APP_NAME"
    echo "Domain: $DOMAIN"
    echo "Directory: $APP_DIR"
    echo ""
    
    echo "Container Status:"
    docker-compose ps
    
    echo ""
    echo "Useful Commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Restart: docker-compose restart"
    echo "  Stop: docker-compose down"
    echo "  Update: ./deploy-vps.sh"
}

cleanup() {
    if [ $? -ne 0 ]; then
        error "Deployment failed! Check the logs above for details."
        error "You can try to restore from backup if needed."
    fi
}

main() {
    log "Starting Crypto Market VPS deployment..."
    echo "========================================"
    
    trap cleanup EXIT
    
    check_root
    check_dependencies
    check_global_proxy
    setup_app_directory
    backup_existing
    deploy_files
    deploy_containers
    
    if wait_for_health; then
        test_application
        show_status
        success "Deployment completed successfully!"
        echo ""
        echo "Your application should be available at: https://$DOMAIN"
    else
        error "Deployment failed during health check"
        exit 1
    fi
}

main "$@"
