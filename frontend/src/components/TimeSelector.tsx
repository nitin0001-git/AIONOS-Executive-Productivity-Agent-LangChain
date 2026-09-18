import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Timepoint } from '../types';

interface TimeSelectorProps {
  timepoints: Timepoint[];
  currentAsOf: string;
  onSelectTime: (iso: string) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  timepoints,
  currentAsOf,
  onSelectTime
}) => {
  const currentIndex = timepoints.findIndex(t => t.iso === currentAsOf);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectTime(timepoints[currentIndex - 1].iso);
    }
  };

  const handleNext = () => {
    if (currentIndex < timepoints.length - 1) {
      onSelectTime(timepoints[currentIndex + 1].iso);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title and Explanation */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Simulated Timeline</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Historical Exercise Week (Sep 21–25, 2026)</span>
            </div>
            <div className="text-sm font-semibold text-white flex items-center gap-2 mt-0.5">
              <span>Viewing as of:</span>
              <span className="text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                {timepoints.find(t => t.iso === currentAsOf)?.label || currentAsOf}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stepper Controls & Dropdown */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            title="Step Back in Time"
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative">
            <select
              id="time-selector-dropdown"
              value={currentAsOf}
              onChange={e => onSelectTime(e.target.value)}
              className="appearance-none bg-slate-800/90 border border-slate-700 text-slate-100 text-xs font-medium rounded-lg px-3.5 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-inner"
            >
              {timepoints.map(tp => (
                <option key={tp.id} value={tp.iso} className="bg-slate-800 text-slate-100">
                  {tp.label}
                </option>
              ))}
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= timepoints.length - 1}
            title="Step Forward in Time"
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Pills for Quick Jumps */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {timepoints.map(tp => {
          const isSelected = tp.iso === currentAsOf;
          return (
            <button
              key={tp.id}
              onClick={() => onSelectTime(tp.iso)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/50 ring-1 ring-indigo-400/50'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tp.label.replace(' — ', ' ')}
            </button>
          );
        })}
      </div>
    </div>
  );
};
