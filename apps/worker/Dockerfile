FROM python:3.11-slim

WORKDIR /app
ENV PYTHONPATH=/app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc g++ make curl libpq-dev git && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run the RQ worker
CMD ["rq", "worker", "analysis_tasks", "--url", "redis://redis:6379/0"]
