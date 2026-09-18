/**
 * Automated Verification Test Suite
 * Validates all 10 core assignment scenarios for AIONOS Executive Productivity Agent:
 * 1. Vendor list deduplication
 * 2. Vendor deadline update
 * 3. Campaign deck deadline update
 * 4. Expense report completion
 * 5. Mumbai lease unclear ownership
 * 6. Meridian call schedule
 * 7. Daily brief filtering
 * 8. Overdue calculation
 * 9. Q&A grounding
 * 10. Source evidence availability
 */

import { generateBrief, loadActions } from '../services/brief.js';
import { resolveActionStateAsOf } from '../services/status.js';
import { askQuestion } from '../services/qa.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

async function runTests() {
  console.log('======================================================');
  console.log(' RUNNING AIONOS EXECUTIVE PRODUCTIVITY AGENT VERIFICATION');
  console.log(' Target User: Arjun Malhotra (VP Sales)');
  console.log(' Historical Exercise Week: 21–25 September 2026');
  console.log('======================================================\n');

  const actions = loadActions();

  // Test 1: Vendor list deduplication
  console.log('Test 1: Vendor List Deduplication');
  const vendorActions = actions.filter(a => a.id === 'action-vendor-list');
  assert(vendorActions.length === 1, 'Only one canonical vendor list action exists', `Found ${vendorActions.length}`);
  const vendorAction = vendorActions[0];
  assert(vendorAction && vendorAction.evidence.length >= 5, 'Vendor list has complete evidence chain (meeting, emails, voice note)', `Evidence count: ${vendorAction?.evidence?.length}`);

  // Test 2: Vendor deadline evolution
  console.log('\nTest 2: Vendor Deadline Evolution');
  // As of Mon 21 Sep 9:00 AM (Sync) -> Tuesday EOD
  const stateMon9am = resolveActionStateAsOf(vendorAction, '2026-09-21T09:00:00');
  assert(stateMon9am.deadline === '2026-09-22T17:00:00', 'Monday 9:00 AM deadline is Tuesday EOD', `Got ${stateMon9am.deadline}`);
  // As of Mon 21 Sep 6:40 PM (Voice Note & Email) -> Tuesday morning
  const stateMonEod = resolveActionStateAsOf(vendorAction, '2026-09-21T18:40:00');
  assert(stateMonEod.deadline === '2026-09-22T09:00:00', 'Monday evening deadline is Tuesday morning', `Got ${stateMonEod.deadline}`);
  // As of Tue 22 Sep 6:30 PM (Email to Raghav) -> Wednesday morning
  const stateTueEod = resolveActionStateAsOf(vendorAction, '2026-09-22T18:30:00');
  assert(stateTueEod.deadline === '2026-09-23T12:00:00', 'Tuesday evening deadline is Wednesday morning', `Got ${stateTueEod.deadline}`);

  // Test 3: Campaign deck deadline update & delivery
  console.log('\nTest 3: Campaign Deck Deadline Evolution');
  const deckAction = actions.find(a => a.id === 'action-campaign-deck');
  assert(Boolean(deckAction), 'Campaign deck canonical action exists');
  const deckMon = resolveActionStateAsOf(deckAction, '2026-09-21T11:00:00');
  assert(deckMon.deadline === '2026-09-23T17:00:00', 'Initial target review is Wednesday', `Got ${deckMon.deadline}`);
  const deckTue = resolveActionStateAsOf(deckAction, '2026-09-22T17:00:00');
  assert(deckTue.deadline === '2026-09-24T09:30:00', 'Shifted target review is Thursday 9:30 AM', `Got ${deckTue.deadline}`);
  const deckThuDelivered = resolveActionStateAsOf(deckAction, '2026-09-24T09:00:00');
  assert(deckThuDelivered.status === 'completed', 'Thursday 9:00 AM status is completed (received Thu 8:00 AM)', `Got ${deckThuDelivered.status}`);

  // Test 4: Expense report completion
  console.log('\nTest 4: Expense Report Completion');
  const expenseAction = actions.find(a => a.id === 'action-expense-variance');
  assert(Boolean(expenseAction), 'Expense variance canonical action exists');
  const expWedMorning = resolveActionStateAsOf(expenseAction, '2026-09-23T09:00:00');
  assert(expWedMorning.status === 'waiting', 'Wednesday 9:00 AM status is waiting on Divya', `Got ${expWedMorning.status}`);
  assert(expWedMorning.deadline === '2026-09-23T18:00:00', 'Expense report deadline is Wednesday evening (18:00)', `Got ${expWedMorning.deadline}`);
  const expWedEod = resolveActionStateAsOf(expenseAction, '2026-09-23T18:10:00');
  assert(expWedEod.status === 'completed', 'Wednesday 6:10 PM status is completed (delivered at 18:00)', `Got ${expWedEod.status}`);

  // Test 5: Mumbai lease unclear ownership
  console.log('\nTest 5: Mumbai Lease Unclear Ownership');
  const leaseAction = actions.find(a => a.id === 'action-mumbai-lease');
  assert(Boolean(leaseAction), 'Mumbai lease canonical action exists');
  assert(leaseAction.owner === 'Unclear', 'Mumbai lease owner is explicitly "Unclear"', `Owner is: ${leaseAction.owner}`);
  assert(leaseAction.status === 'unclear', 'Mumbai lease status is "unclear"', `Status is: ${leaseAction.status}`);
  assert(leaseAction.deadline === '2026-09-25T18:00:00', 'Mumbai lease deadline is Friday 25 Sep EOD', `Deadline: ${leaseAction.deadline}`);
  const leaseThu = resolveActionStateAsOf(leaseAction, '2026-09-24T17:00:00');
  assert(leaseThu.status === 'unclear', 'Mumbai lease remains unclear on Thursday afternoon', `Status: ${leaseThu.status}`);

  // Test 6: Meridian call schedule
  console.log('\nTest 6: Meridian Call Schedule');
  const meridianAction = actions.find(a => a.id === 'action-meridian-call');
  assert(Boolean(meridianAction), 'Meridian call canonical action exists');
  assert(meridianAction.deadline === '2026-09-23T15:00:00', 'Call scheduled for Wednesday 3:00 PM (15:00)', `Time: ${meridianAction.deadline}`);
  const meridianWedMorning = resolveActionStateAsOf(meridianAction, '2026-09-23T09:00:00');
  assert(meridianWedMorning.status === 'scheduled', 'Wednesday 9:00 AM status is scheduled', `Got ${meridianWedMorning.status}`);
  const meridianWedPast = resolveActionStateAsOf(meridianAction, '2026-09-23T16:00:00');
  assert(meridianWedPast.status === 'completed', 'Wednesday 4:00 PM status is completed', `Got ${meridianWedPast.status}`);

  // Test 7: Daily brief filtering
  console.log('\nTest 7: Daily Brief Filtering Across Simulated Time');
  const briefWed9am = generateBrief('2026-09-23T09:00:00');
  assert(briefWed9am.todaysActions.some(a => a.id === 'action-vendor-list'), 'Vendor list is in Today\'s Actions on Wednesday 9:00 AM');
  assert(briefWed9am.todaysActions.some(a => a.id === 'action-meridian-call'), 'Meridian call is in Today\'s Actions on Wednesday 9:00 AM');
  assert(briefWed9am.unclearOwnership.some(a => a.id === 'action-mumbai-lease'), 'Mumbai lease is in Unclear Ownership section');

  // Test 8: Overdue calculation
  console.log('\nTest 8: Overdue Calculation');
  const briefWedEod = generateBrief('2026-09-23T18:00:00');
  assert(briefWedEod.overdue.some(a => a.id === 'action-vendor-list'), 'Vendor list is OVERDUE by Wednesday EOD', `Overdue items: ${briefWedEod.overdue.map(a => a.id).join(', ')}`);
  assert(!briefWed9am.overdue.some(a => a.id === 'action-vendor-list'), 'Vendor list is NOT overdue on Wednesday 9:00 AM');

  // Test 9: Q&A grounding
  console.log('\nTest 9: Q&A Grounding');
  const ansRaghav = await askQuestion('What did I promise Raghav?', '2026-09-23T09:00:00');
  assert(ansRaghav.summary.toLowerCase().includes('vendor list') && ansRaghav.summary.toLowerCase().includes('wednesday morning'), 'Answer correctly identifies vendor list and Wednesday morning commitment');
  const ansMumbai = await askQuestion('What’s happening with the Mumbai lease?', '2026-09-23T09:00:00');
  assert(ansMumbai.summary.toLowerCase().includes('unclear') || ansMumbai.summary.toLowerCase().includes('unassigned'), 'Answer explicitly highlights unowned / unclear ownership of Mumbai lease');
  const ansHallucination = await askQuestion('What is our budget for the Tokyo sales summit?', '2026-09-23T09:00:00');
  assert(ansHallucination.summary.includes('could not determine'), 'Refuses to hallucinate unknown data pack topics');

  // Test 10: Source evidence availability
  console.log('\nTest 10: Source Evidence Availability');
  for (const act of actions) {
    assert(Array.isArray(act.evidence) && act.evidence.length > 0, `Action "${act.title}" has verifiable source evidence records`, `Count: ${act.evidence?.length}`);
    const firstEv = act.evidence[0];
    assert(Boolean(firstEv.sourceType && firstEv.from && firstEv.evidence), `Evidence record has sourceType, from, and quote`, JSON.stringify(firstEv));
  }

  console.log('\n======================================================');
  console.log(` VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
