FROM python:3.10

# Set working directory
WORKDIR /core

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose Flask's port
EXPOSE 5000

# Start the Flask app
CMD ["python", "app.py"]
