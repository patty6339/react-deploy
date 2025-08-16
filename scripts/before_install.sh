#!/bin/bash
# Update system
sudo apt update -y

# Enable and install nginx 
sudo apt-get install nginx -y

# Start and enable nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Node.js from Amazon
sudo apt-get install nodejs -y

# Clean previous deployment
sudo rm -rf /var/www/html/*