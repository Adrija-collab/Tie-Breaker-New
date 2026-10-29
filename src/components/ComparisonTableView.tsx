import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Trash2, Award, Info, RotateCcw } from 'lucide-react';
import { ComparisonCriterion, OptionAnalysis } from '../types';

interface ComparisonTableViewProps {
  criteria: ComparisonCriterion[];
  optionsAnalysis: OptionAnalysis[];
  onUpdateCriteria?: (updated: ComparisonCriterion[]) => void;
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  criteria,
  optionsAnalysis,
  onUpdateCriteria,
}) => {
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    criteria.forEach((c) => {
      init[c.name] = c.weight || 3;
    });
    return init;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCriterionDesc, setNewCriterionDesc] = useState('');
  const [newScores, setNewScores] = useState<Record<string, number>>({});

  const optionNames = optionsAnalysis.map((o) => o.optionName);

  const handleWeightChange = (criterionName: string, val: number) => {
    setWeights((prev) => ({ ...prev, [criterionName]: val }));
  };

  const handleResetWeights = () => {
    const init: Record<string, number> = {};
    criteria.forEach((c) => {
      init[c.name] = c.weight || 3;
    });
    setWeights(init);
  };

  // Calculate total weighted scores for each option
  // Score = sum(criterion.score * weight) / sum(weight * 10) * 100
  const totals = React.useMemo(() => {
    const optionTotals: Record<string, { rawWeighted: number; maxPossible: number; percentage: number }> = {};
    optionNames.forEach((opt) => {
      optionTotals[opt] = { rawWeighted: 0, maxPossible: 0, percentage: 0 };
    });

    let totalWeight = 0;
    criteria.forEach((crit) => {
      const weight = weights[crit.name] ?? crit.weight ?? 3;
      totalWeight += weight;

      crit.scores.forEach((s) => {
        if (optionTotals[s.optionName]) {
          optionTotals[s.optionName].rawWeighted += s.score * weight;
        }
      });
    });

    const maxScore = totalWeight * 10;
    optionNames.forEach((opt) => {
      const raw = optionTotals[opt].rawWeighted;
      optionTotals[opt].maxPossible = maxScore;
      optionTotals[opt].percentage = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0;
    });

    return optionTotals;
  }, [criteria, weights, optionNames]);

  // Find the winning option under the current user weights
  const winningOption = React.useMemo(() => {
    let best = '';
    let maxPct = -1;
    optionNames.forEach((opt) => {
      if (totals[opt]?.percentage > maxPct) {
        maxPct = totals[opt].percentage;
        best = opt;
      }
    });
    return { name: best, percentage: maxPct };
  }, [totals, optionNames]);

  const handleAddCustomCriterion = () => {
    if (!newCriterionName.trim() || !onUpdateCriteria) return;

    const newCrit: ComparisonCriterion = {
      name: newCriterionName.trim(),
      description: newCriterionDesc.trim() || 'Custom user criterion',
      weight: 3,
      scores: optionNames.map((opt) => ({
        optionName: opt,
        score: newScores[opt] || 5,
        comment: 'User evaluated score',
      })),
    };

    const updated = [...criteria, newCrit];
    setWeights((prev) => ({ ...prev, [newCrit.name]: 3 }));
    onUpdateCriteria(updated);

    setNewCriterionName('');
    setNewCriterionDesc('');
    setNewScores({});
    setShowAddModal(false);
  };

  const handleDeleteCriterion = (index: number) => {
    if (!onUpdateCriteria) return;
    const critName = criteria[index].name;
    const updated = criteria.filter((_, i) => i !== index);
    onUpdateCriteria(updated);
    setWeights((prev) => {
      const clone = { ...prev };
      delete clone[critName];
      return clone;
    });
  };

  return (
    <div className="space-y-6">
      {/* Weighted Scorecards Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <SlidersHorizontal className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Live Weighted Scorecard
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Adjust weights below to match what you personally value most. Scores recalculate instantaneously.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetWeights}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
              title="Reset weights to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Weights</span>
            </button>
            {onUpdateCriteria && (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Criterion</span>
              </button>
            )}
          </div>
        </div>

        {/* Options Progress Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {optionNames.map((opt, idx) => {
            const data = totals[opt] || { percentage: 0, rawWeighted: 0 };
            const isWinner = opt === winningOption.name;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Option {String.fromCharCode(65 + idx)}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">{opt}</h4>
                  </div>
                  {isWinner && (
                    <span className="p-1 rounded-md bg-amber-500 text-slate-950 shrink-0" title="Leading on points">
                      <Award className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xs text-slate-400">Match Score:</span>
                  <span className={`text-lg font-black ${isWinner ? 'text-amber-300' : 'text-slate-200'}`}>
                    {data.percentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isWinner
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300 text-xs uppercase tracking-wider">
                <th className="py-4 px-5 font-bold w-1/3 min-w-[240px]">
                  Evaluation Criteria
                </th>
                <th className="py-4 px-4 font-bold text-center w-28 min-w-[120px]">
                  Importance Weight
                </th>
                {optionNames.map((opt, idx) => (
                  <th key={idx} className="py-4 px-5 font-bold min-w-[200px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-[10px] flex items-center justify-center font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="truncate">{opt}</span>
                    </div>
                  </th>
                ))}
                {onUpdateCriteria && <th className="py-4 px-3 w-10"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {criteria.map((crit, cIdx) => {
                const currentWeight = weights[crit.name] ?? crit.weight ?? 3;

                return (
                  <tr key={cIdx} className="hover:bg-slate-800/30 transition-colors group">
                    {/* Criterion Name & Description */}
                    <td className="py-4 px-5 align-top">
                      <div className="font-bold text-slate-100 text-sm">
                        {crit.name}
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                        {crit.description}
                      </p>
                    </td>

                    {/* Weight Slider */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          {currentWeight}x
                        </span>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={currentWeight}
                          onChange={(e) => handleWeightChange(crit.name, Number(e.target.value))}
                          className="w-20 accent-amber-500 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500">
                          {currentWeight === 1 ? 'Low' : currentWeight === 5 ? 'Vital' : 'Med'}
                        </span>
                      </div>
                    </td>

                    {/* Scores for Each Option */}
                    {optionNames.map((optName, oIdx) => {
                      const scoreObj = crit.scores.find((s) => s.optionName === optName) || {
                        score: 5,
                        comment: 'N/A',
                      };

                      return (
                        <td key={oIdx} className="py-4 px-5 align-top">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-sm font-extrabold px-2 py-0.5 rounded ${
                                scoreObj.score >= 8
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : scoreObj.score >= 5
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {scoreObj.score} / 10
                            </span>
                            <div className="flex-1 bg-slate-800 rounded-full h-1.5 max-w-[80px]">
                              <div
                                className={`h-full rounded-full ${
                                  scoreObj.score >= 8
                                    ? 'bg-emerald-400'
                                    : scoreObj.score >= 5
                                    ? 'bg-amber-400'
                                    : 'bg-rose-400'
                                }`}
                                style={{ width: `${scoreObj.score * 10}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            {scoreObj.comment}
                          </p>
                        </td>
                      );
                    })}

                    {/* Delete criterion */}
                    {onUpdateCriteria && (
                      <td className="py-4 px-3 align-top text-center">
                        <button
                          onClick={() => handleDeleteCriterion(cIdx)}
                          className="p-1 text-slate-600 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove criterion"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Criterion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white">Add Custom Criterion</h4>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Criterion Name
              </label>
              <input
                type="text"
                value={newCriterionName}
                onChange={(e) => setNewCriterionName(e.target.value)}
                placeholder="e.g. Relocation Hassle, Family Alignment"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description / Context
              </label>
              <input
                type="text"
                value={newCriterionDesc}
                onChange={(e) => setNewCriterionDesc(e.target.value)}
                placeholder="Why this metric matters..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Score each option (1-10):
              </label>
              {optionNames.map((opt) => (
                <div key={opt} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-300 truncate max-w-[180px]">{opt}</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newScores[opt] ?? 5}
                    onChange={(e) =>
                      setNewScores((prev) => ({
                        ...prev,
                        [opt]: Math.max(1, Math.min(10, Number(e.target.value))),
                      }))
                    }
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-center text-xs text-white"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomCriterion}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400"
              >
                Add Metric
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
