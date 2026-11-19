"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SimulatorDashboard } from "@/components/SimulatorDashboard";
import { CurrencyCode } from "@/types/finance";
import { Sparkles, BookOpen, ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  const [currency, setCurrency] = useState<CurrencyCode>("HKD");
  const [activeTab, setActiveTab] = useState<"simulator" | "ai" | "ledger">("simulator");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        currency={currency}
        onCurrencyChange={setCurrency}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === "simulator" && (
          <SimulatorDashboard
            currency={currency}
            onNavigateToAI={() => setActiveTab("ai")}
          />
        )}

        {activeTab === "ai" && (
          <div className="py-12 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coming in Phase 4 • Multimodal Gemini Copilot</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              AI Risk Stress-Tester & Receipt Scanner
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Feed your side-hustle model to Gemini 2.0 / Flash. It acts as an aggressive VC/CFO pointing out hidden costs, delivery pitfalls, and seasonal student dips.
            </p>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-left max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Planned Phase 4 Capabilities:</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                <li>Automated risk stress-testing via `@google/genai`</li>
                <li>Receipt photo OCR into structured expense line-items</li>
                <li>Free tier API key guidance & mock fallback mode</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab("simulator")}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Back to Interactive Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {activeTab === "ledger" && (
          <div className="py-12 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Coming in Phase 5 • Cash-Flow Ledger & Pitch Export</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Student Side-Hustle Cash Ledger
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Track actual real-life cash in and cash out, categorize fixed vs variable expenses, and export a 1-page PDF/Pitch Deck summary for student grants.
            </p>
            <button
              onClick={() => setActiveTab("simulator")}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Back to Interactive Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            MicroCFO • Built for <strong className="text-slate-400">SMBP FinHack (Hong Kong PolyU)</strong>
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Finance Track</span>
            <span>•</span>
            <span>PWA Enabled</span>
            <span>•</span>
            <span>Gemini AI Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
