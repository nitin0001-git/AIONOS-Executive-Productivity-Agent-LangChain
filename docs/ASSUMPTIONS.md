# AIONOS Executive Productivity Agent — Assumptions & Boundaries

To guarantee complete technical rigor, this document clearly delineates:
1. **Direct Facts from the Data Pack** (ground truth)
2. **Deterministic Business Logic Rules** (application policies)
3. **LLM Semantic Interpretation Boundaries** (where AI assists)

---

## 1. Direct Facts from Data Pack (Ground Truth)

The following facts are taken verbatim from `Assignment 1_DataPack_ExecutiveProductivityAgent.pdf`:

1. **Target User**:
   - Arjun Malhotra is the sole user of the application (VP Sales, `arjun.malhotra@veridian-corp.example`).
   - Neha Kapoor, Raghav Sethi, Divya Rao, Priya Nair, and Facilities are source people and information feeds, not users of the application.

2. **Historical Scope**:
   - The exercise takes place strictly during Monday, 21 September 2026 through Friday, 25 September 2026.
   - All relative time references ("tomorrow", "Wednesday", "Friday") resolve strictly within this week.

3. **Leadership Sync (Mon 21 Sep, 9:00–9:35 AM)**:
   - Neha stated the Q3 campaign deck is 80% done; review targeted by Wednesday; later noted Thursday morning is safer.
   - Arjun promised Raghav an updated vendor list by end of day tomorrow.
   - Raghav flagged that the Mumbai office renewal paperwork needs sign-off this week and ownership is unknown.
   - Divya suggested Facilities normally handles it, but hasn't seen anyone pick it up; Arjun explicitly said: *"Okay, flag it, don't assume."*
   - Arjun asked Divya for July expense variance report before Thursday board prep; Divya said she would have it ready Wednesday evening.
   - Arjun noted client call with Meridian Logistics got pushed and he needs to reconfirm.

4. **Vendor List Evolution**:
   - Mon 9:50 AM: Raghav followed up asking if it can be sent today.
   - Mon 5:40 PM: Arjun replied running behind, will send first thing tomorrow morning.
   - Mon 6:40 PM: Arjun voice memo: might slip to tomorrow morning.
   - Tue 9:15 AM: Raghav noted whenever you get a chance today works.
   - Tue 6:30 PM: Arjun replied: *"Sorry, got pulled into board prep — will send by tomorrow (Wednesday) morning for sure."*
   - Wed 8:45 AM: Raghav asked: *"Just checking — still good for this morning?"*

5. **Q3 Campaign Deck Evolution**:
   - Mon 11:00 AM: Neha targeting Wednesday review.
   - Tue 4:15 PM: Neha shifted review to Thursday morning to finish data slides.
   - Wed 10:20 AM: Neha proposed 9:30 AM Thursday, before Arjun's board prep block.
   - Thu 8:00 AM: Neha attached draft ahead of 9:30 AM review.
   - Thu 9:30–10:00 AM: Deck review scheduled on Neha's calendar.

6. **July Expense Variance Report Evolution**:
   - Mon 2:30 PM: Divya targeting Thursday morning for board prep.
   - Tue 9:00 AM: Arjun requested Wednesday evening instead.
   - Tue 9:40 AM: Divya confirmed Wednesday evening.
   - Wed 8:15 AM: Arjun voice memo confirming Wednesday evening requirement.
   - Wed 6:00 PM: Divya attached report, sent as promised.
   - Wed 6:10 PM: Arjun acknowledged receipt: *"Got it, thank you — exactly what I needed before tomorrow."*

7. **Mumbai Office Lease Renewal**:
   - Mon 10:15 AM: Facilities reminder stating authorized signature required by Friday, 25 September.
   - Mon 6:40 PM: Arjun voice memo: *"someone needs to own that, I don't think it's me."*
   - Tue 11:00 AM: Raghav emailed asking if anyone confirmed who is signing off; doesn't think it has been assigned.
   - Wed 9:30 AM: Divya stated: *"Not on my end — I believe this typically sits with Facilities directly, not us."*
   - Thu 4:00 PM: Facilities second reminder stating signature is still pending, deadline is Friday end of day.
   - Thu 4:45 PM: Raghav emailed Arjun: *"This is now one day out and still unowned — can you confirm who’s handling it?"*

8. **Meridian Logistics Call**:
   - Mon 1:00 PM: Priya Nair asked to propose new time (flexible Tue–Thu afternoons).
   - Tue 3:00 PM: Arjun proposed Wednesday 3:00 PM.
   - Tue 5:45 PM: Priya confirmed Wednesday 3:00 PM.
   - Wed 8:15 AM: Arjun voice memo noting need to lock in Meridian call time today.
   - Wed 1:30 PM: Priya check-in: *"Quick check — still on for 3 PM today?"*
   - Wed 2:00 PM: Arjun confirmed: *"Yes, confirmed, see you at 3."*
   - Wed 3:00–3:30 PM: Scheduled on Arjun's calendar.

---

## 2. Deterministic Business Logic Rules

The application enforces the following rules without relying on LLM variance:

1. **Simulated Clock Independence**:
   - The host system clock is completely ignored.
   - All state computations are strictly driven by the `asOf` query parameter.

2. **Deadline Timestamp Mapping**:
   - `"Morning"` without explicit time resolves to `12:00:00` (end of morning) for overdue evaluation, or `09:00:00` for scheduled events.
   - `"End of Day"` (EOD) resolves to `17:00:00` or `18:00:00`.
   - Explicit times (e.g. `9:30 AM`, `3:00 PM`, `6:00 PM`) map to their exact historical timestamps (`09:30:00`, `15:00:00`, `18:00:00`).

3. **Status Calculation Precedence**:
   - **Precedence 1**: If `owner === "Unclear"`, status is **always** `unclear`.
   - **Precedence 2**: If `completionTimestamp` is present and `asOf >= completionTimestamp`, status is `completed`.
   - **Precedence 3**: If `asOf > activeDeadline` and not completed, status is `overdue`.
   - **Precedence 4**: If item is a calendar event, status is `scheduled` before its start time and `completed` after.
   - **Precedence 5**: If `owner !== "Arjun Malhotra"`, status is `waiting` (waiting on that owner).
   - **Precedence 6**: If `owner === "Arjun Malhotra"` and deadline has not passed, status is `open`.

4. **Overdue Status Transition**:
   - The Vendor List action deadline is Wednesday morning (`2026-09-23T12:00:00`).
   - At Wednesday 9:00 AM, status is `open`.
   - At Wednesday EOD (`2026-09-23T18:00:00`), status deterministically switches to `overdue`.

5. **Completion Transition**:
   - Divya's Expense Variance Report transitions from `waiting` to `completed` at `2026-09-23T18:00:00`.
   - Neha's Q3 Campaign Deck transitions from `waiting` to `completed` at `2026-09-24T08:00:00`.

---

## 3. LLM Semantic Interpretation Boundaries

Where Gemini 3.8 Flash is deployed:
1. **Semantic Extraction**:
   - Discerning between casual banter and actionable commitments in meeting transcripts.
   - Discerning personal dictation memos from instructions sent to others.
2. **Grounded Executive Synthesis**:
   - Formulating concise, executive-friendly summaries in response to ad-hoc natural language questions.
   - Adhering strictly to context: if asked about an unmentioned topic (e.g. "What is our budget for the Tokyo sales summit?"), the model refuses to answer and states:
     > *"I could not determine that from the available source data."*
