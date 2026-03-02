"""
scripts/evaluate.py
────────────────────
Offline evaluation script for the Veracity Engine model.

Usage
─────
    python scripts/evaluate.py --csv path/to/test.csv [--limit 1000]

Expected CSV schema
───────────────────
    text  : str   — article text
    label : int   — 0 = Real, 1 = Fake  (or "real"/"fake" strings)

Output
──────
  • Classification report (accuracy, precision, recall, F1) in terminal
  • Confusion matrix PNG saved to outputs/confusion_matrix.png
  • `outputs/metrics.json` with numeric results

Academic context
────────────────
Precision = TP / (TP + FP)   — of all predicted Fake, how many were correct?
Recall    = TP / (TP + FN)   — of all actual Fake, how many did we catch?
F1-Score  = 2·P·R / (P+R)   — harmonic mean, balances Precision and Recall
AUC-ROC   shows separability across all thresholds
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")  # headless rendering
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    accuracy_score,
)

# Add backend root to path so imports work
sys.path.insert(0, str(Path(__file__).parent.parent))

from model.model_loader import load_model
from model.predictor import predict
from dotenv import load_dotenv

load_dotenv()

OUTPUT_DIR = Path("outputs")
OUTPUT_DIR.mkdir(exist_ok=True)


def normalise_label(val) -> int:
    """Convert various label formats to 0 (Real) / 1 (Fake)."""
    if isinstance(val, int):
        return val
    mapping = {"0": 0, "1": 1, "real": 0, "fake": 1, "true": 0, "false": 1}
    return mapping.get(str(val).strip().lower(), int(val))


def run_evaluation(csv_path: str, limit: int | None = None) -> dict:
    print(f"\n{'─'*60}")
    print("  Veracity Engine — Model Evaluation")
    print(f"{'─'*60}")

    # Load data
    df = pd.read_csv(csv_path)
    if "text" not in df.columns or "label" not in df.columns:
        raise ValueError("CSV must have 'text' and 'label' columns.")

    df = df.dropna(subset=["text", "label"])
    df["label_int"] = df["label"].apply(normalise_label)

    if limit:
        df = df.sample(min(limit, len(df)), random_state=42)

    print(f"  Dataset: {len(df)} samples  |  Fake: {df['label_int'].sum()}  |  Real: {(df['label_int']==0).sum()}")

    # Load model
    model_name = os.getenv("MODEL_NAME", "mrm8488/bert-tiny-finetuned-fake-news-detection")
    local_path = os.getenv("LOCAL_MODEL_PATH")
    print(f"\n  Loading model: {local_path or model_name}\n")
    tokenizer, model = load_model(model_name=model_name, local_path=local_path)

    # Run inference
    y_true, y_pred, y_prob_fake = [], [], []
    for i, row in enumerate(df.itertuples(), 1):
        result = predict(str(row.text), tokenizer, model)
        pred_label = 1 if result.label == "FAKE" else 0
        y_true.append(row.label_int)
        y_pred.append(pred_label)
        y_prob_fake.append(result.probabilities["fake"])

        if i % 50 == 0:
            print(f"  Progress: {i}/{len(df)} ({i/len(df)*100:.1f}%)")

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    y_prob_fake = np.array(y_prob_fake)

    # Metrics
    print(f"\n{'─'*60}")
    print("  Classification Report")
    print(f"{'─'*60}")
    report = classification_report(y_true, y_pred, target_names=["Real", "Fake"], digits=4)
    print(report)

    acc = accuracy_score(y_true, y_pred)
    auc = roc_auc_score(y_true, y_prob_fake)
    print(f"  Accuracy : {acc*100:.2f}%")
    print(f"  AUC-ROC  : {auc:.4f}")

    # Confusion matrix
    cm = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(6, 5))
    sns.heatmap(
        cm, annot=True, fmt="d", cmap="Blues",
        xticklabels=["Pred Real", "Pred Fake"],
        yticklabels=["Act Real", "Act Fake"],
        ax=ax,
        linewidths=0.5,
        linecolor="white",
    )
    ax.set_title("Confusion Matrix — Veracity Engine", fontsize=13, pad=12)
    ax.set_ylabel("Actual Label", fontsize=11)
    ax.set_xlabel("Predicted Label", fontsize=11)
    plt.tight_layout()
    cm_path = OUTPUT_DIR / "confusion_matrix.png"
    fig.savefig(cm_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"\n  ✓ Confusion matrix saved → {cm_path}")

    # Save metrics JSON
    metrics = {
        "accuracy": round(acc, 4),
        "auc_roc": round(float(auc), 4),
        "samples": len(df),
        "confusion_matrix": cm.tolist(),
    }
    metrics_path = OUTPUT_DIR / "metrics.json"
    metrics_path.write_text(json.dumps(metrics, indent=2))
    print(f"  ✓ Metrics saved       → {metrics_path}\n")

    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate the Veracity Engine model.")
    parser.add_argument("--csv", required=True, help="Path to test CSV (text, label columns)")
    parser.add_argument("--limit", type=int, default=None, help="Max rows to evaluate")
    args = parser.parse_args()
    run_evaluation(args.csv, args.limit)
