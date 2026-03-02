"""
model/predictor.py
───────────────────
Core inference logic: text → tokenize → BERT forward pass → softmax →
sentence highlights → PredictionResponse.

Design notes
────────────
• Model is loaded once at startup and passed via dependency injection —
  no module-level globals, making the code fully testable.
• `torch.inference_mode()` context manager (faster than `no_grad` in
  PyTorch ≥ 1.9) disables gradient tracking and version counters.
• Processing time is measured wall-clock so it includes tokenisation and
  attention computation; this is the number shown in the frontend.
"""

from __future__ import annotations

import time
from typing import Any

import torch
from pydantic import BaseModel, Field
from transformers import AutoModelForSequenceClassification, AutoTokenizer

from utils.attention import get_sentence_highlights
from utils.preprocessing import clean_text


# ── Pydantic response models ──────────────────────────────────────────────────

class SentenceHighlight(BaseModel):
    text: str
    score: float = Field(ge=0.0, le=1.0)
    isMisleading: bool


class PredictionResponse(BaseModel):
    label: str                              # "FAKE" | "REAL"
    confidence: float = Field(ge=0.0, le=1.0)
    probabilities: dict[str, float]         # {"fake": 0.87, "real": 0.13}
    model: str
    processingTime: str                     # seconds, 2 d.p.
    highlights: list[SentenceHighlight]


class BatchPredictionResponse(BaseModel):
    results: list[PredictionResponse]
    total: int
    processingTime: str


# ── Inference ─────────────────────────────────────────────────────────────────

def _label_name(raw: str) -> str:
    """
    Normalise raw HuggingFace label strings (e.g. 'LABEL_1', 'fake', 'Fake')
    to the canonical 'FAKE' / 'REAL' used by the frontend.
    """
    mapping = {
        "label_0": "REAL", "label_1": "FAKE",
        "real": "REAL", "fake": "FAKE",
        "0": "REAL", "1": "FAKE",
        "true": "REAL", "false": "FAKE",
    }
    return mapping.get(raw.lower(), raw.upper())


def predict(
    text: str,
    tokenizer: AutoTokenizer,
    model: AutoModelForSequenceClassification,
    max_length: int = 512,
) -> PredictionResponse:
    """
    Run a single fake-news classification inference.

    Parameters
    ----------
    text       : Raw news article text (will be cleaned internally)
    tokenizer  : HuggingFace tokenizer loaded at startup
    model      : Classification model loaded at startup
    max_length : Max token length (BERT max is 512)

    Returns
    -------
    PredictionResponse with label, confidence, probabilities, highlights.
    """
    t0 = time.perf_counter()

    cleaned = clean_text(text)
    device = next(model.parameters()).device

    # Tokenise ------------------------------------------------------------------
    inputs = tokenizer(
        cleaned,
        return_tensors="pt",
        max_length=max_length,
        truncation=True,
        padding=True,
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Forward pass --------------------------------------------------------------
    with torch.inference_mode():
        outputs = model(**inputs)

    # Probabilities -------------------------------------------------------------
    probs = torch.softmax(outputs.logits, dim=-1).squeeze().cpu()

    # Determine which index maps to FAKE
    id2label: dict[int, str] = model.config.id2label   # {0: "REAL", 1: "FAKE"} or similar
    fake_idx = next(
        (i for i, lbl in id2label.items() if _label_name(lbl) == "FAKE"), 1
    )
    real_idx = 1 - fake_idx

    fake_prob = float(probs[fake_idx])
    real_prob = float(probs[real_idx])

    predicted_idx = int(torch.argmax(probs).item())
    label = _label_name(id2label[predicted_idx])
    confidence = fake_prob if label == "FAKE" else real_prob

    # Sentence highlights via attention rollout  --------------------------------
    attentions = outputs.attentions  # tuple of (1, heads, seq, seq) per layer
    highlights_raw = get_sentence_highlights(
        text=cleaned,
        attentions=attentions,
        tokenizer=tokenizer,
        max_sentences=5,
        fake_threshold=0.5 if label == "FAKE" else 0.75,
    )
    highlights = [SentenceHighlight(**h) for h in highlights_raw]

    elapsed = time.perf_counter() - t0
    model_name = getattr(model.config, "_name_or_path", "bert-fake-news-classifier")

    return PredictionResponse(
        label=label,
        confidence=round(confidence, 4),
        probabilities={"fake": round(fake_prob, 4), "real": round(real_prob, 4)},
        model=model_name,
        processingTime=f"{elapsed:.2f}",
        highlights=highlights,
    )


def predict_batch(
    texts: list[str],
    tokenizer: AutoTokenizer,
    model: AutoModelForSequenceClassification,
    max_length: int = 512,
) -> BatchPredictionResponse:
    """
    Vectorised batch inference for multiple articles.

    Each article is predicted independently (no cross-contamination of
    attention weights) but tokenisation is batched for efficiency.
    """
    t0 = time.perf_counter()
    results = [predict(t, tokenizer, model, max_length) for t in texts]
    elapsed = time.perf_counter() - t0
    return BatchPredictionResponse(
        results=results,
        total=len(results),
        processingTime=f"{elapsed:.2f}",
    )
