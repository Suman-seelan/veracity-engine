import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Loader2, Link as LinkIcon, Type } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictionResult from "@/components/PredictionResult";
import NeuralBackground from "@/components/NeuralBackground";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";

// ── API config ────────────────────────────────────────────────────────────────
// Set VITE_API_URL in your .env file; defaults to the local FastAPI server.
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type AnalysisResult = {
  label: "FAKE" | "REAL";
  confidence: number;
  probabilities: { fake: number; real: number };
  model: string;
  processingTime: string;
  highlights: { text: string; score: number; isMisleading: boolean }[];
};

// ── Real API call ─────────────────────────────────────────────────────────────
const analyzeWithAPI = async (
  payload: { text?: string; url?: string }
): Promise<AnalysisResult> => {
  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `API error ${response.status}`);
  }

  return response.json() as Promise<AnalysisResult>;
};

const AnalysisPage = () => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("text");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    const hasText = text.trim().length > 0;
    const hasUrl = url.trim().length > 0;
    if (!hasText && !hasUrl) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload =
        activeTab === "url" && hasUrl
          ? { url: url.trim() }
          : { text: text.trim() };

      const res = await analyzeWithAPI(payload);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)]">
        {/* Hero section */}
        <section className="relative overflow-hidden py-16 text-center md:py-24">
          <NeuralBackground />
          <div className="absolute inset-0 gradient-hero opacity-90" />
          <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />

          <div className="container relative z-10 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm"
            >
              <Shield className="h-4 w-4" />
              Transformer-Based Semantic Analysis
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-4 font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              Fake News <span className="text-gradient">Detection</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto max-w-xl text-base text-white/50 md:text-lg"
            >
              Leveraging RoBERTa embeddings and deep learning classifiers to identify misinformation with high accuracy and explainability.
            </motion.p>
          </div>
        </section>

        {/* Analysis input */}
        <section className="container -mt-8 max-w-3xl pb-20 relative z-10">
          <ScrollReveal>
            <div className="rounded-2xl border border-border/50 bg-card/40 p-6 shadow-[0_0_40px_hsl(173,80%,40%,0.08)] backdrop-blur-xl">
              <Tabs
                defaultValue="text"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-4 grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Paste Text
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Enter URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text">
                  <Textarea
                    placeholder="Paste a news article or headline here for analysis..."
                    className="min-h-[160px] resize-none font-mono text-sm bg-background/50"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </TabsContent>

                <TabsContent value="url">
                  <Input
                    placeholder="https://example.com/news-article"
                    className="bg-background/50"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    The system will scrape and analyze the article content.
                  </p>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleAnalyze}
                disabled={loading || (activeTab === "text" ? !text.trim() : !url.trim())}
                className="mt-4 w-full rounded-xl bg-primary text-primary-foreground shadow-[0_0_20px_hsl(173,80%,40%,0.2)] hover:bg-primary/90"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing with DistilBERT…
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Analyze Article
                  </>
                )}
              </Button>
            </div>
          </ScrollReveal>

          {/* Loading state */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex flex-col items-center gap-3 text-muted-foreground"
            >
              <div className="relative h-1 w-48 overflow-hidden rounded-full bg-secondary">
                <div className="absolute inset-0 animate-scan-line rounded-full bg-primary" />
              </div>
              <p className="text-sm">Processing semantic embeddings…</p>
            </motion.div>
          )}

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PredictionResult result={result} />
            </motion.div>
          )}
        </section>
      </div>
    </PageTransition>
  );
};

export default AnalysisPage;
