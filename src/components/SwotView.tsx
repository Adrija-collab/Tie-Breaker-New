import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, AlertOctagon, Lightbulb, CheckCircle2 } from 'lucide-react';
import { OptionAnalysis } from '../types';

interface SwotViewProps {
  optionsAnalysis: OptionAnalysis[];
}

export const SwotView: React.FC<SwotViewProps> = ({ optionsAnalysis }) => {
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const currentOption = optionsAnalysis[selectedOptionIdx] || optionsAnalysis[0];

  if (!currentOption) return null;

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-slate-400 mr-1 pl-2">
            Select Option to View:
          </span>
          {optionsAnalysis.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOptionIdx(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                selectedOptionIdx === idx
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/20 text-[10px] flex items-center justify-center font-black">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="truncate max-w-[200px]">{opt.optionName}</span>
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 italic px-2 hidden sm:block">
          "{currentOption.tagline}"
        </div>
      </div>

      {/* 2x2 SWOT Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* STRENGTHS */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-extrabold text-emerald-400 tracking-wider uppercase">
                  Strengths
                </h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Internal Advantages
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {currentOption.swot.strengths.length} Factors
            </span>
          </div>

          <ul className="space-y-2.5">
            {currentOption.swot.strengths.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-950/20 text-xs text-slate-200 leading-relaxed border border-emerald-500/10"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-extrabold text-amber-400 tracking-wider uppercase">
                  Weaknesses
                </h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Internal Vulnerabilities
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {currentOption.swot.weaknesses.length} Factors
            </span>
          </div>

          <ul className="space-y-2.5">
            {currentOption.swot.weaknesses.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-950/20 text-xs text-slate-200 leading-relaxed border border-amber-500/10"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OPPORTUNITIES */}
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-sky-500/50 transition-all">
          <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-sky-500/20">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-extrabold text-sky-400 tracking-wider uppercase">
                  Opportunities
                </h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  External Tailwinds & Upside
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {currentOption.swot.opportunities.length} Factors
            </span>
          </div>

          <ul className="space-y-2.5">
            {currentOption.swot.opportunities.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-sky-950/20 text-xs text-slate-200 leading-relaxed border border-sky-500/10"
              >
                <TrendingUp className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* THREATS */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-rose-500/20">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <AlertOctagon className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-extrabold text-rose-400 tracking-wider uppercase">
                  Threats
                </h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  External Risks & Headwinds
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {currentOption.swot.threats.length} Factors
            </span>
          </div>

          <ul className="space-y-2.5">
            {currentOption.swot.threats.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-950/20 text-xs text-slate-200 leading-relaxed border border-rose-500/10"
              >
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Synthesis Callout */}
      <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-5 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-indigo-200">
            Executive SWOT Strategy Guide
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            To make <strong>{currentOption.optionName}</strong> succeed, match its greatest Strengths against external Opportunities while preparing contingency safeguards against its primary Weakness.
          </p>
        </div>
      </div>
    </div>
  );
};
