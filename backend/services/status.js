/**
 * Deterministic Status & Historical State Resolver
 * Evaluates actions strictly relative to a simulated "asOf" timestamp.
 */

/**
 * Standard simulated time points for easy selection
 */
export const SIMULATED_TIMEPOINTS = [
  { id: 'mon-9am', label: 'Monday 21 Sep — 9:00 AM', iso: '2026-09-21T09:00:00' },
  { id: 'mon-eod', label: 'Monday 21 Sep — EOD (6:00 PM)', iso: '2026-09-21T18:00:00' },
  { id: 'tue-9am', label: 'Tuesday 22 Sep — 9:00 AM', iso: '2026-09-22T09:00:00' },
  { id: 'tue-eod', label: 'Tuesday 22 Sep — EOD (6:00 PM)', iso: '2026-09-22T18:00:00' },
  { id: 'wed-9am', label: 'Wednesday 23 Sep — 9:00 AM (Default)', iso: '2026-09-23T09:00:00' },
  { id: 'wed-eod', label: 'Wednesday 23 Sep — EOD (6:00 PM)', iso: '2026-09-23T18:00:00' },
  { id: 'thu-9am', label: 'Thursday 24 Sep — 9:00 AM', iso: '2026-09-24T09:00:00' },
  { id: 'thu-eod', label: 'Thursday 24 Sep — EOD (6:00 PM)', iso: '2026-09-24T18:00:00' },
  { id: 'fri-9am', label: 'Friday 25 Sep — 9:00 AM', iso: '2026-09-25T09:00:00' },
  { id: 'fri-eod', label: 'Friday 25 Sep — EOD (6:00 PM)', iso: '2026-09-25T18:00:00' }
];

export const DEFAULT_AS_OF = '2026-09-23T09:00:00';

/**
 * Resolve an action's state strictly as of the simulated timestamp
 * @param {Object} action - canonical action definition
 * @param {string} asOf - ISO string representation of simulated time
 * @returns {Object|null} - evaluated action as of that time, or null if not yet introduced
 */
export function resolveActionStateAsOf(action, asOf = DEFAULT_AS_OF) {
  // Evidence known up to asOf
  let knownEvidence = (action.evidence || []).filter(ev => {
    if (!ev.timestamp) return true;
    return ev.timestamp <= asOf;
  });

  // If viewing at the exact start of the week, include the initial evidence
  if (knownEvidence.length === 0 && action.evidence?.length > 0) {
    knownEvidence = [action.evidence[0]];
  }

  // Determine active deadline based on latest evidence known up to asOf
  let activeDeadline = action.deadline;
  let activeDeadlineLabel = action.deadlineLabel;

  // Specific historical deadline transitions:
  if (action.id === 'action-vendor-list') {
    if (asOf < '2026-09-21T17:40:00') {
      activeDeadline = '2026-09-22T17:00:00';
      activeDeadlineLabel = 'Tuesday EOD (22 Sep)';
    } else if (asOf < '2026-09-22T18:30:00') {
      activeDeadline = '2026-09-22T09:00:00';
      activeDeadlineLabel = 'Tuesday morning (22 Sep)';
    } else {
      activeDeadline = '2026-09-23T12:00:00';
      activeDeadlineLabel = 'Wednesday morning (23 Sep)';
    }
  } else if (action.id === 'action-campaign-deck') {
    if (asOf < '2026-09-22T16:15:00') {
      activeDeadline = '2026-09-23T17:00:00';
      activeDeadlineLabel = 'Wednesday review (23 Sep)';
    } else {
      activeDeadline = '2026-09-24T09:30:00';
      activeDeadlineLabel = 'Thursday 9:30 AM (24 Sep)';
    }
  } else if (action.id === 'action-expense-variance') {
    if (asOf < '2026-09-22T09:40:00') {
      activeDeadline = '2026-09-24T09:00:00';
      activeDeadlineLabel = 'Thursday morning board prep (24 Sep)';
    } else {
      activeDeadline = '2026-09-23T18:00:00';
      activeDeadlineLabel = 'Wednesday evening (23 Sep, 6:00 PM)';
    }
  }

  // Determine status as of asOf
  let calculatedStatus = 'open';

  // Rule 1: Unclear ownership is ALWAYS UNCLEAR
  if (action.owner === 'Unclear' || action.id === 'action-mumbai-lease') {
    calculatedStatus = 'unclear';
  }
  // Rule 2: Check completion timestamp
  else if (action.completionTimestamp && asOf >= action.completionTimestamp) {
    calculatedStatus = 'completed';
  }
  // Rule 3: Check overdue condition (if not completed and deadline has passed)
  else if (activeDeadline && asOf > activeDeadline) {
    calculatedStatus = 'overdue';
  }
  // Rule 4: Scheduled meetings / calls
  else if (action.isMeeting || action.category === 'scheduled_event' || (action.id === 'action-meridian-call' && asOf >= '2026-09-22T17:45:00')) {
    if (asOf >= action.endTime || (action.id === 'action-meridian-call' && asOf > '2026-09-23T15:30:00')) {
      calculatedStatus = 'completed';
    } else {
      calculatedStatus = 'scheduled';
    }
  }
  // Rule 5: Waiting on others (if Arjun is not owner)
  else if (action.owner !== 'Arjun Malhotra') {
    calculatedStatus = 'waiting';
  }
  // Rule 6: Open commitment by Arjun
  else {
    calculatedStatus = 'open';
  }

  return {
    ...action,
    deadline: activeDeadline,
    deadlineLabel: activeDeadlineLabel,
    status: calculatedStatus,
    knownEvidence,
    asOfEvaluated: asOf
  };
}
