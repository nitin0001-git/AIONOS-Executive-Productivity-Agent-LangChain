import React from 'react';
import { Clock, User, AlertTriangle, CheckCircle, Hourglass, ShieldAlert, FileText, ChevronRight } from 'lucide-react';
import { ActionItem } from '../types';

interface ActionCardProps {
  action: ActionItem;
  onViewEvidence: (action: ActionItem) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, onViewEvidence }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle
        };
      case 'overdue':
        return {
          label: 'Overdue',
          className: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold animate-pulse',
          icon: ShieldAlert
        };
      case 'waiting':
        return {
          label: 'Waiting on Others',
          className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          icon: Hourglass
        };
      case 'unclear':
        return {
          label: 'Ownership Unclear',
          className: 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold',
          icon: AlertTriangle
        };
      case 'scheduled':
        return {
          label: 'Scheduled',
          className: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
          icon: Clock
        };
      default:
        return {
          label: 'Open',
          className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          icon: Clock
        };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'medium':
        return 'bg-slate-700 text-slate-300 border-slate-600';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const statusBadge = getStatusBadge(action.status);
  const StatusIcon = statusBadge.icon;
  const evidenceCount = action.knownEvidence?.length || action.evidence?.length || 0;

  return (
    <div className="p-4 rounded-2xl bg-slate-900/75 border border-slate-800 hover:border-slate-700 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-950/20 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge.className}`}>
              <StatusIcon className="w-3 h-3" />
              <span>{statusBadge.label}</span>
            </span>

            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityBadge(action.priority)}`}>
              {action.priority}
            </span>

            <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              {action.category.replace('_', ' ')}
            </span>
          </div>

          {/* Evidence pill trigger */}
          <button
            onClick={() => onViewEvidence(action)}
            className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-0.5 rounded-lg border border-indigo-500/20 transition-colors"
          >
            <FileText className="w-3 h-3" />
            <span>{evidenceCount} Evidence</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Action Title */}
        <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors mb-1.5 leading-snug">
          {action.title}
        </h4>

        {/* Description Context */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {action.description}
        </p>
      </div>

      {/* Meta Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        {/* Owner / Waiting Info */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Owner:</span>
            <span className={`font-semibold ${action.owner === 'Unclear' ? 'text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30' : 'text-slate-200'}`}>
              {action.owner}
            </span>
          </div>

          {action.waitingOn && action.status !== 'completed' && (
            <div className="flex items-center gap-1 text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">
              <span>Waiting on:</span>
              <span className="font-semibold">{action.waitingOn}</span>
            </div>
          )}
        </div>

        {/* Deadline Badge */}
        <div className="flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/80">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="font-medium text-[11px]">{action.deadlineLabel}</span>
        </div>
      </div>
    </div>
  );
};
