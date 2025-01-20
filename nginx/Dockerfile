FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpcre3 libpcre3-dev \
    libssl-dev \
    zlib1g-dev \
    wget git

# Download and build NGINX with RTMP
RUN wget http://nginx.org/download/nginx-1.25.2.tar.gz && \
    tar -xzvf nginx-1.25.2.tar.gz && \
    git clone https://github.com/arut/nginx-rtmp-module.git && \
    cd nginx-1.25.2 && \
    ./configure --add-module=../nginx-rtmp-module --with-http_ssl_module && \
    make && make install

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose RTMP and HTTP ports
EXPOSE 1935

# Start NGINX
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]
