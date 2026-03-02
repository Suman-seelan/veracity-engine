import { CheckCircle, AlertTriangle, Clock, Cpu } from "lucide-react";
import type { AnalysisResult } from "@/pages/AnalysisPage";

const PredictionResult = ({ result }: { result: AnalysisResult }) => {
  const isFake = result.label === "FAKE";
  const pct = (result.confidence * 100).toFixed(1);

  return (
    <div className="mt-8 space-y-6">
      {/* Main verdict */}
      <div
        className={`rounded-xl border p-6 ${
          isFake
            ? "border-destructive/30 bg-destructive/5"
            : "border-success/30 bg-success/5"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              isFake ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
            }`}
          >
            {isFake ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-foreground">
                {isFake ? "Likely Fake" : "Likely Real"}
              </h3>
              <span
                className={`rounded-full px-3 py-0.5 font-mono text-xs font-bold ${
                  isFake
                    ? "bg-destructive/10 text-destructive"
                    : "bg-success/10 text-success"
                }`}
              >
                {pct}% confidence
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" /> {result.model}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {result.processingTime}s
              </span>
            </div>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Real</span>
            <span>Fake</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isFake ? "bg-destructive" : "bg-success"
              }`}
              style={{ width: `${pct}%`, marginLeft: isFake ? "auto" : undefined }}
            />
          </div>
        </div>
      </div>

      {/* Highlighted sentences */}
      {result.highlights.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Sentence Analysis
          </h4>
          <div className="space-y-3">
            {result.highlights.map((h, i) => (
              <div
                key={i}
                className={`rounded-lg border p-3 text-sm ${
                  h.isMisleading
                    ? "border-destructive/20 bg-destructive/5"
                    : "border-border bg-secondary/50"
                }`}
              >
                <p className="text-foreground">"{h.text}"</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${h.isMisleading ? "bg-destructive" : "bg-success"}`}
                      style={{ width: `${h.score * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {(h.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
