#!/bin/bash

# Wayfair Clone - Start with Digital Ocean MySQL
# This script establishes SSH tunnel and starts the development server

set -e

echo "=========================================="
echo "🚀 Starting Wayfair Clone with DO MySQL"
echo "=========================================="
echo ""

# Configuration
SSH_KEY="/home/ubuntu/do_mysql_key"
SSH_HOST="165.232.54.128"
SSH_USER="root"
LOCAL_PORT="3306"
REMOTE_PORT="3306"

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Error: SSH key not found at $SSH_KEY"
    exit 1
fi

# Check if tunnel already exists
if pgrep -f "ssh.*$SSH_HOST.*$LOCAL_PORT:127.0.0.1:$REMOTE_PORT" > /dev/null; then
    echo "✅ SSH tunnel already running"
else
    echo "🔧 Establishing SSH tunnel to Digital Ocean..."
    
    # Start SSH tunnel in background
    ssh -i "$SSH_KEY" \
        -L "$LOCAL_PORT:127.0.0.1:$REMOTE_PORT" \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -o ServerAliveInterval=60 \
        -o ServerAliveCountMax=3 \
        "$SSH_USER@$SSH_HOST" \
        -N -f
    
    # Wait for tunnel to establish
    echo "⏳ Waiting for tunnel to establish..."
    sleep 3
    
    # Verify tunnel is running
    if pgrep -f "ssh.*$SSH_HOST.*$LOCAL_PORT:127.0.0.1:$REMOTE_PORT" > /dev/null; then
        echo "✅ SSH tunnel established successfully"
    else
        echo "❌ Failed to establish SSH tunnel"
        exit 1
    fi
fi

echo ""
echo "🔗 MySQL Connection:"
echo "   Host: 127.0.0.1"
echo "   Port: $LOCAL_PORT"
echo "   Database: wayfair_clone"
echo "   User: root"
echo ""

# Test MySQL connection
echo "🧪 Testing MySQL connection..."
if ssh -i "$SSH_KEY" \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    "$SSH_USER@$SSH_HOST" \
    'mysql -e "SELECT 1;" 2>/dev/null' > /dev/null; then
    echo "✅ MySQL connection test passed"
else
    echo "⚠️  MySQL connection test failed (but tunnel is running)"
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📝 Next steps:"
echo "   1. Update DATABASE_URL in your .env file:"
echo "      DATABASE_URL=mysql://root@127.0.0.1:3306/wayfair_clone"
echo ""
echo "   2. Run database migrations:"
echo "      cd /home/ubuntu/wayfair-clone && pnpm db:push"
echo ""
echo "   3. Start development server:"
echo "      cd /home/ubuntu/wayfair-clone && pnpm dev"
echo ""
echo "🛑 To stop the SSH tunnel:"
echo "   pkill -f 'ssh.*$SSH_HOST'"
echo ""
