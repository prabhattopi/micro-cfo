"use client";

import { useState } from "react";
import { CurrencyCode, HustleInputs } from "@/types/finance";
import { Sparkles, RefreshCw, Lightbulb, ArrowRight, X } from "lucide-react";

interface CustomIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onApplyBlueprint: (inputs: HustleInputs) => void;
}

export function CustomIdeaModal({
  isOpen,
  onClose,
  currency,
  onApplyBlueprint,
}: CustomIdeaModalProps) {
  const [ideaPrompt, setIdeaPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickIdeas = [
    "Dorm Cold-Brew Coffee delivery",
    "3D printed custom keyboard keycaps",
    "Weekend bicycle puncture & chain repair",
    "Curated exam notes & visual study sheets",
  ];

  const handleGenerate = async (promptToUse?: string) => {
    const finalPrompt = promptToUse || ideaPrompt;
    if (!finalPrompt.trim()) {
      setError("Please describe your side-hustle idea first!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check for local API key if stored
      const localKey = typeof window !== "undefined" ? localStorage.getItem("microcfo_gemini_key") || "" : "";

      const res = await fetch("/api/ai/generate-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaPrompt: finalPrompt,
          currency,
          clientApiKey: localKey,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate model");
      }

      const data = await res.json();

      onApplyBlueprint({
        name: data.name,
        category: data.category,
        currency: data.currency || currency,
        sellingPrice: Number(data.sellingPrice),
        variableCostPerUnit: Number(data.variableCostPerUnit),
        platformFeePercent: Number(data.platformFeePercent),
        fixedPaymentFee: Number(data.fixedPaymentFee),
        fixedMonthlyCosts: Number(data.fixedMonthlyCosts),
        hoursPerUnit: Number(data.hoursPerUnit),
        monthlyVolumeTarget: Number(data.monthlyVolumeTarget),
        initialCapital: Number(data.initialCapital),
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">AI Blueprint Generator</h3>
              <p className="text-[11px] text-slate-400">Turn any raw side-hustle idea into a full financial model</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            What side-hustle do you want to launch?
          </label>
          <textarea
            rows={3}
            value={ideaPrompt}
            onChange={(e) => {
              setIdeaPrompt(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Selling cold-brew coffee bottles in student halls every morning before 9 AM..."
            className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none"
          />
          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>Or pick a student idea to simulate:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickIdeas.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIdeaPrompt(chip);
                  handleGenerate(chip);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border border-slate-700/60 text-slate-300 transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 disabled:opacity-50 cursor-pointer transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemini Calculating Unit Economics...</span>
              </>
            ) : (
              <>
                <span>Generate Full Model</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
