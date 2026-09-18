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
        return <Mail className="w-3.5 h-3.5 text-sky-600" />;
      case 'meeting':
        return <Users className="w-3.5 h-3.5 text-indigo-600" />;
      case 'voice_note':
        return <Mic className="w-3.5 h-3.5 text-amber-600" />;
      case 'calendar':
        return <Calendar className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <ExternalLink className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getSourceBadge = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'meeting':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'voice_note':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'calendar':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const evidenceList: EvidenceItem[] = action.knownEvidence || action.evidence || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="pr-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                Source Evidence Trail
              </span>
              <span className="text-xs text-slate-500">• {evidenceList.length} Recorded Citation(s)</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">{action.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability Meta */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 text-xs flex flex-wrap items-center gap-4 text-slate-600">
          <div>
            <span className="text-slate-400">Current Status:</span>{' '}
            <span className="font-semibold uppercase text-indigo-700">{action.status}</span>
          </div>
          <div>
            <span className="text-slate-400">Owner:</span>{' '}
            <span className={`font-semibold ${action.owner === 'Unclear' ? 'text-amber-800' : 'text-slate-800'}`}>
              {action.owner}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Active Deadline:</span>{' '}
            <span className="font-semibold text-slate-800">{action.deadlineLabel}</span>
          </div>
        </div>

        {/* Chronological Evidence Timeline */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Why does the agent think this? Chronological Evolution:</span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {evidenceList.map((item, idx) => (
              <div key={`${item.sourceId}-${idx}`} className="relative group">
                {/* Dot */}
                <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-indigo-600" />
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                  {/* Top line: Source type & time */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${getSourceBadge(item.sourceType)}`}>
                        {getSourceIcon(item.sourceType)}
                        <span className="capitalize">{item.sourceType.replace('_', ' ')}</span>
                      </span>
                      <span className="text-xs font-medium text-slate-800">{item.displayTime}</span>
                    </div>
                    {item.sourceId && (
                      <span className="text-[10px] font-mono text-slate-400">{item.sourceId}</span>
                    )}
                  </div>

                  {/* Sender and recipient */}
                  <div className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
                    <span className="font-medium text-slate-800">{item.from}</span>
                    {item.to && (
                      <>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{item.to}</span>
                      </>
                    )}
                  </div>

                  {/* Original quote */}
                  <div className="p-2.5 rounded bg-white border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed italic">
                    "{item.evidence}"
                  </div>

                  {/* Context Note */}
                  {item.note && (
                    <div className="mt-1.5 text-[11px] text-indigo-700 font-medium">
                      Note: {item.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Source Grounding: Data Pack Artifacts</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal;
