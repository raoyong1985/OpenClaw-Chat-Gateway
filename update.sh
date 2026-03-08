#!/bin/bash
set -e

# Configuration
# If not in a project dir, default to ~/OpenClaw-Chat-Gateway
INSTALL_DIR="$HOME/OpenClaw-Chat-Gateway"
if [ -f "deploy-release.sh" ]; then
    PROJECT_ROOT="$(pwd)"
elif [ -d "$INSTALL_DIR" ]; then
    PROJECT_ROOT="$INSTALL_DIR"
else
    echo "Error: Could not find OpenClaw Chat Gateway installation."
    echo "Checked: $(pwd) and $INSTALL_DIR"
    exit 1
fi

SERVICE_DIR="$HOME/.config/systemd/user"

echo "================================================"
echo "   OpenClaw Chat Gateway - Updater"
echo "================================================"

# 1. Detect existing port from service files
EXISTING_PORT=""
SERVICES=$(ls $SERVICE_DIR/clawui-*.service 2>/dev/null | sort -V || true)

if [ -n "$SERVICES" ]; then
    # Use the first found service port as default
    FIRST_SERVICE=$(echo "$SERVICES" | head -n 1)
    EXISTING_PORT=$(basename "$FIRST_SERVICE" | sed 's/clawui-\([0-9]*\)\.service/\1/')
    echo "Detected active installation on port: $EXISTING_PORT"
else
    # Check for legacy service file
    if [ -f "$SERVICE_DIR/clawui.service" ]; then
        EXISTING_PORT="3115"
        echo "Detected legacy installation (port 3115)"
    fi
fi

TARGET_PORT=${1:-$EXISTING_PORT}
TARGET_PORT=${TARGET_PORT:-3115}

echo "Updating code from GitHub in $PROJECT_ROOT..."
cd "$PROJECT_ROOT"
git pull

echo "Starting upgrade for port $TARGET_PORT..."
./deploy-release.sh "$TARGET_PORT"

echo "================================================"
echo "Upgrade Completed Successfully!"
echo "Your configuration and data have been preserved."
echo "================================================"
