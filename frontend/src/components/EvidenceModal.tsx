import React from 'react';
import { X, Mail, Users, Mic, Calendar, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { ActionItem, EvidenceItem } from '../types';

interface EvidenceModalProps {
  action: ActionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ action, isOpen, onClose }) => {
  if (!isOpen || !action) return null;

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4 text-cyan-400" />;
      case 'meeting':
        return <Users className="w-4 h-4 text-indigo-400" />;
      case 'voice_note':
        return <Mic className="w-4 h-4 text-amber-400" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      default:
        return <ExternalLink className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSourceBadge = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'meeting':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      case 'voice_note':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'calendar':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-700';
    }
  };

  const evidenceList: EvidenceItem[] = action.knownEvidence || action.evidence || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between bg-slate-850">
          <div className="pr-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Source Evidence Trail
              </span>
              <span className="text-xs text-slate-400">• {evidenceList.length} Recorded Citation(s)</span>
            </div>
            <h3 className="text-base font-bold text-white leading-snug">{action.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{action.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability Meta */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 text-xs flex flex-wrap items-center gap-4 text-slate-300">
          <div>
            <span className="text-slate-500">Current Status:</span>{' '}
            <span className="font-semibold uppercase text-indigo-300">{action.status}</span>
          </div>
          <div>
            <span className="text-slate-500">Owner:</span>{' '}
            <span className={`font-semibold ${action.owner === 'Unclear' ? 'text-amber-400' : 'text-slate-200'}`}>
              {action.owner}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Active Deadline:</span>{' '}
            <span className="font-semibold text-slate-200">{action.deadlineLabel}</span>
          </div>
        </div>

        {/* Chronological Evidence Timeline */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Why does the agent think this? Chronological Evolution:</span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {evidenceList.map((item, idx) => (
              <div key={`${item.sourceId}-${idx}`} className="relative group">
                {/* Dot */}
                <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors">
                  {/* Top line: Source type & time */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getSourceBadge(item.sourceType)}`}>
                        {getSourceIcon(item.sourceType)}
                        <span className="capitalize">{item.sourceType.replace('_', ' ')}</span>
                      </span>
                      <span className="text-xs font-medium text-slate-200">{item.displayTime}</span>
                    </div>
                    {item.sourceId && (
                      <span className="text-[10px] font-mono text-slate-500">{item.sourceId}</span>
                    )}
                  </div>

                  {/* Sender and recipient */}
                  <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                    <span className="font-medium text-slate-300">{item.from}</span>
                    {item.to && (
                      <>
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                        <span className="text-slate-400">{item.to}</span>
                      </>
                    )}
                  </div>

                  {/* Original quote */}
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed italic">
                    "{item.evidence}"
                  </div>

                  {/* Context Note */}
                  {item.note && (
                    <div className="mt-2 text-[11px] text-indigo-300/90 font-medium">
                      Note: {item.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Source of Truth: Assignment 1 Data Pack (Verified deterministic audit chain)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
