#!/bin/bash
set -e

# Configuration
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVICE_DIR="$HOME/.config/systemd/user"

echo "================================================"
echo "   OpenClaw Chat Gateway - Updater"
echo "================================================"

# 1. Detect existing port from service files
EXISTING_PORT=""
SERVICES=$(ls $SERVICE_DIR/clawui-*.service 2>/dev/null || true)

if [ -n "$SERVICES" ]; then
    # Try to extract port from the first found service
    FIRST_SERVICE=$(echo "$SERVICES" | head -n 1)
    EXISTING_PORT=$(basename "$FIRST_SERVICE" | sed 's/clawui-\([0-9]*\)\.service/\1/')
    echo "Detected existing installation on port: $EXISTING_PORT"
else
    # Check for legacy service file
    if [ -f "$SERVICE_DIR/clawui.service" ]; then
        EXISTING_PORT="3115"
        echo "Detected legacy installation (default port 3115)"
    fi
fi

TARGET_PORT=${1:-$EXISTING_PORT}
TARGET_PORT=${TARGET_PORT:-3115}

echo "Updating code from GitHub..."
cd "$PROJECT_ROOT"
git pull

echo "Starting upgrade for port $TARGET_PORT..."
./deploy-release.sh "$TARGET_PORT"

echo "================================================"
echo "Upgrade Completed Successfully!"
echo "Your configuration and data have been preserved."
echo "================================================"
