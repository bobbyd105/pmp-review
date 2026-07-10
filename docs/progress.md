# Progress

## Current Version
v0.7 — Slice 6 complete (Prompt Helper); curriculum content batch 2 added
(8 questions, 2 lessons) via the direct-PR pipeline per Decision #9; all
existing content remapped to the July 2026 ECO structure per Decision #10

## Completed Work
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

## Files Modified
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
- Slice 5: first `src/studio/` module — validation logic in a pure,
  React-free module, unit-tested directly. JSON seed files remain
  read-only static imports everywhere (Decision #8); no write path.
- Slice 6: third JSON seed file (`data/prompts.json`) following the
  questions.json/lessons.json pattern (static import + data-contract
  test). Prompts are standalone text — no cross-references to questions
  or lessons, no execution, no external calls.

## Known Issues
None blocking.

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
Constitution Section 10 manual accuracy spot-check (questions AND
lessons) remains pending User review. Content Studio checks shape, not
correctness. The 8 prompts are meta-content (study instructions, not
exam content) but merit the same User read-through for tone and
usefulness. Batch 2's 8 questions and 2 lessons likewise passed the
data-contract tests (shape only) and still need the User's manual
accuracy spot-check against the current ECO before merge.

## Current Status
Slices 5 and 6 merged to main (PR #5); curriculum content batch 2 merged
to main (PR #6). July 2026 ECO remap committed on branch
`content/eco-2026-remap` — a re-labeling pass over existing content plus
`docs/content_plan.md`, no new questions or lessons. Not merged, no PR
opened yet; awaiting Review and User approval.

## Next Recommended Task
Full curriculum content authoring (Claude-chat lane), now with Content
Studio as the intake/validation path and Prompt Helper's authoring
prompts as the starting templates; or history management (clear/export)
— spec to be written by ChatGPT + User before implementation.
