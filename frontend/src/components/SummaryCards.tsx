import React from 'react';
import { AlertCircle, Hourglass, HelpCircle, CheckCircle2 } from 'lucide-react';
import { BriefMetrics } from '../types';

interface SummaryCardsProps {
  metrics: BriefMetrics;
  onFilterClick?: (sectionId: string) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics, onFilterClick }) => {
  const cards = [
    {
      id: 'section-todays-actions',
      label: "Today's Actions",
      count: metrics.todaysActionsCount,
      icon: CheckCircle2,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      badge: 'Action Required',
      description: 'Priorities for Arjun today'
    },
    {
      id: 'section-waiting-on-others',
      label: 'Waiting on Others',
      count: metrics.waitingOnOthersCount,
      icon: Hourglass,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      badge: 'Delegated / Blocked',
      description: 'Pending external deliverables'
    },
    {
      id: 'section-overdue',
      label: 'Overdue Items',
      count: metrics.overdueCount,
      icon: AlertCircle,
      color: metrics.overdueCount > 0 ? 'text-rose-400' : 'text-slate-400',
      bgColor: metrics.overdueCount > 0 ? 'bg-rose-500/10' : 'bg-slate-800/40',
      borderColor: metrics.overdueCount > 0 ? 'border-rose-500/30' : 'border-slate-800',
      badge: metrics.overdueCount > 0 ? 'Critical' : 'All On Track',
      description: 'Past deadline commitments'
    },
    {
      id: 'section-unclear-ownership',
      label: 'Unclear Ownership',
      count: metrics.unclearOwnershipCount,
      icon: HelpCircle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      badge: 'Unassigned',
      description: 'Flagged, needs assignment'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterClick && onFilterClick(card.id)}
            className={`p-4 rounded-2xl border ${card.borderColor} ${card.bgColor} backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl bg-slate-900/60 border border-white/5 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/60 border border-white/5 ${card.color}`}>
                {card.badge}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight">{card.count}</div>
                <div className="text-xs font-semibold text-slate-300 mt-1">{card.label}</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 group-hover:text-slate-200 transition-colors">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
