FROM python:3.9-slim

ARG PYTHON_PORT
ARG PYTHON_HOST

WORKDIR /app

COPY requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

COPY app/ .

EXPOSE ${PYTHON_PORT}

CMD ["python3", "main.py"]
