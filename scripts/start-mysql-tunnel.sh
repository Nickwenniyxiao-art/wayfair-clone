#!/bin/bash

# SSH Tunnel Configuration for Digital Ocean MySQL
# This script establishes an SSH tunnel to access MySQL database securely

set -e

SSH_KEY="${SSH_KEY:-/home/ubuntu/.ssh/wayfair_mysql_tunnel}"
REMOTE_HOST="${REMOTE_HOST:-165.232.54.128}"
REMOTE_USER="${REMOTE_USER:-root}"
LOCAL_PORT="${LOCAL_PORT:-3306}"
REMOTE_PORT="${REMOTE_PORT:-3306}"

echo "Starting SSH tunnel for MySQL database..."
echo "Remote: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PORT}"
echo "Local: 127.0.0.1:${LOCAL_PORT}"

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo "ERROR: SSH key not found at $SSH_KEY"
    exit 1
fi

# Check if port is already in use
if lsof -Pi :${LOCAL_PORT} -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "WARNING: Port ${LOCAL_PORT} is already in use"
    echo "Existing process:"
    lsof -Pi :${LOCAL_PORT} -sTCP:LISTEN
    echo ""
    echo "Kill existing process? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        lsof -ti :${LOCAL_PORT} | xargs kill -9
        echo "Killed existing process"
        sleep 2
    else
        echo "Exiting..."
        exit 1
    fi
fi

# Start SSH tunnel with autossh for automatic reconnection
echo "Starting autossh tunnel..."
autossh -M 0 \
  -o "ServerAliveInterval=30" \
  -o "ServerAliveCountMax=3" \
  -o "StrictHostKeyChecking=no" \
  -o "UserKnownHostsFile=/dev/null" \
  -o "ExitOnForwardFailure=yes" \
  -f \
  -N \
  -L ${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT} \
  -i ${SSH_KEY} \
  ${REMOTE_USER}@${REMOTE_HOST}

# Wait for tunnel to establish
sleep 3

# Verify tunnel is running
if lsof -Pi :${LOCAL_PORT} -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✓ SSH tunnel established successfully"
    echo "MySQL is now accessible at 127.0.0.1:${LOCAL_PORT}"
    
    # Test MySQL connection
    if command -v mysql >/dev/null 2>&1; then
        echo ""
        echo "Testing MySQL connection..."
        if mysql -h 127.0.0.1 -P ${LOCAL_PORT} -u wayfair -p'Wayfair2024Secure!' -e "SELECT 'Connection successful!' as status, VERSION() as version;" wayfair_clone 2>/dev/null; then
            echo "✓ MySQL connection test passed"
        else
            echo "⚠ MySQL connection test failed (tunnel is running but MySQL connection failed)"
        fi
    fi
else
    echo "✗ Failed to establish SSH tunnel"
    exit 1
fi

echo ""
echo "Tunnel is running in background. To stop it, run:"
echo "  pkill -f 'autossh.*${REMOTE_HOST}'"
