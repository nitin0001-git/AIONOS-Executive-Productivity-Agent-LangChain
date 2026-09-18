import React from 'react';
import { UserCheck, Sparkles, ShieldCheck, MessageSquare, LayoutDashboard } from 'lucide-react';
import { SystemHealth } from '../types';

interface HeaderProps {
  health: SystemHealth | null;
  activeTab: 'brief' | 'qa';
  setActiveTab: (tab: 'brief' | 'qa') => void;
  asOf: string;
}

export const Header: React.FC<HeaderProps> = ({ health, activeTab, setActiveTab }) => {

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Executive Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Arjun Malhotra</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  VP Sales
                </span>
                <span className="text-xs text-slate-400">Veridian Corp</span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Executive Productivity Agent</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 font-medium">Historical Simulation (Sep 21–25, 2026)</span>
              </p>
            </div>
          </div>

          {/* Controls & Nav */}
          <div className="flex items-center gap-3">
            {/* AI Engine Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <Sparkles className={`w-3.5 h-3.5 ${health?.geminiConfigured ? 'text-violet-400' : 'text-amber-400'}`} />
              <span>{health?.geminiConfigured ? `Gemini 3.8 Flash` : 'Deterministic Grounding'}</span>
              <span className={`w-2 h-2 rounded-full ${health?.geminiConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
              <button
                id="tab-brief"
                onClick={() => setActiveTab('brief')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'brief'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Executive Brief</span>
              </button>
              <button
                id="tab-qa"
                onClick={() => setActiveTab('qa')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'qa'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Agent</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
