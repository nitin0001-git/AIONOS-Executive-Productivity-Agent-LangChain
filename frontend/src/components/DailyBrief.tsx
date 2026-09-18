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
    <div className="space-y-6">
      {/* 1. OVERDUE SECTION (Shown prominently at top if overdue items exist) */}
      {brief.overdue.length > 0 && (
        <section id="section-overdue" className="p-5 rounded-xl bg-rose-50/60 border border-rose-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 border border-rose-200">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-rose-950 tracking-tight">1. Overdue Actions</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                  {brief.overdue.length} Action(s) Past Deadline
                </span>
              </div>
              <p className="text-xs text-rose-700/90">Commitments whose deadline has elapsed relative to the simulated time</p>
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
      <section id="section-todays-actions" className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Today's Actions</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {brief.todaysActions.length} Pending Today
                </span>
              </div>
              <p className="text-xs text-slate-500">Items requiring Arjun's immediate execution, review, or participation today</p>
            </div>
          </div>
        </div>

        {brief.todaysActions.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-100">
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
      <section id="section-my-commitments" className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-violet-50 text-violet-600 border border-violet-100">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">My Commitments</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200">
                  {brief.myCommitments.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-500">Promises and deliverables made by Arjun to colleagues and clients</p>
            </div>
          </div>
        </div>

        {brief.myCommitments.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-100">
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
      <section id="section-waiting-on-others" className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
              <Hourglass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Waiting on Others</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                  {brief.waitingOnOthers.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-500">Actions where someone else needs to respond, finalize, or deliver</p>
            </div>
          </div>
        </div>

        {brief.waitingOnOthers.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-100">
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
      <section id="section-unclear-ownership" className="p-5 rounded-xl bg-white border border-amber-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Unclear Ownership</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  {brief.unclearOwnership.length} Unresolved
                </span>
              </div>
              <p className="text-xs text-slate-500">Critical tasks where ownership is unassigned or disputed (strictly preserved as Unclear)</p>
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
      <section id="section-upcoming-deadlines" className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Upcoming Deadlines</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {brief.upcomingDeadlines.length} Upcoming
                </span>
              </div>
              <p className="text-xs text-slate-500">Future commitments due later in the historical simulation week</p>
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

export default DailyBrief;
