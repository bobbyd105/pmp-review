# Progress

## Current Version
v0.6 — Slice 5 complete (Content Studio)

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
  - Tests: 104 Vitest tests passing (62 prior + 31 validator +
    11 ContentStudio, covering valid input and each rejection case)
  - Verified in headless Chromium: parse/missing-field/duplicate-id/
    bad-domain/dangling-ref errors named on screen, valid snippet +
    not-saved notice + clipboard copy work, all five views regression-
    checked, zero console errors/warnings

## Files Modified
- docs/ai_collaboration_agreement.md (v1.5 — direct-to-main policy,
  committed separately)
- docs/decision_log.md (Decision #8 added)
- src/studio/contentValidator.js (added)
- src/components/ContentStudio.jsx (added)
- src/__tests__/contentValidator.test.js,
  src/__tests__/ContentStudio.test.jsx (added)
- src/App.jsx (modified — fifth nav view), src/index.css (studio styles)
- package.json (version bump)
- docs/app-map.html (updated — ContentStudio, contentValidator, tests)
- docs/progress.md (this file)

## Architecture Changes
- First `src/studio/` module: validation logic lives in a pure,
  React-free module so it can be unit-tested directly and stays in
  lock-step with the data-contract tests it mirrors. The JSON seed
  files remain read-only static imports everywhere (Decision #8) — no
  write path was added.

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

## Content Accuracy Note
Constitution Section 10 manual accuracy spot-check (questions AND
lessons) remains pending User review. Content Studio checks shape, not
correctness — content quality still depends on authored material and
User review (Decision #5).

## Current Status
Slice 5 built, tested, and documented on branch
`claude/content-studio-prompt-helper-441p0f`. Prompt Helper (Slice 6)
follows on the same branch per this session's spec. Pushed for review —
no PR opened, per instruction.

## Next Recommended Task
Prompt Helper (Slice 6, this branch), then full curriculum content
authoring (Claude-chat lane) using Content Studio for intake.
