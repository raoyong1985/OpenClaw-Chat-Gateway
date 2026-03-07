#!/bin/bash
set -e

# Configuration
PROJECT_ROOT="/home/ange/Dev/Antigravity/clawui"
SERVICE_DIR="$HOME/.config/systemd/user"

# Default Ports
BACKEND_PORT=${1:-3110}
FRONTEND_PORT=${2:-3115}

echo "Deploying OpenClaw Chat Gateway..."
echo "Backend Port:  $BACKEND_PORT"
echo "Frontend Port: $FRONTEND_PORT"

echo "Building projects..."
cd "$PROJECT_ROOT"
npm run build

echo "Setting up systemd services..."
mkdir -p "$SERVICE_DIR"

# Copy and update service files with custom ports
cp "$PROJECT_ROOT/clawui-backend.service" "$SERVICE_DIR/"
cp "$PROJECT_ROOT/clawui-frontend.service" "$SERVICE_DIR/"

# Update backend service port
sed -i "s/Environment=PORT=.*/Environment=PORT=$BACKEND_PORT/" "$SERVICE_DIR/clawui-backend.service"

# Update frontend service ports and preview command
sed -i "s/Environment=FRONTEND_PORT=.*/Environment=FRONTEND_PORT=$FRONTEND_PORT/" "$SERVICE_DIR/clawui-frontend.service"
sed -i "s/Environment=BACKEND_PORT=.*/Environment=BACKEND_PORT=$BACKEND_PORT/" "$SERVICE_DIR/clawui-frontend.service"
sed -i "s/--port [0-9]*/--port $FRONTEND_PORT/" "$SERVICE_DIR/clawui-frontend.service"

echo "Reloading systemd daemon..."
systemctl --user daemon-reload

echo "Enabling and starting services..."
systemctl --user enable clawui-backend.service
systemctl --user enable clawui-frontend.service
systemctl --user restart clawui-backend.service
systemctl --user restart clawui-frontend.service

# Ensure services stay running after logout
echo "Enabling lingering for user $(whoami)..."
sudo loginctl enable-linger $(whoami)

echo "------------------------------------------------"
echo "Deployment complete!"
echo "Release URL: http://localhost:$FRONTEND_PORT"
echo "Backend URL: http://localhost:$BACKEND_PORT"
echo "------------------------------------------------"
echo "Check status with: systemctl --user status clawui-backend clawui-frontend"
