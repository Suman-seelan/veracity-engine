import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Activity, Target, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import PageTransition from "@/components/PageTransition";

const barData = [
  { name: "Accuracy", value: 96.47, fill: "hsl(173, 80%, 40%)" },
  { name: "Precision", value: 95.81, fill: "hsl(190, 75%, 45%)" },
  { name: "Recall", value: 97.23, fill: "hsl(142, 76%, 36%)" },
  { name: "F1-Score", value: 96.51, fill: "hsl(200, 70%, 50%)" },
];

const confusionMatrix = [[4821, 213], [143, 4823]];

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

const metricCards = [
  { icon: Target, label: "Accuracy", value: 96.47 },
  { icon: TrendingUp, label: "Precision", value: 95.81 },
  { icon: Activity, label: "Recall", value: 97.23 },
  { icon: Award, label: "F1-Score", value: 96.51 },
];

const DashboardPage = () => {
  return (
    <PageTransition>
      <div className="container max-w-6xl py-10">
        <ScrollReveal>
          <div className="mb-8">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary">
              PERFORMANCE
            </span>
            <h1 className="text-3xl font-bold text-foreground">Model Performance</h1>
            <p className="mt-1 text-muted-foreground">
              RoBERTa-base fine-tuned on Kaggle Fake News Dataset • 10,000 test samples
            </p>
          </div>
        </ScrollReveal>

        {/* Metric cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {metricCards.map((m, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard glow={i === 0} className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <m.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <AnimatedCounter
                  target={m.value}
                  suffix="%"
                  decimals={2}
                  className="block font-mono text-2xl font-bold text-foreground"
                />
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{m.label}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ScrollReveal>
            <GlassCard>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Evaluation Metrics
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 16%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(220, 10%, 55%)" }} />
                  <YAxis domain={[90, 100]} tick={{ fontSize: 12, fill: "hsl(220, 10%, 55%)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(220, 25%, 9%)",
                      border: "1px solid hsl(220, 20%, 16%)",
                      borderRadius: "12px",
                      color: "hsl(220, 15%, 92%)",
                      backdropFilter: "blur(20px)",
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <GlassCard>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Model Capability Radar
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(220, 20%, 16%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} />
                  <PolarRadiusAxis domain={[90, 100]} tick={{ fontSize: 10, fill: "hsl(220, 10%, 55%)" }} />
                  <Radar name="Model" dataKey="A" stroke="hsl(173, 80%, 40%)" fill="hsl(173, 80%, 40%)" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal>
            <GlassCard>
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
                        <motion.div
                          key={j}
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: (i * 2 + j) * 0.15, type: "spring" }}
                          className={`flex h-20 w-24 flex-col items-center justify-center rounded-xl font-mono text-lg font-bold ${
                            isCorrect
                              ? "bg-success/10 text-success shadow-[0_0_20px_hsl(142,76%,36%,0.1)]"
                              : "bg-destructive/10 text-destructive shadow-[0_0_20px_hsl(0,72%,51%,0.1)]"
                          }`}
                        >
                          {val.toLocaleString()}
                          <span className="text-[10px] font-normal text-muted-foreground">
                            {isCorrect ? (i === 0 ? "TN" : "TP") : i === 0 ? "FP" : "FN"}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <GlassCard>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Prediction Distribution
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={55} dataKey="value" stroke="none">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(220, 25%, 9%)",
                      border: "1px solid hsl(220, 20%, 16%)",
                      borderRadius: "12px",
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
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
