import React from 'react';
import { X, History, Trash2, ArrowUpRight, Scale, Clock } from 'lucide-react';
import { SavedDecision } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecision[];
  onLoadDecision: (decision: SavedDecision) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onLoadDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <History className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Decision Vault</h3>
              <p className="text-xs text-slate-400">
                {savedDecisions.length} archived {savedDecisions.length === 1 ? 'decision' : 'decisions'}
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

        {/* List of decisions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Scale className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No saved decisions yet.</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Decisions you evaluate with The Tiebreaker are automatically saved here for future reference.
              </p>
            </div>
          ) : (
            savedDecisions.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2">
                    {item.title}
                  </h4>
                  <button
                    onClick={() => onDeleteDecision(item.id)}
                    className="p-1 text-slate-600 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete saved decision"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span>•</span>
                  <span>{item.options.length} Options</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-amber-400 font-semibold truncate max-w-[200px]">
                    Winner: {item.analysis.verdict.recommendedOption}
                  </div>
                  <button
                    onClick={() => {
                      onLoadDecision(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Re-open</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedDecisions.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
