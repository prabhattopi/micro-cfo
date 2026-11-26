"use client";

import { useState } from "react";
import { HustleInputs, FinancialAnalysis, CurrencyCode, Transaction } from "@/types/finance";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Printer, Copy, Check, X, Award, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

interface PitchDeckExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: HustleInputs;
  analysis: FinancialAnalysis;
  currency: CurrencyCode;
  transactions: Transaction[];
}

export function PitchDeckExportModal({
  isOpen,
  onClose,
  inputs,
  analysis,
  currency,
  transactions,
}: PitchDeckExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalInflow = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter((t) => t.type !== "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const actualNetCash = totalInflow - totalOutflow;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const generateMarkdownSummary = () => {
    return `# ${inputs.name} — Student Venture Financial Summary
**Hackathon Track:** SMBP FinHack 2026 • Finance Track
**Category:** ${inputs.category}
**Date Generated:** ${new Date().toLocaleDateString()}
**Base Currency:** ${currency}

---

## 1. Executive Unit Economics
* **Retail Selling Price:** ${formatCurrency(inputs.sellingPrice, currency)} / unit
* **Variable Cost of Goods (COGS):** ${formatCurrency(inputs.variableCostPerUnit, currency)} / unit
* **Platform & Payment Cut:** ${formatPercent(inputs.platformFeePercent)} + ${formatCurrency(inputs.fixedPaymentFee, currency)}
* **Unit Contribution Margin:** ${formatCurrency(analysis.unitContributionMargin, currency)} (${formatPercent(analysis.contributionMarginRatio)})
* **Monthly Fixed Overhead:** ${formatCurrency(inputs.fixedMonthlyCosts, currency)}/mo

## 2. Viability & Solvency Assessment
* **Composite Health Grade:** ${analysis.grade} (${analysis.healthScore}/100)
* **Break-Even Volume:** ${analysis.breakEvenUnits} units/month
* **Monthly Volume Target:** ${inputs.monthlyVolumeTarget} units (${analysis.isBreakEvenFeasible ? "Profitable" : "Volume Gap"})
* **Projected Monthly Net Profit:** ${formatCurrency(analysis.monthlyNetProfit, currency)} (Margin: ${formatPercent(analysis.netProfitMargin)})
* **Student Real Hourly Wage:** ${formatCurrency(analysis.realHourlyWage, currency)}/hr (Campus Benchmark: ${formatCurrency(60, currency)}/hr)
* **Emergency Cash Runway:** ${analysis.cashRunwayMonths.toFixed(1)} months

## 3. Real Operating Ledger Status
* **Actual Total Revenue:** ${formatCurrency(totalInflow, currency)}
* **Actual Total Expenses:** ${formatCurrency(totalOutflow, currency)}
* **Net Cash Surplus:** ${formatCurrency(actualNetCash, currency)}

## 4. Key Risk Mitigations & Strategy
${analysis.riskFlags.map((r) => `- [Risk Alert] ${r}`).join("\n")}
${analysis.positiveHighlights.map((h) => `- [Advantage] ${h}`).join("\n")}
`;
  };

  const handleCopyMarkdown = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(generateMarkdownSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 print:p-0 print:border-none print:bg-white print:text-black">
        {/* Top Controls (Hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-white">
              Investor & Grant Pitch Deck Summary
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Report"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-400 cursor-pointer shadow-md shadow-emerald-500/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="space-y-6 print:space-y-4">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 print:border-black">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 print:text-emerald-700">
                SMBP FinHack 2026 • Financial Feasibility Report
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black">
                {inputs.name}
              </h2>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                Category: <strong>{inputs.category}</strong> • Currency: <strong>{currency}</strong> • Evaluated on: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 print:border-black print:bg-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center font-black text-xl text-emerald-400 print:text-emerald-700">
                <span>{analysis.grade}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 print:text-slate-700 uppercase">
                  Viability Score
                </p>
                <p className="text-sm font-extrabold text-white print:text-black">
                  {analysis.healthScore} / 100
                </p>
              </div>
            </div>
          </div>

          {/* Unit Economics Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>1. Corporate Unit Economics & Margin Breakdown</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Selling Price (P)</span>
                <p className="font-mono font-bold text-white print:text-black text-sm mt-0.5">
                  {formatCurrency(inputs.sellingPrice, currency)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Variable Cost (V)</span>
                <p className="font-mono font-bold text-rose-400 print:text-red-700 text-sm mt-0.5">
                  {formatCurrency(inputs.variableCostPerUnit, currency)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Contribution Margin</span>
                <p className="font-mono font-bold text-emerald-400 print:text-emerald-700 text-sm mt-0.5">
                  {formatCurrency(analysis.unitContributionMargin, currency)} ({formatPercent(analysis.contributionMarginRatio)})
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Fixed Overhead (F)</span>
                <p className="font-mono font-bold text-amber-400 print:text-amber-800 text-sm mt-0.5">
                  {formatCurrency(inputs.fixedMonthlyCosts, currency)}/mo
                </p>
              </div>
            </div>
          </div>

          {/* Solvency & Performance Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>2. Break-Even & Student Labor Return</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Break-Even Volume</span>
                <p className="font-mono font-bold text-white print:text-black text-sm mt-0.5">
                  {analysis.breakEvenUnits} units/mo
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Monthly Net Profit</span>
                <p className="font-mono font-bold text-emerald-400 print:text-emerald-700 text-sm mt-0.5">
                  {formatCurrency(analysis.monthlyNetProfit, currency)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Student Real Wage</span>
                <p className="font-mono font-bold text-cyan-400 print:text-cyan-800 text-sm mt-0.5">
                  {formatCurrency(analysis.realHourlyWage, currency)}/hr
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Emergency Runway</span>
                <p className="font-mono font-bold text-white print:text-black text-sm mt-0.5">
                  {analysis.cashRunwayMonths.toFixed(1)} Months
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Ledger Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>3. Real Operating Ledger Performance</span>
            </h4>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 print:border-gray-300 print:bg-gray-50 flex items-center justify-around text-xs">
              <div className="text-center">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Recorded Inflow</span>
                <p className="font-mono font-bold text-emerald-400 print:text-emerald-700 text-base mt-0.5">
                  {formatCurrency(totalInflow, currency)}
                </p>
              </div>
              <div className="text-center border-x border-slate-800 print:border-gray-300 px-6">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Recorded Outflow</span>
                <p className="font-mono font-bold text-rose-400 print:text-red-700 text-base mt-0.5">
                  {formatCurrency(totalOutflow, currency)}
                </p>
              </div>
              <div className="text-center">
                <span className="text-slate-400 print:text-gray-600 text-[10px]">Net Cash Surplus</span>
                <p className="font-mono font-bold text-cyan-400 print:text-cyan-800 text-base mt-0.5">
                  {formatCurrency(actualNetCash, currency)}
                </p>
              </div>
            </div>
          </div>

          {/* Strategic Risk Assessment */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>4. Strategic Risk Management</span>
            </h4>
            <div className="space-y-1.5 text-[11px] print:text-xs">
              {analysis.riskFlags.map((risk, idx) => (
                <p key={idx} className="text-rose-300 print:text-red-800">
                  • <strong>Risk:</strong> {risk}
                </p>
              ))}
              {analysis.positiveHighlights.map((hi, idx) => (
                <p key={idx} className="text-emerald-300 print:text-emerald-800">
                  • <strong>Advantage:</strong> {hi}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
