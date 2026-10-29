import React from 'react';
import { Scale, History, PlusCircle, Sparkles } from 'lucide-react';
import { PRESET_DILEMMAS, PresetDilemma } from '../data/presets';

interface NavbarProps {
  onSelectPreset: (preset: PresetDilemma) => void;
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectPreset,
  onOpenHistory,
  historyCount,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                The Tiebreaker
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                AI Decision Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Cut through paralysis with Pros & Cons, Matrix, and SWOT
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Preset dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/80 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Preset</span>
            </button>
            <div className="absolute right-0 mt-1 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 hidden group-hover:block hover:block z-50 animate-in fade-in slide-in-from-top-1">
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Sample Dilemmas
              </div>
              {PRESET_DILEMMAS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPreset(preset)}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-700/70 hover:text-amber-300 transition-colors flex flex-col gap-0.5"
                >
                  <span className="font-medium truncate">{preset.title}</span>
                  <span className="text-[10px] text-slate-400">{preset.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* History button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/80 transition-colors relative"
            title="Saved Decisions History"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Reset / New Decision */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-3.5 py-1.5 rounded-lg shadow-sm shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Decision</span>
          </button>
        </div>
      </div>
    </header>
  );
};
