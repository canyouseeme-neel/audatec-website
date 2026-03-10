# Audatec Backend - Hugging Face Spaces
# FastAPI backend for voice, audit, CRM, and sentiment workflows

FROM python:3.12-slim

# Hugging Face Spaces runs as user 1000 - create user first to avoid permission issues
RUN useradd -m -u 1000 user

USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Upgrade pip (run as user to avoid permission issues)
RUN pip install --no-cache-dir --upgrade pip

# Copy dependency files and app (needed for pip install)
COPY --chown=user pyproject.toml ./
COPY --chown=user app ./app

# Install dependencies (no editable install for production)
RUN pip install --no-cache-dir .

# Hugging Face Spaces expects port 7860 by default
ENV PORT=7860
EXPOSE 7860

# Run uvicorn - bind to 0.0.0.0 for external access
# Use PORT from environment (Render sets this; default 7860 for Hugging Face Spaces)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
