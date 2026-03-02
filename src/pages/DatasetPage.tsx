import { Database, FileText, BarChart3, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import GlassCard from "@/components/GlassCard";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import PageTransition from "@/components/PageTransition";

const datasetStats = [
  { label: "Total Samples", value: 44898, suffix: "" },
  { label: "Real News", value: 21417, suffix: "" },
  { label: "Fake News", value: 23481, suffix: "" },
  { label: "Avg. Length", value: 405, suffix: " words" },
];

const lengthDistribution = [
  { range: "0-100", real: 1200, fake: 3400 },
  { range: "100-200", real: 2800, fake: 4100 },
  { range: "200-500", real: 6200, fake: 7300 },
  { range: "500-1000", real: 7100, fake: 5800 },
  { range: "1000+", real: 4117, fake: 2881 },
];

const sampleArticles = [
  { text: "Scientists discover high-pressure water ice could explain high magnetic fields of Uranus and Neptune...", label: "REAL", length: 342, source: "Reuters" },
  { text: "BREAKING: Secret government documents reveal plan to control citizens through 5G networks...", label: "FAKE", length: 198, source: "Unknown" },
  { text: "New study finds Mediterranean diet linked to lower risk of heart disease in adults over 65...", label: "REAL", length: 456, source: "AP News" },
  { text: "SHOCKING: Doctors confirm vaccines contain microchips for tracking population movements...", label: "FAKE", length: 167, source: "Blog" },
  { text: "International Space Station crew completes first spacewalk of 2026 to install solar panels...", label: "REAL", length: 523, source: "NASA" },
];

const DatasetPage = () => {
  return (
    <PageTransition>
      <div className="container max-w-6xl py-10">
        <ScrollReveal>
          <div className="mb-8">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary">
              DATASET
            </span>
            <h1 className="text-3xl font-bold text-foreground">Dataset Explorer</h1>
            <p className="mt-1 text-muted-foreground">
              Kaggle Fake News Dataset — Exploring training data characteristics
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {datasetStats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard glow={i === 0} className="text-center">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={0}
                  className="block font-mono text-2xl font-bold text-primary"
                />
                <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Article length distribution */}
          <ScrollReveal>
            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <BarChart3 className="h-4 w-4 text-primary" />
                Article Length Distribution
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={lengthDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 16%)" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(220, 25%, 9%)",
                      border: "1px solid hsl(220, 20%, 16%)",
                      borderRadius: "12px",
                      color: "hsl(220, 15%, 92%)",
                    }}
                  />
                  <Bar dataKey="real" name="Real" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fake" name="Fake" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </ScrollReveal>

          {/* Dataset info */}
          <ScrollReveal delay={0.1}>
            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Database className="h-4 w-4 text-primary" />
                Dataset Information
              </h3>
              <div className="space-y-4 text-sm">
                {[
                  { label: "Source", value: "Kaggle Fake News Dataset" },
                  { label: "Format", value: "CSV (title, text, label)" },
                  { label: "Split", value: "80% Train / 10% Val / 10% Test" },
                  { label: "Preprocessing", value: "Lowercasing, tokenization, padding (512 max)" },
                  { label: "Tokenizer", value: "RoBERTa BPE Tokenizer (50,265 vocab)" },
                  { label: "Class Balance", value: "47.7% Real / 52.3% Fake" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex justify-between border-b border-border/30 pb-2"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono text-foreground">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>

        {/* Sample articles */}
        <ScrollReveal>
          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Sample Articles
            </h3>
            <div className="space-y-3">
              {sampleArticles.map((article, i) => {
                const isFake = article.label === "FAKE";
                return (
                  <ScrollReveal key={i} delay={i * 0.08}>
                    <GlassCard hoverScale>
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                          isFake ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                        }`}>
                          {article.label}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{article.text}</p>
                          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                            <span className="font-mono">{article.length} words</span>
                            <span>Source: {article.source}</span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
};

export default DatasetPage;
