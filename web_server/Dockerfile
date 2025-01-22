FROM python:3.10

# Set the working directory
WORKDIR /web_server

# Args that can be passed during build
ARG FLASK_SECRET_KEY
ARG STRIPE_SECRET_KEY

# Set as environment variables
ENV FLASK_SECRET_KEY=${FLASK_SECRET_KEY}
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV FLASK_APP=backend.blueprints.__init__
ENV FLASK_DEBUG=True

# Start the Flask app
CMD ["gunicorn", "-b", "0.0.0.0:5000", "backend.blueprints.__init__:create_app()"]
