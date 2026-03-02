import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Loader2, Link as LinkIcon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictionResult from "@/components/PredictionResult";

// Mock analysis
const mockAnalyze = (text: string): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fakeKeywords = ["shocking", "unbelievable", "they don't want you to know", "secret", "hoax", "conspiracy"];
      const lowerText = text.toLowerCase();
      const fakeScore = fakeKeywords.reduce((acc, kw) => acc + (lowerText.includes(kw) ? 0.12 : 0), 0.15 + Math.random() * 0.3);
      const isFake = fakeScore > 0.5;

      // Generate highlighted sentences
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
      const highlights = sentences.slice(0, 3).map((s, i) => ({
        text: s.trim(),
        score: Math.random() * 0.5 + (isFake ? 0.4 : 0.1),
        isMisleading: isFake && i < 2,
      }));

      resolve({
        label: isFake ? "FAKE" : "REAL",
        confidence: isFake ? fakeScore : 1 - fakeScore,
        model: "RoBERTa-base + Dense Classifier",
        processingTime: (Math.random() * 1.5 + 0.3).toFixed(2),
        highlights,
      });
    }, 2000);
  });
};

export type AnalysisResult = {
  label: "FAKE" | "REAL";
  confidence: number;
  model: string;
  processingTime: string;
  highlights: { text: string; score: number; isMisleading: boolean }[];
};

const AnalysisPage = () => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    const input = text.trim() || url.trim();
    if (!input) return;
    setLoading(true);
    setResult(null);
    const res = await mockAnalyze(input);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero section */}
      <section className="gradient-hero py-16 text-center md:py-24">
        <div className="container max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/30 bg-card/10 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <Shield className="h-4 w-4 text-primary" />
            Transformer-Based Semantic Analysis
          </div>
          <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            Fake News <span className="text-gradient">Detection</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/60 md:text-lg">
            Leveraging RoBERTa embeddings and deep learning classifiers to identify misinformation with high accuracy and explainability.
          </p>
        </div>
      </section>

      {/* Analysis input */}
      <section className="container -mt-8 max-w-3xl pb-20">
        <div className="rounded-xl border border-border bg-card p-6 shadow-elevated">
          <Tabs defaultValue="text" className="w-full">
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
                className="min-h-[160px] resize-none font-mono text-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="url">
              <Input
                placeholder="https://example.com/news-article"
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
            disabled={loading || (!text.trim() && !url.trim())}
            className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with RoBERTa...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Analyze Article
              </>
            )}
          </Button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mt-8 flex flex-col items-center gap-3 text-muted-foreground">
            <div className="relative h-1 w-48 overflow-hidden rounded-full bg-secondary">
              <div className="absolute inset-0 animate-scan-line rounded-full bg-primary" />
            </div>
            <p className="text-sm">Processing semantic embeddings...</p>
          </div>
        )}

        {/* Results */}
        {result && <PredictionResult result={result} />}
      </section>
    </div>
  );
};

export default AnalysisPage;
