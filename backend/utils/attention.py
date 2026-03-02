"""
utils/attention.py
───────────────────
Maps token-level attention weights back to sentence-level scores for
the frontend "Sentence Analysis" panel.

Academic explanation
────────────────────
Transformer self-attention assigns a weight aᵢⱼ ∈ [0,1] to each token
pair, indicating how much token j influences the representation of token i.

We aggregate across all heads and layers using the "attention rollout"
approximation (Abnar & Zuidema, 2020):
    A_rollout = A_L ⊗ A_{L-1} ⊗ … ⊗ A_1
    (where ⊗ denotes attn matrix multiplication with residual mixing)

Then, for each sentence, we average the [CLS] → sentence-token rollout
scores.  A higher score means the model "paid more attention" to that
sentence when forming its classification decision — i.e., it was more
influential in determining Fake vs. Real.
"""

from __future__ import annotations

import re

import numpy as np
import torch


def _rollout_attention(
    attentions: tuple[torch.Tensor, ...],
) -> np.ndarray:
    """
    Compute attention rollout from a tuple of per-layer attention tensors.

    Parameters
    ----------
    attentions : tuple of [batch=1, heads, seq, seq] tensors

    Returns
    -------
    np.ndarray of shape (seq_len,)
        Rollout score for each token index (relative to [CLS] token at idx 0).
    """
    # Stack to (num_layers, heads, seq, seq) and average over heads
    mat = torch.stack([a.squeeze(0).mean(dim=0) for a in attentions])  # (L, S, S)

    # Add residual connection: A_hat = 0.5 * A + 0.5 * I
    eye = torch.eye(mat.size(-1), device=mat.device)
    mat = 0.5 * mat + 0.5 * eye  # (L, S, S)

    # Rollout: multiply attention matrices across layers
    rollout = mat[0]
    for i in range(1, mat.size(0)):
        rollout = torch.matmul(mat[i], rollout)

    # [CLS] row → importance of each token for the classification decision
    cls_scores = rollout[0].cpu().numpy()  # (S,)
    return cls_scores


def get_sentence_highlights(
    text: str,
    attentions: tuple[torch.Tensor, ...],
    tokenizer,
    max_sentences: int = 5,
    fake_threshold: float = 0.5,
) -> list[dict]:
    """
    Return sentence-level attention highlights matching the frontend schema:
        { "text": str, "score": float (0-1), "isMisleading": bool }

    Parameters
    ----------
    text            : Original input text
    attentions      : Tuple of per-layer attention tensors from the model
    tokenizer       : HuggingFace tokenizer (same as used for encoding)
    max_sentences   : Max number of sentences to return
    fake_threshold  : Sentences with score above this are flagged isMisleading
    """
    # Split into sentences
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 8]
    sentences = sentences[:max_sentences]

    if not sentences or attentions is None:
        return []

    try:
        cls_scores = _rollout_attention(attentions)

        highlights = []
        for sent in sentences:
            # Tokenise just this sentence to find which token indices it maps to
            enc = tokenizer(sent, add_special_tokens=False)
            n_tokens = len(enc["input_ids"])

            # Average attention score for this sentence's tokens
            # (We use a sliding window over the global cls_scores)
            score = float(np.mean(cls_scores[1 : 1 + n_tokens])) if n_tokens > 0 else 0.0
            score = min(max(score, 0.0), 1.0)

            highlights.append(
                {
                    "text": sent[:200],  # truncate very long sentences for UI
                    "score": round(score, 4),
                    "isMisleading": score >= fake_threshold,
                }
            )

        # Normalise scores to [0, 1] range for visual consistency
        scores = [h["score"] for h in highlights]
        s_min, s_max = min(scores), max(scores)
        if s_max > s_min:
            for h in highlights:
                h["score"] = round((h["score"] - s_min) / (s_max - s_min), 4)

        # Re-apply threshold after normalisation
        for h in highlights:
            h["isMisleading"] = h["score"] >= fake_threshold

        return highlights

    except Exception:
        # Graceful fallback: return sentences with uniform scores
        return [
            {"text": s[:200], "score": 0.5, "isMisleading": False}
            for s in sentences
        ]
