"use client";

import { useState } from "react";
import { HustleInputs, FinancialAnalysis, CurrencyCode } from "@/types/finance";
import { HustleAIAnalysisResponse, ReceiptScanResponse } from "@/types/ai";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Receipt,
  Key,
  Flame,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Zap,
} from "lucide-react";

interface AICopilotTabProps {
  inputs: HustleInputs;
  analysis: FinancialAnalysis;
  currency: CurrencyCode;
  onAddTransactionFromReceipt?: (scan: ReceiptScanResponse) => void;
}

export function AICopilotTab({
  inputs,
  analysis,
  currency,
  onAddTransactionFromReceipt,
}: AICopilotTabProps) {
  // State for AI Stress-Test
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<HustleAIAnalysisResponse | null>(null);

  // State for Receipt Scan
  const [loadingReceipt, setLoadingReceipt] = useState(false);
  const [receiptScan, setReceiptScan] = useState<ReceiptScanResponse | null>(null);
  const [receiptImagePreview, setReceiptImagePreview] = useState<string | null>(null);

  // API Key drawer / modal state
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKey, setCustomKey] = useState("");
  const [keySavedStatus, setKeySavedStatus] = useState<string | null>(null);

  // Save custom key in localStorage
  const handleSaveKey = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("microcfo_gemini_key", customKey);
      setKeySavedStatus("Key saved locally for this browser session!");
      setTimeout(() => setKeySavedStatus(null), 3000);
      setShowKeyModal(false);
    }
  };

  const getActiveKey = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("microcfo_gemini_key") || "";
    }
    return "";
  };

  // Run AI Stress-Test
  const handleRunStressTest = async () => {
    setLoadingAnalysis(true);
    try {
      const activeKey = getActiveKey();
      const res = await fetch("/api/ai/analyze-hustle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs,
          analysis,
          clientApiKey: activeKey,
        }),
      });
      const data: HustleAIAnalysisResponse = await res.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error("Failed to run AI analysis:", err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Run Receipt Scan with Sample or Uploaded Image
  const handleScanReceipt = async (base64Img?: string) => {
    setLoadingReceipt(true);
    try {
      const activeKey = getActiveKey();
      const res = await fetch("/api/ai/scan-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Img || "",
          mimeType: "image/jpeg",
          clientApiKey: activeKey,
        }),
      });
      const data: ReceiptScanResponse = await res.json();
      setReceiptScan(data);
    } catch (err) {
      console.error("Failed to scan receipt:", err);
    } finally {
      setLoadingReceipt(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setReceiptImagePreview(result);
      handleScanReceipt(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Banner & API Key Management */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Powered by Google Gemini 2.0 / Flash
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            AI Risk Auditor & Virtual Fractional CFO
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Auditing <span className="text-emerald-400 font-semibold">{inputs.name}</span>. Gemini inspects hidden campus failure modes, regulatory traps, and extracts physical receipts into structured accounting data.
          </p>
        </div>

        <button
          onClick={() => setShowKeyModal(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span>Configure Gemini Key</span>
        </button>
      </div>

      {/* SECTION 1: The AI Risk Stress-Tester */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <span>Hustle Stress-Tester & Vulnerability Audit</span>
            </h3>
            <p className="text-xs text-slate-400">
              Runs deep scenario analysis on your {formatCurrency(inputs.sellingPrice, currency)} pricing and {inputs.monthlyVolumeTarget} unit targets.
            </p>
          </div>

          <button
            onClick={handleRunStressTest}
            disabled={loadingAnalysis}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            {loadingAnalysis ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Model with Gemini...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>{aiAnalysis ? "Re-Run Stress-Test" : "Run Gemini Stress-Test"}</span>
              </>
            )}
          </button>
        </div>

        {/* AI Analysis Results View */}
        {aiAnalysis ? (
          <div className="space-y-6">
            {/* Executive Verdict Box */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  CFO Executive Verdict
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Model: {aiAnalysis.modelUsed} {aiAnalysis.isMock && "(Simulation)"}
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                "{aiAnalysis.cfoExecutiveVerdict}"
              </p>
            </div>

            {/* 3 Hidden Risks & 3 Tactical Directives */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Hidden Risks */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Hidden Campus Risks Identified</span>
                </h4>

                <div className="space-y-3">
                  {aiAnalysis.hiddenRisks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-200">{risk.riskTitle}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-rose-500/20 text-rose-300">
                          {risk.severity} Severity
                        </span>
                      </div>
                      <p className="text-xs text-rose-300/80 leading-relaxed">{risk.explanation}</p>
                      <div className="pt-1 text-[11px] text-emerald-400 flex items-start gap-1">
                        <span className="font-bold">Fix:</span>
                        <span>{risk.preventiveMitigation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Tactical Directives */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Tactical Profit Levers (+20% Margin)</span>
                </h4>

                <div className="space-y-3">
                  {aiAnalysis.tacticalDirectives.map((directive, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-200">{directive.title}</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400">
                          {directive.expectedProfitImpact}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{directive.actionableStep}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stress Scenarios */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                <span>"What If?" Crisis Stress-Testing</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aiAnalysis.stressScenarios.map((scen, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{scen.scenarioName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          scen.survivalStatus === "SURVIVES"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-rose-500/20 text-rose-400"
                        }`}
                      >
                        {scen.survivalStatus}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-300">
                      Adjusted Monthly Net:{" "}
                      <span className="font-bold text-emerald-400">
                        {formatCurrency(scen.adjustedMonthlyNetProfit, currency)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{scen.cfoSurvivalAdvice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Empty placeholder before run */
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-emerald-400/60 mx-auto" />
            <h4 className="text-sm font-bold text-slate-200">
              Run Gemini AI Stress-Test on {inputs.name}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Examine vulnerability to exam season dips, platform chargebacks, and price sensitivity before investing real capital.
            </p>
            <button
              onClick={handleRunStressTest}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              Start Instant Analysis
            </button>
          </div>
        )}
      </div>

      {/* SECTION 2: Smart Receipt & Invoice OCR Scanner */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-cyan-400" />
            <span>Multimodal Receipt & Invoice Scanner</span>
          </h3>
          <p className="text-xs text-slate-400">
            Upload ingredient, tool, or packaging bills. Gemini vision extracts individual line items and classifies them for your cash ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Upload Box (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 text-center space-y-3 transition-colors bg-slate-950/50">
              <Upload className="w-8 h-8 text-cyan-400/60 mx-auto" />
              <div>
                <p className="text-xs font-bold text-slate-200">Upload Receipt or Invoice</p>
                <p className="text-[10px] text-slate-500">Supports JPG, PNG, Screenshots</p>
              </div>
              <label className="inline-block px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 cursor-pointer transition-all">
                Browse Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">No receipt on hand?</span>
              <button
                onClick={() => handleScanReceipt()}
                disabled={loadingReceipt}
                className="text-[11px] text-cyan-400 hover:underline font-medium cursor-pointer"
              >
                Load Sample Bakery Invoice
              </button>
            </div>

            {receiptImagePreview && (
              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-48">
                <img
                  src={receiptImagePreview}
                  alt="Receipt Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Right: Extracted Accounting Items (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Parsed Line-Items
              </span>
              {loadingReceipt && (
                <span className="text-xs text-cyan-400 flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini Vision Extracting...</span>
                </span>
              )}
            </div>

            {receiptScan ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-bold text-white">{receiptScan.merchantName}</h5>
                    <p className="text-[10px] text-slate-400">Date: {receiptScan.date}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {receiptScan.category}
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {receiptScan.lineItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 text-xs"
                    >
                      <span className="text-slate-300">{item.name}</span>
                      <span className="font-mono font-bold text-white">
                        {formatCurrency(item.price, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Total Extracted:</span>
                  <span className="text-base font-extrabold font-mono text-emerald-400">
                    {formatCurrency(receiptScan.totalAmount, currency)}
                  </span>
                </div>

                {onAddTransactionFromReceipt && (
                  <button
                    onClick={() => onAddTransactionFromReceipt(receiptScan)}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-cyan-400 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sync Directly to Cash Ledger</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Upload a bill or click "Load Sample Bakery Invoice" to view AI extraction.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API Key Modal / Drawer */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Google Gemini API Key</span>
              </h4>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini offers a <strong>100% free API tier</strong> with generous RPM. You can generate a free key in under 30 seconds:
            </p>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span>Get Free Key at Google AI Studio</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Paste Gemini API Key:</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Key is stored only in your local browser storage for testing.
              </p>
            </div>

            {keySavedStatus && (
              <p className="text-xs text-emerald-400 font-medium">{keySavedStatus}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
