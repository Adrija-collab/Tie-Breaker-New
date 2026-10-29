import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, ArrowRight, Sliders, ChevronDown, ChevronUp, Shuffle } from 'lucide-react';
import { PRESET_DILEMMAS, PresetDilemma } from '../data/presets';

interface DecisionInputProps {
  title: string;
  setTitle: (t: string) => void;
  options: string[];
  setOptions: React.Dispatch<React.SetStateAction<string[]>>;
  context: string;
  setContext: (c: string) => void;
  priorities: string[];
  setPriorities: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: PresetDilemma) => void;
}

export const DecisionInput: React.FC<DecisionInputProps> = ({
  title,
  setTitle,
  options,
  setOptions,
  context,
  setContext,
  priorities,
  setPriorities,
  onSubmit,
  isLoading,
  onSelectPreset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [newPriority, setNewPriority] = useState('');

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}`]);
    }
  };

  const handleUpdateOption = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleAddPriority = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newPriority.trim()) {
      e.preventDefault();
      if (!priorities.includes(newPriority.trim())) {
        setPriorities([...priorities, newPriority.trim()]);
      }
      setNewPriority('');
    }
  };

  const handleRemovePriority = (p: string) => {
    setPriorities(priorities.filter((item) => item !== p));
  };

  const handleSuggest = async () => {
    if (!title.trim()) return;
    setIsSuggesting(true);
    try {
      const res = await fetch('/api/tiebreaker/quick-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dilemma: title }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.suggestedOptions && data.suggestedOptions.length >= 2) {
          setOptions(data.suggestedOptions);
        }
        if (data.suggestedPriorities && data.suggestedPriorities.length > 0) {
          setPriorities(data.suggestedPriorities);
        }
        setShowAdvanced(true);
      }
    } catch (err) {
      console.error('Failed to get suggestions', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const isFormValid = title.trim().length > 3 && options.filter((o) => o.trim().length > 0).length >= 2;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-7 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>What decision are you wrestling with?</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Frame your dilemma clearly. The Tiebreaker will stress-test every angle with Pros & Cons, Comparison Matrix, and SWOT.
          </p>
        </div>

        {title.trim().length > 5 && (
          <button
            type="button"
            onClick={handleSuggest}
            disabled={isSuggesting}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSuggesting ? 'animate-spin' : ''}`} />
            <span>{isSuggesting ? 'Brainstorming...' : 'Suggest Options & Criteria'}</span>
          </button>
        )}
      </div>

      {/* Main Dilemma Input */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Decision Title / Question <span className="text-amber-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Should I accept the startup offer or stay at my stable corporate role?"
            className="w-full bg-slate-950/70 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 text-sm sm:text-base outline-none transition-all"
          />
        </div>
      </div>

      {/* Options Builder */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Options under consideration</span>
            <span className="text-[11px] font-normal text-slate-400">({options.length} options)</span>
          </label>
          {options.length < 5 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Option</span>
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 group">
              <span className="w-7 h-7 shrink-0 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-700">
                {String.fromCharCode(65 + idx)}
              </span>
              <input
                type="text"
                value={opt}
                onChange={(e) => handleUpdateOption(idx, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                className="flex-1 bg-slate-950/50 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Remove this option"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Drawer: Context & Priorities */}
      <div className="mb-6 border-t border-slate-800/80 pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors py-1"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Context, Constraints & Decision Priorities (Optional)</span>
            {(context || priorities.length > 0) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 ml-1 inline-block" />
            )}
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-1">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Constraints, Timeline, or Financial details
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={2}
                placeholder="e.g. Budget is $15k; must decide by Friday; have a 9-month emergency fund; value low stress over maximum salary."
                className="w-full bg-slate-950/50 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Key Decision Priorities (Press Enter to add tags)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950/50 border border-slate-700/80 rounded-xl min-h-[42px]">
                {priorities.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs bg-slate-800 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-md"
                  >
                    <span>{p}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePriority(p)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  onKeyDown={handleAddPriority}
                  placeholder={priorities.length === 0 ? "e.g. Work-life balance, Upside, Low risk" : "Add more..."}
                  className="bg-transparent border-none text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none flex-1 min-w-[140px] px-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preset Pills */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-500 font-medium mr-1">Try example:</span>
        {PRESET_DILEMMAS.slice(0, 3).map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPreset(preset)}
            className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700/60 px-2.5 py-1 rounded-lg transition-all truncate max-w-[220px]"
            title={preset.title}
          >
            {preset.category}: {preset.title.split('vs')[0]}...
          </button>
        ))}
      </div>

      {/* Submit Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400 text-center sm:text-left">
          {!isFormValid && (
            <span>Please enter a decision question and at least 2 distinct options to evaluate.</span>
          )}
          {isFormValid && (
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ready to break the tie
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!isFormValid || isLoading}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Decisions & Synthesizing SWOT...</span>
            </>
          ) : (
            <>
              <span>Run The Tiebreaker</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
