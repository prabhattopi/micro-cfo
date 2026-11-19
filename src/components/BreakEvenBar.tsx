"use client";

import { Target, CheckCircle2, AlertOctagon } from "lucide-react";

interface BreakEvenBarProps {
  targetUnits: number;
  breakEvenUnits: number;
  unitContributionMargin: number;
}

export function BreakEvenBar({
  targetUnits,
  breakEvenUnits,
  unitContributionMargin,
}: BreakEvenBarProps) {
  if (unitContributionMargin <= 0) {
    return (
      <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/50 text-rose-300 flex items-center gap-3">
        <AlertOctagon className="w-5 h-5 flex-shrink-0 text-rose-400" />
        <div className="text-xs">
          <p className="font-bold">Break-Even Impossible (Negative Unit Margin)</p>
          <p className="text-rose-400/80">
            Each sale costs more than its selling price. You cannot reach break-even regardless of sales volume.
          </p>
        </div>
      </div>
    );
  }

  // Calculate percentage of target achieved relative to break-even
  const maxScale = Math.max(breakEvenUnits * 1.5, targetUnits * 1.2, 10);
  const breakEvenPercent = Math.min(100, (breakEvenUnits / maxScale) * 100);
  const targetPercent = Math.min(100, (targetUnits / maxScale) * 100);
  const isProfitable = targetUnits >= breakEvenUnits;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Break-Even Volume Visualizer
          </h4>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
            isProfitable
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          {isProfitable ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Profitable (+{targetUnits - breakEvenUnits} units)</span>
            </>
          ) : (
            <>
              <span>Gap: -{breakEvenUnits - targetUnits} units</span>
            </>
          )}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
        {/* Progress fill */}
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isProfitable
              ? "bg-gradient-to-r from-teal-500 to-emerald-400 shadow-md shadow-emerald-500/30"
              : "bg-gradient-to-r from-rose-500 to-amber-500"
          }`}
          style={{ width: `${targetPercent}%` }}
        />

        {/* Break-Even Marker Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${breakEvenPercent}%` }}
        />
      </div>

      {/* Metric Labels */}
      <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
        <div>
          <span>Target Volume: </span>
          <span className="font-bold text-white">{targetUnits} units/mo</span>
        </div>
        <div className="text-right">
          <span>Break-Even Threshold: </span>
          <span className="font-bold text-emerald-400">{breakEvenUnits} units</span>
        </div>
      </div>
    </div>
  );
}
