FROM python:3.10

WORKDIR /web_server

# Install system dependencies for FFmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

ARG FLASK_SECRET_KEY
ARG STRIPE_SECRET_KEY

ENV FLASK_SECRET_KEY=${FLASK_SECRET_KEY}
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=blueprints.__init__
ENV FLASK_DEBUG=True

CMD ["python", "-c", "from blueprints.socket import socketio; from blueprints.__init__ import create_app; app = create_app(); socketio.run(app, host='0.0.0.0', port=5000, debug=True)"]