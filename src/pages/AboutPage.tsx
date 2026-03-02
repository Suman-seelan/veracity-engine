import { Database, Cpu, Globe, Layers, ArrowRight, Zap, Server } from "lucide-react";

const architectureLayers = [
  {
    icon: Globe,
    title: "Presentation Layer",
    description: "React + TypeScript frontend with real-time analysis interface",
    tech: ["React 18", "TypeScript", "Tailwind CSS", "Recharts"],
    color: "text-primary",
  },
  {
    icon: Server,
    title: "API Gateway",
    description: "RESTful API handling authentication, rate limiting, and request routing",
    tech: ["FastAPI", "JWT Auth", "Redis Cache", "Rate Limiter"],
    color: "text-primary",
  },
  {
    icon: Cpu,
    title: "ML Inference Engine",
    description: "Transformer-based semantic analysis with deep learning classification",
    tech: ["RoBERTa-base", "PyTorch", "HuggingFace", "Dense Classifier"],
    color: "text-primary",
  },
  {
    icon: Database,
    title: "Data Layer",
    description: "Persistent storage for predictions, user data, and model artifacts",
    tech: ["PostgreSQL", "Redis", "S3 Storage", "Model Registry"],
    color: "text-primary",
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
    <div className="container max-w-5xl py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">System Architecture</h1>
        <p className="mt-1 text-muted-foreground">
          Scalable Fake News Detection using Transformer-Based Semantic Representation
        </p>
      </div>

      {/* Pipeline */}
      <section className="mb-12">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Inference Pipeline
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {pipeline.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-card">
                <p className="font-mono text-xs font-bold text-primary">{p.step}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
              {i < pipeline.length - 1 && (
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Architecture layers */}
      <section className="mb-12">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Architecture Layers
        </h2>
        <div className="space-y-4">
          {architectureLayers.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                    <Icon className={`h-5 w-5 ${layer.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{layer.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{layer.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {layer.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scalability */}
      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Scalability Considerations
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Zap, title: "DistilBERT Option", desc: "40% faster inference with 97% accuracy retention" },
            { icon: Layers, title: "Horizontal Scaling", desc: "Containerized inference workers with load balancing" },
            { icon: Database, title: "API Caching", desc: "Redis-backed response caching for repeated queries" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <Icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
