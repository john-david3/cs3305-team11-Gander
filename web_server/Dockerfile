FROM python:3.10

WORKDIR /web_server

ARG FLASK_SECRET_KEY
ARG STRIPE_SECRET_KEY

ENV FLASK_SECRET_KEY=${FLASK_SECRET_KEY}
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=blueprints.__init__
ENV FLASK_DEBUG=True

CMD ["gunicorn", "-b", "0.0.0.0:5000", "blueprints.__init__:create_app()"]
