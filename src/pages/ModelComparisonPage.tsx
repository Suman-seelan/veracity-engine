import { Brain, Zap, Timer, Scale, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import GlassCard from "@/components/GlassCard";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import PageTransition from "@/components/PageTransition";

const models = [
  {
    name: "BERT-base",
    params: "110M",
    accuracy: 94.32,
    precision: 93.87,
    recall: 94.91,
    f1: 94.39,
    inference: "2.4s",
    size: "440MB",
    selected: false,
  },
  {
    name: "RoBERTa-base",
    params: "125M",
    accuracy: 96.47,
    precision: 95.81,
    recall: 97.23,
    f1: 96.51,
    inference: "2.1s",
    size: "498MB",
    selected: true,
  },
  {
    name: "DistilBERT",
    params: "66M",
    accuracy: 93.15,
    precision: 92.44,
    recall: 93.98,
    f1: 93.20,
    inference: "1.2s",
    size: "265MB",
    selected: false,
  },
];

const radarData = [
  { metric: "Accuracy", BERT: 94.32, RoBERTa: 96.47, DistilBERT: 93.15 },
  { metric: "Precision", BERT: 93.87, RoBERTa: 95.81, DistilBERT: 92.44 },
  { metric: "Recall", BERT: 94.91, RoBERTa: 97.23, DistilBERT: 93.98 },
  { metric: "F1-Score", BERT: 94.39, RoBERTa: 96.51, DistilBERT: 93.20 },
  { metric: "Speed", BERT: 92, RoBERTa: 93, DistilBERT: 98 },
];

const ModelComparisonPage = () => {
  return (
    <PageTransition>
      <div className="container max-w-6xl py-10">
        <ScrollReveal>
          <div className="mb-8">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary">
              COMPARISON
            </span>
            <h1 className="text-3xl font-bold text-foreground">Model Comparison</h1>
            <p className="mt-1 text-muted-foreground">
              Side-by-side comparison of Transformer architectures for fake news detection
            </p>
          </div>
        </ScrollReveal>

        {/* Model cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {models.map((model, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard glow={model.selected} className={`relative ${model.selected ? "border-primary/30" : ""}`}>
                {model.selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-[0_0_15px_hsl(173,80%,40%,0.3)]"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-primary-foreground" />
                  </motion.div>
                )}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{model.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{model.params} params</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Accuracy", value: model.accuracy },
                    { label: "Precision", value: model.precision },
                    { label: "Recall", value: model.recall },
                    { label: "F1-Score", value: model.f1 },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <AnimatedCounter target={metric.value} suffix="%" decimals={2} className="font-mono text-foreground" />
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-border/30 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {model.inference}</span>
                    <span className="flex items-center gap-1"><Scale className="h-3 w-3" /> {model.size}</span>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Radar comparison */}
        <ScrollReveal>
          <GlassCard glow>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Performance Comparison Radar
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220, 20%, 16%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "hsl(220, 10%, 55%)" }} />
                <PolarRadiusAxis domain={[88, 100]} tick={{ fontSize: 10, fill: "hsl(220, 10%, 55%)" }} />
                <Radar name="BERT" dataKey="BERT" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.1} />
                <Radar name="RoBERTa" dataKey="RoBERTa" stroke="hsl(173, 80%, 40%)" fill="hsl(173, 80%, 40%)" fillOpacity={0.15} />
                <Radar name="DistilBERT" dataKey="DistilBERT" stroke="hsl(200, 70%, 50%)" fill="hsl(200, 70%, 50%)" fillOpacity={0.1} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6">
              {[
                { name: "BERT", color: "hsl(38, 92%, 50%)" },
                { name: "RoBERTa", color: "hsl(173, 80%, 40%)" },
                { name: "DistilBERT", color: "hsl(200, 70%, 50%)" },
              ].map((m) => (
                <span key={m.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
                  {m.name}
                </span>
              ))}
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
};

export default ModelComparisonPage;
