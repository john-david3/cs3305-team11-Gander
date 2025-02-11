FROM tiangolo/nginx-rtmp

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 1935 8080

RUN mkdir -p /stream_data/hls && \
    chmod -R 777 /stream_data

# Start the Nginx server
CMD [ "nginx", "-g", "daemon off;" ]
