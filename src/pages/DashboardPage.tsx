import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Activity, Target, TrendingUp, Award } from "lucide-react";

const metrics = {
  accuracy: 0.9647,
  precision: 0.9581,
  recall: 0.9723,
  f1Score: 0.9651,
};

const barData = [
  { name: "Accuracy", value: metrics.accuracy * 100, fill: "hsl(173, 80%, 40%)" },
  { name: "Precision", value: metrics.precision * 100, fill: "hsl(190, 75%, 45%)" },
  { name: "Recall", value: metrics.recall * 100, fill: "hsl(142, 76%, 36%)" },
  { name: "F1-Score", value: metrics.f1Score * 100, fill: "hsl(200, 70%, 50%)" },
];

const confusionMatrix = [
  [4821, 213],
  [143, 4823],
];

const radarData = [
  { subject: "Accuracy", A: 96.5 },
  { subject: "Precision", A: 95.8 },
  { subject: "Recall", A: 97.2 },
  { subject: "F1", A: 96.5 },
  { subject: "AUC-ROC", A: 98.1 },
];

const pieData = [
  { name: "True Positive", value: 4823 },
  { name: "True Negative", value: 4821 },
  { name: "False Positive", value: 213 },
  { name: "False Negative", value: 143 },
];

const PIE_COLORS = [
  "hsl(142, 76%, 36%)",
  "hsl(173, 80%, 40%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
];

const MetricCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <div className="rounded-xl border border-border bg-card p-5 shadow-card">
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-accent`}>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Model Performance</h1>
        <p className="mt-1 text-muted-foreground">
          RoBERTa-base fine-tuned on Kaggle Fake News Dataset • 10,000 test samples
        </p>
      </div>

      {/* Metric cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard icon={Target} label="Accuracy" value="96.47%" color="primary" />
        <MetricCard icon={TrendingUp} label="Precision" value="95.81%" color="primary" />
        <MetricCard icon={Activity} label="Recall" value="97.23%" color="primary" />
        <MetricCard icon={Award} label="F1-Score" value="96.51%" color="primary" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bar chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Evaluation Metrics
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[90, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 25%, 9%)",
                  border: "1px solid hsl(220, 20%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(220, 15%, 92%)",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Model Capability Radar
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220, 13%, 91%)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[90, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Model"
                dataKey="A"
                stroke="hsl(173, 80%, 40%)"
                fill="hsl(173, 80%, 40%)"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Confusion Matrix */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Confusion Matrix
          </h3>
          <div className="flex flex-col items-center">
            <div className="mb-2 flex gap-1 text-xs font-medium text-muted-foreground">
              <span className="w-24" />
              <span className="w-24 text-center">Pred Real</span>
              <span className="w-24 text-center">Pred Fake</span>
            </div>
            {confusionMatrix.map((row, i) => (
              <div key={i} className="flex gap-1">
                <span className="flex w-24 items-center text-xs font-medium text-muted-foreground">
                  {i === 0 ? "Actual Real" : "Actual Fake"}
                </span>
                {row.map((val, j) => {
                  const isCorrect = i === j;
                  return (
                    <div
                      key={j}
                      className={`flex h-20 w-24 flex-col items-center justify-center rounded-lg font-mono text-lg font-bold ${
                        isCorrect
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {val.toLocaleString()}
                      <span className="text-[10px] font-normal text-muted-foreground">
                        {isCorrect ? (i === 0 ? "TN" : "TP") : i === 0 ? "FP" : "FN"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Prediction Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={55}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 25%, 9%)",
                  border: "1px solid hsl(220, 20%, 16%)",
                  borderRadius: "8px",
                  color: "hsl(220, 15%, 92%)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {pieData.map((d, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
