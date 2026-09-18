# AIONOS Executive Productivity Agent
### Tailored for Arjun Malhotra — VP Sales, Veridian Corp
**Historical Simulation Period**: Monday, 21 September 2026 – Friday, 25 September 2026

[![Node.js](https://img.shields.io/badge/Node.js-v24-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com)
[![Google GenAI](https://img.shields.io/badge/Google_GenAI-Gemini_3.8_Flash-4285f4.svg)](https://ai.google.dev)
[![Tests](https://img.shields.io/badge/Tests-46%20Passed-emerald.svg)](docs/TESTING.md)

---

## 1. Project Overview & Problem Statement

Senior executives receive massive streams of unstructured information every week across meetings, emails, voice notes, and calendar invites. Typical LLM assistants suffer from two major flaws:
1. **Nondeterministic Hallucinations**: Fabricating deadlines or guessing ownership when ambiguity exists.
2. **Clock Dependency & Lack of Context**: Confusing current system time with the historical timeline of corporate events.

The **AIONOS Executive Productivity Agent** transforms raw, chaotic business inputs into an actionable daily executive brief for **Arjun Malhotra (VP Sales)**. It implements a **hybrid architecture** combining **Google Gemini 3.8 Flash** via the modern `@google/genai` SDK for semantic extraction and conversational Q&A with **strict deterministic business logic** for entity normalization, cross-channel deduplication, deadline calculation, and ownership integrity.

---

## 2. Key Features

- **Historical Simulation Engine ("Viewing as of")**:
  - Eliminates host system clock dependencies.
  - Simulates the historical week of **Sep 21–25, 2026** across 10 selectable timepoints (e.g., *Monday 9:00 AM*, *Wednesday 9:00 AM [Default]*, *Wednesday EOD*, *Thursday 9:00 AM*, *Friday EOD*).
  - Dynamically recalculates overdue status, active commitments, waiting states, and calendar visibility.
- **Explainable Evidence Audit Trail ("Why does the agent think this?")**:
  - Every canonical action retains an auditable chronological evidence chain linking back to meetings, email threads, voice notes, or calendar entries with direct quotes and timestamps.
- **Strict Ownership Integrity**:
  - When data does not confirm an owner (notably the *Mumbai Office Lease Renewal*), the system marks ownership as strictly **UNCLEAR**, preventing unauthorized task attribution.
- **Cross-Channel Action Deduplication**:
  - Consolidates real-world tasks scattered across Leadership Syncs, 5-turn email threads, and personal voice memos into single canonical actions with updated deadlines.
- **Grounded Executive Q&A**:
  - Conversational Q&A powered by Gemini 3.8 Flash with a deterministic fallback engine.
  - Refuses to hallucinate facts outside the Data Pack: returns *"I could not determine that from the available source data."*

---

## 3. Technology Stack

- **Frontend**:
  - React 18, TypeScript, Vite 6
  - Tailwind CSS (Clean Executive Dark Theme & Glassmorphism)
  - Lucide React Icons
- **Backend**:
  - Node.js (v24), Express.js (ES Modules)
  - CORS, Dotenv
- **AI Integration**:
  - Google Gemini 3.8 Flash (`gemini-2.5-flash` / `gemini-3.8-flash`)
  - Modern Google GenAI SDK: `@google/genai`
- **Data Layer**:
  - Local structured JSON (`backend/data/raw/dataPack.json` and `backend/data/actions.json`)
  - Zero external database or microservice dependencies required.

---

## 4. Architecture & Data Flow

```
RAW DATA (PDF Data Pack)
          ↓
backend/data/raw/dataPack.json (Meetings, Calendars, Emails, Voice Notes)
          ↓
Semantic Extraction (Gemini 3.8 Flash / Deterministic Baseline)
          ↓
Deterministic Normalization (Standardize entities & timestamps)
          ↓
Deterministic Deduplication (Consolidate into canonical actions)
          ↓
Deterministic Deadline & Status Engine (Evaluate relative to "asOf")
          ↓
backend/data/actions.json (8 Canonical Actions with Evidence Trails)
          ↓
Executive Daily Brief API (GET /api/brief) & Grounded Q&A API (POST /api/ask)
          ↓
Executive Dashboard (React + TypeScript UI)
```

For complete technical defense and Mermaid diagrams, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 5. Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18+ recommended, built & tested on Node v24.13.1)
- npm (v9+)

### Installation
Clone the repository and install all dependencies:
```bash
# 1. Install root, backend, and frontend packages
npm run install:all
```

### Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Edit `.env` to include your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=3001
VITE_PORT=5173
```
> **Note on API Key**: If `GEMINI_API_KEY` is omitted, the application automatically runs in **Offline Grounded Mode**, utilizing the built-in deterministic grounding engine. All 10 verification scenarios and Q&A interactions function out of the box.

---

## 6. Running the Application

### Option A: Run Full Stack with One Command
```bash
npm run dev
```
Starts both:
- Backend Express API on `http://localhost:3001`
- Frontend Vite Dev Server on `http://localhost:5173`

Open your browser at **`http://localhost:5173`** (or `http://localhost:3001`).

### Option B: Run Services Individually
```bash
# Start Backend
npm run server

# Start Frontend (in a separate terminal)
npm run client
```

### Option C: Re-run Action Pipeline
To re-extract and normalize actions from raw Data Pack:
```bash
npm run pipeline
```

---

## 7. Running the Test Suite

Run the automated verification suite testing all 10 core assignment scenarios:
```bash
npm test
```
**Test Coverage**:
1. Vendor List Deduplication (Consolidates meeting, email thread, voice note into 1 action)
2. Vendor Deadline Evolution (Mon EOD -> Tue morning -> Wed morning)
3. Campaign Deck Deadline Update (Wed -> Thu 9:30 AM -> delivered Thu 8:00 AM)
4. Expense Report Completion (Waiting until Wed 6:00 PM -> transitions to Completed)
5. Mumbai Lease Unclear Ownership (Strictly preserved as "Unclear", deadline Fri EOD)
6. Meridian Call Schedule (Rescheduled, confirmed for Wed 23 Sep 3:00 PM)
7. Daily Brief Filtering Across Simulated Time
8. Overdue Calculation (Vendor list becomes overdue after Wednesday morning)
9. Q&A Grounding & Refusal to Hallucinate
10. Source Evidence Availability on all canonical items

For detailed test logs, see [`docs/TESTING.md`](docs/TESTING.md).

---

## 8. 15-Minute Demo Flow Guide

Use this script during a live presentation or evaluator walkthrough:

1. **Open the Dashboard (`http://localhost:5173`)**:
   - Show header: **Arjun Malhotra (VP Sales, Veridian Corp)**.
   - Note the default simulated time: **Wednesday 23 Sep 2026 — 9:00 AM**.
2. **Review the Executive Daily Brief**:
   - Point out **Today's Actions**:
     - *Send Updated Vendor List to Raghav* (Due Wednesday morning).
     - *Reschedule & Hold Meridian Logistics Client Call* (Scheduled today at 3:00 PM).
   - Point out **Waiting on Others**:
     - *Q3 Campaign Deck Draft* (Waiting on Neha).
     - *July Expense Variance Report* (Waiting on Divya until Wednesday evening).
   - Point out **Unclear Ownership**:
     - *Mumbai Office Lease Renewal Sign-off* (Ownership is strictly **UNCLEAR**).
3. **Inspect Explainability & Source Evidence**:
   - Click **"View Evidence"** on *Send Updated Vendor List to Raghav*.
   - Walk through the chronological evidence trail: Leadership Sync -> Raghav email -> Arjun delay -> Voice Note 1 -> Tuesday board prep email -> Wednesday morning check-in.
4. **Demonstrate Historical Timeline Dynamics ("Viewing as of")**:
   - Select **Wednesday 23 Sep — EOD (6:00 PM)**:
     - Notice that *Send Updated Vendor List to Raghav* instantly appears in the **Overdue Actions** section with a red alert badge (Wednesday morning deadline passed).
     - Notice that *July Expense Variance Report* transitioned to **Completed** (delivered at 6:00 PM).
   - Select **Thursday 24 Sep — 9:00 AM**:
     - Notice that *Q3 Campaign Deck Draft* transitioned to **Completed** (draft delivered at 8:00 AM ahead of 9:30 AM review).
   - Switch back to **Wednesday 23 Sep — 9:00 AM**.
5. **Demonstrate Grounded Q&A ("Ask Agent" Tab)**:
   - Click the **Ask Agent** tab.
   - Click the one-click chip: *"What did I promise Raghav?"*
     - Show concise answer identifying the vendor list, the Wednesday morning commitment, and direct citations.
   - Click *"What’s happening with the Mumbai lease?"*
     - Show that the agent explicitly refuses to assume ownership, highlighting that Divya and Facilities have not claimed it.
   - Type an ungrounded prompt: *"What is our budget for the Tokyo sales summit?"*
     - Show anti-hallucination refusal: *"I could not determine that from the available source data."*

---

## 9. API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | GET | Server health, Gemini API configuration status, actions count |
| `/api/brief?asOf=...` | GET | Generates the 7-section Executive Daily Brief for simulated time |
| `/api/actions?asOf=...` | GET | Returns all canonical actions evaluated as of simulated time |
| `/api/actions/:id?asOf=...` | GET | Returns single action with full chronological evidence trail |
| `/api/ask` | POST | Grounded Q&A endpoint (`{ question, asOf }`) |
| `/api/timepoints` | GET | Returns list of standard historical simulation time points |
| `/api/pipeline/run` | POST | Re-runs action extraction, normalization, and deduplication |

---

## 10. Repository Structure

```
AIONOS-Executive-Productivity-Agent/
├── backend/
│   ├── data/
│   │   ├── raw/
│   │   │   └── dataPack.json          # Structured representation of supplied Data Pack
│   │   └── actions.json               # Normalized canonical actions & evidence
│   ├── routes/
│   │   └── agent.js                   # Express API routes
│   ├── services/
│   │   ├── llm.js                     # Google GenAI SDK (@google/genai) integration
│   │   ├── extract.js                 # Semantic extraction from raw Data Pack
│   │   ├── normalize.js               # Entity and timestamp normalization
│   │   ├── deduplicate.js             # Topic-based deduplication & evidence consolidation
│   │   ├── deadlines.js               # Deterministic historical deadline resolver
│   │   ├── status.js                  # Dynamic status & simulated time evaluator
│   │   ├── brief.js                   # 7-section Executive Daily Brief engine
│   │   ├── qa.js                      # Grounded executive Q&A engine
│   │   └── pipelineRunner.js          # Pipeline orchestration script
│   ├── tests/
│   │   └── verifyAllScenarios.js      # Automated 10-scenario verification suite
│   ├── package.json
│   └── server.js                      # Express application entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx             # Executive header & navigation
│   │   │   ├── TimeSelector.tsx       # "Viewing as of" historical timeline control
│   │   │   ├── SummaryCards.tsx       # Executive metric summary cards
│   │   │   ├── ActionCard.tsx         # Action card with status & priority badges
│   │   │   ├── EvidenceModal.tsx      # Explainability audit drawer / modal
│   │   │   ├── DailyBrief.tsx         # The 7 core dashboard sections
│   │   │   ├── MeetingsSection.tsx    # Daily calendar integration
│   │   │   └── AskAgent.tsx           # Interactive grounded Q&A console
│   │   ├── services/
│   │   │   └── api.ts                 # Backend API client
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript interfaces
│   │   ├── App.tsx                    # Root UI application
│   │   ├── main.tsx                   # Vite React entrypoint
│   │   └── index.css                  # Tailwind styles and glassmorphism
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── docs/
│   ├── ARCHITECTURE.md                # System design & Mermaid architecture diagram
│   ├── ASSUMPTIONS.md                 # Facts, deterministic rules, and LLM boundaries
│   ├── AI_USAGE.md                    # Gemini 3.8 Flash & @google/genai integration guide
│   └── TESTING.md                     # Verification report & test scenario logs
├── .env.example                       # Example environment variables template
├── .gitignore                         # Excludes node_modules, .env, and dist
├── package.json                       # Unified root scripts
└── README.md                          # Comprehensive project documentation
```

---

## 11. Security & Hygiene

- **Zero Secrets Committed**: `.env` is listed in `.gitignore`. No hardcoded API keys exist in the codebase.
- **Client-Side Safety**: All Gemini API calls are strictly executed server-side.
- **Input Validation**: All user questions and timeline inputs are sanitized and bounds-checked.
