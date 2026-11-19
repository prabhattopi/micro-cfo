"use client";

import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: ReactNode;
  trend?: "positive" | "negative" | "neutral";
  tooltip?: string;
  badge?: string;
}

export function MetricCard({
  title,
  value,
  subValue,
  icon,
  trend = "neutral",
  badge,
}: MetricCardProps) {
  const trendColor =
    trend === "positive"
      ? "text-emerald-400"
      : trend === "negative"
      ? "text-rose-400"
      : "text-slate-300";

  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="p-2 rounded-xl bg-slate-800/60 text-slate-300 group-hover:text-emerald-400 transition-colors">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className={`text-2xl font-extrabold tracking-tight ${trendColor}`}>
          {value}
        </span>
        {badge && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              trend === "positive"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : trend === "negative"
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {subValue && (
        <p className="text-xs text-slate-400 font-medium">{subValue}</p>
      )}
    </div>
  );
}
