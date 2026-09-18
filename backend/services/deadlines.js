/**
 * Deterministic Deadline Resolver
 * Resolves relative date/time expressions against source timestamps within the
 * historical simulation week of Monday 21 September 2026 – Friday 25 September 2026.
 */

// Calendar mapping for the historical week
const HISTORICAL_DATES = {
  monday: '2026-09-21',
  mon: '2026-09-21',
  tuesday: '2026-09-22',
  tue: '2026-09-22',
  wednesday: '2026-09-23',
  wed: '2026-09-23',
  thursday: '2026-09-24',
  thu: '2026-09-24',
  friday: '2026-09-25',
  fri: '2026-09-25'
};

/**
 * Given a source timestamp (ISO) and a date expression, return { deadline: string, deadlineLabel: string }
 * @param {string} rawExpression - e.g. "Wednesday morning", "tomorrow morning", "Friday, 25 September, end of day"
 * @param {string} sourceTimestamp - ISO string of message, e.g. "2026-09-22T18:30:00"
 * @returns {{ deadline: string, deadlineLabel: string }}
 */
export function resolveDeadline(rawExpression, sourceTimestamp) {
  if (!rawExpression) {
    return { deadline: null, deadlineLabel: 'Unspecified' };
  }

  const expr = rawExpression.toLowerCase().trim();
  const sourceDateStr = sourceTimestamp ? sourceTimestamp.split('T')[0] : '2026-09-21';
  
  // Specific known expressions from Data Pack:
  if (expr.includes('wednesday') && (expr.includes('morning') || expr.includes('this morning'))) {
    return {
      deadline: '2026-09-23T12:00:00',
      deadlineLabel: 'Wednesday morning (23 Sep)'
    };
  }

  if (expr.includes('wednesday') && (expr.includes('evening') || expr.includes('6:00 pm') || expr.includes('6 pm'))) {
    return {
      deadline: '2026-09-23T18:00:00',
      deadlineLabel: 'Wednesday evening (23 Sep, 6:00 PM)'
    };
  }

  if (expr.includes('wednesday') && (expr.includes('3:00 pm') || expr.includes('3 pm'))) {
    return {
      deadline: '2026-09-23T15:00:00',
      deadlineLabel: 'Wednesday 3:00 PM (23 Sep)'
    };
  }

  if (expr.includes('wednesday') && !expr.includes('morning') && !expr.includes('evening')) {
    return {
      deadline: '2026-09-23T17:00:00',
      deadlineLabel: 'Wednesday (23 Sep)'
    };
  }

  if (expr.includes('9:30 am thursday') || (expr.includes('thursday') && expr.includes('9:30'))) {
    return {
      deadline: '2026-09-24T09:30:00',
      deadlineLabel: 'Thursday 9:30 AM (24 Sep)'
    };
  }

  if (expr.includes('thursday') && (expr.includes('morning') || expr.includes('board prep'))) {
    return {
      deadline: '2026-09-24T09:00:00',
      deadlineLabel: 'Thursday morning before board prep (24 Sep, 9:00 AM)'
    };
  }

  if (expr.includes('thursday') && !expr.includes('morning')) {
    return {
      deadline: '2026-09-24T17:00:00',
      deadlineLabel: 'Thursday EOD (24 Sep)'
    };
  }

  if (expr.includes('friday') || expr.includes('25 september')) {
    return {
      deadline: '2026-09-25T18:00:00',
      deadlineLabel: 'Friday 25 Sep, End of Day'
    };
  }

  // Relative to source timestamp:
  if (expr.includes('tomorrow morning') || expr.includes('first thing tomorrow')) {
    if (sourceDateStr === '2026-09-21') {
      return {
        deadline: '2026-09-22T09:00:00',
        deadlineLabel: 'Tuesday morning (22 Sep)'
      };
    }
    if (sourceDateStr === '2026-09-22') {
      return {
        deadline: '2026-09-23T12:00:00',
        deadlineLabel: 'Wednesday morning (23 Sep)'
      };
    }
  }

  if (expr.includes('tomorrow') || expr.includes('end of day tomorrow')) {
    if (sourceDateStr === '2026-09-21') {
      return {
        deadline: '2026-09-22T17:00:00',
        deadlineLabel: 'Tuesday EOD (22 Sep)'
      };
    }
    if (sourceDateStr === '2026-09-22') {
      return {
        deadline: '2026-09-23T17:00:00',
        deadlineLabel: 'Wednesday EOD (23 Sep)'
      };
    }
  }

  if (expr.includes('today')) {
    return {
      deadline: `${sourceDateStr}T17:00:00`,
      deadlineLabel: `Today (${sourceDateStr} EOD)`
    };
  }

  if (expr.includes('this week')) {
    return {
      deadline: '2026-09-25T18:00:00',
      deadlineLabel: 'Friday 25 Sep, End of Day'
    };
  }

  return {
    deadline: null,
    deadlineLabel: rawExpression
  };
}
