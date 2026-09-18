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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Executive Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">Arjun Malhotra</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  VP Sales
                </span>
                <span className="text-xs text-slate-500">Veridian Corp</span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium text-slate-700">Executive Productivity Agent</span>
                <span className="text-slate-300">•</span>
                <span>Historical Simulation (Sep 21–25, 2026)</span>
              </p>
            </div>
          </div>

          {/* Controls & Nav */}
          <div className="flex items-center gap-3">
            {/* AI Engine Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-medium">LangChain</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">{health?.geminiConfigured ? 'Gemini 3.8 Flash' : 'Deterministic Grounding'}</span>
              <span className={`w-2 h-2 rounded-full ${health?.geminiConfigured ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                id="tab-brief"
                onClick={() => setActiveTab('brief')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'brief'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                <span>Executive Brief</span>
              </button>
              <button
                id="tab-qa"
                onClick={() => setActiveTab('qa')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'qa'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Ask Agent</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
