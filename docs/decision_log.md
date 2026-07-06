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
