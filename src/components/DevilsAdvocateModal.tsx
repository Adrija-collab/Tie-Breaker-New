import React, { useState, useEffect } from 'react';
import { Flame, X, ShieldAlert, Skull, HelpCircle, Check, Loader2 } from 'lucide-react';
import { DevilsAdvocateData } from '../types';

interface DevilsAdvocateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  chosenOption: string;
}

export const DevilsAdvocateModal: React.FC<DevilsAdvocateModalProps> = ({
  isOpen,
  onClose,
  title,
  chosenOption,
}) => {
  const [data, setData] = useState<DevilsAdvocateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && chosenOption) {
      fetchDevilsAdvocate();
    }
  }, [isOpen, chosenOption]);

  const fetchDevilsAdvocate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tiebreaker/devil-advocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          chosenOption,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to generate devil\'s advocate analysis');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 p-5 border-b border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Flame className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>The Devil's Advocate</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                  Stress Test
                </span>
              </h3>
              <p className="text-xs text-rose-300/80">
                Challenging "{chosenOption}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
              <p className="text-xs font-medium">
                Interrogating choice for hidden traps & pre-mortem risks...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {data && !loading && (
            <>
              {/* Fatal Flaw */}
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>The Underestimated Fatal Flaw</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {data.fatalFlaw}
                </p>
              </div>

              {/* Pre-Mortem Scenario */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <Skull className="w-4 h-4" />
                  <span>The 2-Year Pre-Mortem Failure Scenario</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {data.preMortem}
                </p>
              </div>

              {/* Worst Case */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
                  Worst-Case Horizon (12 Months)
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {data.worstCaseScenario}
                </p>
              </div>

              {/* Litmus Test Question */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>The Litmus Test Question</span>
                </div>
                <p className="text-sm font-semibold text-white leading-relaxed italic">
                  "{data.litmusTestQuestion}"
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  If your immediate answer to this is a confident "Yes", proceed without hesitation. If you hesitate, pause and reconsider.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close & Back to Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
