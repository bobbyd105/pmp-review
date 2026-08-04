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

---

## Decision #7 — Lessons schema: flat JSON records with markdown-text body and question cross-references

**Date:** 2026-07-06

**Decision:** `data/lessons.json` is a flat array of lesson records:
`id`, `eco_domain`, `eco_task`, `title`, `body` (markdown-capable plain
text), and optional `related_question_ids[]` referencing `id` values in
`data/questions.json`. The body is stored as markdown but rendered in MVP
with a minimal built-in subset (paragraphs, bold, bullet lists) — no
markdown library dependency and no raw-HTML injection.

**Alternatives considered:**
1. Structured body (array of typed sections: heading/paragraph/list/callout)
   instead of markdown text.
2. Full markdown rendering via a library (e.g. react-markdown) from day one.
3. Nesting lessons under a module/course hierarchy now.
4. Embedding related questions inline in the lesson file rather than by id.

**Why rejected:**
1. Typed sections make authoring harder (curriculum will be written as
   prose by Claude-chat per the RACI) and pre-decide a structure no feature
   needs yet.
2. A markdown library is a real dependency with an HTML-injection surface;
   nothing in this slice needs more than paragraphs/bold/lists. The schema —
   which is what this slice locks in — is unaffected by upgrading the
   renderer later.
3. A course hierarchy is speculative structure (constitution Section 3);
   a flat list with eco_domain/eco_task tags already supports grouping.
4. Embedding questions duplicates content that data/questions.json owns —
   ids keep one source of truth, enforced by a referential-integrity test.

**Tradeoffs:** Markdown beyond the rendered subset displays as literal text
until a fuller renderer is adopted (a logged decision at that point).
Cross-references by id mean lesson validity depends on questions.json — the
data-contract test makes a dangling id a test failure, and the renderer
skips unresolvable ids rather than crashing.

**Evidence:** Mirrors the Slice 1 questions.json pattern (flat JSON seed +
data-contract test) that has held up through three slices; related-question
rendering resolves ids against the live question bank at render time,
proving the linkage rather than assuming it.

**Revisit:** When full curriculum content is authored — if it needs richer
formatting (tables, images, code blocks) or a module hierarchy, upgrade the
renderer/schema then, as a new logged decision.

**Approved by:** User

---

## Decision #8 — Content Studio output: validate-and-display snippet, no direct file write

**Date:** 2026-07-07

**Decision:** Content Studio validates pasted question/lesson JSON and, on
success, displays a ready-to-paste snippet plus explicit instructions for
which file (`data/questions.json` or `data/lessons.json`) and where (end of
the array) to add it. It never writes to the JSON files itself, and it
states that plainly in the UI so there is no ambiguity about whether
content was saved. This refines Decision #5, which loosely said the tool
"writes to" the JSON files before the write mechanism had been designed.

**Alternatives considered:**
1. A local dev-server write endpoint (a Vite dev-only middleware that
   appends validated entries to the JSON files), unavailable in a static
   production build.
2. Browser-side writes via the File System Access API.

**Why rejected:**
1. A dev-only endpoint makes the same UI behave differently in `npm run
   dev` vs. a static build — a silent-failure trap for exactly one user —
   and puts programmatic writes on the seed files, whose corruption would
   break every view. It also bypasses the User's review moment: hand-adding
   the snippet and seeing the git diff *is* the approval step for new
   content, per the agreement's User-as-final-authority rule.
2. File System Access API is Chromium-only, requires re-granting file
   permissions per session, and still amounts to the app rewriting its own
   seed files — same corruption risk, more ceremony.

**Tradeoffs:** One manual paste per new entry. Acceptable at MVP scale,
where content arrives in small, User-reviewed batches; batching many
entries at once is a future revisit, not a current requirement.

**Evidence:** Decision #3 already established that this browser app has no
write path to local files; every existing data flow treats the JSON seeds
as read-only static imports. The snippet flow keeps that single pattern
intact with zero new dependencies.

**Revisit:** If content volume makes per-entry pasting a real bottleneck
(e.g. bulk-importing a full curriculum), or if SQLite is adopted per
constitution Section 3 — a real write layer changes this calculus.

**Approved by:** User (scope pre-approved in this session's slice spec,
which delegated the write-mechanism choice to the implementer)

---

## Decision #9 — Content Studio's role narrowed to ad-hoc additions; bulk content goes through the PR pipeline

**Decision:** Content Studio's role narrowed: bulk curriculum content
(batches authored in Claude chat) goes through the normal PR pipeline —
appended directly to questions.json/lessons.json, validated by the
existing data-contract test suite, standard Review/Merge. Content Studio
itself is reserved for occasional single, ad-hoc additions outside a
planned content batch.

**Alternatives considered:** routing all content, including bulk batches,
through Content Studio's one-at-a-time paste flow.

**Rejected because:** real friction at the actual content volume needed
(150+ questions), with no added safety over what the existing test suite
already provides.

**Approved by:** User

---

## Decision #10 — Remap all existing content to the July 2026 ECO structure

**Decision:** PMI updated the PMP Exam Content Outline effective July 9,
2026: domain weights changed (People 42%->33%, Process 50%->41%, Business
Environment 8%->26%), and the task list consolidated from 35 tasks to 26.
All existing question/lesson `eco_domain` and `eco_task` fields were
written against the retired 2021 ECO and have been remapped to the new
structure (see commit for the full mapping). Some items changed domain,
not just task label — notably risk, change control, and governance moved
from Process to Business Environment; communications moved from Process to
People; value/benefits moved from Business Environment to Process;
impediments/issues merged into one Business Environment task.

**Alternatives considered:** leaving old labels in place and only updating
new content going forward.

**Rejected because:** mixed old/new task labels in the same data file would
make coverage tracking meaningless and could mislabel Dashboard's
per-domain accuracy stats for existing quiz history.

**Evidence:** PMI's official ECO PDF (pmi.org, July 2026 revision),
cross-checked directly, not from training-data memory.

**Approved by:** User

---

## Decision #11 — Conversational User approval is the content review decision

**Date:** 2026-07-13

**Decision:** In this single-author/single-reviewer project, the User's explicit
approval in the working conversation replaces a separate formal multi-step
review ceremony for concept lessons c001-c010 and future content batches unless
this decision is revisited. Automated structural, mapping, and referential
validation still runs before commit. For c001-c010, conversational approval
authorizes ingestion as **Authored**; it does not claim that pending knowledge
checks or related production questions are complete, and it does not mark the
canonical coverage units Implemented.

**Alternatives considered:** Requiring separate structural, overlap, technical,
source, instructional, and assessment sign-offs by the same two participants
after conversational approval had already been given.

**Why rejected:** Repeating the same approval through multiple formal gates
adds ceremony without adding an independent reviewer. The committed contract
tests, source references, visible diff, and draft PR preserve an auditable
review point.

**Tradeoffs:** Conversational approval must be explicit and recorded in the
decision log or PR. It does not replace automated validation, and it cannot
turn incomplete assessment assets into complete ones.

**Revisit:** If another author or reviewer joins, content is published outside
the local repository workflow, or the User requests separate review gates.

**Approved by:** User (explicit closeout instruction in this session)

---

## Decision #12 — Answer-length bias remediated editorially; length gates become hard content-acceptance rules

**Date:** 2026-07-16

**Decision:** The full question bank was editorially remediated for
answer-length cueing (trimming over-elaborate correct answers to their core
action, extending thin distractors to comparable specificity), and
`src/__tests__/lengthBias.test.js` now enforces hard gates on the committed
bank: no more than 40% of questions may have a strictly longest correct
answer, no question may exceed the 1.3 correct/average-distractor length
ratio, and no more than 30% may have a strictly shortest correct answer (an
over-correction guard). Every future content batch must pass these gates.

**Alternatives considered:**
1. Mechanically padding distractors or truncating correct answers by script.
2. Leaving the measurement-only test and deferring remediation indefinitely.
3. Remediating only the worst offenders (ratio > 2) and gating at a looser
   threshold.

**Why rejected:**
1. Mechanical rewriting risks changing which option is defensibly best and
   produces unnatural wording; the audits explicitly required editorial
   judgment per item.
2. 94.8% strictly-longest correct answers let a learner pass quizzes on a
   length heuristic that fails on the real exam — an actively harmful teaching
   signal for the platform's core purpose.
3. A partial pass leaves the heuristic exploitable; the ratio flags list only
   shrinks to zero with a full pass, and gating at the target with real margin
   (actual: 18.5%) prevents silent regression as the bank grows.

**Tradeoffs:** ~285 questions had option wording changed (substance,
correct-answer meaning, and explanations preserved; positions unchanged by
the ID-keyed seed). Learners' stored quiz history remains comparable since
question IDs and correctness semantics did not change. Future authors must
draft options with length discipline or fail CI.

**Evidence:** `docs/content/length_bias_report.md` (regenerated, WITHIN
TARGET); before/after measurements 364/384 → 71/384 strictly-longest,
315 → 0 ratio flags; full suite 18 files / 141 tests passing; option-position
distribution unchanged at 96/96/96/96.

**Approved by:** Mission agent (Claude) under the 2026-07-15 mission
authority; subject to User ratification at draft-PR review — nothing merges
to main without explicit User approval.

---

## Decision #13 — PR #24 review remediation: actionable practice questions, durable course progress, and a single reconciled lesson-ID scheme

**Date:** 2026-07-17

**Decision:** Addressed all four blocking findings from the PR #24 review
(recorded as a PR comment, since GitHub does not let an account formally
request changes on its own pull request):

1. **Actionable practice questions.** `ConceptLessonCard.jsx` now renders
   each related bank question through a shared `AnswerableQuestion`
   component (radiogroup, locked-until-selected "Check answer", reveal with
   correctness and explanation) instead of a static `<li>` stem, and adds an
   "Open in Question Bank" handoff that switches the app to the Browse view
   and scrolls to/auto-expands that exact question (`App.jsx` →
   `QuestionBank.jsx`'s new `focusQuestionId` prop).
2. **Durable course progress.** New `src/course/courseProgress.js` (pure
   logic + localStorage, load-validated against the current course —
   mirrors `quiz/quizSession.js`) persists lesson-completion toggles and
   knowledge-check selections/reveals. `Course.jsx` owns this state and
   passes it down, so collapsing a lesson, switching views, or refreshing
   the page no longer loses knowledge-check results, and a visible "X of Y
   lessons complete" summary gives a resume signal.
3. **Reconciled Course–Reference linking.** `formula_catalog.json` and
   `glossary_catalog.json` carried a stale `related_lesson_ids` scheme
   (`PL-Cxxx`) from a pre-authoring 59-unit planning pass
   (`knowledge_graph.json` / `learning_objectives.json`). Investigation
   showed this scheme's numbering does **not** correspond to the authored
   62-lesson `concept_lessons.json` (e.g. planning-layer `C038` is "Earned
   Value Interpretation"; authored `c038` is "Building the Project
   Schedule") — a naive `PL-Cxxx` → `cxxx` rewrite would have produced
   confidently wrong links. Every one of the 18 formula and 38 glossary
   entries was instead re-matched to the authored course by content (title,
   key terms, and section text), `related_lesson_ids` rewritten to real
   `cxxx` ids, and `concept_lessons.json`'s `formula_refs`/`glossary_refs`
   populated as the reverse relationship. Two glossary terms (RACI chart,
   risk appetite) do not appear in any authored lesson yet and were left
   unlinked rather than forced onto an approximate lesson — a genuine
   content gap, not a bug. `reference_sheet_refs` stays empty everywhere:
   `reference_sheet_catalog.json` is `"status": "planned"` with zero UI
   integration (the Reference view never imports it), so there is nothing
   valid to point at until that layer actually ships.
   `conceptLessons.data.test.js` gained a bidirectional resolution test
   (every populated ref resolves in both directions) and
   `knowledgeLayer.data.test.js`'s `related_lesson_ids` assertions now check
   against `concept_lessons.json` instead of the planning-layer id set.
   `ConceptLessonCard.jsx` surfaces the populated refs as a "Reference
   sheet" section with the same open-and-scroll handoff into `Reference.jsx`
   (new `focusEntry` prop), which also now resets its filter on section
   switch (a non-blocking finding from the same review).
4. **CI.** Added `.github/workflows/ci.yml`: one job, `npm ci` → `npm test`
   → `npm run build`, triggered on `pull_request`. Deliberately minimal —
   no coverage tooling, no matrix, no additional checks — since the review
   asked only for reproducible evidence at the head SHA, not a build system.

**Alternatives considered (item 3):** Adding a third, new field for
authored-course lesson ids instead of repurposing `related_lesson_ids`.

**Why rejected:** The review's instruction was to use *one* valid lesson ID
scheme, not add a fourth. `related_lesson_ids` on these two catalogs had no
consumer relying on the old `PL-Cxxx` meaning outside the one test updated
here, so repurposing it is the reconciliation the review asked for rather
than a workaround.

**Not implemented / flagged for User decision:** whether to build a
Reference-sheet UI for `reference_sheet_catalog.json` at all (it is
currently unbuilt, unrendered planning content); if not, its "planned"
status and the PR/README language around the Reference layer should say so
explicitly rather than implying full three-catalog integration.

**Evidence:** full suite 21 files / 174 tests passing; `npm run build`
succeeds.

**Approved by:** Mission agent (Claude), responding to the PR #24 review
comment; subject to User re-review before approval/merge.
