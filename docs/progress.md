# Progress

## Current Version
Current working state: v0.7 runtime plus the merged curriculum architecture and
knowledge-layer baseline. This closeout balances all 384 questions across the
four correct-answer positions, adds reproducible answer-bias measurement, and
ingests the complete ten-lesson Foundation Block (c001-c010) as Authored concept
assets. Knowledge checks and direct production-question links remain pending.

Prior v0.7 summary follows.

v0.7 — Slice 6 complete (Prompt Helper); curriculum content batch 2 added
(8 questions, 2 lessons) via the direct-PR pipeline per Decision #9; all
existing content remapped to the July 2026 ECO structure per Decision #10;
Phase 1 ECO breadth coverage now COMPLETE on both sides — every one of the
26 ECO tasks has at least one question AND at least one lesson (31 questions,
26 lessons total; 26 of 26 tasks have both). Phase 12 questions are added:
the bank now contains 384 questions and 26 lessons (People 130Q/8L, Process
155Q/10L, Business Environment 99Q/8L).

## Completed Work
- Answer-bias closeout and Foundation Block ingestion (2026-07-13):
  - Reordered option arrays deterministically with the committed
    `pmp-options-v1` seed. Correct-answer text and all question wording are
    unchanged; positions are exactly balanced at 96 / 96 / 96 / 96.
  - Added a hard answer-position distribution guard (no position may exceed
    40%) and a reproducibility/idempotence check.
  - Added character-length measurement and a generated worst-first report.
    315/384 questions exceed the 1.3 correct/average-distractor ratio and
    364/384 (94.8%) have a strictly longest correct answer. This remains an
    explicit editorial remediation blocker; no wording changed in this slice.
  - Added `data/concept_lessons.json` with the supplied c001-c010 Foundation
    Block records, preserving empty glossary/reference/formula links, pending
    knowledge checks, and empty related-question links.
  - Added validation for required fields, exact unique IDs, Foundation Block
    membership, module/PMBOK/focus-area/approach enums, current ECO mappings,
    deferred assessment fields, and source references.
  - Recorded the single-author/single-reviewer approval workflow in Decision
    #11 and marked the ten assets Authored in the coverage matrix without
    changing canonical unit lifecycle statuses.
  - Validation: focused 3 files / 9 tests pass; full suite 18 files / 139 tests
    passes; production build passes with the existing non-blocking large-chunk
    warning.
- Knowledge Layer & Content Production Framework (merged via PR #21,
  2026-07-13):
  - Added a canonical 59-concept graph with reciprocal hierarchy/related
    relationships, acyclic prerequisites, ECO/PMBOK mappings, and planned/
    existing lesson plus glossary/formula/reference links.
  - Added 59 planned concept-lesson records and 118 measurable objectives with
    prerequisites, competencies, Bloom levels, mastery thresholds, estimated
    time, and difficulty hypotheses. Planning IDs do not reserve production
    lesson IDs.
  - Added representative catalogs: 14 glossary entries, 10 formulas, and 12
    planned reference sheets. These validate schemas and are not complete or
    Approved production content.
  - Designed local-first adaptive learning, question/lesson target metadata,
    the governed content pipeline, curriculum/knowledge visual maps, and a
    no-move-yet repository future state.
  - Added cross-catalog validation for identity, mappings, reciprocal links,
    prerequisite cycles, planned lessons/objectives, and shared asset/source
    references.
  - Validation: focused 7-test contract passes; full suite 15 files / 130 tests
    passes; production build passes; production lesson/question diffs are empty.
- Curriculum architecture audit and planning infrastructure (working tree,
  2026-07-13):
  - Inventoried all 11 local reference PDFs and produced a machine-readable
    source-topic index without committing source files or copied text.
  - Audited repository models, UI, prompts, validation, all 384 questions,
    and all 26 lessons.
  - Defined one canonical curriculum catalog surfaced through a 59-unit
    Comprehensive Course, the existing 26-lesson ECO Review track, and
    shared reference/assessment layers.
  - Added `data/content_coverage.json`: 13 modules and 59 concept units;
    each has ECO, PMBOK, and source mappings. Ratings: 9 Strong, 29 Partial,
    11 Thin, 10 Missing. Lifecycle: 30 Existing anchors, 29 Planned, 0
    Approved, 0 Implemented.
  - Added lesson, question, and metadata generation contracts plus working
    progress/decision/resume logs.
  - Added pure coverage validation/derivation logic and the seventh app view,
    Curriculum Coverage, with module/strength/status filters, lesson/source
    mappings, and derived ECO-aligned question counts.
  - Validation: 14 test files / 123 tests pass; production build passes;
    rendered headless-browser check confirms 59 cards, filters, mappings,
    four expected AI gap cards, and zero console errors.
- Repository governance established: docs/ai_collaboration_agreement.md,
  docs/project_constitution.md
- Slice 1 — Question Bank data foundation (v0.2, merged via PR #2)
- Slice 2 — Quiz Engine (v0.3, merged via PR #2)
- Slice 3 — Progress Tracking + Dashboard (v0.4, merged via PR #3)
- Slice 4 — Lessons data foundation (v0.5, merged via PR #4)
- Governance: direct-to-main commit policy added to
  docs/ai_collaboration_agreement.md v1.5 (Section 7) — documentation
  backfills explicitly approved in-session may bypass a PR; everything
  else goes through Review/Approve
- Slice 5 — Content Studio (v0.6):
  - decision_log.md Decision #8: validate-and-display snippet flow, no
    direct file write — the tool never touches data/questions.json or
    data/lessons.json; on valid input it shows a ready-to-paste snippet
    and says so explicitly (refines Decision #5's "writes to" wording)
  - `src/studio/contentValidator.js`: pure validation module mirroring
    the questions.data.test.js and lessons.data.test.js contracts —
    required fields, valid ECO domains, ≥2 unique options,
    correct_answer ∈ options, lesson body length/placeholder rules,
    cross-file id uniqueness (both directions), related_question_ids
    referential integrity. Every rejection names the exact problem.
  - `ContentStudio` component: fifth nav view — Question/Lesson toggle,
    paste textarea, Validate button, specific error list on failure,
    snippet + "Nothing has been saved" notice + copy-to-clipboard on
    success. Additive only; reads existing data solely for duplicate
    and reference checks.
  - Verified in headless Chromium: parse/missing-field/duplicate-id/
    bad-domain/dangling-ref errors named on screen, valid snippet +
    not-saved notice + clipboard copy work, zero console errors
- Slice 6 — Prompt Helper (v0.7):
  - `data/prompts.json`: 8 curated PMP-study prompts (practice-question
    generation, concept explainers, situational drills, missed-question
    diagnosis, PMI mindset checks, dashboard-driven study plan, and two
    Content Studio authoring prompts) — static local text with
    [bracketed] fill-in slots, per the product brief's "copy/paste
    prompts only"
  - `PromptHelper` component: sixth nav view — browsable prompt cards
    (title, when-to-use description, full text) each with a
    copy-to-clipboard button and per-card "Copied!" feedback; UI states
    plainly that the app never calls an AI
  - Tests: 114 Vitest tests passing (104 after Slice 5 + 5 prompts
    data-contract incl. a no-URLs/static-text check + 5 PromptHelper
    rendering/copy)
  - Verified in headless Chromium: all 8 prompt cards render, clipboard
    receives the exact prompt text with per-card feedback, all six views
    regression-checked, zero console errors/warnings, and zero external
    network requests observed (constitution Section 2)
- Curriculum content batch 2: 8 questions (q017–q024) and 2 lessons
  (l005–l006) appended to data/questions.json and data/lessons.json.
  Added via the direct-PR pipeline (appended directly to the JSON files,
  validated by the existing data-contract test suite), NOT through Content
  Studio, per decision_log.md Decision #9 — Content Studio is now reserved
  for occasional single ad-hoc additions, while bulk batches go through the
  normal PR/Review/Merge flow. New content covers virtual teams,
  impediment removal, methodology tailoring, governance, issue management,
  quality/conformance, project closure, and continuous improvement. All 114
  existing tests plus the data-contract tests pass with zero test-file
  changes.
- July 2026 ECO remap (Decision #10): this was a re-labeling pass, NOT new
  content. The `eco_domain` and `eco_task` fields of all 24 questions and 6
  lessons were remapped from the retired 2021 ECO (35 tasks) to the current
  July 9, 2026 ECO (26 tasks; domain weights People 33% / Process 41% /
  Business Environment 26%). Question/answer/body text was untouched — only
  the two classification fields changed. 8 items also changed domain, not
  just task label (risk, change control, governance → Business Environment;
  communications → People; value/benefits → Process; impediments/issues
  merged into one Business Environment task). Added `docs/content_plan.md`:
  a coverage table of all 26 tasks with real question/lesson counts. All
  114 tests still pass with zero test-file changes (eco_domain values remain
  valid strings). Note: 6 empty tasks (People 1/5/7, Process 4/6/9) are
  marked "name pending" in content_plan.md — their official ECO labels were
  not in the remap mapping and were not guessed.
- Phase 1 ECO breadth coverage: appended 6 questions (q025–q030) and 6
  lessons (l007–l012) covering the 6 previously-empty tasks — People
  Task 1 (Develop a common vision), Task 5 (Align stakeholder
  expectations), Task 7 (Help ensure knowledge transfer); Process Task 4
  (Plan and manage resources), Task 6 (Plan and manage finance), Task 9
  (Evaluate project status). Their official ECO names (previously "name
  pending" in content_plan.md) are now filled in, and content_plan.md
  counts were re-tallied from the actual files. Every one of the 26 ECO
  tasks now has at least one item — breadth is complete. Bank totals: 30
  questions, 12 lessons (People 10Q/5L, Process 11Q/7L, Business
  Environment 9Q/0L). All 114 tests pass with zero test-file changes.
  Top remaining gap: Business Environment has zero lessons despite being
  ~26% of the exam — the priority for the next (depth) batch.
- Business Environment lesson coverage + People Task 6 gap: appended 8
  lessons (l013–l020, one per Business Environment task) and 1 question
  (q031, People Task 6). This closes Business Environment's zero-lesson
  gap entirely (0 → 8) and gives People Task 6 (previously lesson-only)
  a question. Bank totals after this batch: 31 questions, 20 lessons
  (People 11Q/5L, Process 11Q/7L, Business Environment 9Q/8L). At this
  point 6 tasks were still Questions-only (People Tasks 3/4/8, Process
  Tasks 2/5/7) — 20 of 26 tasks had both.
- Close remaining lesson gaps (People 3/4/8, Process 2/5/7): appended 6
  lessons (l021–l026), one per remaining Questions-only task. Re-counting
  the actual files confirms every one of the 26 ECO tasks now has at least
  one question AND at least one lesson — breadth is complete on both sides.
  Bank totals now: 31 questions, 26 lessons (People 11Q/8L, Process
  11Q/10L, Business Environment 9Q/8L). No task is Questions-only,
  Lesson-only, or empty. All 114 tests pass with zero test-file changes.
- Phase 2 Process depth batch 1: appended 10 questions (q032–q041), one
  for each Process task. This is the first Phase 2 depth batch after Phase
  1 breadth completion. Process now has 21 questions across its 10 tasks
  (Task 3 has 3; every other Process task has 2). Bank totals are now 41
  questions and 26 lessons (People 11Q/8L, Process 21Q/10L, Business
  Environment 9Q/8L). All 114 tests pass with zero test-file changes.
- Phase 2 People depth batch 1: appended 7 questions (q042–q048), one for
  each underrepresented People task (Tasks 1, 2, 4, 5, 6, 7, and 8).
  People now has 18 questions across its 8 tasks: Task 3 remains at 4 and
  every other task has 2. Combined with Process depth batch 1, bank totals
  are now 48 questions and 26 lessons (People 18Q/8L, Process 21Q/10L,
  Business Environment 9Q/8L). Reconciled with `main` after PR #9 merged;
  all 114 tests pass with zero test-file changes.
- Phase 2 depth round 2: appended 34 questions (q049–q082) across Process,
  People, and Business Environment. Actual-file recount: 82 questions and
  26 lessons (People 26Q/8L, Process 31Q/10L, Business Environment
  25Q/8L). Every task now has at least 3 questions; People Task 3 has 5,
  Process Task 3 and Business Environment Task 4 have 4, and all others
  have 3. All 114 tests pass with zero test-file changes.
- Lesson-question cross-references regenerated for all 26 lessons from
  exact `eco_domain` + `eco_task` matches. No lesson has an empty
  `related_question_ids` array; link counts range from 3 to 5 and total 82.
  This regeneration plus the empty-match check is now the standard final
  step at the end of every future content phase.
- Phase 3 questions: appended 26 questions (q083–q108), exactly one per ECO
  task across all three domains. Actual-file recount: 108 questions and 26
  lessons (People 34Q/8L, Process 41Q/10L, Business Environment 33Q/8L).
  Every task now has at least 4 questions; People Task 3 has 6, Process Task
  3 and Business Environment Task 4 have 5, and all others have 4.
  Reformatted both JSON data files, regenerated every lesson's
  `related_question_ids` from exact domain/task matches, and confirmed all
  26 lessons have 4–6 links with no empty arrays. All 114 tests pass with
  zero test-file changes.
- Phase 4 questions: appended 32 questions (q109–q140) across People and
  Process. Every People task now has 6 questions; nine Process tasks have 6
  and Process Task 3 has 5. Actual-file recount: 140 questions and 26
  lessons (People 48Q/8L, Process 59Q/10L, Business Environment 33Q/8L).
  Reformatted both JSON files, regenerated all 26 lessons' exact
  domain/task question links, and confirmed no empty arrays. All 114 tests
  pass with zero test-file changes.
- Phase 5 questions: appended 15 questions (q141–q155), bringing Process
  Task 3 and seven Business Environment tasks to 6 questions. Every People
  and Process task now has 6 questions; Business Environment Task 4 remains
  at 5 while its other seven tasks have 6. Actual-file recount: 155
  questions and 26 lessons (People 48Q/8L, Process 60Q/10L, Business
  Environment 47Q/8L). Reformatted both JSON files, regenerated all 26
  lessons' exact domain/task question links, and confirmed no empty arrays.
  All 114 tests pass with zero test-file changes.
- Phase 6 questions: appended 19 questions (q156–q174), one for every
  People and Process task plus Business Environment Task 4. Every People
  and Process task now has 7 questions; every Business Environment task
  has 6. Actual-file recount: 174 questions and 26 lessons (People 56Q/8L,
  Process 70Q/10L, Business Environment 48Q/8L). Reformatted both JSON
  files, regenerated all 26 lessons' exact domain/task question links, and
  confirmed no empty arrays. All 114 tests pass with zero test-file changes.
- Phase 7 questions: appended 18 questions (q175–q192), one for every
  People and Process task. Every People and Process task now has 8
  questions; every Business Environment task remains at 6. Actual-file
  recount: 192 questions and 26 lessons (People 64Q/8L, Process 80Q/10L,
  Business Environment 48Q/8L). Reformatted both JSON files, regenerated
  all 26 lessons' exact domain/task question links, and confirmed no empty
  arrays. All 114 tests pass with zero test-file changes.
- Phase 8 questions: appended 26 questions (q193–q218), exactly one per ECO
  task across all three domains. Every People and Process task now has 9
  questions; every Business Environment task has 7. Actual-file recount:
  218 questions and 26 lessons (People 72Q/8L, Process 90Q/10L, Business
  Environment 56Q/8L). Reformatted both JSON files, regenerated all 26
  lessons' exact domain/task question links, and confirmed no empty arrays.
  All 114 tests pass with zero test-file changes.
- Phase 9 questions: appended 26 questions (q219–q244), exactly one per ECO
  task across all three domains. Every People and Process task now has 10
  questions; every Business Environment task has 8. Actual-file recount:
  244 questions and 26 lessons (People 80Q/8L, Process 100Q/10L, Business
  Environment 64Q/8L). Reformatted both JSON files, regenerated all 26
  lessons' exact domain/task question links, and confirmed no empty arrays.
  Increased only the exhaustive Question Bank rendering test timeout to 15
  seconds as the growing bank began exceeding the default. All 114 tests
  pass.
- Phase 10 questions: appended 26 questions (q245–q270), exactly one per ECO
  task across all three domains. Every People and Process task now has 11
  questions; every Business Environment task has 9. Actual-file recount:
  270 questions and 26 lessons (People 88Q/8L, Process 110Q/10L, Business
  Environment 72Q/8L). Reformatted both JSON files, regenerated all 26
  lessons' exact domain/task question links, and confirmed no empty arrays.
  Replaced the Phase 9 per-test timeout with a file-scoped top-level
  `vi.setConfig({ testTimeout: 15000 })` in `QuestionBank.test.jsx`, avoiding
  manual timeout arguments as additional full-bank tests cross the default.
  The requested `beforeAll` placement was tested but did not affect timeouts
  in the installed Vitest runtime. All 114 tests pass.
- Phase 11 questions: appended 26 questions (q271–q296), exactly one per ECO
  task across all three domains. Every People and Process task now has 12
  questions; every Business Environment task has 10. Actual-file recount:
  296 questions and 26 lessons (People 96Q/8L, Process 120Q/10L, Business
  Environment 80Q/8L). Reformatted both JSON files, regenerated all 26
  lessons' exact domain/task question links, and confirmed no empty arrays.
  All 114 tests pass with the file-scoped Question Bank timeout.
- Phase 12 questions: appended 88 questions (q297–q384) across all three
  domains. Actual-file recount: 384 questions and 26 lessons (People
  130Q/8L, Process 155Q/10L, Business Environment 99Q/8L). Task depths are
  intentionally uneven: People 16–17, Process 15–16, and Business
  Environment 12–13. Reformatted both JSON files, regenerated all 26
  lessons' exact domain/task question links, and confirmed no empty arrays.
  All 114 tests pass with the file-scoped Question Bank timeout.

## Files Modified
- Answer-bias/Foundation closeout: `data/questions.json`,
  `data/concept_lessons.json`, `scripts/shuffle-question-options.mjs`,
  `scripts/report-length-bias.mjs`, three focused tests,
  `docs/content/length_bias_report.md`, `docs/content/coverage_matrix.md`,
  `docs/decision_log.md`, `package.json`, `docs/app-map.html`, and this file.
- Knowledge layer: `data/knowledge_graph.json`,
  `data/learning_objectives.json`, `data/glossary_catalog.json`,
  `data/formula_catalog.json`, `data/reference_sheet_catalog.json`,
  `docs/content/knowledge_graph.md`, glossary/formula/reference/adaptive/
  question-metadata/lesson-metadata models, pipeline/maps/future-state/report,
  `src/__tests__/knowledgeLayer.data.test.js`, `docs/working/*`,
  `docs/app-map.html`, and `docs/progress.md`.
- Curriculum architecture/planning slice: `README.md`,
  `data/content_coverage.json`, `docs/content/*`, `docs/working/*`,
  `src/coverage/contentCoverage.js`,
  `src/components/CurriculumCoverage.jsx`,
  `src/__tests__/contentCoverage.test.js`,
  `src/__tests__/CurriculumCoverage.test.jsx`, `src/App.jsx`,
  `src/index.css`, `docs/content_plan.md`, `docs/app-map.html`, and
  `docs/progress.md`.
- Slice 5: docs/decision_log.md (Decision #8),
  src/studio/contentValidator.js, src/components/ContentStudio.jsx,
  src/__tests__/contentValidator.test.js + ContentStudio.test.jsx,
  src/App.jsx, src/index.css, package.json, docs/app-map.html,
  docs/progress.md
- Slice 6: data/prompts.json (added),
  src/components/PromptHelper.jsx (added),
  src/__tests__/prompts.data.test.js + PromptHelper.test.jsx (added),
  src/App.jsx (sixth nav view), src/index.css (prompt styles),
  package.json (version bump), docs/app-map.html, docs/progress.md

## Architecture Changes
- The production curriculum now has a separate validated concept-lesson
  catalog. It is an authored content source but has no runtime UI consumer yet;
  the existing ECO lesson schema and the 59-unit planning catalog are unchanged.
  Question option order is now a reproducible generated property, while answer
  length is an independently generated quality signal.
- Knowledge layer: concepts and objectives now form the canonical instructional
  dependency layer between the coverage catalog and future lessons/questions.
  Taxonomy, prerequisites, and related links are distinct. Shared glossary,
  formula, and reference assets use stable semantic IDs. Learner state remains
  separate, adaptive algorithms are not implemented, and production metadata
  migration is sidecar-first and still requires User approval.
- Curriculum planning: one canonical catalog with separate Comprehensive
  Course and ECO Review tracks. Coverage strength is separate from content
  lifecycle. Question counts are derived from ECO mappings and labeled as
  coarse alignment, not direct concept mastery. Production question/lesson
  schemas remain unchanged pending a separate User-approved migration.
- Slice 5: first `src/studio/` module — validation logic in a pure,
  React-free module, unit-tested directly. JSON seed files remain
  read-only static imports everywhere (Decision #8); no write path.
- Slice 6: third JSON seed file (`data/prompts.json`) following the
  questions.json/lessons.json pattern (static import + data-contract
  test). Prompts are standalone text — no cross-references to questions
  or lessons, no execution, no external calls.

## Known Issues
- **Content-quality blocker (partially resolved):** correct-answer positions
  are now exactly balanced at 96 per position and protected by a hard test.
  Length bias remains: 364/384 questions (94.8%) have a strictly longest
  correct answer, and 315/384 exceed the 1.3 correct/average-distractor ratio.
  Editorial wording remediation remains required before quiz scores can be
  treated as strong content evidence.
- Production build emits a large-chunk warning because the full local
  content bank is statically bundled. It is non-blocking for the local MVP.

## Technical Debt
- `correct_answer` stored as exact option string (decision_log.md #1).
- No clear/export for quiz history (carried from v0.4).
- Lesson body markdown beyond paragraphs/bold/bullets renders as literal
  text until a fuller renderer is adopted (decision_log.md #7).
- Content Studio validation rules are intentionally duplicated from the
  data-contract tests (the tests remain the source of truth); if the
  schema changes, both must be updated together — the validator's tests
  run against the real data files to catch drift.
- Six flat nav buttons is approaching the point where grouping (study
  views vs. authoring tools) is worth considering — cosmetic, not
  blocking.

## Content Accuracy Note
The curriculum audit validates structure and traceability, not the factual
accuracy of every lesson/question. Source-derived planning language is
original, and the local PDFs/planning maps remain ignored. New concept
lessons/questions require the review contracts under `docs/content/`.

Constitution Section 10 manual accuracy spot-check (questions AND
lessons) remains pending User review. Content Studio checks shape, not
correctness. The 8 prompts are meta-content (study instructions, not
exam content) but merit the same User read-through for tone and
usefulness. Batch 2's 8 questions and 2 lessons likewise passed the
data-contract tests (shape only) and still need the User's manual
accuracy spot-check against the current ECO before merge.

## Current Status
Knowledge-layer Phases 0-13 and their curriculum architecture baseline are
merged on main via PR #21. The current closeout branch adds deterministic
question option ordering, the length-bias report, and the Authored Foundation
Block. `data/lessons.json` remains unchanged; concept lessons are isolated in
`data/concept_lessons.json` and are not yet rendered by the app.

Slices 5 and 6 merged to main (PR #5); curriculum content batch 2 merged
to main (PR #6). Branch `content/eco-2026-remap` (open as PR #7) now holds
four commits: (1) the July 2026 ECO remap (re-labeling pass +
content_plan.md), (2) Phase 1 breadth coverage (6 questions, 6 lessons),
(3) Business Environment lesson coverage + People Task 6 question
(8 lessons, 1 question), and (4) the final 6 lessons closing the last
Questions-only tasks (People 3/4/8, Process 2/5/7). PR #7 merged to main.
Breadth is complete: all 26 ECO tasks have both a question and a lesson.
Phase 2 depth is complete through q082. Phase 3 adds q083–q108, exactly one
question per ECO task across all three domains. Phase 4 adds q109–q140
across People and Process. Phase 5 adds q141–q155 across Process and
Business Environment. Phase 6 adds q156–q174 across People, Process, and
Business Environment Task 4. Phase 7 adds q175–q192 across People and
Process. Phase 8 adds q193–q218, exactly one question per ECO task. The
Phase 9 batch adds q219–q244, also exactly one question per ECO task. The
Phase 10 batch adds q245–q270, also exactly one question per ECO task. The
Phase 11 batch adds q271–q296, also exactly one question per ECO task. The
Phase 12 batch adds q297–q384 across all three domains. The combined bank
contains 384 questions and
26 lessons, and every lesson's related questions have been regenerated
from exact domain/task matching.

## Next Recommended Task
Current recommendation: perform the dedicated editorial length-bias remediation
for the worst-first flagged question list, then enable a hard <=40%
strict-longest acceptance gate. In parallel, review and author knowledge checks
and direct question mappings for c001-c010 before exposing the Foundation Block
in a learner-facing Comprehensive Course view.

Prior recommendation (superseded by this audit):
Continue curriculum lesson depth authoring (Claude-chat lane), using
Content Studio as the intake/validation path and Prompt Helper's authoring
prompts as starting templates; or history management (clear/export) — spec
to be written by ChatGPT + User before implementation. End every future
content phase by regenerating and validating lesson-question references.
