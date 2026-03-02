"""
app.py — Veracity Engine FastAPI Application
─────────────────────────────────────────────
Entry point for the ML inference server.

Architecture
────────────
  Next.js / Vite Frontend
        │
        ▼
  FastAPI (this file)          ← CORS, logging, routing
        │
        ▼
  model/predictor.py           ← tokenise → BERT forward → softmax
        │
        ▼
  model/model_loader.py        ← HuggingFace AutoModel (loaded ONCE)

Startup sequence
────────────────
The `lifespan` context manager runs model loading exactly once when the
process starts and stores `(tokenizer, model)` in `app.state` so every
request handler can access them without re-loading from disk.
"""

from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model.model_loader import load_model
from model.predictor import BatchPredictionResponse, PredictionResponse, predict, predict_batch
from utils.logger import RequestLoggingMiddleware, configure_logging
from utils.preprocessing import fetch_url_content

# ── Bootstrap ─────────────────────────────────────────────────────────────────

load_dotenv()  # reads .env file if present

configure_logging(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("veracity.app")

MODEL_NAME = os.getenv("MODEL_NAME", "mrm8488/bert-tiny-finetuned-fake-news-detection")
LOCAL_MODEL_PATH = os.getenv("LOCAL_MODEL_PATH")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
MAX_INPUT_TOKENS = int(os.getenv("MAX_INPUT_TOKENS", "512"))
BATCH_SIZE_LIMIT = int(os.getenv("BATCH_SIZE_LIMIT", "32"))


# ── Lifespan (replaces on_event deprecated pattern) ───────────────────────────

@asynccontextmanager
async def lifespan(application: FastAPI):
    """Load model at startup; clean-up (if any) at shutdown."""
    logger.info("Starting Veracity Engine — loading model …")
    tokenizer, model = load_model(
        model_name=MODEL_NAME,
        local_path=LOCAL_MODEL_PATH,
    )
    application.state.tokenizer = tokenizer
    application.state.model = model
    logger.info("Model ready. Server is live.")
    yield
    # Shutdown: PyTorch frees memory automatically; add explicit cleanup here if needed.
    logger.info("Shutting down Veracity Engine.")


# ── App factory ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="Veracity Engine API",
    description=(
        "Transformer-based fake news detection. "
        "Uses DistilBERT / BERT-tiny fine-tuned on Kaggle Fake News Dataset."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── Middleware ─────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestLoggingMiddleware)


# ── Request / Response schemas ────────────────────────────────────────────────

class PredictRequest(BaseModel):
    text: Optional[str] = Field(None, description="Raw news article text")
    url: Optional[str] = Field(None, description="Public URL of a news article")

    model_config = {"json_schema_extra": {"example": {"text": "Scientists say the Earth is flat."}}}


class BatchPredictRequest(BaseModel):
    texts: list[str] = Field(..., min_length=1, description="List of article texts")

    model_config = {
        "json_schema_extra": {
            "example": {
                "texts": [
                    "Breaking: Moon landing was faked by NASA.",
                    "WHO releases updated COVID-19 vaccination guidelines.",
                ]
            }
        }
    }


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
async def health_check(request: Request) -> dict:
    """Liveness probe — returns model info and device."""
    model = request.app.state.model
    tokenizer = request.app.state.tokenizer
    import torch

    return {
        "status": "ok",
        "model": getattr(model.config, "_name_or_path", MODEL_NAME),
        "device": str(next(model.parameters()).device),
        "vocab_size": tokenizer.vocab_size,
        "num_labels": model.config.num_labels,
        "id2label": model.config.id2label,
    }


@app.get("/model/info", tags=["System"])
async def model_info(request: Request) -> dict:
    """Detailed model architecture info for the frontend About / Dashboard pages."""
    model = request.app.state.model
    cfg = model.config
    num_params = sum(p.numel() for p in model.parameters())

    return {
        "model_name": getattr(cfg, "_name_or_path", MODEL_NAME),
        "architecture": cfg.architectures[0] if cfg.architectures else "Transformer",
        "num_parameters": num_params,
        "num_layers": getattr(cfg, "num_hidden_layers", "N/A"),
        "hidden_size": getattr(cfg, "hidden_size", "N/A"),
        "num_attention_heads": getattr(cfg, "num_attention_heads", "N/A"),
        "max_position_embeddings": getattr(cfg, "max_position_embeddings", 512),
        "labels": cfg.id2label,
    }


@app.post("/predict", response_model=PredictionResponse, tags=["Inference"])
async def predict_article(body: PredictRequest, request: Request) -> PredictionResponse:
    """
    Classify a single news article as FAKE or REAL.

    Accepts either:
    - `text`: raw article text (paste from frontend)
    - `url`: public article URL (will be scraped server-side)

    Returns the classification result with confidence scores and
    sentence-level attention highlights.
    """
    if not body.text and not body.url:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Provide either 'text' or 'url'.",
        )

    # Resolve text from URL if needed
    if body.url and not body.text:
        try:
            text = await fetch_url_content(body.url)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Could not fetch article from URL: {exc}",
            ) from exc
    else:
        text = body.text

    if len(text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Text is too short to analyse (minimum 10 characters).",
        )

    tokenizer = request.app.state.tokenizer
    model = request.app.state.model

    try:
        return predict(text, tokenizer, model, max_length=MAX_INPUT_TOKENS)
    except Exception as exc:
        logger.exception("Inference error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model inference failed. Check server logs.",
        ) from exc


@app.post("/predict/batch", response_model=BatchPredictionResponse, tags=["Inference"])
async def predict_batch_articles(body: BatchPredictRequest, request: Request) -> BatchPredictionResponse:
    """
    Classify a batch of news articles (max 32).

    Useful for bulk dataset evaluation or research workflows.
    """
    if len(body.texts) > BATCH_SIZE_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Batch size {len(body.texts)} exceeds limit of {BATCH_SIZE_LIMIT}.",
        )

    tokenizer = request.app.state.tokenizer
    model = request.app.state.model

    try:
        return predict_batch(body.texts, tokenizer, model, max_length=MAX_INPUT_TOKENS)
    except Exception as exc:
        logger.exception("Batch inference error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Batch inference failed.",
        ) from exc
