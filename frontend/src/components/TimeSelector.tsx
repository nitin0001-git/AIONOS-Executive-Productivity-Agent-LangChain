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
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Title and Explanation */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Simulated Timeline</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500">Historical Exercise Week (Sep 21–25, 2026)</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 flex items-center gap-2 mt-0.5">
              <span>Viewing as of:</span>
              <span className="text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200/70 font-bold">
                {timepoints.find(t => t.iso === currentAsOf)?.label || currentAsOf}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stepper Controls & Dropdown */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            title="Step Back in Time"
            className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative">
            <select
              id="time-selector-dropdown"
              value={currentAsOf}
              onChange={e => onSelectTime(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer shadow-2xs"
            >
              {timepoints.map(tp => (
                <option key={tp.id} value={tp.iso}>
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
            className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Pills for Quick Jumps */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1">
        {timepoints.map(tp => {
          const isSelected = tp.iso === currentAsOf;
          return (
            <button
              key={tp.id}
              onClick={() => onSelectTime(tp.iso)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white font-medium shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
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

export default TimeSelector;
