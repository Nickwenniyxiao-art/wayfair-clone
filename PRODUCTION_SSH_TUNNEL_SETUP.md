# Production SSH Tunnel Setup for Digital Ocean MySQL

This document explains how to configure a secure SSH tunnel for the production Wayfair Clone application to connect to Digital Ocean MySQL database.

## Problem Statement

Direct MySQL connections from external IPs to Digital Ocean droplets fail with "Lost connection at 'reading initial communication packet'" error, even when:
- TCP connection succeeds (port is reachable)
- Firewall rules are configured correctly
- MySQL is configured to accept external connections

This appears to be a Digital Ocean VPC or DDoS protection mechanism that blocks MySQL protocol traffic at the application layer.

## Solution: SSH Tunnel

Use an SSH tunnel to securely forward MySQL traffic through an encrypted SSH connection. This bypasses network-level restrictions while providing additional security.

## Architecture

```
Production App → SSH Tunnel → Digital Ocean Droplet → MySQL (localhost:3306)
(Manus Server)   (Port 22)    (165.232.54.128)
```

## Prerequisites

1. Digital Ocean droplet with MySQL installed
2. SSH access to the droplet (root or sudo user)
3. Production environment with SSH client and autossh installed

## Setup Steps

### Step 1: Generate SSH Key Pair

On the production server (or locally for testing):

```bash
# Generate ED25519 key pair (more secure than RSA)
ssh-keygen -t ed25519 -f ~/.ssh/wayfair_mysql_tunnel -N "" -C "wayfair-production-mysql-tunnel"

# This creates:
# - Private key: ~/.ssh/wayfair_mysql_tunnel
# - Public key: ~/.ssh/wayfair_mysql_tunnel.pub
```

### Step 2: Add Public Key to Digital Ocean Droplet

Copy the public key to the droplet's authorized_keys:

```bash
# Display public key
cat ~/.ssh/wayfair_mysql_tunnel.pub

# SSH to droplet and add the key
ssh root@165.232.54.128

# On the droplet:
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

### Step 3: Test SSH Connection

```bash
# Test SSH connection with the new key
ssh -i ~/.ssh/wayfair_mysql_tunnel root@165.232.54.128 "echo 'SSH connection successful'"
```

### Step 4: Create SSH Tunnel Startup Script

Create `/home/ubuntu/wayfair-clone/scripts/start-production-tunnel.sh`:

```bash
#!/bin/bash

# SSH Tunnel Configuration
SSH_KEY="/path/to/ssh/key/wayfair_mysql_tunnel"
REMOTE_HOST="165.232.54.128"
REMOTE_USER="root"
LOCAL_PORT="3306"
REMOTE_PORT="3306"

# Start SSH tunnel with autossh for automatic reconnection
autossh -M 0 \
  -o "ServerAliveInterval=30" \
  -o "ServerAliveCountMax=3" \
  -o "StrictHostKeyChecking=no" \
  -o "UserKnownHostsFile=/dev/null" \
  -o "ExitOnForwardFailure=yes" \
  -N \
  -L ${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT} \
  -i ${SSH_KEY} \
  ${REMOTE_USER}@${REMOTE_HOST}
```

### Step 5: Configure Systemd Service (Optional)

For production environments with systemd, create a service to manage the tunnel:

Create `/etc/systemd/system/wayfair-mysql-tunnel.service`:

```ini
[Unit]
Description=SSH Tunnel for Wayfair MySQL Database
After=network.target

[Service]
Type=simple
User=ubuntu
Environment="AUTOSSH_GATETIME=0"
ExecStart=/usr/bin/autossh -M 0 \
  -o "ServerAliveInterval=30" \
  -o "ServerAliveCountMax=3" \
  -o "StrictHostKeyChecking=no" \
  -o "ExitOnForwardFailure=yes" \
  -N \
  -L 3306:127.0.0.1:3306 \
  -i /path/to/ssh/key/wayfair_mysql_tunnel \
  root@165.232.54.128
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable wayfair-mysql-tunnel
sudo systemctl start wayfair-mysql-tunnel
sudo systemctl status wayfair-mysql-tunnel
```

### Step 6: Update Database Connection String

Update the `CUSTOM_DATABASE_URL` environment variable to use localhost:

```bash
# Original (direct connection - doesn't work)
CUSTOM_DATABASE_URL=mysql://wayfair:Wayfair2024Secure!@165.232.54.128:3306/wayfair_clone

# Updated (via SSH tunnel)
CUSTOM_DATABASE_URL=mysql://wayfair:Wayfair2024Secure!@127.0.0.1:3306/wayfair_clone
```

### Step 7: Test Database Connection

```bash
# Test MySQL connection through the tunnel
mysql -h 127.0.0.1 -P 3306 -u wayfair -p'Wayfair2024Secure!' -e "SELECT COUNT(*) as product_count FROM products;" wayfair_clone
```

Expected output:
```
+---------------+
| product_count |
+---------------+
|           200 |
+---------------+
```

## Docker Deployment

If deploying with Docker, you have two options:

### Option 1: Run SSH Tunnel in Separate Container

Create a dedicated tunnel container that other services can use:

```dockerfile
# Dockerfile.tunnel
FROM alpine:latest

RUN apk add --no-cache openssh-client autossh

COPY wayfair_mysql_tunnel /root/.ssh/id_ed25519
RUN chmod 600 /root/.ssh/id_ed25519

CMD ["autossh", "-M", "0", \
     "-o", "ServerAliveInterval=30", \
     "-o", "ServerAliveCountMax=3", \
     "-o", "StrictHostKeyChecking=no", \
     "-N", \
     "-L", "0.0.0.0:3306:127.0.0.1:3306", \
     "-i", "/root/.ssh/id_ed25519", \
     "root@165.232.54.128"]
```

docker-compose.yml:
```yaml
version: '3.8'

services:
  mysql-tunnel:
    build:
      context: .
      dockerfile: Dockerfile.tunnel
    container_name: mysql-tunnel
    restart: always
    ports:
      - "3306:3306"

  app:
    build: .
    depends_on:
      - mysql-tunnel
    environment:
      - CUSTOM_DATABASE_URL=mysql://wayfair:Wayfair2024Secure!@mysql-tunnel:3306/wayfair_clone
```

### Option 2: Run SSH Tunnel in Same Container

Add SSH tunnel startup to your application's entrypoint script:

```bash
#!/bin/bash

# Start SSH tunnel in background
autossh -M 0 \
  -o "ServerAliveInterval=30" \
  -o "ServerAliveCountMax=3" \
  -o "StrictHostKeyChecking=no" \
  -N \
  -L 3306:127.0.0.1:3306 \
  -i /root/.ssh/wayfair_mysql_tunnel \
  root@165.232.54.128 &

# Wait for tunnel to establish
sleep 5

# Start application
exec node server/_core/index.js
```

## Kubernetes Deployment

For Kubernetes/GKE deployment:

### 1. Create Secret for SSH Key

```bash
kubectl create secret generic mysql-tunnel-key \
  --from-file=ssh-privatekey=/path/to/wayfair_mysql_tunnel
```

### 2. Create Tunnel Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-tunnel
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql-tunnel
  template:
    metadata:
      labels:
        app: mysql-tunnel
    spec:
      containers:
      - name: tunnel
        image: alpine:latest
        command:
          - /bin/sh
          - -c
          - |
            apk add --no-cache openssh-client autossh
            chmod 600 /ssh-key/ssh-privatekey
            autossh -M 0 \
              -o "ServerAliveInterval=30" \
              -o "ServerAliveCountMax=3" \
              -o "StrictHostKeyChecking=no" \
              -N \
              -L 0.0.0.0:3306:127.0.0.1:3306 \
              -i /ssh-key/ssh-privatekey \
              root@165.232.54.128
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: ssh-key
          mountPath: /ssh-key
          readOnly: true
      volumes:
      - name: ssh-key
        secret:
          secretName: mysql-tunnel-key
          defaultMode: 0600
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-tunnel
spec:
  selector:
    app: mysql-tunnel
  ports:
  - port: 3306
    targetPort: 3306
```

### 3. Update Application to Use Tunnel Service

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wayfair-clone
spec:
  template:
    spec:
      containers:
      - name: app
        env:
        - name: CUSTOM_DATABASE_URL
          value: "mysql://wayfair:Wayfair2024Secure!@mysql-tunnel:3306/wayfair_clone"
```

## Monitoring and Troubleshooting

### Check Tunnel Status

```bash
# Check if autossh is running
ps aux | grep autossh

# Check if port 3306 is listening
netstat -tlnp | grep 3306

# Test MySQL connection
mysql -h 127.0.0.1 -P 3306 -u wayfair -p -e "SELECT 1;"
```

### Common Issues

**Issue 1: "Connection refused" on localhost:3306**
- Tunnel is not running
- Check autossh process: `ps aux | grep autossh`
- Check SSH key permissions: `ls -la ~/.ssh/wayfair_mysql_tunnel`

**Issue 2: "Permission denied (publickey)"**
- Public key not added to droplet's authorized_keys
- SSH key permissions incorrect (should be 600)

**Issue 3: Tunnel disconnects frequently**
- Increase ServerAliveInterval
- Check network stability
- Review autossh logs

### Logs

```bash
# Systemd service logs
sudo journalctl -u wayfair-mysql-tunnel -f

# Docker logs
docker logs -f mysql-tunnel

# Kubernetes logs
kubectl logs -f deployment/mysql-tunnel
```

## Security Considerations

1. **SSH Key Protection**: Store private keys securely, never commit to version control
2. **Key Rotation**: Rotate SSH keys periodically (every 90 days recommended)
3. **Firewall**: Keep SSH port (22) restricted to known IPs if possible
4. **Monitoring**: Set up alerts for tunnel disconnections
5. **Backup Connection**: Consider a backup database or failover mechanism

## Performance

SSH tunnels add minimal overhead:
- Latency: +1-5ms (encryption overhead)
- Throughput: Negligible impact for typical database queries
- CPU: <1% on modern hardware

## Alternatives Considered

1. **Direct MySQL Connection**: Blocked by Digital Ocean network policies
2. **VPN**: More complex setup, similar security benefits
3. **Cloud SQL Proxy**: Not applicable (using Digital Ocean, not Google Cloud SQL)
4. **MySQL over TLS**: Still blocked at network layer

## Conclusion

SSH tunnel provides a reliable, secure solution for connecting to Digital Ocean MySQL from production environments. It bypasses network-level restrictions while maintaining strong security through SSH encryption.

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review Digital Ocean firewall settings
3. Verify MySQL server status on droplet
4. Contact Digital Ocean support for network-level issues
