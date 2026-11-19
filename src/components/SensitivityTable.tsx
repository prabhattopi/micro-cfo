"use client";

import { generateSensitivityMatrix } from "@/lib/cfo-math";
import { HustleInputs, CurrencyCode } from "@/types/finance";
import { formatCurrency } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

interface SensitivityTableProps {
  inputs: HustleInputs;
  currency: CurrencyCode;
}

export function SensitivityTable({ inputs, currency }: SensitivityTableProps) {
  const matrix = generateSensitivityMatrix(inputs);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Price Elasticity & Sensitivity Matrix
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">Impact of changing selling price</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Scenario</th>
              <th className="py-2.5 px-3">Price</th>
              <th className="py-2.5 px-3">Monthly Net Profit</th>
              <th className="py-2.5 px-3">Break-Even Point</th>
              <th className="py-2.5 px-3">Real Hourly Wage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {matrix.map((row) => {
              const isBaseCase = row.priceChangePercent === 0;
              const isProfitable = row.netProfit > 0;

              return (
                <tr
                  key={row.priceChangePercent}
                  className={`transition-colors ${
                    isBaseCase
                      ? "bg-emerald-500/10 font-semibold text-white"
                      : "hover:bg-slate-800/30 text-slate-300"
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                        isBaseCase
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : row.priceChangePercent > 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {row.priceChangePercent > 0 ? `+${row.priceChangePercent}%` : `${row.priceChangePercent}%`}
                      {isBaseCase && " (Current)"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {formatCurrency(row.newPrice, currency)}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className={isProfitable ? "text-emerald-400 font-bold" : "text-rose-400"}>
                      {formatCurrency(row.netProfit, currency)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">
                    {row.breakEvenUnits !== null ? `${row.breakEvenUnits} units` : "Insolvent"}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">
                    {formatCurrency(row.realHourlyWage, currency)}/hr
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
