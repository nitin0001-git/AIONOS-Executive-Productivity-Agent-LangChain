import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { QAResponse, EvidenceItem } from '../types';
import { askAgent } from '../services/api';

interface AskAgentProps {
  currentAsOf: string;
  onViewEvidenceItem?: (evidence: EvidenceItem) => void;
}

export const AskAgent: React.FC<AskAgentProps> = ({ currentAsOf }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QAResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const suggestedQuestions = [
    { label: 'Vendor List Promise', q: 'What did I promise Raghav?' },
    { label: "Today's Action Items", q: 'What needs action today?' },
    { label: 'Waiting on Others', q: 'What am I waiting on?' },
    { label: 'Mumbai Lease Status', q: 'What’s happening with the Mumbai lease?' },
    { label: 'Campaign Deck Deadline', q: 'When is the Q3 campaign deck due?' },
    { label: 'Deck Deadline Shift', q: 'Did the campaign deck deadline change?' },
    { label: 'Expense Variance Report', q: 'What happened with the expense variance report?' },
    { label: 'Meridian Logistics Call', q: 'What’s happening with the Meridian call?' }
  ];

  const handleAsk = async (queryToAsk: string) => {
    if (!queryToAsk.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await askAgent(queryToAsk, currentAsOf);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Failed to obtain answer from agent.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(question);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-violet-950/40 border border-indigo-500/20 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Ask the Executive Productivity Agent</h2>
            <p className="text-xs text-slate-400">
              Grounded executive Q&A for Arjun Malhotra • Evaluated strictly as of the simulated historical time
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              id="qa-input-field"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask anything about Arjun's commitments, deadlines, or deliverables..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
            />
          </div>
          <button
            type="submit"
            id="qa-submit-button"
            disabled={loading || !question.trim()}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Ask</span>
          </button>
        </form>

        {/* Suggested Chips */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Suggested Executive Prompts:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestion(item.q);
                  handleAsk(item.q);
                }}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-950/60 hover:text-indigo-200 border border-slate-700/70 hover:border-indigo-500/40 text-slate-300 transition-all cursor-pointer"
              >
                {item.q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3 shadow-xl">
          <Loader2 className="w-7 h-7 text-indigo-400 animate-spin mx-auto" />
          <div className="text-sm font-semibold text-white">Synthesizing Grounded Answer...</div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Cross-referencing Leadership Sync, email threads, calendar events, and voice notes as of {currentAsOf}
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Answer Presentation */}
      {response && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Agent Response
              </span>
              <h3 className="text-base font-bold text-white mt-1">"{response.question}"</h3>
            </div>
            <div className="flex items-center gap-2">
              {response.status && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 uppercase">
                  Status: {response.status}
                </span>
              )}
              {response.deadline && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{response.deadline}</span>
                </span>
              )}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-sm text-slate-200 leading-relaxed font-medium">
            {response.summary}
          </div>

          {/* Key Takeaways */}
          {response.keyPoints && response.keyPoints.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Key Executive Takeaways</span>
              </h4>
              <ul className="space-y-2">
                {response.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <span className="text-indigo-400 mt-0.5 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence Citations */}
          {response.citations && response.citations.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Direct Data Pack Citations ({response.citations.length})</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {response.citations.map((cite, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-indigo-300 capitalize">{cite.sourceType.replace('_', ' ')}</span>
                      <span>{cite.displayTime}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span className="font-medium text-slate-300">{cite.from}</span>
                      {cite.to && (
                        <>
                          <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                          <span>{cite.to}</span>
                        </>
                      )}
                    </div>
                    <div className="p-2 rounded bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-300 italic">
                      "{cite.evidence}"
                    </div>
                    {cite.note && (
                      <div className="text-[10px] text-indigo-400">Note: {cite.note}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
