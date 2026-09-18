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
    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Relevant Meetings for Today</h3>
            <p className="text-xs text-slate-500">Arjun Malhotra's schedule on {asOfDate}</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
          {meetings.length} Event(s)
        </span>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-100">
          No scheduled calendar events for this day.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {meetings.map(m => {
            const isBlocked = m.event.toLowerCase() === 'blocked';
            return (
              <div
                key={m.id}
                className={`p-3 rounded-lg border transition-colors ${
                  isBlocked
                    ? 'bg-slate-50/50 border-slate-200 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>
                      {formatTime(m.startTime)} – {formatTime(m.endTime)}
                    </span>
                  </div>
                  {m.relatedAction && (
                    <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/80 flex items-center gap-0.5">
                      <span>Action Linked</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-900 mb-1">{m.event}</div>

                {m.relatedAction && (
                  <div className="text-[11px] text-indigo-700/90 line-clamp-1">
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

export default MeetingsSection;
