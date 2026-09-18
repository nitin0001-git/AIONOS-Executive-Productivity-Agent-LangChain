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
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-100',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'Action Required',
      description: 'Priorities for Arjun today'
    },
    {
      id: 'section-waiting-on-others',
      label: 'Waiting on Others',
      count: metrics.waitingOnOthersCount,
      icon: Hourglass,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50 border-sky-100',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      badge: 'Delegated',
      description: 'Pending external deliverables'
    },
    {
      id: 'section-overdue',
      label: 'Overdue Items',
      count: metrics.overdueCount,
      icon: AlertCircle,
      iconColor: metrics.overdueCount > 0 ? 'text-rose-600' : 'text-slate-400',
      iconBg: metrics.overdueCount > 0 ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100',
      badgeClass: metrics.overdueCount > 0 ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold' : 'bg-slate-50 text-slate-600 border-slate-200',
      badge: metrics.overdueCount > 0 ? 'Action Overdue' : 'On Track',
      description: 'Past deadline commitments',
      highlight: metrics.overdueCount > 0
    },
    {
      id: 'section-unclear-ownership',
      label: 'Unclear Ownership',
      count: metrics.unclearOwnershipCount,
      icon: HelpCircle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-100',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Unassigned',
      description: 'Flagged, needs assignment'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterClick && onFilterClick(card.id)}
            className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer bg-white hover:border-slate-300 hover:shadow-sm ${
              card.highlight
                ? 'border-rose-200 ring-1 ring-rose-200/50'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className={`p-2 rounded-lg border ${card.iconBg} ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${card.badgeClass}`}>
                {card.badge}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{card.count}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{card.label}</div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-1">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
