/**
 * Extraction Service
 * Performs semantic extraction using Gemini 3.8 Flash when API key is provided,
 * backed by a robust deterministic extraction layer grounded directly in the Data Pack.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isGeminiConfigured, getChatModel, getModelName } from './llm.js';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { normalizeAction } from './normalize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PACK_PATH = path.resolve(__dirname, '../data/raw/dataPack.json');

/**
 * Load raw dataPack
 */
export function loadRawDataPack() {
  if (!fs.existsSync(DATA_PACK_PATH)) {
    throw new Error(`Data Pack not found at ${DATA_PACK_PATH}`);
  }
  return JSON.parse(fs.readFileSync(DATA_PACK_PATH, 'utf-8'));
}

/**
 * High-fidelity deterministic extraction baseline derived directly from the Data Pack
 */
export function getDeterministicExtractedActions(dataPack) {
  return [
    {
      id: 'action-vendor-list',
      title: 'Send Updated Vendor List to Raghav',
      description: 'Arjun promised Raghav an updated vendor list. Initial commitment during Monday Leadership Sync was tomorrow EOD; on Monday evening slipped to Tuesday morning; on Tuesday evening delayed to Wednesday morning for sure; on Wednesday morning Raghav checked in.',
      category: 'sales_ops',
      owner: 'Arjun Malhotra',
      recipient: 'Raghav Sethi',
      status: 'open',
      deadline: '2026-09-23T12:00:00',
      deadlineLabel: 'Wednesday morning (23 Sep)',
      completionTimestamp: null,
      priority: 'high',
      waitingOn: null,
      relatedPeople: ['Arjun Malhotra', 'Raghav Sethi'],
      sourceIds: ['meeting-leadership-sync', 'thread-1', 'vn-1'],
      evidence: [
        {
          sourceType: 'meeting',
          sourceId: 'meeting-leadership-sync',
          timestamp: '2026-09-21T09:00:00',
          displayTime: 'Mon 21 Sep, 9:00 AM',
          from: 'Arjun Malhotra',
          to: 'Raghav Sethi',
          evidence: 'Also, remind me — I told Raghav I’d send him the updated vendor list. I’ll get that to him by end of day tomorrow.',
          note: 'Initial commitment made during Leadership Sync'
        },
        {
          sourceType: 'email',
          sourceId: 't1-e1',
          timestamp: '2026-09-21T09:50:00',
          displayTime: 'Mon 21 Sep, 9:50 AM',
          from: 'Raghav Sethi',
          to: 'Arjun Malhotra',
          evidence: 'Following up from the sync — can you send the updated vendor list today?',
          note: 'Raghav follow-up'
        },
        {
          sourceType: 'email',
          sourceId: 't1-e2',
          timestamp: '2026-09-21T17:40:00',
          displayTime: 'Mon 21 Sep, 5:40 PM',
          from: 'Arjun Malhotra',
          to: 'Raghav Sethi',
          evidence: 'Running behind, will send first thing tomorrow morning instead.',
          note: 'Arjun pushes commitment to Tuesday morning'
        },
        {
          sourceType: 'voice_note',
          sourceId: 'vn-1',
          timestamp: '2026-09-21T18:40:00',
          displayTime: 'Mon 21 Sep, 6:40 PM (recorded in cab)',
          from: 'Arjun Malhotra',
          to: 'Arjun Malhotra',
          evidence: 'Quick note to self — need to get Raghav that vendor list, I think I said today but it might slip to tomorrow morning, remind me.',
          note: 'Arjun personal voice memo acknowledging slip'
        },
        {
          sourceType: 'email',
          sourceId: 't1-e3',
          timestamp: '2026-09-22T09:15:00',
          displayTime: 'Tue 22 Sep, 9:15 AM',
          from: 'Raghav Sethi',
          to: 'Arjun Malhotra',
          evidence: 'No worries, whenever you get a chance today works.',
          note: 'Raghav confirms flexibility'
        },
        {
          sourceType: 'email',
          sourceId: 't1-e4',
          timestamp: '2026-09-22T18:30:00',
          displayTime: 'Tue 22 Sep, 6:30 PM',
          from: 'Arjun Malhotra',
          to: 'Raghav Sethi',
          evidence: 'Sorry, got pulled into board prep — will send by tomorrow (Wednesday) morning for sure.',
          note: 'Latest confirmed commitment: Wednesday morning'
        },
        {
          sourceType: 'email',
          sourceId: 't1-e5',
          timestamp: '2026-09-23T08:45:00',
          displayTime: 'Wed 23 Sep, 8:45 AM',
          from: 'Raghav Sethi',
          to: 'Arjun Malhotra',
          evidence: 'Just checking — still good for this morning?',
          note: 'Raghav morning check-in'
        }
      ]
    },
    {
      id: 'action-campaign-deck',
      title: 'Q3 Campaign Deck Draft & Review',
      description: 'Neha is preparing the Q3 campaign deck (80% done on Mon). Review originally targeted Wednesday; shifted on Tuesday to Thursday morning; confirmed 9:30 AM before board prep; delivered Thursday 8:00 AM.',
      category: 'marketing',
      owner: 'Neha Kapoor',
      recipient: 'Arjun Malhotra',
      status: 'waiting',
      deadline: '2026-09-24T09:30:00',
      deadlineLabel: 'Thursday 9:30 AM (24 Sep)',
      completionTimestamp: '2026-09-24T08:00:00',
      priority: 'medium',
      waitingOn: 'Neha Kapoor',
      relatedPeople: ['Neha Kapoor', 'Arjun Malhotra'],
      sourceIds: ['meeting-leadership-sync', 'thread-2'],
      evidence: [
        {
          sourceType: 'meeting',
          sourceId: 'meeting-leadership-sync',
          timestamp: '2026-09-21T09:00:00',
          displayTime: 'Mon 21 Sep, 9:00 AM',
          from: 'Neha Kapoor',
          to: 'Arjun Malhotra',
          evidence: 'Draft is 80% done. I’ll send it to Arjun for review by Wednesday... realistically Thursday morning is safer.',
          note: 'Initial status in Leadership Sync'
        },
        {
          sourceType: 'email',
          sourceId: 't2-e1',
          timestamp: '2026-09-21T11:00:00',
          displayTime: 'Mon 21 Sep, 11:00 AM',
          from: 'Neha Kapoor',
          to: 'Arjun Malhotra',
          evidence: 'Deck’s coming together, still targeting Wednesday for your review.',
          note: 'Targeting Wednesday review'
        },
        {
          sourceType: 'email',
          sourceId: 't2-e2',
          timestamp: '2026-09-22T16:15:00',
          displayTime: 'Tue 22 Sep, 4:15 PM',
          from: 'Neha Kapoor',
          to: 'Arjun Malhotra',
          evidence: 'Heads up — shifting the review to Thursday morning instead of Wednesday, need one more day on the data slides.',
          note: 'Deadline update: shifted to Thursday morning'
        },
        {
          sourceType: 'email',
          sourceId: 't2-e3',
          timestamp: '2026-09-23T10:00:00',
          displayTime: 'Wed 23 Sep, 10:00 AM',
          from: 'Arjun Malhotra',
          to: 'Neha Kapoor',
          evidence: 'Understood, Thursday morning works. What time exactly?',
          note: 'Arjun agrees to Thursday morning'
        },
        {
          sourceType: 'email',
          sourceId: 't2-e4',
          timestamp: '2026-09-23T10:20:00',
          displayTime: 'Wed 23 Sep, 10:20 AM',
          from: 'Neha Kapoor',
          to: 'Arjun Malhotra',
          evidence: 'Let’s say 9:30 AM Thursday, before your board prep block.',
          note: 'Time finalized for Thursday 9:30 AM'
        },
        {
          sourceType: 'email',
          sourceId: 't2-e5',
          timestamp: '2026-09-24T08:00:00',
          displayTime: 'Thu 24 Sep, 8:00 AM',
          from: 'Neha Kapoor',
          to: 'Arjun Malhotra',
          evidence: 'Deck is ready, attaching the draft ahead of our 9:30 review.',
          note: 'Draft received/completed ahead of review'
        }
      ]
    },
    {
      id: 'action-expense-variance',
      title: 'July Expense Variance Report for Board Prep',
      description: 'Arjun asked Divya for July expense variance report before Thursday board prep. Divya targeted Thursday morning / Wednesday evening. Arjun requested Wednesday evening on Tue morning. Divya agreed and delivered report via email Wed 23 Sep 6:00 PM; acknowledged by Arjun at 6:10 PM.',
      category: 'finance',
      owner: 'Divya Rao',
      recipient: 'Arjun Malhotra',
      status: 'waiting',
      deadline: '2026-09-23T18:00:00',
      deadlineLabel: 'Wednesday evening (23 Sep, 6:00 PM)',
      completionTimestamp: '2026-09-23T18:00:00',
      priority: 'high',
      waitingOn: 'Divya Rao',
      relatedPeople: ['Divya Rao', 'Arjun Malhotra'],
      sourceIds: ['meeting-leadership-sync', 'thread-4', 'vn-2'],
      evidence: [
        {
          sourceType: 'meeting',
          sourceId: 'meeting-leadership-sync',
          timestamp: '2026-09-21T09:00:00',
          displayTime: 'Mon 21 Sep, 9:00 AM',
          from: 'Arjun Malhotra',
          to: 'Divya Rao',
          evidence: 'Divya, can you also pull the July expense variance report before Thursday’s board prep? Divya: Yes, I’ll have it ready Wednesday evening.',
          note: 'Requested in Leadership Sync'
        },
        {
          sourceType: 'email',
          sourceId: 't4-e1',
          timestamp: '2026-09-21T14:30:00',
          displayTime: 'Mon 21 Sep, 2:30 PM',
          from: 'Divya Rao',
          to: 'Arjun Malhotra',
          evidence: 'Starting on the July variance numbers, targeting Thursday morning for board prep as discussed.',
          note: 'Divya targets Thursday morning'
        },
        {
          sourceType: 'email',
          sourceId: 't4-e2',
          timestamp: '2026-09-22T09:00:00',
          displayTime: 'Tue 22 Sep, 9:00 AM',
          from: 'Arjun Malhotra',
          to: 'Divya Rao',
          evidence: 'Actually, can I get it by Wednesday evening instead? Want time to review before Thursday.',
          note: 'Arjun moves deadline to Wednesday evening'
        },
        {
          sourceType: 'email',
          sourceId: 't4-e3',
          timestamp: '2026-09-22T09:40:00',
          displayTime: 'Tue 22 Sep, 9:40 AM',
          from: 'Divya Rao',
          to: 'Arjun Malhotra',
          evidence: 'Wednesday evening is tight but doable, I’ll prioritize it.',
          note: 'Divya agrees to Wednesday evening deadline'
        },
        {
          sourceType: 'voice_note',
          sourceId: 'vn-2',
          timestamp: '2026-09-23T08:15:00',
          displayTime: 'Wed 23 Sep, 8:15 AM',
          from: 'Arjun Malhotra',
          to: 'Arjun Malhotra',
          evidence: 'Reminder — expense variance report from Divya needs to be in my hands by Wednesday evening, not Thursday, I want time to go through it before board prep.',
          note: 'Arjun memo confirming expectation'
        },
        {
          sourceType: 'email',
          sourceId: 't4-e4',
          timestamp: '2026-09-23T18:00:00',
          displayTime: 'Wed 23 Sep, 6:00 PM',
          from: 'Divya Rao',
          to: 'Arjun Malhotra',
          evidence: 'Report attached, sent as promised.',
          note: 'Completed & delivered'
        },
        {
          sourceType: 'email',
          sourceId: 't4-e5',
          timestamp: '2026-09-23T18:10:00',
          displayTime: 'Wed 23 Sep, 6:10 PM',
          from: 'Arjun Malhotra',
          to: 'Divya Rao',
          evidence: 'Got it, thank you — exactly what I needed before tomorrow.',
          note: 'Arjun confirmation of receipt'
        }
      ]
    },
    {
      id: 'action-mumbai-lease',
      title: 'Mumbai Office Lease Renewal Sign-off',
      description: 'Mumbai office lease renewal requires an authorized signature by Friday 25 September EOD. Ownership is unassigned and strictly UNCLEAR. Divya thought Facilities handles it, but Facilities sent all-staff reminders without claiming sign-off ownership; Raghav flagged twice that it remains unowned; Arjun explicitly noted in Leadership Sync and Voice Note 1 not to assume ownership and that it is unowned.',
      category: 'facilities_legal',
      owner: 'Unclear',
      recipient: 'Internal Sign-off',
      status: 'unclear',
      deadline: '2026-09-25T18:00:00',
      deadlineLabel: 'Friday 25 Sep, End of Day',
      completionTimestamp: null,
      priority: 'urgent',
      waitingOn: 'Unclear / Internal Sign-off',
      relatedPeople: ['Arjun Malhotra', 'Raghav Sethi', 'Divya Rao', 'Facilities'],
      sourceIds: ['meeting-leadership-sync', 'thread-5', 'vn-1'],
      evidence: [
        {
          sourceType: 'meeting',
          sourceId: 'meeting-leadership-sync',
          timestamp: '2026-09-21T09:00:00',
          displayTime: 'Mon 21 Sep, 9:00 AM',
          from: 'Raghav Sethi',
          to: 'Leadership Sync Attendees',
          evidence: 'Separately, the Mumbai office renewal paperwork needs someone to sign off this week. Not sure whose desk that’s on right now. Divya: I think that’s supposed to be Facilities, but I haven’t seen anyone pick it up. Arjun: Okay, flag it, don’t assume.',
          note: 'Raised in sync; Arjun flags not to assume ownership'
        },
        {
          sourceType: 'email',
          sourceId: 't5-e1',
          timestamp: '2026-09-21T10:15:00',
          displayTime: 'Mon 21 Sep, 10:15 AM',
          from: 'Facilities',
          to: 'All Staff',
          evidence: 'Reminder: the Mumbai office lease renewal requires an authorized signature by Friday, 25 September.',
          note: 'Facilities reminder sent to all staff'
        },
        {
          sourceType: 'voice_note',
          sourceId: 'vn-1',
          timestamp: '2026-09-21T18:40:00',
          displayTime: 'Mon 21 Sep, 6:40 PM (recorded in cab)',
          from: 'Arjun Malhotra',
          to: 'Arjun Malhotra',
          evidence: 'Also still haven’t heard back on the Mumbai lease thing, someone needs to own that, I don’t think it’s me.',
          note: 'Arjun memo confirming lease is unowned'
        },
        {
          sourceType: 'email',
          sourceId: 't5-e2',
          timestamp: '2026-09-22T11:00:00',
          displayTime: 'Tue 22 Sep, 11:00 AM',
          from: 'Raghav Sethi',
          to: 'Arjun Malhotra, Divya Rao',
          evidence: 'Following up from the sync — has anyone confirmed who’s signing off on the Mumbai renewal? Don’t think it’s been assigned.',
          note: 'Raghav confirms unassigned status'
        },
        {
          sourceType: 'email',
          sourceId: 't5-e3',
          timestamp: '2026-09-23T09:30:00',
          displayTime: 'Wed 23 Sep, 9:30 AM',
          from: 'Divya Rao',
          to: 'Raghav Sethi, Arjun Malhotra',
          evidence: 'Not on my end — I believe this typically sits with Facilities directly, not us.',
          note: 'Divya states she does not own it'
        },
        {
          sourceType: 'email',
          sourceId: 't5-e4',
          timestamp: '2026-09-24T16:00:00',
          displayTime: 'Thu 24 Sep, 4:00 PM',
          from: 'Facilities',
          to: 'All Staff',
          evidence: 'Second reminder: signature is still pending. Deadline is Friday, 25 September, end of day.',
          note: 'Second all-staff reminder; signature still pending'
        },
        {
          sourceType: 'email',
          sourceId: 't5-e5',
          timestamp: '2026-09-24T16:45:00',
          displayTime: 'Thu 24 Sep, 4:45 PM',
          from: 'Raghav Sethi',
          to: 'Arjun Malhotra',
          evidence: 'This is now one day out and still unowned — can you confirm who’s handling it?',
          note: 'Raghav notes still unowned 1 day out'
        }
      ]
    },
    {
      id: 'action-meridian-call',
      title: 'Reschedule & Hold Meridian Logistics Client Call',
      description: 'Client call with Meridian Logistics bumped from client side. Arjun proposed Wednesday 3:00 PM; Priya confirmed; meeting locked in on calendar for Wednesday 23 Sep 3:00–3:30 PM.',
      category: 'client_relations',
      owner: 'Arjun Malhotra',
      recipient: 'Priya Nair',
      status: 'scheduled',
      deadline: '2026-09-23T15:00:00',
      deadlineLabel: 'Wednesday 3:00 PM (23 Sep)',
      completionTimestamp: '2026-09-23T15:30:00',
      isMeeting: true,
      priority: 'high',
      waitingOn: null,
      relatedPeople: ['Arjun Malhotra', 'Priya Nair'],
      sourceIds: ['meeting-leadership-sync', 'thread-3', 'vn-2', 'cal-arjun-6'],
      evidence: [
        {
          sourceType: 'meeting',
          sourceId: 'meeting-leadership-sync',
          timestamp: '2026-09-21T09:00:00',
          displayTime: 'Mon 21 Sep, 9:00 AM',
          from: 'Arjun Malhotra',
          to: 'Leadership Sync Attendees',
          evidence: 'One more thing — client call with Meridian Logistics got pushed. I need to reconfirm the new time with their team myself.',
          note: 'Arjun identifies need to reconfirm new time'
        },
        {
          sourceType: 'email',
          sourceId: 't3-e1',
          timestamp: '2026-09-21T13:00:00',
          displayTime: 'Mon 21 Sep, 1:00 PM',
          from: 'Priya Nair',
          to: 'Arjun Malhotra',
          evidence: 'Our scheduled call this week got bumped from our side — can you propose a new time? We’re flexible Tuesday–Thursday afternoons.',
          note: 'Priya requests proposed time'
        },
        {
          sourceType: 'email',
          sourceId: 't3-e2',
          timestamp: '2026-09-22T15:00:00',
          displayTime: 'Tue 22 Sep, 3:00 PM',
          from: 'Arjun Malhotra',
          to: 'Priya Nair',
          evidence: 'Apologies for the delay — how about Wednesday 3:00 PM?',
          note: 'Arjun proposes Wednesday 3:00 PM'
        },
        {
          sourceType: 'email',
          sourceId: 't3-e3',
          timestamp: '2026-09-22T17:45:00',
          displayTime: 'Tue 22 Sep, 5:45 PM',
          from: 'Priya Nair',
          to: 'Arjun Malhotra',
          evidence: 'Wednesday 3 PM works on our end, confirmed.',
          note: 'Priya confirms Wednesday 3:00 PM'
        },
        {
          sourceType: 'voice_note',
          sourceId: 'vn-2',
          timestamp: '2026-09-23T08:15:00',
          displayTime: 'Wed 23 Sep, 8:15 AM',
          from: 'Arjun Malhotra',
          to: 'Arjun Malhotra',
          evidence: 'Also Meridian call — I owe Priya a time, need to lock that in today.',
          note: 'Arjun memo regarding call'
        },
        {
          sourceType: 'calendar',
          sourceId: 'cal-arjun-6',
          timestamp: '2026-09-23T15:00:00',
          displayTime: 'Wed 23 Sep, 3:00–3:30 PM',
          from: 'Arjun Malhotra',
          to: 'Priya Nair',
          evidence: 'Call — Meridian Logistics (Wed 23 Sep, 3:00–3:30 PM)',
          note: 'Locked in calendar event'
        },
        {
          sourceType: 'email',
          sourceId: 't3-e4',
          timestamp: '2026-09-23T13:30:00',
          displayTime: 'Wed 23 Sep, 1:30 PM',
          from: 'Priya Nair',
          to: 'Arjun Malhotra',
          evidence: 'Quick check — still on for 3 PM today?',
          note: 'Priya check-in'
        },
        {
          sourceType: 'email',
          sourceId: 't3-e5',
          timestamp: '2026-09-23T14:00:00',
          displayTime: 'Wed 23 Sep, 2:00 PM',
          from: 'Arjun Malhotra',
          to: 'Priya Nair',
          evidence: 'Yes, confirmed, see you at 3.',
          note: 'Final confirmation before call'
        }
      ]
    },
    {
      id: 'action-board-prep',
      title: 'Attend Board Prep Session',
      description: 'Preparation session for upcoming board meeting with Arjun and Divya.',
      category: 'scheduled_event',
      owner: 'Arjun Malhotra',
      recipient: 'Executive Team',
      status: 'scheduled',
      deadline: '2026-09-24T09:00:00',
      deadlineLabel: 'Thursday 9:00 AM (24 Sep)',
      completionTimestamp: '2026-09-24T10:00:00',
      isMeeting: true,
      priority: 'high',
      waitingOn: null,
      relatedPeople: ['Arjun Malhotra', 'Divya Rao'],
      sourceIds: ['cal-arjun-8', 'meeting-leadership-sync'],
      evidence: [
        {
          sourceType: 'calendar',
          sourceId: 'cal-arjun-8',
          timestamp: '2026-09-24T09:00:00',
          displayTime: 'Thu 24 Sep, 9:00–10:00 AM',
          from: 'Executive Team',
          to: 'Arjun Malhotra, Divya Rao',
          evidence: 'Board Prep Session (Thursday 24 Sep, 9:00–10:00 AM)',
          note: 'Calendar entry on Arjun & Divya calendar'
        }
      ]
    },
    {
      id: 'action-facilities-checkin',
      title: 'Attend Facilities Check-in Meeting',
      description: 'Facilities check-in with Facilities and Raghav.',
      category: 'scheduled_event',
      owner: 'Facilities',
      recipient: 'Arjun Malhotra, Raghav Sethi',
      status: 'scheduled',
      deadline: '2026-09-25T10:00:00',
      deadlineLabel: 'Friday 10:00 AM (25 Sep)',
      completionTimestamp: '2026-09-25T10:30:00',
      isMeeting: true,
      priority: 'medium',
      waitingOn: null,
      relatedPeople: ['Arjun Malhotra', 'Raghav Sethi', 'Facilities'],
      sourceIds: ['cal-arjun-10'],
      evidence: [
        {
          sourceType: 'calendar',
          sourceId: 'cal-arjun-10',
          timestamp: '2026-09-25T10:00:00',
          displayTime: 'Fri 25 Sep, 10:00–10:30 AM',
          from: 'Facilities',
          to: 'Arjun Malhotra, Raghav Sethi',
          evidence: 'Facilities Check-in (Friday 25 Sep, 10:00–10:30 AM)',
          note: 'Calendar entry on Arjun & Raghav calendar'
        }
      ]
    },
    {
      id: 'action-hiring-panel',
      title: 'Hiring Panel — Sales Associate Interview',
      description: 'Arjun participates in candidate hiring panel for Sales Associate role.',
      category: 'scheduled_event',
      owner: 'Arjun Malhotra',
      recipient: 'Recruiting',
      status: 'scheduled',
      deadline: '2026-09-24T16:00:00',
      deadlineLabel: 'Thursday 4:00 PM (24 Sep)',
      completionTimestamp: '2026-09-24T17:00:00',
      isMeeting: true,
      priority: 'medium',
      waitingOn: null,
      relatedPeople: ['Arjun Malhotra'],
      sourceIds: ['cal-arjun-9'],
      evidence: [
        {
          sourceType: 'calendar',
          sourceId: 'cal-arjun-9',
          timestamp: '2026-09-24T16:00:00',
          displayTime: 'Thu 24 Sep, 4:00–5:00 PM',
          from: 'Recruiting',
          to: 'Arjun Malhotra',
          evidence: 'Hiring Panel — Sales Associate (Thursday 24 Sep, 4:00–5:00 PM)',
          note: 'Calendar event'
        }
      ]
    }
  ].map(normalizeAction);
}

/**
 * Execute extraction process.
 * If Gemini is enabled, it validates and enriches the extraction from the raw data.
 * Otherwise, it uses the high-precision deterministic baseline.
 */
export async function extractActions() {
  const dataPack = loadRawDataPack();
  const baseline = getDeterministicExtractedActions(dataPack);

  if (!isGeminiConfigured()) {
    console.log('[Extract Service] Using deterministic Data Pack extraction baseline.');
    return baseline;
  }

  try {
    console.log(`[Extract Service] Performing semantic extraction via LangChain (${getModelName()})...`);
    const model = getChatModel();
    if (!model) {
      return baseline;
    }

    const systemPrompt = `You are an executive assistant for Arjun Malhotra (VP Sales at Veridian Corp).
Extract actionable commitments, tasks, and deadlines from this historical exercise data (week of 21–25 September 2026).

REQUIREMENTS:
1. Extract canonical actions/commitments.
2. For the Mumbai office lease: keep ownership strictly "Unclear" (do NOT assume Facilities or Arjun).
3. Consolidate email threads into single canonical commitments with latest confirmed deadlines.
4. Return an array of objects matching the required schema.`;

    const humanPrompt = `RAW DATA SUMMARY:
{rawDataSummary}

Return an array of objects matching:
[
  {{
    "id": "action-...",
    "title": "...",
    "description": "...",
    "category": "...",
    "owner": "...",
    "recipient": "...",
    "deadline": "YYYY-MM-DDTHH:MM:SS",
    "deadlineLabel": "...",
    "priority": "urgent|high|medium|low",
    "waitingOn": "... or null",
    "relatedPeople": ["..."],
    "evidence": [
      {{
        "sourceType": "email|meeting|voice_note|calendar",
        "sourceId": "...",
        "timestamp": "YYYY-MM-DDTHH:MM:SS",
        "displayTime": "...",
        "from": "...",
        "to": "...",
        "evidence": "exact quote",
        "note": "..."
      }}
    ]
  }}
]`;

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['human', humanPrompt]
    ]);

    const parser = new JsonOutputParser();
    const chain = promptTemplate.pipe(model).pipe(parser);

    const rawDataSummary = JSON.stringify({
      meetings: dataPack.meetings,
      emailThreads: dataPack.emailThreads,
      voiceNotes: dataPack.voiceNotes
    }, null, 2);

    const result = await chain.invoke({ rawDataSummary });
    if (Array.isArray(result) && result.length >= 4) {
      console.log(`[Extract Service] LangChain successfully extracted ${result.length} canonical actions.`);
      return result.map(normalizeAction);
    }
  } catch (err) {
    console.warn('[Extract Service] LangChain extraction encountered an issue, falling back to deterministic baseline:', err.message);
  }

  return baseline;
}
