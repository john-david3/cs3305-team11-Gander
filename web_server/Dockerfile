FROM python:3.10

# Set the working directory
WORKDIR /web_server

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV FLASK_APP=backend.blueprints.__init__
ENV FLASK_DEBUG=True

# Expose Flask's port
EXPOSE 5000

# Start the Flask app
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
