import { Link } from "react-router-dom";
import { Shield, Brain, BarChart3, Zap, Database, Globe, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import NeuralBackground from "@/components/NeuralBackground";
import GlassCard from "@/components/GlassCard";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import PageTransition from "@/components/PageTransition";

const features = [
  {
    icon: Brain,
    title: "Transformer Embeddings",
    description: "RoBERTa-base generates 768-dimensional contextual semantic vectors capturing deep linguistic patterns.",
  },
  {
    icon: Shield,
    title: "Deep Learning Classifier",
    description: "Dense Neural Network with dropout regularization and softmax output for binary classification.",
  },
  {
    icon: BarChart3,
    title: "Explainable Predictions",
    description: "Sentence-level analysis highlights misleading content with individual confidence scores.",
  },
  {
    icon: Zap,
    title: "Real-Time Inference",
    description: "Optimized pipeline delivers predictions in under 2 seconds with async processing.",
  },
  {
    icon: Database,
    title: "Scalable Architecture",
    description: "Horizontally scalable inference workers with Redis caching and load balancing.",
  },
  {
    icon: Globe,
    title: "URL Scraping",
    description: "Automatic extraction and analysis of article content from any news URL.",
  },
];

const stats = [
  { value: 96.47, suffix: "%", label: "Accuracy", decimals: 2 },
  { value: 95.81, suffix: "%", label: "Precision", decimals: 2 },
  { value: 97.23, suffix: "%", label: "Recall", decimals: 2 },
  { value: 10000, suffix: "+", label: "Test Samples", decimals: 0 },
];

const Index = () => {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <NeuralBackground />
        <div className="absolute inset-0 gradient-hero opacity-90" />

        {/* Glow orbs */}
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Major Final Year Project</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            Scalable Fake News{" "}
            <span className="text-gradient">Detection</span>{" "}
            Architecture
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/50 md:text-xl"
          >
            Using Transformer-Based Semantic Representation and Deep Learning Classifiers
            to combat misinformation with{" "}
            <span className="font-semibold text-primary">96.47% accuracy</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button asChild size="lg" className="group relative overflow-hidden rounded-xl bg-primary px-8 text-primary-foreground shadow-[0_0_30px_hsl(173,80%,40%,0.3)]">
              <Link to="/analyze">
                <Shield className="mr-2 h-5 w-5" />
                Start Analysis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl border-border/50 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white">
              <Link to="/dashboard">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Metrics
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-white/30"
          >
            <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
            <ChevronRight className="h-4 w-4 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative -mt-20 z-10">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <GlassCard glow className="text-center">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    className="block font-mono text-3xl font-bold text-primary md:text-4xl"
                  />
                  <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </span>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container max-w-6xl">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary">
                ARCHITECTURE
              </span>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Key Components
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                A multi-layered approach combining state-of-the-art NLP with scalable infrastructure.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <GlassCard className="h-full" glow={i === 0}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div className="container relative z-10 max-w-5xl">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-medium text-primary">
                PIPELINE
              </span>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                How It Works
              </h2>
            </div>
          </ScrollReveal>

          <div className="flex flex-col items-center gap-4">
            {[
              { step: "01", title: "Input", desc: "Raw news text or URL is submitted for analysis" },
              { step: "02", title: "Preprocessing", desc: "Tokenization, normalization, and feature extraction" },
              { step: "03", title: "Embedding", desc: "RoBERTa generates 768-dim contextual semantic vectors" },
              { step: "04", title: "Classification", desc: "Dense NN with dropout + softmax output layer" },
              { step: "05", title: "Explanation", desc: "Sentence-level misleading content highlighting" },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                <GlassCard className="flex w-full max-w-xl items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <span className="font-mono text-xl font-bold text-primary">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container max-w-3xl text-center">
          <ScrollReveal>
            <GlassCard glow className="p-12">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Ready to Detect Misinformation?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Try our Transformer-based analysis engine and see real-time predictions with confidence scores.
              </p>
              <Button asChild size="lg" className="mt-8 rounded-xl bg-primary px-10 text-primary-foreground shadow-[0_0_30px_hsl(173,80%,40%,0.3)]">
                <Link to="/analyze">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
          <p>VerityAI — Major Final Year Project</p>
          <p className="font-mono">Scalable Fake News Detection Using Transformer-Based Semantic Representation</p>
        </div>
      </footer>
    </PageTransition>
  );
};

export default Index;
