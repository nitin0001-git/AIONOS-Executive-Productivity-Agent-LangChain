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
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle
        };
      case 'overdue':
        return {
          label: 'Overdue',
          className: 'bg-rose-50 text-rose-700 border-rose-300 font-bold',
          icon: ShieldAlert
        };
      case 'waiting':
        return {
          label: 'Waiting on Others',
          className: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: Hourglass
        };
      case 'unclear':
        return {
          label: 'Ownership Unclear',
          className: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
          icon: AlertTriangle
        };
      case 'scheduled':
        return {
          label: 'Scheduled',
          className: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Clock
        };
      default:
        return {
          label: 'Open',
          className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: Clock
        };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const statusBadge = getStatusBadge(action.status);
  const StatusIcon = statusBadge.icon;
  const evidenceCount = action.knownEvidence?.length || action.evidence?.length || 0;

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-150 shadow-2xs hover:shadow-sm flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${statusBadge.className}`}>
              <StatusIcon className="w-3 h-3" />
              <span>{statusBadge.label}</span>
            </span>

            <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getPriorityBadge(action.priority)}`}>
              {action.priority}
            </span>

            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {action.category.replace('_', ' ')}
            </span>
          </div>

          {/* Evidence pill trigger */}
          <button
            onClick={() => onViewEvidence(action)}
            className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200/70 transition-colors cursor-pointer"
          >
            <FileText className="w-3 h-3" />
            <span>{evidenceCount} Evidence</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Action Title */}
        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1 leading-snug">
          {action.title}
        </h4>

        {/* Description Context */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {action.description}
        </p>
      </div>

      {/* Meta Bar */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        {/* Owner / Waiting Info */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Owner:</span>
            <span className={`font-semibold ${action.owner === 'Unclear' ? 'text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200' : 'text-slate-800'}`}>
              {action.owner}
            </span>
          </div>

          {action.waitingOn && action.status !== 'completed' && (
            <div className="flex items-center gap-1 text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
              <span className="text-sky-600">Waiting on:</span>
              <span className="font-semibold">{action.waitingOn}</span>
            </div>
          )}
        </div>

        {/* Deadline Badge */}
        <div className="flex items-center gap-1 text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="font-medium">{action.deadlineLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
