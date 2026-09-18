/**
 * Deterministic Normalization Service
 * Standardizes names, roles, sources, and action models across extracted items.
 */

export const PERSON_MAP = {
  'arjun': 'Arjun Malhotra',
  'arjun malhotra': 'Arjun Malhotra',
  'arjun.malhotra@veridian-corp.example': 'Arjun Malhotra',

  'neha': 'Neha Kapoor',
  'neha kapoor': 'Neha Kapoor',
  'neha.kapoor@veridian-corp.example': 'Neha Kapoor',

  'raghav': 'Raghav Sethi',
  'raghav sethi': 'Raghav Sethi',
  'raghav.sethi@veridian-corp.example': 'Raghav Sethi',

  'divya': 'Divya Rao',
  'divya rao': 'Divya Rao',
  'divya.rao@veridian-corp.example': 'Divya Rao',

  'priya': 'Priya Nair',
  'priya nair': 'Priya Nair',
  'priya.nair@meridianlogistics.example': 'Priya Nair',

  'facilities': 'Facilities',
  'facilities@veridian-corp.example': 'Facilities',
  'all staff': 'All Staff',
  'allstaff@veridian-corp.example': 'All Staff'
};

/**
 * Normalize person or entity name
 */
export function normalizePerson(rawName) {
  if (!rawName) return null;
  const key = rawName.toLowerCase().trim();
  return PERSON_MAP[key] || rawName.trim();
}

/**
 * Standardize an evidence record
 */
export function normalizeEvidence(rawEvidence) {
  return {
    sourceType: rawEvidence.sourceType || 'email',
    sourceId: rawEvidence.sourceId || '',
    timestamp: rawEvidence.timestamp || '',
    displayTime: rawEvidence.displayTime || rawEvidence.timestamp || '',
    from: normalizePerson(rawEvidence.from) || 'Unknown',
    to: normalizePerson(rawEvidence.to) || '',
    evidence: (rawEvidence.evidence || rawEvidence.text || '').trim(),
    note: (rawEvidence.note || '').trim()
  };
}

/**
 * Normalize an action item to ensure all fields are strongly typed and compliant
 */
export function normalizeAction(action) {
  const owner = normalizePerson(action.owner);
  const recipient = normalizePerson(action.recipient);
  const waitingOn = normalizePerson(action.waitingOn);

  return {
    id: action.id,
    title: action.title.trim(),
    description: (action.description || '').trim(),
    category: action.category || 'general',
    owner: owner || (action.owner === 'Unclear' ? 'Unclear' : 'Unassigned'),
    recipient: recipient || null,
    status: action.status || 'open',
    deadline: action.deadline || null,
    deadlineLabel: action.deadlineLabel || 'Unspecified',
    completionTimestamp: action.completionTimestamp || null,
    priority: action.priority || 'medium',
    waitingOn: waitingOn || null,
    sourceIds: Array.isArray(action.sourceIds) ? action.sourceIds : [],
    evidence: Array.isArray(action.evidence) ? action.evidence.map(normalizeEvidence) : [],
    relatedPeople: Array.isArray(action.relatedPeople)
      ? [...new Set(action.relatedPeople.map(normalizePerson).filter(Boolean))]
      : [],
    lastUpdated: action.lastUpdated || (action.evidence?.[action.evidence.length - 1]?.timestamp) || '2026-09-21T09:00:00',
    confidence: action.confidence || 'high'
  };
}
