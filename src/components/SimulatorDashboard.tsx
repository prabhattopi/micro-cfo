"use client";

import { useState } from "react";
import { HustleInputs, CurrencyCode, HustlePreset } from "@/types/finance";
import { calculateFinancials, MIN_HOURLY_WAGE_BENCHMARKS, convertHustleInputs } from "@/lib/cfo-math";
import { STUDENT_HUSTLE_PRESETS } from "@/data/hustle-presets";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { PresetSelector } from "@/components/PresetSelector";
import { MetricCard } from "@/components/MetricCard";
import { BreakEvenBar } from "@/components/BreakEvenBar";
import { SensitivityTable } from "@/components/SensitivityTable";
import { CustomIdeaModal } from "@/components/CustomIdeaModal";
import {
  DollarSign,
  TrendingUp,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Award,
  Sparkles,
  Edit2,
} from "lucide-react";

interface SimulatorDashboardProps {
  inputs: HustleInputs;
  setInputs: React.Dispatch<React.SetStateAction<HustleInputs>>;
  selectedPresetId: string | null;
  setSelectedPresetId: (id: string | null) => void;
  currency: CurrencyCode;
  onNavigateToAI: () => void;
}

export function SimulatorDashboard({
  inputs,
  setInputs,
  selectedPresetId,
  setSelectedPresetId,
  currency,
  onNavigateToAI,
}: SimulatorDashboardProps) {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const analysis = calculateFinancials({ ...inputs, currency });
  const campusWageBenchmark = MIN_HOURLY_WAGE_BENCHMARKS[currency] || 15.0;

  // Currency-aware dynamic slider bounds
  const priceMax = currency === "INR" ? 10000 : currency === "HKD" ? 2500 : 350;
  const priceStep = currency === "INR" ? 25 : currency === "HKD" ? 5 : 0.5;
  const overheadMax = currency === "INR" ? 25000 : currency === "HKD" ? 5000 : 600;
  const overheadStep = currency === "INR" ? 100 : currency === "HKD" ? 25 : 5;

  // Handle Preset Selection
  const handleSelectPreset = (preset: HustlePreset) => {
    setSelectedPresetId(preset.id);
    const converted = convertHustleInputs(preset.defaultInputs, currency);
    setInputs(converted);
  };

  const handleCustomHustle = () => {
    setIsCustomModalOpen(true);
  };

  const handleApplyBlueprint = (blueprint: HustleInputs) => {
    setSelectedPresetId("custom");
    setInputs(blueprint);
  };

  const updateInput = <K extends keyof HustleInputs>(field: K, value: HustleInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Grade color helper
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 ring-emerald-500/20";
      case "B":
        return "text-teal-400 bg-teal-500/10 border-teal-500/30 ring-teal-500/20";
      case "C":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30 ring-amber-500/20";
      case "D":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30 ring-orange-500/20";
      default:
        return "text-rose-400 bg-rose-500/10 border-rose-500/30 ring-rose-500/20";
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Preset Selector */}
      <PresetSelector
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onCustomHustle={handleCustomHustle}
        currency={currency}
      />

      {/* Custom Idea Modal */}
      <CustomIdeaModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        currency={currency}
        onApplyBlueprint={handleApplyBlueprint}
      />

      {/* 2. Top Executive Summary Banner & Health Score */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {inputs.category}
              </span>
              <span className="text-xs text-slate-400">Micro-Business Model</span>
              <button
                onClick={() => setIsCustomModalOpen(true)}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 ml-2 cursor-pointer bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 transition-all hover:bg-emerald-500/20"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Generate Any Idea</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={inputs.name}
                  onChange={(e) => updateInput("name", e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                  autoFocus
                  className="text-2xl sm:text-3xl font-extrabold text-white bg-slate-950 border border-emerald-500 px-3 py-1 rounded-xl focus:outline-none"
                />
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 cursor-pointer group hover:text-emerald-300 transition-colors"
                  title="Click to rename"
                >
                  <span>{inputs.name}</span>
                  <Edit2 className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h2>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Targeting {inputs.monthlyVolumeTarget} sales/month at {formatCurrency(inputs.sellingPrice, currency)} per unit.
              Calculated real net profitability and student wage return below.
            </p>
          </div>

          {/* Health Score Badge */}
          <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div
              className={`w-16 h-16 rounded-2xl border ring-4 flex flex-col items-center justify-center font-black text-2xl ${getGradeColor(
                analysis.grade
              )}`}
            >
              <span>{analysis.grade}</span>
              <span className="text-[9px] font-mono tracking-tighter opacity-80">
                {analysis.healthScore}/100
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Financial Viability</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {analysis.grade === "A+" || analysis.grade === "A"
                  ? "Highly Sustainable Model"
                  : analysis.grade === "B"
                  ? "Solid, Room for Margin Optimization"
                  : analysis.grade === "C"
                  ? "Fragile: Tight Margins"
                  : "High Risk: Operating Insolvent"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Scorecard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monthly Net Profit"
          value={formatCurrency(analysis.monthlyNetProfit, currency)}
          subValue={`Net Margin: ${formatPercent(analysis.netProfitMargin)}`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={analysis.monthlyNetProfit > 0 ? "positive" : "negative"}
          badge={analysis.monthlyNetProfit > 0 ? "Profitable" : "Operating Loss"}
        />

        <MetricCard
          title="Unit Contribution Margin"
          value={formatCurrency(analysis.unitContributionMargin, currency)}
          subValue={`Margin Ratio: ${formatPercent(analysis.contributionMarginRatio)}`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={analysis.unitContributionMargin > 0 ? "positive" : "negative"}
          badge={`${formatPercent(analysis.contributionMarginRatio)} margin`}
        />

        <MetricCard
          title="Real Hourly Wage"
          value={`${formatCurrency(analysis.realHourlyWage, currency)}/hr`}
          subValue={`Campus Base: ${formatCurrency(campusWageBenchmark, currency)}/hr`}
          icon={<Clock className="w-5 h-5" />}
          trend={analysis.isWageAboveCampusMinimum ? "positive" : "negative"}
          badge={analysis.isWageAboveCampusMinimum ? "Beats Campus Wage" : "Below Minimum"}
        />

        <MetricCard
          title="Emergency Cash Runway"
          value={analysis.cashRunwayMonths >= 99 ? "∞ Runway" : `${analysis.cashRunwayMonths.toFixed(1)} Mos`}
          subValue={`Fixed Burn: ${formatCurrency(inputs.fixedMonthlyCosts, currency)}/mo`}
          icon={<Flame className="w-5 h-5 text-amber-400" />}
          trend={analysis.cashRunwayMonths >= 3 ? "positive" : "neutral"}
          badge={analysis.cashRunwayMonths >= 3 ? "Safe Buffer" : "Lean Buffer"}
        />
      </div>

      {/* 4. Interactive Simulator Sliders & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Unit Economics & Cost Controls</span>
            </h3>
            <span className="text-[11px] text-slate-400">Drag sliders to simulate outcomes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Selling Price */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Selling Price (P)</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {formatCurrency(inputs.sellingPrice, currency)}
                </span>
              </div>
              <input
                type="range"
                min={priceStep}
                max={Math.max(priceMax, inputs.sellingPrice * 1.5)}
                step={priceStep}
                value={inputs.sellingPrice}
                onChange={(e) => updateInput("sellingPrice", parseFloat(e.target.value) || 0)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Retail price charged to customer</p>
            </div>

            {/* Variable Cost */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Variable Cost / Unit (V)</span>
                <span className="font-mono text-rose-400 font-bold">
                  {formatCurrency(inputs.variableCostPerUnit, currency)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(priceMax * 0.8, inputs.sellingPrice * 1.2)}
                step={priceStep}
                value={inputs.variableCostPerUnit}
                onChange={(e) => updateInput("variableCostPerUnit", parseFloat(e.target.value) || 0)}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Ingredients, blanks, packaging, shipping</p>
            </div>

            {/* Monthly Volume Target */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Monthly Volume Target (Q)</span>
                <span className="font-mono text-cyan-400 font-bold">{inputs.monthlyVolumeTarget} units</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                step="1"
                value={inputs.monthlyVolumeTarget}
                onChange={(e) => updateInput("monthlyVolumeTarget", parseInt(e.target.value) || 1)}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Number of orders/clients per month</p>
            </div>

            {/* Fixed Monthly Overhead */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Fixed Monthly Overhead (F)</span>
                <span className="font-mono text-amber-400 font-bold">
                  {formatCurrency(inputs.fixedMonthlyCosts, currency)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(overheadMax, inputs.fixedMonthlyCosts * 1.5)}
                step={overheadStep}
                value={inputs.fixedMonthlyCosts}
                onChange={(e) => updateInput("fixedMonthlyCosts", parseFloat(e.target.value) || 0)}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Subscriptions (Adobe/Canva), stall rent, tools</p>
            </div>

            {/* Hours per unit */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Hours Invested / Unit (H)</span>
                <span className="font-mono text-indigo-400 font-bold">{inputs.hoursPerUnit} hrs</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={inputs.hoursPerUnit}
                onChange={(e) => updateInput("hoursPerUnit", parseFloat(e.target.value) || 0.1)}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Production, editing, or fulfillment time</p>
            </div>

            {/* Platform Take-rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Platform & Payment Take-Rate</span>
                <span className="font-mono text-purple-400 font-bold">
                  {formatPercent(inputs.platformFeePercent)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.20"
                step="0.005"
                value={inputs.platformFeePercent}
                onChange={(e) => updateInput("platformFeePercent", parseFloat(e.target.value) || 0)}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">PayMe/FPS (1.5%), Stripe (3%), Etsy (6.5%)</p>
            </div>
          </div>
        </div>

        {/* Live Diagnostics & Reality Check Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Break-even bar */}
          <BreakEvenBar
            targetUnits={inputs.monthlyVolumeTarget}
            breakEvenUnits={analysis.breakEvenUnits}
            unitContributionMargin={analysis.unitContributionMargin}
          />

          {/* Risk Warnings & Positive Highlights */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Diagnostic Insights & Red Flags</span>
            </h4>

            {analysis.riskFlags.length > 0 && (
              <div className="space-y-2">
                {analysis.riskFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            )}

            {analysis.positiveHighlights.length > 0 && (
              <div className="space-y-2">
                {analysis.positiveHighlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            )}

            {/* AI Stress-Test Call to Action */}
            <div className="pt-2">
              <button
                onClick={onNavigateToAI}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Stress-Test this Model with Gemini AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Sensitivity Matrix Table */}
      <SensitivityTable inputs={inputs} currency={currency} />
    </div>
  );
}
