#!/bin/bash

# Variables
VM_USER="azureuser"
VM_IP="104.214.176.100"
SSH_KEY="./display_key.pem"
REMOTE_DIR="~/app"
LOCAL_DIR="$(pwd)"

# Ensure SSH key has correct permissions
chmod 600 "$SSH_KEY"

# Create remote directory
ssh -i "$SSH_KEY" "$VM_USER@$VM_IP" "mkdir -p $REMOTE_DIR"

# Rsync project files, excluding node_modules, dist, and .git
rsync -avz -e "ssh -i $SSH_KEY" --exclude 'node_modules' --exclude 'dist' --exclude '.git' "$LOCAL_DIR/" "$VM_USER@$VM_IP:$REMOTE_DIR/"

# SSH into VM and run Docker Compose
ssh -i "$SSH_KEY" "$VM_USER@$VM_IP" << EOF
cd $REMOTE_DIR
sudo docker compose down
sudo docker compose up --build -d
EOF


echo "Deployment complete! App should be running on the VM."
