/**
 * Executive Daily Brief Engine
 * Generates tailored executive dashboard sections for Arjun Malhotra (VP Sales)
 * based on the simulated historical timestamp.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveActionStateAsOf, DEFAULT_AS_OF, SIMULATED_TIMEPOINTS } from './status.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PACK_PATH = path.resolve(__dirname, '../data/raw/dataPack.json');
const ACTIONS_PATH = path.resolve(__dirname, '../data/actions.json');

/**
 * Load raw dataPack
 */
function loadDataPack() {
  if (fs.existsSync(DATA_PACK_PATH)) {
    return JSON.parse(fs.readFileSync(DATA_PACK_PATH, 'utf-8'));
  }
  return null;
}

/**
 * Load canonical actions
 */
export function loadActions() {
  if (fs.existsSync(ACTIONS_PATH)) {
    return JSON.parse(fs.readFileSync(ACTIONS_PATH, 'utf-8'));
  }
  return [];
}

/**
 * Generate the Executive Daily Brief for Arjun Malhotra as of the specified time
 * @param {string} asOf 
 * @returns {Object}
 */
export function generateBrief(asOf = DEFAULT_AS_OF) {
  const allCanonical = loadActions();
  const dataPack = loadDataPack();

  const asOfDate = asOf.split('T')[0]; // e.g. "2026-09-23"

  // Evaluate each action as of the simulated time
  const evaluatedActions = allCanonical
    .map(act => resolveActionStateAsOf(act, asOf))
    .filter(Boolean);

  // 1. Overdue actions (deadline strictly passed, not completed)
  const overdue = evaluatedActions.filter(act => act.status === 'overdue');

  // 2. Unclear ownership items (e.g. Mumbai lease)
  const unclearOwnership = evaluatedActions.filter(act => act.status === 'unclear' || act.owner === 'Unclear');

  // 3. Today's Actions (Arjun's active responsibilities today)
  const todaysActions = evaluatedActions.filter(act => {
    if (act.status === 'completed') {
      // Show completed items only if completed today
      return act.completionTimestamp?.startsWith(asOfDate);
    }
    const deadlineDate = act.deadline?.split('T')[0];
    const isDueToday = deadlineDate === asOfDate;
    const isOwner = act.owner === 'Arjun Malhotra';
    const isScheduledToday = act.category === 'scheduled_event' && deadlineDate === asOfDate;
    const isOverdue = act.status === 'overdue';

    return (isDueToday && isOwner) || isScheduledToday || isOverdue;
  });

  // 4. My Commitments (promises Arjun made to others)
  const myCommitments = evaluatedActions.filter(act => {
    return act.owner === 'Arjun Malhotra' && act.status !== 'completed' && act.category !== 'scheduled_event';
  });

  // 5. Waiting on Others
  const waitingOnOthers = evaluatedActions.filter(act => {
    return act.status === 'waiting' || (act.waitingOn && act.status !== 'completed' && act.owner !== 'Arjun Malhotra');
  });

  // 6. Upcoming Deadlines (future deadlines relative to asOf)
  const upcomingDeadlines = evaluatedActions.filter(act => {
    return act.deadline && act.deadline >= asOf && act.status !== 'completed';
  });

  // 7. Relevant Meetings for Arjun for today
  const arjunCal = dataPack?.calendars?.['Arjun Malhotra'] || [];
  const relevantMeetings = arjunCal
    .filter(evt => evt.date === asOfDate)
    .map(evt => {
      // Find related actions
      let relatedActionTitle = null;
      if (evt.event.includes('Meridian')) {
        relatedActionTitle = 'Reschedule & Hold Meridian Logistics Client Call';
      } else if (evt.event.includes('Board Prep')) {
        relatedActionTitle = 'July Expense Variance Report & Q3 Campaign Deck';
      } else if (evt.event.includes('Facilities Check-in')) {
        relatedActionTitle = 'Mumbai Office Lease Renewal Sign-off';
      } else if (evt.event.includes('1:1 with Neha')) {
        relatedActionTitle = 'Q3 Campaign Deck Draft';
      }

      return {
        id: evt.id,
        date: evt.date,
        startTime: evt.startTime,
        endTime: evt.endTime,
        event: evt.event,
        relatedAction: relatedActionTitle
      };
    });

  // Summary Metrics
  const metrics = {
    todaysActionsCount: todaysActions.length,
    myCommitmentsCount: myCommitments.length,
    waitingOnOthersCount: waitingOnOthers.length,
    unclearOwnershipCount: unclearOwnership.length,
    overdueCount: overdue.length,
    upcomingDeadlinesCount: upcomingDeadlines.length,
    meetingsCount: relevantMeetings.length
  };

  return {
    asOf,
    asOfDate,
    user: {
      name: 'Arjun Malhotra',
      role: 'VP Sales',
      company: 'Veridian Corp'
    },
    metrics,
    todaysActions,
    myCommitments,
    waitingOnOthers,
    unclearOwnership,
    overdue,
    upcomingDeadlines,
    relevantMeetings,
    allActions: evaluatedActions,
    timepoints: SIMULATED_TIMEPOINTS
  };
}
