FROM debian:bullseye

# Install dependencies
RUN apt update && apt install -y \
    build-essential \
    libpcre3 libpcre3-dev \
    zlib1g zlib1g-dev \
    libssl-dev \
    curl wget git

# Define versions
ENV NGINX_VERSION=1.24.0
ENV NGINX_RTMP_MODULE_VERSION=1.2.2

# Download and compile NGINX with RTMP & auth_request module
RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar -zxvf nginx-${NGINX_VERSION}.tar.gz && \
    git clone https://github.com/arut/nginx-rtmp-module.git && \
    cd nginx-${NGINX_VERSION} && \
    ./configure --with-http_auth_request_module --add-module=../nginx-rtmp-module && \
    make -j$(nproc) && \
    make install

# Create required directories for logs
RUN mkdir -p /var/log/nginx && \
    touch /var/log/nginx/error.log && \
    touch /var/log/nginx/access.log

# Copy custom NGINX config
COPY nginx.conf /usr/local/nginx/conf/nginx.conf

# Expose necessary ports
EXPOSE 1935 8080

# Start NGINX
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]