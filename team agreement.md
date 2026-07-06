# PMP Study Platform — AI Collaboration Agreement

**Version:** 1.4
**Last Updated:** 2026-06-30
**Canonical path:** `docs/ai_collaboration_agreement.md`
**Status:** Draft for User review (incorporates ChatGPT's review round)
**Applies to:** User, ChatGPT, Claude, Codex
**Supersedes:** Informal role assumptions in project brief v0.1; Agreement v1.0, v1.1

---

## 1. Purpose

This document exists because the User is the only constant across three AI tools that cannot
see each other's context. Without an explicit agreement, decisions get re-litigated, ownership
gets assumed rather than confirmed, and documentation drifts from reality. This is the
contract that prevents that.

This agreement governs *who decides, who drafts, who builds, and who has final say* — not
*how* work gets done (that's `project_constitution.md` and Addy Osmani's agent-skills
workflow).

---

## 2. Final Authority

**The User is the sole orchestrator and final authority.** Neither ChatGPT nor Claude has
authority to approve their own work, resolve disagreements between each other, or make
binding architectural or product decisions. Both produce recommendations; the User decides.

This matters specifically because the User is manually relaying context between tools — so
neither AI should assume the other's silence means agreement, or that a decision "stuck"
unless the User confirms it landed in the persistent docs (`progress.md`,
`project_constitution.md`).

---

## 3. Role Charter

| Agent | Primary Lane | Holds the Thread? | Shares Budget With |
|---|---|---|---|
| **User** | Product vision, final approval, cross-tool orchestration | Yes — only one who does | — |
| **ChatGPT** | Architecture, QA, consistency review, task sequencing | Within its own session | — |
| **Claude (chat)** | Long-form documentation, curriculum content, architecture *feedback* (not decisions) | No — stateless across sessions unless explicitly re-fed context | Claude Code |
| **Claude Code** | Implementation (selective use), running tests, committing | No | Claude (chat) |
| **Codex** | Implementation (default), running tests, committing | No — executes against a spec, doesn't originate one | — (separate from ChatGPT's budget) |

**Note on "Claude" throughout this document:** unless explicitly marked "Claude Code," all
references to "Claude" mean the conversational/documentation role (this chat), not the
implementation agent. They are functionally separate parties that happen to share a resource
constraint — see below.

**Why Claude doesn't lead orchestration:** shorter effective context budget than ChatGPT for
holding a long-running multi-week thread, and no native persistence across the separate tools
in use. Claude is well-suited to single, bounded, high-quality writing tasks — not to being
the place where "what did we decide three weeks ago" lives.

**Why ChatGPT doesn't lead documentation:** documentation quality (clarity, structure,
long-form coherence) is a different skill from architectural consistency-checking. Splitting
these avoids one tool being asked to both author and grade its own writing.

**Why Claude leads code & UI auditing rather than raw implementation:** Claude (chat) and
Claude Code draw from the same token budget, so heavy raw-build work through Claude Code
shrinks what's left for documentation and curriculum work in this chat. Auditing — reviewing
code quality, implementation approach, and especially UI decisions — is comparatively
cheap and high-leverage, so that's where Claude leads regardless of which engine wrote the
code. Raw implementation itself (Codex vs. Claude Code) is a case-by-case call, not a fixed
default: pick whichever fits the task, and lean toward Codex when the task is long or
token-heavy to preserve Claude's budget for the audit pass after.

---

## 4. RACI by Artifact

R = Responsible (does the work) · A = Accountable (final sign-off) · C = Consulted · I = Informed

| Artifact | R | A | C | I |
|---|---|---|---|---|
| `product_brief.md` | User | User | ChatGPT, Claude | Codex |
| `project_constitution.md` | **Claude** | User | ChatGPT | Codex |
| `build_plan.md` | ChatGPT | User | Claude | Codex |
| `data_model.md` | ChatGPT | User | Claude (terminology/clarity pass) | Codex |
| `architecture_decisions.md` | ChatGPT (synthesis) | User | Claude (critique, alternatives) | Codex |
| `decision_log.md` | Whoever proposes the decision | User | The other AI (rebuttal) | All |
| App-map / repo hygiene (Librarian function) | Codex | User | Claude (flags inaccuracies it finds) | ChatGPT |
| Curriculum / lesson content | **Claude** | User | ChatGPT (scope check) | Codex |
| Code implementation (raw build) | Codex *or* Claude Code (case-by-case, not a fixed default) | User | ChatGPT (spec adherence) | Claude |
| Code & implementation-approach audit | **Claude** | User | ChatGPT (scope/architecture angle) | Codex/Claude Code |
| UI implementation & review | **Claude** (lead) / Claude Code or Codex (build) | User | ChatGPT | — |
| `progress.md` updates | Codex | User | — | ChatGPT, Claude |
| Spec / success conditions per task | ChatGPT + User | User | Claude (if curriculum-adjacent) | Codex |
| Documentation accuracy audit | Claude | User | ChatGPT | Codex |

When a row shows two R's (e.g. spec-writing), the User breaks ties if ChatGPT and Claude
disagree — see Section 6.

**`progress.md` vs. `decision_log.md` — not the same job.** `progress.md` answers "where are
we right now." `decision_log.md` answers "why did we do it this way." Conflating them was a
gap in v1.0 of this agreement — it's what caused decisions to get re-litigated on Cash Flow
Manager and InfraSignal. Each significant decision gets an entry in the log: what was decided,
alternatives considered, why they were rejected, tradeoffs, and who approved it. This applies
to architecture- and data-model-level decisions — not every minor implementation choice, or
the log becomes overhead that violates the "never build more than necessary" principle.

**Librarian function, scoped separately from documentation accuracy:** Codex owns repo
hygiene after each slice — broken links, duplicate or stale docs, keeping `app-map.html`
synced with what was actually built. Claude's "documentation accuracy audit" (Section 4) is a
different check: does the doc's *content* correctly describe behavior, not whether the repo is
tidy. Same general space, different failure modes.

---

## 5. Specific Commitments

### Claude will:
- Draft `project_constitution.md` and keep it internally consistent
- Write curriculum structure, lesson content, and long-form product documentation
- Lead the audit of code quality, implementation approach, and UI decisions — regardless of
  whether Codex or Claude Code wrote the original implementation
- Give architecture *feedback* when asked — flag risks, suggest alternatives — but not issue
  binding architecture decisions
- Flag when a request would require context Claude doesn't have (e.g. "what did we decide
  last week") rather than guessing
- Default to auditing/reviewing over raw building when a task is large or token-heavy, to
  preserve budget shared with Claude Code

### ChatGPT will:
- Lead architecture *synthesis and consistency* — not unilateral ownership; Claude critiques
  and proposes alternatives, the User approves
- Write success conditions for each vertical slice that are verifiable, not aesthetic
- Review Codex's implementation for maintainability, scope creep, and spec adherence
- Flag inconsistencies between what Claude documents and what's actually been built
- Orchestrate within a session, while deferring final say to the User across sessions

### Codex will:
- Implement only against an approved spec/success-conditions, not improvise scope
- Run tests and provide evidence (not just "looks done") before requesting Review
- Update `progress.md` and `app-map.html` after every task, before commit
- Act as repo Librarian after each completed slice: fix broken links, archive obsolete docs,
  flag duplicated or conflicting documentation
- Not commit until Review (ChatGPT) and Approve (User) steps are complete
- Follow the doc-before-complete rule: a task is not done at "code finished" — it's done at
  code → tests → docs updated → app-map updated → commit, in that order

### User will:
- Carry context between tools — neither AI should assume the other has seen prior turns
- Give final approval on architecture, content, and constitution changes
- Resolve disagreements between ChatGPT and Claude when they conflict (Section 6)
- Decide when this agreement itself needs amending

---

## 6. Disagreement Protocol

If ChatGPT and Claude give conflicting recommendations (e.g. ChatGPT wants a leaner data
model, Claude flags it as insufficient for curriculum content needs):

1. Each states its position and *reasoning*, not just a conclusion, in its own session
2. The User relays both positions to the other tool for a single rebuttal round (optional —
   skip if the tradeoff is already clear)
3. The User decides. There is no tie-break mechanism beyond the User — this is intentional,
   since neither AI has visibility into the full picture the User holds

---

## 7. Handoff Protocol (no shared platform)

Since Claude and ChatGPT cannot see each other's sessions:

- **Source of truth for state:** `progress.md` — both AIs should be re-fed this at the start
  of a session if continuity matters
- **Source of truth for non-negotiables:** `project_constitution.md` — read before any
  architecture or content decision
- **The User is responsible for pasting relevant prior output** when asking one tool to react
  to the other's work. Neither AI should be assumed to have "seen" the other's reasoning
  unless it was explicitly provided in-session
- When Claude produces a document for ChatGPT to review (or vice versa), the User should
  paste it in full rather than summarizing — summaries lose the reasoning the other tool
  needs to give a useful critique
- **Claude's access to `app-map.html` depends on the session.** If Claude has repo access in
  that session, it reads the file directly. If not, the User must paste it in or summarize it
  — Claude should not assume it has seen the current app-map unless one of those happened in
  this conversation

---

## 8. Required Context Load Before Implementation

Before any implementation task, Codex or Claude Code must read, **in this order:**

1. `docs/ai_collaboration_agreement.md`
2. `docs/project_constitution.md`
3. `docs/progress.md` — current state, cheap to read
4. `docs/app-map.html` — tells the agent *where* relevant code lives, without reading the
   codebase itself
5. **Only then**, the specific source files `app-map.html` identifies as relevant to this
   task, plus the matching `.agent-skills/` file

Steps 1–4 are lightweight orientation. Step 5 is scoped by what step 4 points to — the agent
should not read the entire codebase by default. This is the whole point of maintaining
`app-map.html`: it lets the agent understand where to look without paying the token cost of
reading everything.

The agent must then state, before touching any code:

- The current project state
- The slice being changed
- Files expected to be touched
- Risks or ambiguities
- Validation plan

**No code changes may begin until this context load is complete.** This applies regardless of
whether the implementation is being run by Codex or Claude Code.

### Standard prompt prefix

Use this at the start of every Codex/Claude Code build prompt:

> Read `docs/progress.md` and `docs/app-map.html` first to get oriented — do not read the
> full codebase yet. Use `docs/app-map.html` to identify which specific files are relevant to
> this task, then read only those, plus `docs/ai_collaboration_agreement.md`,
> `docs/project_constitution.md`, and the relevant `.agent-skills/` file.
>
> Then summarize the current state and proposed slice before editing.

### Closing the no-API enforcement gap

Without API access, there's no automatic hook to inject this instruction before every agent
turn — it only happens if the User pastes it. **Confirmed fix:** both tools auto-load an
instructions file at the start of every session/run — Claude Code reads `CLAUDE.md`, Codex
reads `AGENTS.md`. Neither is hard enforcement (both are context the agent is instructed to
follow, not a lock — true hard-blocking requires separate hook/policy mechanisms in each
tool), but it removes the User as the sole point of failure for getting the rule loaded.

**Use a single `AGENTS.md` at the repo root, not two separate files.** Claude Code falls back
to reading `AGENTS.md` when no `CLAUDE.md` is present, so one file covers both Codex and
Claude Code without duplicate maintenance or drift between two copies. Put the Section 8
context-load requirement there. The prompt prefix above is the fallback for any session where
that file isn't loading correctly — not the primary mechanism.

---

## 8.5 Non-Negotiable: Definition of Done Ordering

No implementation is complete at "code finished." The order is fixed:

**Code → Tests → Docs → Map → Commit**

A task that's coded and tested but undocumented is not done — it's a liability waiting to
cause the next re-litigated decision.

---

## 9. Limitations, Stated Plainly

- Claude does not persist memory across sessions in this workflow unless context is re-supplied
- Claude's context budget is smaller than what's needed to hold the full project thread —
  this is why it doesn't orchestrate
- Claude (chat) and Claude Code draw from a shared token budget — heavy Claude Code usage on
  implementation reduces what's available for documentation work in this chat, and vice versa.
  Codex doesn't share this constraint, which is why Claude leads code/UI *auditing* rather
  than defaulting to Claude Code for raw builds — not because Codex is the fixed default builder
- Neither AI can verify the other's claims about what was "previously agreed" — only
  `progress.md` and `project_constitution.md` are authoritative
- This agreement covers *roles*, not *quality enforcement*. Quality enforcement is the job of
  the Review step (ChatGPT) and the skill-based workflow (Osmani's agent-skills) running
  inside Codex's build step

---

## 10. Amendment

This document changes only via explicit User decision, logged as a dated entry below. It is
not updated as a side effect of any single task, unlike `progress.md`.

| Date | Change | Reason |
|---|---|---|
| — | Initial draft (v1.0) | Establish roles before constitution work begins |
| 2026-06-30 | v1.1: softened ChatGPT's architecture ownership, added `decision_log.md`, split Librarian (Codex) from documentation accuracy audit (Claude), versioned the constitution, added Definition of Done ordering rule | Incorporated ChatGPT's review round |
| 2026-06-30 | v1.2: added Required Context Load Before Implementation (Section 8) and standard prompt prefix; clarified Claude's app-map.html access depends on session repo access | User-specified enforcement mechanism for context loading |
| 2026-06-30 | v1.3: staged the context load (progress.md + app-map.html first, full codebase only as scoped by app-map), and noted that auto-loaded rules files (CLAUDE.md etc.) should carry this requirement structurally rather than relying on the prompt prefix every session | No API access means no automatic per-turn injection; the User shouldn't be the sole enforcement mechanism |
| 2026-06-30 | v1.4: confirmed via Anthropic/OpenAI docs that Claude Code reads `CLAUDE.md` and Codex reads `AGENTS.md` automatically at session start; confirmed Claude Code falls back to `AGENTS.md` when no `CLAUDE.md` exists, so a single root `AGENTS.md` covers both tools | Verified product behavior rather than relying on assumption; reduces duplicate-file maintenance cost |

**Parked, not adopted yet:** ChatGPT proposed this agreement's structure (Constitution →
Product Brief → Architecture Map → Decision Log → Progress → Next Actions → Agent Skills →
Code) become a reusable template across all future projects, not just this one. That's a good
idea but out of scope here — adopting it now would make this document try to govern both this
project and a cross-project standard at once. Worth a separate, dedicated document if the
User wants to pursue it after this project validates the approach.
