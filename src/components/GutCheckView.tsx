import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Coins, Sparkles, HeartHandshake, RefreshCw, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import { OptionAnalysis } from '../types';

interface GutCheckViewProps {
  optionsAnalysis: OptionAnalysis[];
}

export const GutCheckView: React.FC<GutCheckViewProps> = ({ optionsAnalysis }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [gutFeedback, setGutFeedback] = useState<'relief' | 'dread' | null>(null);

  const optionA = optionsAnalysis[0]?.optionName || 'Option A';
  const optionB = optionsAnalysis[1]?.optionName || 'Option B';

  const handleFlip = () => {
    setIsFlipping(true);
    setSelectedResult(null);
    setGutFeedback(null);

    setTimeout(() => {
      const winner = Math.random() < 0.5 ? optionA : optionB;
      setSelectedResult(winner);
      setIsFlipping(false);
      try {
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }, 1200);
  };

  const alternateOption = selectedResult === optionA ? optionB : optionA;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Intro Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/20 mb-4">
          <Coins className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white">
          The Intuition Gut Check
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
          "When you flip a coin, it does not settle the question. Rather, in that brief moment when the coin is in the air, you suddenly discover what you are really hoping for."
        </p>
        <span className="text-[11px] text-amber-400 font-semibold mt-1 block">
          — Piet Hein & Behavioral Economics Principle
        </span>

        {/* The Coin Toss Container */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div
            onClick={!isFlipping ? handleFlip : undefined}
            className={`w-36 h-36 rounded-full border-4 border-amber-400/80 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex flex-col items-center justify-center p-3 text-slate-950 font-black shadow-2xl shadow-amber-500/30 cursor-pointer select-none transition-transform active:scale-95 ${
              isFlipping ? 'animate-spin duration-300 scale-110' : 'hover:scale-105'
            }`}
          >
            {isFlipping ? (
              <RefreshCw className="w-8 h-8 animate-spin text-slate-950" />
            ) : selectedResult ? (
              <div className="text-center px-2">
                <span className="text-[9px] uppercase tracking-wider block opacity-75 font-bold">
                  Result
                </span>
                <span className="text-xs leading-tight font-extrabold line-clamp-3">
                  {selectedResult}
                </span>
              </div>
            ) : (
              <div className="text-center">
                <Coins className="w-8 h-8 mx-auto mb-1 text-slate-950" />
                <span className="text-xs uppercase tracking-wider font-extrabold">
                  Flip Coin
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleFlip}
            disabled={isFlipping}
            className="mt-5 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            {isFlipping ? 'Coin is in the air...' : selectedResult ? 'Flip Again' : 'Toss The Tiebreaker Coin'}
          </button>
        </div>

        {/* Subconscious Reflection Prompt */}
        {selectedResult && (
          <div className="pt-6 border-t border-slate-800 text-left animate-in fade-in slide-in-from-bottom-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Notice your immediate emotional reaction:
            </div>
            <p className="text-sm font-medium text-white text-center mb-4">
              When the coin landed on <strong>"{selectedResult}"</strong>, did you feel a wave of <em>relief</em> or a twinge of <em>disappointment</em>?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              <button
                onClick={() => setGutFeedback('relief')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  gutFeedback === 'relief'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-2 ring-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                <span>I felt Relief / Excitement</span>
              </button>

              <button
                onClick={() => setGutFeedback('dread')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  gutFeedback === 'dread'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-2 ring-rose-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <ThumbsDown className="w-4 h-4 text-rose-400" />
                <span>I felt Regret / Disappointment</span>
              </button>
            </div>

            {/* Psychological Diagnosis */}
            {gutFeedback === 'relief' && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 text-center leading-relaxed animate-in fade-in">
                <strong>Your gut has spoken!</strong> Relief indicates you subconsciously already favored <strong>"{selectedResult}"</strong>. Trust your preparation and move forward with clarity.
              </div>
            )}

            {gutFeedback === 'dread' && (
              <div className="mt-4 p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 text-center leading-relaxed animate-in fade-in">
                <strong>The paradox revealed!</strong> Disappointment means your authentic intuition actually wanted <strong>"{alternateOption}"</strong>! Listen to that visceral signal.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
