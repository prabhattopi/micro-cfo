"use client";

import { STUDENT_HUSTLE_PRESETS } from "@/data/hustle-presets";
import { HustlePreset } from "@/types/finance";
import { Cookie, Video, Shirt, ShoppingBag, GraduationCap, PlusCircle } from "lucide-react";

interface PresetSelectorProps {
  selectedPresetId: string | null;
  onSelectPreset: (preset: HustlePreset) => void;
  onCustomHustle: () => void;
}

export function PresetSelector({
  selectedPresetId,
  onSelectPreset,
  onCustomHustle,
}: PresetSelectorProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Cookie":
        return <Cookie className="w-4 h-4 text-amber-400" />;
      case "Video":
        return <Video className="w-4 h-4 text-purple-400" />;
      case "Shirt":
        return <Shirt className="w-4 h-4 text-cyan-400" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-4 h-4 text-rose-400" />;
      case "GraduationCap":
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      default:
        return <Cookie className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Campus Hustle Blueprints
        </label>
        <span className="text-[11px] text-emerald-400 font-medium">Click to load realistic cost models</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {STUDENT_HUSTLE_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between group ${
                isSelected
                  ? "bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                  : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-slate-800/80 group-hover:scale-110 transition-transform">
                  {getIcon(preset.iconName)}
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {preset.defaultInputs.currency} ${preset.defaultInputs.sellingPrice}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-100 line-clamp-1">{preset.title}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{preset.category}</p>
              </div>
            </button>
          );
        })}

        {/* Custom Hustle Option */}
        <button
          onClick={onCustomHustle}
          className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between group ${
            selectedPresetId === "custom"
              ? "bg-emerald-500/10 border-emerald-500 text-white ring-1 ring-emerald-500/30"
              : "bg-slate-900/30 border-dashed border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
          }`}
        >
          <div className="p-1.5 rounded-lg bg-slate-800/80 w-fit mb-2 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-semibold text-xs">Custom Idea</h4>
            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">Start blank model</p>
          </div>
        </button>
      </div>
    </div>
  );
}
