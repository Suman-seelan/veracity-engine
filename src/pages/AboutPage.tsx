import { Database, Cpu, Globe, Layers, ArrowRight, Zap, Server } from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const architectureLayers = [
  {
    icon: Globe,
    title: "Presentation Layer",
    description: "React + TypeScript frontend with real-time analysis interface",
    tech: ["React 18", "TypeScript", "Tailwind CSS", "Recharts"],
  },
  {
    icon: Server,
    title: "API Gateway",
    description: "RESTful API handling authentication, rate limiting, and request routing",
    tech: ["FastAPI", "JWT Auth", "Redis Cache", "Rate Limiter"],
  },
  {
    icon: Cpu,
    title: "ML Inference Engine",
    description: "Transformer-based semantic analysis with deep learning classification",
    tech: ["RoBERTa-base", "PyTorch", "HuggingFace", "Dense Classifier"],
  },
  {
    icon: Database,
    title: "Data Layer",
    description: "Persistent storage for predictions, user data, and model artifacts",
    tech: ["PostgreSQL", "Redis", "S3 Storage", "Model Registry"],
  },
];

const pipeline = [
  { step: "Input", desc: "Raw news text / URL" },
  { step: "Preprocessing", desc: "Tokenization, cleaning" },
  { step: "Embedding", desc: "RoBERTa contextual vectors" },
  { step: "Classification", desc: "Dense NN + Softmax" },
  { step: "Output", desc: "Label + confidence + explanation" },
];

const AboutPage = () => {
  return (
    <PageTransition>
      <div className="container max-w-5xl py-10">
        <ScrollReveal>
          <div className="mb-10">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary">
              ARCHITECTURE
            </span>
            <h1 className="text-3xl font-bold text-foreground">System Architecture</h1>
            <p className="mt-1 text-muted-foreground">
              Scalable Fake News Detection using Transformer-Based Semantic Representation
            </p>
          </div>
        </ScrollReveal>

        {/* Pipeline */}
        <section className="mb-12">
          <ScrollReveal>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Inference Pipeline
            </h2>
          </ScrollReveal>
          <div className="flex flex-wrap items-center gap-2">
            {pipeline.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="left">
                <div className="flex items-center gap-2">
                  <GlassCard glow={i === 2} hoverScale className="px-4 py-3">
                    <p className="font-mono text-xs font-bold text-primary">{p.step}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </GlassCard>
                  {i < pipeline.length - 1 && (
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary/40" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Architecture layers */}
        <section className="mb-12">
          <ScrollReveal>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Architecture Layers
            </h2>
          </ScrollReveal>
          <div className="space-y-4">
            {architectureLayers.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <GlassCard glow={i === 2}>
                    <div className="flex items-start gap-4">
                      <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        whileInView={{ rotate: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15, type: "spring" }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10"
                      >
                        <Icon className="h-5 w-5 text-primary" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-foreground">{layer.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{layer.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {layer.tech.map((t) => (
                            <span
                              key={t}
                              className="rounded-lg bg-primary/5 border border-primary/10 px-2 py-0.5 font-mono text-xs text-primary"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Scalability */}
        <section>
          <ScrollReveal>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Scalability Considerations
            </h2>
          </ScrollReveal>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Zap, title: "DistilBERT Option", desc: "40% faster inference with 97% accuracy retention" },
              { icon: Layers, title: "Horizontal Scaling", desc: "Containerized inference workers with load balancing" },
              { icon: Database, title: "API Caching", desc: "Redis-backed response caching for repeated queries" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <GlassCard glow>
                    <Icon className="mb-3 h-6 w-6 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
