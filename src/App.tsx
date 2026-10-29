/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DecisionInput } from './components/DecisionInput';
import { VerdictView } from './components/VerdictView';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SwotView } from './components/SwotView';
import { GutCheckView } from './components/GutCheckView';
import { DevilsAdvocateModal } from './components/DevilsAdvocateModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { PresetDilemma } from './data/presets';
import { DecisionAnalysis, SavedDecision, OptionAnalysis, ComparisonCriterion } from './types';
import {
  Trophy,
  TableProperties,
  Grid2X2,
  ListOrdered,
  Coins,
  Copy,
  Printer,
  Sparkles,
  Check,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions_v1';

export default function App() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [context, setContext] = useState('');
  const [priorities, setPriorities] = useState<string[]>([]);

  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'verdict' | 'proscons' | 'matrix' | 'swot' | 'gutcheck'>('verdict');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [devilsAdvocateOpen, setDevilsAdvocateOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Saved decisions in localStorage
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecisions));
    } catch {
      // storage unavailable
    }
  }, [savedDecisions]);

  const handleSelectPreset = (preset: PresetDilemma) => {
    setTitle(preset.title);
    setOptions(preset.options);
    setContext(preset.context);
    setPriorities(preset.priorities);
    setAnalysis(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setTitle('');
    setOptions(['', '']);
    setContext('');
    setPriorities([]);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    const validOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (!title.trim() || validOptions.length < 2) {
      setError('Please provide a decision question and at least 2 options.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/tiebreaker/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          context: context.trim(),
          options: validOptions,
          priorities,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to complete analysis. Please try again.');
      }

      const result: DecisionAnalysis = await res.json();
      setAnalysis(result);
      setActiveTab('verdict');

      // Auto-save to history
      const newEntry: SavedDecision = {
        id: 'dec_' + Date.now(),
        createdAt: new Date().toISOString(),
        title: title.trim(),
        context: context.trim(),
        options: validOptions,
        priorities,
        analysis: result,
      };

      setSavedDecisions((prev) => [newEntry, ...prev.filter((d) => d.title !== title.trim())]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSavedDecision = (saved: SavedDecision) => {
    setTitle(saved.title);
    setOptions(saved.options);
    setContext(saved.context || '');
    setPriorities(saved.priorities || []);
    setAnalysis(saved.analysis);
    setActiveTab('verdict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSavedDecision = (id: string) => {
    setSavedDecisions((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearAllHistory = () => {
    if (confirm('Are you sure you want to clear your saved decisions history?')) {
      setSavedDecisions([]);
    }
  };

  const handleUpdateOptionAnalysis = (updated: OptionAnalysis[]) => {
    if (!analysis) return;
    setAnalysis({
      ...analysis,
      optionsAnalysis: updated,
    });
  };

  const handleUpdateCriteria = (updated: ComparisonCriterion[]) => {
    if (!analysis) return;
    setAnalysis({
      ...analysis,
      comparisonCriteria: updated,
    });
  };

  const handleCopyMarkdown = () => {
    if (!analysis) return;
    const md = `
# The Tiebreaker Decision Brief: ${title}
**Winner:** ${analysis.verdict.recommendedOption} (Confidence: ${analysis.verdict.confidenceScore}%)
**Summary:** ${analysis.verdict.executiveSummary}

## The Pivot Point
${analysis.verdict.thePivotPoint}

## Immediate Next Action
${analysis.verdict.recommendedNextAction}

## Evaluated Options
${analysis.optionsAnalysis
  .map(
    (opt) => `
### ${opt.optionName} ("${opt.tagline}")
- Pros:
${opt.pros.map((p) => `  * ${p.text} (Impact: ${p.impact}/5)`).join('\n')}
- Cons:
${opt.cons.map((c) => `  * ${c.text} (Severity: ${c.impact}/5)`).join('\n')}
`
  )
  .join('\n')}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar
        onSelectPreset={handleSelectPreset}
        onOpenHistory={() => setHistoryOpen(true)}
        historyCount={savedDecisions.length}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Card */}
        <DecisionInput
          title={title}
          setTitle={setTitle}
          options={options}
          setOptions={setOptions}
          context={context}
          setContext={setContext}
          priorities={priorities}
          setPriorities={setPriorities}
          onSubmit={handleAnalyze}
          isLoading={isLoading}
          onSelectPreset={handleSelectPreset}
        />

        {/* Analysis Results View */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Top Analysis Header & Tab Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setActiveTab('verdict')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'verdict'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>The Verdict</span>
                </button>

                <button
                  onClick={() => setActiveTab('proscons')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'proscons'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                  <span>Pros & Cons</span>
                </button>

                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'matrix'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <TableProperties className="w-4 h-4" />
                  <span>Comparison Matrix</span>
                </button>

                <button
                  onClick={() => setActiveTab('swot')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'swot'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Grid2X2 className="w-4 h-4" />
                  <span>SWOT Analysis</span>
                </button>

                <button
                  onClick={() => setActiveTab('gutcheck')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                    activeTab === 'gutcheck'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>Gut Check</span>
                </button>
              </div>

              {/* Utility buttons: Copy & Print */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                  title="Copy decision brief to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Brief!' : 'Copy Summary'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                  title="Print or export as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Dilemma Recap Banner */}
            <div className="px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Fundamental Tradeoff:
                </span>
                <span className="text-slate-200 font-medium">
                  {analysis.keyTradeoff}
                </span>
              </div>
              <div className="text-slate-400">
                Evaluating <span className="text-amber-400 font-bold">{analysis.optionsAnalysis.length} options</span> across <span className="text-indigo-400 font-bold">{analysis.comparisonCriteria.length} weighted criteria</span>
              </div>
            </div>

            {/* Active Tab View */}
            {activeTab === 'verdict' && (
              <VerdictView
                verdict={analysis.verdict}
                onOpenDevilsAdvocate={() => setDevilsAdvocateOpen(true)}
                title={title}
              />
            )}

            {activeTab === 'proscons' && (
              <ProsConsView
                optionsAnalysis={analysis.optionsAnalysis}
                onUpdateOptionAnalysis={handleUpdateOptionAnalysis}
              />
            )}

            {activeTab === 'matrix' && (
              <ComparisonTableView
                criteria={analysis.comparisonCriteria}
                optionsAnalysis={analysis.optionsAnalysis}
                onUpdateCriteria={handleUpdateCriteria}
              />
            )}

            {activeTab === 'swot' && (
              <SwotView optionsAnalysis={analysis.optionsAnalysis} />
            )}

            {activeTab === 'gutcheck' && (
              <GutCheckView optionsAnalysis={analysis.optionsAnalysis} />
            )}
          </div>
        )}
      </main>

      {/* Devil's Advocate Modal */}
      {analysis && (
        <DevilsAdvocateModal
          isOpen={devilsAdvocateOpen}
          onClose={() => setDevilsAdvocateOpen(false)}
          title={title}
          chosenOption={analysis.verdict.recommendedOption}
        />
      )}

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onLoadDecision={handleLoadSavedDecision}
        onDeleteDecision={handleDeleteSavedDecision}
        onClearAll={handleClearAllHistory}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>The Tiebreaker — Impartial Decision & SWOT Engine</span>
          <span>Powered by Gemini 3.8 Flash</span>
        </div>
      </footer>
    </div>
  );
}
