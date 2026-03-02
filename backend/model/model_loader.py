"""
model/model_loader.py
─────────────────────
Loads the HuggingFace transformer model and tokenizer exactly once at
application startup and caches them in `app.state`.

Supported models
────────────────
  • mrm8488/bert-tiny-finetuned-fake-news-detection  (default, ~17 MB, CPU-fast)
  • Any local path set via LOCAL_MODEL_PATH env var
  • Swap MODEL_NAME to 'distilbert-base-uncased' and point LOCAL_MODEL_PATH
    at your fine-tuned weights to use a larger model.

Architecture
────────────
The HuggingFace `AutoModelForSequenceClassification` class attaches a
two-neuron linear classification head on top of the transformer encoder.
Logits → Softmax → [P(real), P(fake)].
"""

from __future__ import annotations

import logging
import os
from pathlib import Path

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

logger = logging.getLogger(__name__)


def load_model(
    model_name: str = "mrm8488/bert-tiny-finetuned-fake-news-detection",
    local_path: str | None = None,
) -> tuple[AutoTokenizer, AutoModelForSequenceClassification]:
    """
    Download (or load from disk) the tokenizer + classification model.

    Parameters
    ----------
    model_name : str
        HuggingFace Hub model identifier.
    local_path : str | None
        If provided, load model weights from this local directory instead of
        the Hub.  Useful for offline / Docker deployments.

    Returns
    -------
    (tokenizer, model) both ready for inference.
    """
    source = local_path if (local_path and Path(local_path).exists()) else model_name

    logger.info("Loading tokenizer from: %s", source)
    tokenizer = AutoTokenizer.from_pretrained(source)

    logger.info("Loading model from: %s", source)
    model = AutoModelForSequenceClassification.from_pretrained(
        source,
        output_attentions=True,   # needed for sentence-level explainability
    )

    # Inference-only: disable dropout, gradients not needed
    model.eval()
    torch.set_grad_enabled(False)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)

    num_params = sum(p.numel() for p in model.parameters()) / 1e6
    logger.info(
        "Model ready on %s — %.1f M parameters | labels: %s",
        device.upper(),
        num_params,
        model.config.id2label,
    )

    return tokenizer, model
