# Use a temporary file to store the content
sudo tee /etc/nginx/sites-enabled/default > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Restart nginx
sudo systemctl daemon-reload
