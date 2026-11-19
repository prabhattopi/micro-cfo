import { Calculator, Sparkles, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>SMBP FinHack 2026 • Finance Track Submission</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl mb-4">
        Stop Losing Money on Your{" "}
        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
          Student Side-Hustles
        </span>
      </h1>

      <p className="text-slate-400 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
        The AI-powered fractional CFO built for college students. Calculate true unit economics, simulate cash runway, expose platform take-rates, and stress-test your business model in 60 seconds.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full text-left mb-10">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm mb-1">True Unit Economics</h3>
          <p className="text-xs text-slate-400">Fixed costs, variable margins, and realistic hourly wage calculations.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm mb-1">Break-Even Simulator</h3>
          <p className="text-xs text-slate-400">Interactive volume-vs-price sensitivity models to avoid zero-margin traps.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm mb-1">Gemini AI Stress-Test</h3>
          <p className="text-xs text-slate-400">Exposes hidden platform cuts, seasonal campus dips, and regulatory risks.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20">
          <span>Phase 1 Scaffolding Ready</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </main>
  );
}
