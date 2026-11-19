"use client";

import { Sparkles, Shield, TrendingUp, BookOpen } from "lucide-react";
import { CurrencyCode } from "@/types/finance";

interface NavbarProps {
  currency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  activeTab: "simulator" | "ai" | "ledger";
  onTabChange: (tab: "simulator" | "ai" | "ledger") => void;
}

export function Navbar({ currency, onCurrencyChange, activeTab, onTabChange }: NavbarProps) {
  const currencies: CurrencyCode[] = ["HKD", "USD", "INR", "EUR", "GBP"];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            µ$
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">MicroCFO</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                FinHack 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI Side-Hustle Copilot & Risk Simulator</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => onTabChange("simulator")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "simulator"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </button>

          <button
            onClick={() => onTabChange("ai")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "ai"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Risk Copilot</span>
          </button>

          <button
            onClick={() => onTabChange("ledger")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "ledger"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cash Ledger</span>
          </button>
        </nav>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden md:inline">Currency:</span>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="bg-slate-900 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
