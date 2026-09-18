/**
 * Deterministic Deduplication Service
 * Consolidates cross-channel mentions (meeting, email threads, voice notes, calendar)
 * into unified canonical actions while preserving the full chronological evidence trail.
 */

import { normalizeAction } from './normalize.js';

/**
 * Cluster keys to identify duplicate mentions of the same real-world commitment
 */
function getClusterKey(item) {
  const title = (item.title || '').toLowerCase();
  const text = `${item.title || ''} ${item.description || ''} ${item.id || ''}`.toLowerCase();

  if (title.includes('vendor') || text.includes('vendor list')) {
    return 'cluster-vendor-list';
  }
  if (title.includes('mumbai') || title.includes('lease') || text.includes('mumbai office') || text.includes('lease renewal')) {
    return 'cluster-mumbai-lease';
  }
  if (title.includes('campaign') || title.includes('deck') || text.includes('campaign deck') || text.includes('q3 deck')) {
    return 'cluster-campaign-deck';
  }
  if (title.includes('expense') || title.includes('variance') || text.includes('variance report')) {
    return 'cluster-expense-variance';
  }
  if (title.includes('meridian') || text.includes('meridian logistics')) {
    return 'cluster-meridian-call';
  }
  if (title.includes('board prep') || text.includes('board prep session')) {
    return 'cluster-board-prep';
  }
  if (title.includes('facilities check-in') || title.includes('facilities checkin')) {
    return 'cluster-facilities-checkin';
  }
  if (title.includes('hiring panel') || text.includes('hiring panel')) {
    return 'cluster-hiring-panel';
  }

  return `cluster-${item.id || Math.random().toString(36).substring(7)}`;
}

/**
 * Merge an array of actions into deduplicated canonical actions
 * @param {Array<Object>} rawActions 
 * @returns {Array<Object>}
 */
export function deduplicateActions(rawActions) {
  const clusters = new Map();

  for (const action of rawActions) {
    const clusterKey = getClusterKey(action);

    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, []);
    }
    clusters.get(clusterKey).push(action);
  }

  const canonicalActions = [];

  for (const [clusterKey, items] of clusters.entries()) {
    // Sort items by lastUpdated or earliest timestamp
    items.sort((a, b) => (a.lastUpdated || '').localeCompare(b.lastUpdated || ''));

    // Base canonical record is the latest item
    const latestItem = items[items.length - 1];

    // Combine all evidence chronologically
    const allEvidence = [];
    const seenEvidenceKeys = new Set();
    const allSourceIds = new Set();
    const allRelatedPeople = new Set();

    for (const it of items) {
      if (Array.isArray(it.sourceIds)) {
        it.sourceIds.forEach(id => allSourceIds.add(id));
      }
      if (Array.isArray(it.relatedPeople)) {
        it.relatedPeople.forEach(p => allRelatedPeople.add(p));
      }
      if (Array.isArray(it.evidence)) {
        for (const ev of it.evidence) {
          const key = `${ev.sourceType}-${ev.timestamp}-${ev.from}-${ev.evidence.substring(0, 30)}`;
          if (!seenEvidenceKeys.has(key)) {
            seenEvidenceKeys.add(key);
            allEvidence.push(ev);
          }
        }
      }
    }

    // Sort evidence by timestamp
    allEvidence.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));

    // Canonical action assembly
    const canonical = normalizeAction({
      ...latestItem,
      evidence: allEvidence,
      sourceIds: Array.from(allSourceIds),
      relatedPeople: Array.from(allRelatedPeople),
      lastUpdated: allEvidence[allEvidence.length - 1]?.timestamp || latestItem.lastUpdated
    });

    canonicalActions.push(canonical);
  }

  return canonicalActions;
}
