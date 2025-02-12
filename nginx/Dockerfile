FROM tiangolo/nginx-rtmp

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 1935 8080

# Start the Nginx server
CMD [ "nginx", "-g", "daemon off;" ]
