"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SimulatorDashboard } from "@/components/SimulatorDashboard";
import { AICopilotTab } from "@/components/AICopilotTab";
import { CurrencyCode, HustleInputs } from "@/types/finance";
import { calculateFinancials } from "@/lib/cfo-math";
import { STUDENT_HUSTLE_PRESETS } from "@/data/hustle-presets";
import { BookOpen, ArrowRight } from "lucide-react";

export default function Home() {
  const [currency, setCurrency] = useState<CurrencyCode>("HKD");
  const [activeTab, setActiveTab] = useState<"simulator" | "ai" | "ledger">("simulator");

  // Shared Hustle State across all tabs
  const [inputs, setInputs] = useState<HustleInputs>({
    ...STUDENT_HUSTLE_PRESETS[0].defaultInputs,
    currency,
  });

  const analysis = calculateFinancials({ ...inputs, currency });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        currency={currency}
        onCurrencyChange={(newCurr) => {
          setCurrency(newCurr);
          setInputs((prev) => ({ ...prev, currency: newCurr }));
        }}
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
          <AICopilotTab
            inputs={inputs}
            analysis={analysis}
            currency={currency}
            onAddTransactionFromReceipt={(scan) => {
              setActiveTab("ledger");
            }}
          />
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
