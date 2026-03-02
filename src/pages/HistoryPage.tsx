import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

const mockHistory = [
  { id: 1, text: "Scientists discover new renewable energy source that could power millions...", label: "REAL" as const, confidence: 0.92, date: "2026-03-02 14:23", model: "RoBERTa-base" },
  { id: 2, text: "SHOCKING: Government secretly controls weather using satellites...", label: "FAKE" as const, confidence: 0.97, date: "2026-03-02 13:15", model: "RoBERTa-base" },
  { id: 3, text: "New study finds link between exercise and improved cognitive function...", label: "REAL" as const, confidence: 0.89, date: "2026-03-01 19:42", model: "RoBERTa-base" },
  { id: 4, text: "They don't want you to know: 5G towers cause mysterious illness...", label: "FAKE" as const, confidence: 0.95, date: "2026-03-01 11:08", model: "RoBERTa-base" },
  { id: 5, text: "Global leaders agree on new climate change mitigation strategy...", label: "REAL" as const, confidence: 0.87, date: "2026-02-28 16:55", model: "RoBERTa-base" },
];

const HistoryPage = () => {
  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Prediction History</h1>
        <p className="mt-1 text-muted-foreground">Recent analyses and their results</p>
      </div>

      <div className="space-y-3">
        {mockHistory.map((item) => {
          const isFake = item.label === "FAKE";
          return (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isFake ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                  }`}
                >
                  {isFake ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-foreground">{item.text}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono font-bold ${
                        isFake
                          ? "bg-destructive/10 text-destructive"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {item.label} • {(item.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.date}
                    </span>
                    <span className="font-mono">{item.model}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPage;
