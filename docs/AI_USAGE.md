# AIONOS Executive Productivity Agent — AI Usage & Integration Guide (LangChain Edition)

This document details the role of Artificial Intelligence in the Executive Productivity Agent, specifically Google Gemini 3.8 Flash, LangChain (`@langchain/google` and `@langchain/core`), grounding mechanisms, prompt templates, runnable chains, and the intentional division of labor between generative AI and deterministic logic.

---

## 1. Model & LangChain Orchestration Selection

- **Model**: Google Gemini 3.8 Flash (`gemini-3.8-flash`)
- **Orchestration**: Official LangChain Google integration (`@langchain/google` and `@langchain/core`)
- **Model Class**: `ChatGoogle`
- **Chain Architecture**: Composable LangChain Runnables using `ChatPromptTemplate` and `JsonOutputParser` / `StringOutputParser`
- **Scope**: AI is used strictly for semantic extraction and grounded Q&A. All business rules, deduplication, deadline resolution, and ownership remain deterministic JavaScript application code.

### LangChain Model Initialization Example:
```javascript
import { ChatGoogle } from '@langchain/google';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';

const model = new ChatGoogle({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  temperature: 0.1
});

const prompt = ChatPromptTemplate.fromMessages([
  ['system', systemInstruction],
  ['human', humanInput]
]);

const chain = prompt.pipe(model).pipe(new JsonOutputParser());
const response = await chain.invoke(variables);
```

---

## 2. Where AI Is Used

### 2.1 Semantic Action Extraction (`services/extract.js`)
Executive communications are filled with nuance:
- *"I told Raghav I'd send him the updated vendor list. I'll get that to him by end of day tomorrow."*
- *"Deck’s coming together, still targeting Wednesday for your review."*
- *"Quick note to self — need to get Raghav that vendor list..."*

Gemini 3.8 Flash processes raw transcripts and email bodies to identify:
1. Deliverable topics (Vendor List, Campaign Deck, Variance Report, Lease Renewal, Client Call).
2. Explicit commitments vs. preliminary estimates.
3. The sender/speaker and intended recipient.
4. Relative timing keywords.

### 2.2 Grounded Executive Q&A (`services/qa.js`)
The user can ask open-ended questions such as:
- *"What did I promise Raghav?"*
- *"What’s happening with the Mumbai lease?"*
- *"Did the campaign deck deadline change?"*

Gemini receives the current canonical actions context along with the full evidence trail and generates a concise, executive-friendly response formatted as structured JSON containing:
- Direct 2–3 sentence executive summary
- Bulleted key takeaways
- Explicit status, deadline, and owner badges
- Citable evidence records with exact quotations

---

## 3. Grounding & Anti-Hallucination Safeguards

To ensure absolute fidelity and technical defense:

1. **Strict System Prompt Constraint**:
   ```
   CRITICAL GROUNDING RULES:
   1. Answer ONLY from the supplied structured action context and evidence.
   2. If the answer cannot be established with certainty from the supplied data,
      state clearly: "I could not determine that from the available source data."
   3. Never invent facts, people, meetings, commitments, or deadlines.
   4. For the Mumbai office lease renewal: Ownership is STRICTLY UNCLEAR / UNASSIGNED.
      Do NOT claim Facilities or anyone else owns it.
   ```

2. **Negative Proofing**:
   If an inquiry requests information outside the historical week or Data Pack (e.g. *"What is our budget for the Tokyo sales summit?"*), the agent refuses to extrapolate and outputs:
   > *"I could not determine that from the available source data."*

3. **Deterministic Grounded Fallback**:
   If `GEMINI_API_KEY` is not provided or API calls encounter network/quota exceptions, the backend automatically transitions to the built-in deterministic grounding engine. The user interface continues operating seamlessly, providing exact, verified answers with full evidence citations for all 8 core assignment scenarios.

---

## 4. Why Deterministic Logic Handles Business Rules

Generative models struggle with exact timeline arithmetic, boundary conditions, and absolute status consistency across time. In our architecture:

| Responsibility | Handled By | Rationale |
| :--- | :--- | :--- |
| Semantic intent extraction | **Gemini 3.8 Flash** | Excellent language comprehension of messy conversational text |
| Entity normalization | **Deterministic Service** | Exact mapping of email addresses and aliases to canonical persons |
| Task deduplication | **Deterministic Service** | Prevents fragmentation of a single task across multiple channels |
| Deadline resolution | **Deterministic Service** | Maps relative expressions to exact historical ISO timestamps |
| Historical status transitions | **Deterministic Service** | Evaluates active status and overdue states relative to simulated time |
| Ownership enforcement | **Deterministic Service** | Enforces that unclear ownership remains strictly "Unclear" |
| Conversational answer synthesis | **Gemini 3.8 Flash** | Produces natural, executive-level summaries with citations |

---

## 5. Limitations & Future Extensions

- **Cross-week Projections**: The current prototype is scoped to the historical week of September 21–25, 2026. Generalizing to multi-week or real-time streaming would require rolling calendar window handlers.
- **Audio File Processing**: The prototype parses transcripts of voice notes. Integrating direct multimodal audio ingestion via Gemini's native audio API would enable direct tone-of-voice analysis.
