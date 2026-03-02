# ── Stage 1: dependency install ───────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# System libs needed by lxml / numpy
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies into a separate prefix for lean final image
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ── Stage 2: runtime image ────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

WORKDIR /app

# Copy installed packages
COPY --from=builder /install /usr/local

# Copy application source
COPY . .

# Create unprivileged user
RUN useradd -m -u 1000 veracity
USER veracity

# HuggingFace cache dir (model weights downloaded here on first run)
ENV HF_HOME=/app/.cache/huggingface
ENV TRANSFORMERS_CACHE=/app/.cache/huggingface/transformers

EXPOSE 8000

# Health check for Docker / Kubernetes
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
