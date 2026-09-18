import React from 'react';
import {
  CheckCircle2,
  Hourglass,
  AlertOctagon,
  HelpCircle,
  Clock,
  ListTodo
} from 'lucide-react';
import { ExecutiveBrief, ActionItem } from '../types';
import { ActionCard } from './ActionCard';
import { MeetingsSection } from './MeetingsSection';

interface DailyBriefProps {
  brief: ExecutiveBrief;
  onViewEvidence: (action: ActionItem) => void;
}

export const DailyBrief: React.FC<DailyBriefProps> = ({ brief, onViewEvidence }) => {
  return (
    <div className="space-y-8">
      {/* 1. OVERDUE SECTION (Shown prominently at top if overdue items exist) */}
      {brief.overdue.length > 0 && (
        <section id="section-overdue" className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">1. Overdue Actions</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {brief.overdue.length} Action(s) Past Deadline
                </span>
              </div>
              <p className="text-xs text-rose-300/80">Commitments whose deadline has elapsed relative to the simulated time</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brief.overdue.map(action => (
              <ActionCard key={action.id} action={action} onViewEvidence={onViewEvidence} />
            ))}
          </div>
        </section>
      )}

      {/* 2. TODAY'S ACTIONS */}
      <section id="section-todays-actions" className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Today's Actions</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {brief.todaysActions.length} Pending Today
                </span>
              </div>
              <p className="text-xs text-slate-400">Items requiring Arjun's immediate execution, review, or participation today</p>
            </div>
          </div>
        </div>

        {brief.todaysActions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
            No pending action items scheduled for today.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brief.todaysActions.map(action => (
              <ActionCard key={action.id} action={action} onViewEvidence={onViewEvidence} />
            ))}
          </div>
        )}
      </section>

      {/* 3. MY COMMITMENTS */}
      <section id="section-my-commitments" className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">My Commitments</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {brief.myCommitments.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400">Promises and deliverables made by Arjun to colleagues and clients</p>
            </div>
          </div>
        </div>

        {brief.myCommitments.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
            No active personal commitments outstanding.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brief.myCommitments.map(action => (
              <ActionCard key={action.id} action={action} onViewEvidence={onViewEvidence} />
            ))}
          </div>
        )}
      </section>

      {/* 4. WAITING ON OTHERS */}
      <section id="section-waiting-on-others" className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Hourglass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Waiting on Others</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {brief.waitingOnOthers.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-400">Actions where someone else needs to respond, finalize, or deliver</p>
            </div>
          </div>
        </div>

        {brief.waitingOnOthers.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
            You are not currently blocked on any deliverables.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brief.waitingOnOthers.map(action => (
              <ActionCard key={action.id} action={action} onViewEvidence={onViewEvidence} />
            ))}
          </div>
        )}
      </section>

      {/* 5. UNCLEAR OWNERSHIP */}
      <section id="section-unclear-ownership" className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Unclear Ownership</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {brief.unclearOwnership.length} Unresolved
                </span>
              </div>
              <p className="text-xs text-slate-400">Critical tasks where ownership is unassigned or disputed (strictly preserved as Unclear)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brief.unclearOwnership.map(action => (
            <ActionCard key={action.id} action={action} onViewEvidence={onViewEvidence} />
          ))}
        </div>
      </section>

      {/* 6. UPCOMING DEADLINES */}
      <section id="section-upcoming-deadlines" className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Upcoming Deadlines</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {brief.upcomingDeadlines.length} Upcoming
                </span>
              </div>
              <p className="text-xs text-slate-400">Future commitments due later in the historical simulation week</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brief.upcomingDeadlines.map(action => (
            <ActionCard key={action.id} action={action} onViewEvidence={onViewEvidence} />
          ))}
        </div>
      </section>

      {/* 7. RELEVANT MEETINGS */}
      <MeetingsSection meetings={brief.relevantMeetings} asOfDate={brief.asOfDate} />
    </div>
  );
};
