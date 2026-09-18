import React from 'react';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { MeetingItem } from '../types';

interface MeetingsSectionProps {
  meetings: MeetingItem[];
  asOfDate: string;
}

export const MeetingsSection: React.FC<MeetingsSectionProps> = ({ meetings, asOfDate }) => {
  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Relevant Meetings for Today</h3>
            <p className="text-xs text-slate-400">Arjun Malhotra's schedule on {asOfDate}</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {meetings.length} Event(s)
        </span>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
          No scheduled calendar events for this day.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {meetings.map(m => {
            const isBlocked = m.event.toLowerCase() === 'blocked';
            return (
              <div
                key={m.id}
                className={`p-3 rounded-xl border transition-all ${
                  isBlocked
                    ? 'bg-slate-950/30 border-slate-850 text-slate-500'
                    : 'bg-slate-850/70 border-slate-750 text-slate-200 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatTime(m.startTime)} – {formatTime(m.endTime)}
                    </span>
                  </div>
                  {m.relatedAction && (
                    <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 flex items-center gap-0.5">
                      <span>Action Linked</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-white mb-1">{m.event}</div>

                {m.relatedAction && (
                  <div className="text-[11px] text-indigo-300/80 line-clamp-1">
                    Related: {m.relatedAction}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
