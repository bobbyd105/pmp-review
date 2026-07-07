# Progress

## Current Version
v0.7 — Slice 6 complete (Prompt Helper)

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
usefulness.

## Current Status
Slices 5 and 6 built, tested, and documented on branch
`claude/content-studio-prompt-helper-441p0f` (three commits: governance
policy, Content Studio, Prompt Helper). Pushed for review — no PR
opened, per instruction. Awaiting Review and User approval.

## Next Recommended Task
Full curriculum content authoring (Claude-chat lane), now with Content
Studio as the intake/validation path and Prompt Helper's authoring
prompts as the starting templates; or history management (clear/export)
— spec to be written by ChatGPT + User before implementation.
