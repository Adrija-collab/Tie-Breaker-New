import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, AlertOctagon, Flame, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { DecisionVerdict } from '../types';

interface VerdictViewProps {
  verdict: DecisionVerdict;
  onOpenDevilsAdvocate: () => void;
  title: string;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  verdict,
  onOpenDevilsAdvocate,
  title,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#6366f1', '#10b981', '#f97316'],
      });
    } catch {
      // ignore
    }
  }, [verdict.recommendedOption]);

  return (
    <div className="space-y-6">
      {/* Top Banner Winner Announcement */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              The Tiebreaker Verdict
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Model Confidence:</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {verdict.confidenceScore}%
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
              Recommended Choice
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-r from-amber-300 via-white to-amber-100 bg-clip-text text-transparent">
                {verdict.recommendedOption}
              </span>
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 shrink-0" />
            </h3>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {verdict.executiveSummary}
          </p>
        </div>
      </div>

      {/* The Pivot Point Spotlight */}
      <div className="rounded-2xl bg-amber-500/5 border border-amber-500/30 p-6 relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-amber-300">The Pivot Point</h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                The Deciding Factor
              </span>
            </div>
            <p className="text-sm text-slate-200 mt-2 leading-relaxed">
              {verdict.thePivotPoint}
            </p>
            <p className="text-xs text-amber-400/80 mt-2 italic">
              When in doubt, anchor your final decision on this single pivot rather than re-litigating every small detail.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 2: Blindspots and Next 24 Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cognitive Biases & Blindspots */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Blindspots & Psychological Traps
              </h4>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Watch out for common cognitive biases that could distort your judgment here:
            </p>
            <ul className="space-y-2.5">
              {verdict.blindspots.map((blindspot, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{blindspot}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Immediate Next 24-Hour Move */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Immediate Next Action (Next 24h)
              </h4>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Break the paralysis cycle by taking one low-risk, decisive action immediately:
            </p>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs sm:text-sm font-medium leading-relaxed">
              {verdict.recommendedNextAction}
            </div>
          </div>

          {/* Devil's Advocate Trigger */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              onClick={onOpenDevilsAdvocate}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all hover:scale-[1.01]"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Challenge This Choice (Devil's Advocate Pre-Mortem)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
