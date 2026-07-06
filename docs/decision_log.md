# Decision Log

Answers "why did we do it this way" — see `docs/project_constitution.md`
Section 4. Architecture- and data-model-level decisions only. Format:
Decision → Alternatives considered → Why rejected → Tradeoffs → Evidence →
Approved by.

---

## Decision #1 — Question schema stays as-is for Slice 2

**Date:** 2026-07-06

**Decision:** The current question fields (`id`, `eco_domain`, `eco_task`,
`question`, `options`, `correct_answer`, `explanation`) are sufficient for
Slice 2 (Quiz Engine). No schema changes.

**Alternatives considered:** Adding `schemaVersion`, `difficulty`, `tags`,
`source`, and stable UUIDs now, per review feedback on PR #2.

**Why rejected:** Not needed until later Diagnostics/Adaptive slices; adding
them now means re-touching all existing questions for fields with no current
consumer.

**Tradeoffs:** When those fields do become needed, every question authored
between now and then must be migrated in one pass at that time.

**Evidence:** No component or planned Slice 2 logic reads any of the proposed
fields; the Slice 2 spec (success condition 8) explicitly requires using the
schema as-is.

**Revisit:** Before starting an Adaptive Recommendations slice.

**Approved by:** User

---

## Decision #2 — Local JSON seed files remain the MVP data store

**Date:** 2026-07-06

**Decision:** Continue with local JSON seed files (`data/questions.json`) for
MVP data.

**Alternatives considered:** SQLite.

**Why rejected (for now):** No write-heavy per-user state exists yet to
justify the added dependency.

**Tradeoffs:** JSON is read-only seed data; anything that needs writes must
use another mechanism (see Decision #3) until/unless SQLite is adopted.

**Evidence:** Constitution Section 3 already names SQLite as the planned next
step only when data shape genuinely outgrows JSON; nothing in Slices 1–2
writes to the question data.

**Revisit:** If Progress Tracking or a scaled-up Question Bank makes JSON
genuinely insufficient.

**Approved by:** User

---

## Decision #3 — Quiz session/score persistence via browser localStorage

**Date:** 2026-07-06

**Decision:** Use browser `localStorage` for quiz session and score
persistence in Slice 2.

**Alternatives considered:** Writing to a local JSON file; a
backend/database.

**Why rejected:** No backend exists yet; a browser app cannot write local
files without one (or without user-driven file dialogs). `localStorage` is
sufficient for a single-device, local-first MVP.

**Tradeoffs:** Sessions are per-browser and per-device; clearing browser
storage loses in-progress quiz state. No sync.

**Evidence:** Slice 2 success condition 5 requires persistence across page
reload only — `localStorage` satisfies that with zero new dependencies.

**Revisit:** If cloud sync or multi-device support becomes a real
requirement.

**Approved by:** User

---

## Decision #4 — Quiz feedback timing: advance on submit, review at end

**Date:** 2026-07-06

**Decision:** Submitting a quiz answer records it and advances immediately;
correct answers and explanations are shown only in the end-of-quiz review,
not per-question.

**Alternatives considered:** Immediate correct/incorrect reveal after each
question.

**Why rejected (for this slice):** Advancing without feedback mirrors
actual PMP exam conditions — there is no per-question feedback on test
day. An immediate-feedback "practice mode" is a legitimate but separate
feature, not a default behavior of the quiz engine.

**Tradeoffs:** Learners do not find out what they missed until the quiz
completes; the end-of-quiz review (missed questions with correct answers
and explanations) is the single feedback point.

**Evidence:** Slice 2 success conditions specified "on submit: record
correct/incorrect, advance to the next question"; the implementation and
its tests already enforce that no answer/explanation is visible before
submit.

**Revisit:** If/when a Practice Mode slice is planned.

**Approved by:** User

---

## Decision #5 — Content Studio scope: local import/validation tool, not a generator

**Date:** 2026-07-06

**Decision:** Content Studio is a local import/validation tool for content
authored externally (by Claude in chat) and pasted in by the User. It
validates pasted content against the existing schemas and writes to
`data/questions.json` / `data/lessons.json`. It is not a live AI content
generator.

**Alternatives considered:**
1. A read-only content viewer.
2. Skipping the feature entirely.

**Why rejected:**
1–2. The question/lesson bank needs to scale well beyond MVP seed content
to be useful for real exam prep, and hand-editing JSON doesn't scale. A
live generator is not an option regardless: it would violate the
constitution's no-AI-API-dependency rule (Section 2).

**Tradeoffs:** An import tool is a new maintenance surface whose
validation logic must stay in sync with the data-contract tests; content
quality still depends entirely on the externally authored material and the
User's review — the tool checks shape, not correctness.

**Evidence:** Constitution Section 1 (local-first, no AI API in MVP) and
Section 2 (never call a paid AI API) constrain the design space to
local tooling; the existing data-contract tests define the validation
rules the tool must apply.

**Revisit:** Scope and success conditions to be specified per slice before
implementation (ChatGPT + User per the RACI).

**Approved by:** User

---

## Decision #6 — Defer per-domain correct ≤ total check in quizHistory.js validation

**Date:** 2026-07-06

**Decision:** `isValidEntry()` in `src/quiz/quizHistory.js` checks
type/shape (including entry-level `score <= total`) but not that each
domain tally's `correct <= total`. This stricter per-domain check is
deferred, not added now.

**Alternatives considered:** Adding the stricter check now.

**Why deferred:** Not a blocker for Slice 3; low risk since the only
writer (`buildHistoryEntry`) already guarantees this invariant internally —
it increments a domain's `correct` and `total` together, so it cannot
produce a tally where `correct > total`.

**Tradeoffs:** A hand-edited or externally corrupted stored history entry
with an impossible domain tally would pass validation and flow into
aggregate stats rather than being discarded.

**Evidence:** `buildHistoryEntry` is the single write path to
`pmp-quiz-history-v1`; loadHistory's existing shape validation plus the
entry-level `score <= total` check bound the damage of malformed data.

**Revisit:** If a second write path to history is ever introduced.

**Approved by:** User (via ChatGPT review, 2026-07-06)
