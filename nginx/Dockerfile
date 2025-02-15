FROM tiangolo/nginx-rtmp

# Copy Nginx config and SSL certificates into the container
COPY nginx.conf /etc/nginx/nginx.conf
COPY ../server.crt /etc/ssl/certs/server.crt
COPY ../server.key /etc/ssl/private/server.key

EXPOSE 1935 8080 443 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
