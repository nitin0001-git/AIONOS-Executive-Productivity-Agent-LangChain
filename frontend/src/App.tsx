import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { Header } from './components/Header';
import { TimeSelector } from './components/TimeSelector';
import { SummaryCards } from './components/SummaryCards';
import { DailyBrief } from './components/DailyBrief';
import { AskAgent } from './components/AskAgent';
import { EvidenceModal } from './components/EvidenceModal';
import { fetchBrief, fetchHealth, triggerPipeline } from './services/api';
import { ExecutiveBrief, SystemHealth, ActionItem } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'brief' | 'qa'>('brief');
  const [asOf, setAsOf] = useState<string>('2026-09-23T09:00:00');
  const [brief, setBrief] = useState<ExecutiveBrief | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState<boolean>(false);
  const [rebuildingPipeline, setRebuildingPipeline] = useState<boolean>(false);

  // Load system health
  useEffect(() => {
    fetchHealth()
      .then(h => setHealth(h))
      .catch(err => console.warn('Health check error:', err));
  }, []);

  // Load brief when asOf changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchBrief(asOf)
      .then(data => {
        if (isMounted) {
          setBrief(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Failed to load brief:', err);
          setError(err.message || 'Failed to connect to backend service.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [asOf]);

  const handleOpenEvidence = (action: ActionItem) => {
    setSelectedAction(action);
    setEvidenceModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    setActiveTab('brief');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleRebuildPipeline = async () => {
    setRebuildingPipeline(true);
    try {
      await triggerPipeline();
      const updatedBrief = await fetchBrief(asOf);
      setBrief(updatedBrief);
    } catch (err: any) {
      alert(`Pipeline rebuild failed: ${err.message}`);
    } finally {
      setRebuildingPipeline(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <Header
        health={health}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        asOf={asOf}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Historical Timeline Selector */}
        {brief && (
          <TimeSelector
            timepoints={brief.timepoints}
            currentAsOf={asOf}
            onSelectTime={newTime => setAsOf(newTime)}
          />
        )}

        {/* Global Loading Spinner */}
        {loading && !brief ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-600">Evaluating Historical State as of {asOf}...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-center space-y-3">
            <p className="font-bold text-sm">Backend Connection Error</p>
            <p className="text-xs text-rose-600">{error}</p>
            <button
              onClick={() => setAsOf('2026-09-23T09:00:00')}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 cursor-pointer transition-colors"
            >
              Reset to Default Time
            </button>
          </div>
        ) : brief ? (
          <>
            {/* Quick Metrics Bar */}
            <SummaryCards
              metrics={brief.metrics}
              onFilterClick={handleScrollToSection}
            />

            {/* View Switcher: Executive Brief vs Ask Agent */}
            {activeTab === 'brief' ? (
              <DailyBrief brief={brief} onViewEvidence={handleOpenEvidence} />
            ) : (
              <AskAgent currentAsOf={asOf} />
            )}
          </>
        ) : null}
      </main>

      {/* Source Evidence Audit Modal */}
      <EvidenceModal
        action={selectedAction}
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">AIONOS Executive Productivity Agent • Built for Arjun Malhotra (VP Sales)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={handleRebuildPipeline}
              disabled={rebuildingPipeline}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${rebuildingPipeline ? 'animate-spin text-indigo-600' : ''}`} />
              <span>Re-run Pipeline</span>
            </button>
            <span>•</span>
            <span>Historical Exercise: Sep 21–25, 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
