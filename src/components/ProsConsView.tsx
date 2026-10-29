import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Plus, Trash2, Tag, TrendingUp, Info } from 'lucide-react';
import { OptionAnalysis, ProConItem } from '../types';

interface ProsConsViewProps {
  optionsAnalysis: OptionAnalysis[];
  onUpdateOptionAnalysis?: (updated: OptionAnalysis[]) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  optionsAnalysis,
  onUpdateOptionAnalysis,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [addingTo, setAddingTo] = useState<{ optionIdx: number; type: 'pro' | 'con' } | null>(null);
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newImpact, setNewImpact] = useState(3);

  // Collect unique categories across all pros & cons
  const categories = React.useMemo(() => {
    const set = new Set<string>(['All']);
    optionsAnalysis.forEach((opt) => {
      opt.pros.forEach((p) => set.add(p.category));
      opt.cons.forEach((c) => set.add(c.category));
    });
    return Array.from(set);
  }, [optionsAnalysis]);

  const handleAddCustomItem = (optionIdx: number, type: 'pro' | 'con') => {
    if (!newText.trim() || !onUpdateOptionAnalysis) return;

    const updated = [...optionsAnalysis];
    const targetOption = { ...updated[optionIdx] };

    const newItem: ProConItem = {
      text: newText.trim(),
      category: newCategory.trim() || 'Custom',
      impact: Number(newImpact) || 3,
    };

    if (type === 'pro') {
      targetOption.pros = [...targetOption.pros, newItem];
    } else {
      targetOption.cons = [...targetOption.cons, newItem];
    }

    updated[optionIdx] = targetOption;
    onUpdateOptionAnalysis(updated);
    setNewText('');
    setAddingTo(null);
  };

  const handleRemoveItem = (optionIdx: number, type: 'pro' | 'con', itemIdx: number) => {
    if (!onUpdateOptionAnalysis) return;
    const updated = [...optionsAnalysis];
    const target = { ...updated[optionIdx] };
    if (type === 'pro') {
      target.pros = target.pros.filter((_, i) => i !== itemIdx);
    } else {
      target.cons = target.cons.filter((_, i) => i !== itemIdx);
    }
    updated[optionIdx] = target;
    onUpdateOptionAnalysis(updated);
  };

  return (
    <div className="space-y-6">
      {/* Category filter pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          <span>Impact ratings are weighted 1-5</span>
        </div>
      </div>

      {/* Side-by-side or stacked option cards */}
      <div className={`grid grid-cols-1 ${optionsAnalysis.length === 2 ? 'lg:grid-cols-2' : 'xl:grid-cols-3'} gap-6`}>
        {optionsAnalysis.map((option, optIdx) => {
          const filteredPros =
            activeCategory === 'All'
              ? option.pros
              : option.pros.filter((p) => p.category === activeCategory);
          const filteredCons =
            activeCategory === 'All'
              ? option.cons
              : option.cons.filter((c) => c.category === activeCategory);

          const totalProsScore = option.pros.reduce((acc, curr) => acc + (curr.impact || 1), 0);
          const totalConsScore = option.cons.reduce((acc, curr) => acc + (curr.impact || 1), 0);
          const netScore = totalProsScore - totalConsScore;

          return (
            <div
              key={optIdx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header with Net Score */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      Option {String.fromCharCode(65 + optIdx)}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                      {option.optionName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Net Balance
                    </span>
                    <span
                      className={`text-sm font-extrabold px-2 py-0.5 rounded-md ${
                        netScore > 0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : netScore < 0
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {netScore > 0 ? `+${netScore}` : netScore}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic mb-5">
                  "{option.tagline}"
                </p>

                {/* Pros Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 pb-1 border-b border-emerald-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Pros & Advantages ({filteredPros.length})</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold">
                      +{totalProsScore} pts
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {filteredPros.map((pro, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs hover:border-emerald-500/40 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-200 flex-1">
                            {pro.text}
                          </span>
                          {onUpdateOptionAnalysis && (
                            <button
                              onClick={() => handleRemoveItem(optIdx, 'pro', pIdx)}
                              className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete item"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {pro.detail && (
                          <p className="text-[11px] text-slate-400 mt-1">
                            {pro.detail}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-emerald-500/10">
                          <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {pro.category}
                          </span>
                          <div className="flex items-center gap-0.5" title={`Impact: ${pro.impact}/5`}>
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <span
                                key={lvl}
                                className={`w-1.5 h-3 rounded-xs ${
                                  lvl <= (pro.impact || 1)
                                    ? 'bg-emerald-400'
                                    : 'bg-emerald-950'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredPros.length === 0 && (
                      <div className="text-xs text-slate-500 italic py-2">
                        No pros matching the selected filter.
                      </div>
                    )}
                  </div>
                </div>

                {/* Cons Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3 pb-1 border-b border-rose-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Cons & Drawbacks ({filteredCons.length})</span>
                    </div>
                    <span className="text-xs text-rose-400 font-semibold">
                      -{totalConsScore} pts
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {filteredCons.map((con, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs hover:border-rose-500/40 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-200 flex-1">
                            {con.text}
                          </span>
                          {onUpdateOptionAnalysis && (
                            <button
                              onClick={() => handleRemoveItem(optIdx, 'con', cIdx)}
                              className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete item"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {con.detail && (
                          <p className="text-[11px] text-slate-400 mt-1">
                            {con.detail}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-rose-500/10">
                          <span className="text-[10px] text-rose-400 font-medium bg-rose-500/10 px-1.5 py-0.5 rounded">
                            {con.category}
                          </span>
                          <div className="flex items-center gap-0.5" title={`Severity: ${con.impact}/5`}>
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <span
                                key={lvl}
                                className={`w-1.5 h-3 rounded-xs ${
                                  lvl <= (con.impact || 1)
                                    ? 'bg-rose-400'
                                    : 'bg-rose-950'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredCons.length === 0 && (
                      <div className="text-xs text-slate-500 italic py-2">
                        No cons matching the selected filter.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Custom Factor Drawer */}
              {onUpdateOptionAnalysis && (
                <div className="pt-4 border-t border-slate-800">
                  {addingTo?.optionIdx === optIdx ? (
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                        <span>Add Custom {addingTo.type === 'pro' ? 'Pro' : 'Con'}</span>
                        <button
                          onClick={() => setAddingTo(null)}
                          className="text-slate-500 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                      <input
                        type="text"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="What factor matters to you?"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Category (e.g. Health)"
                          className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200 outline-none"
                        />
                        <div className="flex-1 flex items-center justify-end gap-1 text-xs text-slate-400">
                          <span>Weight:</span>
                          <select
                            value={newImpact}
                            onChange={(e) => setNewImpact(Number(e.target.value))}
                            className="bg-slate-900 border border-slate-700 rounded p-1 text-xs text-slate-200"
                          >
                            <option value={1}>1 (Low)</option>
                            <option value={2}>2</option>
                            <option value={3}>3 (Med)</option>
                            <option value={4}>4</option>
                            <option value={5}>5 (High)</option>
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddCustomItem(optIdx, addingTo.type)}
                        className="w-full py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
                      >
                        Save Factor
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAddingTo({ optionIdx: optIdx, type: 'pro' })}
                        className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Pro</span>
                      </button>
                      <button
                        onClick={() => setAddingTo({ optionIdx: optIdx, type: 'con' })}
                        className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Con</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
